import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface PuzzleMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    onMissionStart?: () => void
    onMissionEnd?: () => void
}

interface PuzzlePiece {
    id: number
    color: string
}

const PUZZLE_CONFIG = {
    count: 4,
    timeLimit: 30,
    pieceSize: 100,
    snapDistance: 80,
    colors: ['#ff6b6b', '#3498db', '#2ecc71', '#9b59b6']
} as const

export default function PuzzleMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    onMissionStart,
    onMissionEnd
}: PuzzleMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [gameActive, setGameActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(PUZZLE_CONFIG.timeLimit)
    const [placedPieces, setPlacedPieces] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [draggingPiece, setDraggingPiece] = useState<number | null>(null)
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 })

    const missionGroupRef = useRef<THREE.Group>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const processingRef = useRef<number | null>(null)

    const { completeTask, getTaskStatus, activateTask, deactivateTask } = useTaskStore()
    const isCompleted = getTaskStatus('puzzleMission')

    // Мемоизированные данные
    const puzzlePieces = useMemo<PuzzlePiece[]>(() =>
        Array.from({ length: PUZZLE_CONFIG.count }, (_, i) => ({
            id: i + 1,
            color: PUZZLE_CONFIG.colors[i]
        })), []
    )

    const targetPositions = useMemo(() => [
        { x: 150, y: 150 },
        { x: 350, y: 150 },
        { x: 150, y: 350 },
        { x: 350, y: 350 }
    ], [])

    // Управление состоянием игры
    useEffect(() => {
        const shouldBlock = showDialog || gameActive || isProcessing
        if (shouldBlock) {
            document.body.style.pointerEvents = 'auto'
            onMissionStart?.()
        } else {
            document.body.style.pointerEvents = ''
            onMissionEnd?.()
        }
        return () => {
            document.body.style.pointerEvents = ''
            onMissionEnd?.()
        }
    }, [showDialog, gameActive, isProcessing, onMissionStart, onMissionEnd])

    // Таймер
    useEffect(() => {
        if (!gameActive || !showDialog) {
            if (timerRef.current) clearInterval(timerRef.current)
            return
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [gameActive, showDialog])

    // Проверка завершения
    useEffect(() => {
        if (gameActive && placedPieces.length === PUZZLE_CONFIG.count) {
            endGame(true)
        }
    }, [placedPieces, gameActive])

    // Завершение игры
    const endGame = useCallback((success: boolean) => {
        setGameActive(false)
        if (timerRef.current) clearInterval(timerRef.current)

        const finalScore = success
            ? Math.max(timeLeft * 10, 0) + 100 * PUZZLE_CONFIG.count
            : 0

        if (success) setScore(finalScore)

        setIsProcessing(true)
        const startTime = Date.now()
        const duration = 1500

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            setProcessingProgress(progress)

            if (progress < 1) {
                processingRef.current = requestAnimationFrame(animate)
            } else {
                if (success) {
                    completeTask('puzzleMission', Math.floor(finalScore / 10), 'completed')
                }
                setShowDialog(false)
                deactivateTask('puzzleMission')
                setIsProcessing(false)
                setProcessingProgress(0)
            }
        }

        animate()

        return () => {
            if (processingRef.current) cancelAnimationFrame(processingRef.current)
        }
    }, [timeLeft, completeTask, deactivateTask])

    // Старт игры
    const startGame = useCallback(() => {
        setGameActive(true)
        setTimeLeft(PUZZLE_CONFIG.timeLimit)
        setPlacedPieces([])
        setScore(0)
        setDraggingPiece(null)
    }, [])

    // Закрытие диалога
    const handleCloseDialog = useCallback(() => {
        if (!isProcessing && !gameActive) {
            setShowDialog(false)
            deactivateTask('puzzleMission')
        }
    }, [isProcessing, gameActive, deactivateTask])

    // Обработчики мыши
    const handleMouseDown = useCallback((pieceId: number, e: React.MouseEvent) => {
        if (!gameActive) return
        e.preventDefault()
        setDraggingPiece(pieceId)
        setDragPos({ x: e.clientX - 50, y: e.clientY - 50 })
    }, [gameActive])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (draggingPiece !== null) {
            setDragPos({ x: e.clientX - 50, y: e.clientY - 50 })
        }
    }, [draggingPiece])

    const handleMouseUp = useCallback(() => {
        if (draggingPiece !== null) {
            const modal = modalRef.current
            if (modal) {
                const rect = modal.getBoundingClientRect()
                const modalX = dragPos.x + 50 - rect.left
                const modalY = dragPos.y + 50 - rect.top

                // Находим ближайшую свободную целевую позицию
                let minDist = Infinity
                let nearestTarget: { x: number; y: number } | null = null

                for (const target of targetPositions) {
                    // Проверяем, занята ли позиция
                    const isOccupied = placedPieces.length > 0 &&
                        placedPieces.some((_, idx) => {
                            const placedTarget = targetPositions[idx]
                            return Math.abs(placedTarget.x - target.x) < 10 &&
                                Math.abs(placedTarget.y - target.y) < 10
                        })

                    if (!isOccupied) {
                        const dist = Math.sqrt(
                            Math.pow(modalX - target.x, 2) +
                            Math.pow(modalY - target.y, 2)
                        )
                        if (dist < minDist && dist < PUZZLE_CONFIG.snapDistance) {
                            minDist = dist
                            nearestTarget = target
                        }
                    }
                }

                if (nearestTarget) {
                    setPlacedPieces(prev => [...prev, draggingPiece])
                }
            }
            setDraggingPiece(null)
        }
    }, [draggingPiece, dragPos, targetPositions, placedPieces])

    // Подписка на события мыши
    useEffect(() => {
        if (gameActive && showDialog) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [gameActive, showDialog, handleMouseMove, handleMouseUp])

    // Обработчики клавиш
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                e.preventDefault()
                setShowDialog(true)
                activateTask('puzzleMission')
            }
            if (e.code === 'Escape' && showDialog && !isProcessing && !gameActive) {
                e.preventDefault()
                handleCloseDialog()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [playerNear, isCompleted, showDialog, isProcessing, gameActive, activateTask, handleCloseDialog])

    // Рендер игрового интерфейса
    const renderGame = () => (
        <div ref={modalRef} style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>Пазлы на скорость</h3>
                <div style={{ ...styles.timer, color: timeLeft < 10 ? '#ef4444' : '#4ade80' }}>
                    {timeLeft} сек
                </div>
            </div>

            <div style={styles.gameArea}>
                {/* Доступные пазлы */}
                <div style={styles.sidePanel}>
                    <h4 style={styles.subtitle}>Перетащите пазлы:</h4>
                    <div style={styles.piecesContainer}>
                        {puzzlePieces
                            .filter(p => !placedPieces.includes(p.id))
                            .map(piece => (
                                <div
                                    key={piece.id}
                                    onMouseDown={(e) => handleMouseDown(piece.id, e)}
                                    style={{
                                        ...styles.piece,
                                        background: piece.color,
                                        transform: draggingPiece === piece.id ? 'scale(1.05)' : 'none',
                                        border: draggingPiece === piece.id ? '3px dashed white' : 'none',
                                        cursor: 'grab',
                                        position: draggingPiece === piece.id ? 'fixed' : 'relative',
                                        left: draggingPiece === piece.id ? `${dragPos.x}px` : 'auto',
                                        top: draggingPiece === piece.id ? `${dragPos.y}px` : 'auto',
                                        zIndex: 1000
                                    }}
                                >
                                    {piece.id}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Целевые места */}
                <div style={styles.sidePanel}>
                    <h4 style={styles.subtitle}>Целевые места:</h4>
                    <div style={styles.targetsGrid}>
                        {targetPositions.map((pos, idx) => {
                            const placedIdx = placedPieces[idx]
                            const piece = placedIdx ? puzzlePieces[placedIdx - 1] : null

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        ...styles.target,
                                        background: piece?.color || 'rgba(51, 65, 85, 0.3)',
                                        borderColor: piece ? '#4ade80' : '#f59e0b'
                                    }}
                                >
                                    {piece ? '✓' : idx + 1}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div style={styles.progress}>
                <div style={styles.progressText}>
                    <span>Прогресс:</span>
                    <span style={styles.progressCount}>
                        {placedPieces.length} / {PUZZLE_CONFIG.count}
                    </span>
                </div>
                <div style={styles.progressBar}>
                    <div style={{
                        ...styles.progressFill,
                        width: `${(placedPieces.length / PUZZLE_CONFIG.count) * 100}%`
                    }} />
                </div>
            </div>
        </div>
    )

    // Рендер стартового экрана
    const renderStart = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>Пазлы на скорость</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <div style={styles.content}>
                <p><strong>Цель:</strong> Соберите {PUZZLE_CONFIG.count} пазла за {PUZZLE_CONFIG.timeLimit} секунд!</p>

                <div style={styles.infoBox}>
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>{PUZZLE_CONFIG.count}</div>
                        <div>
                            <div style={styles.infoTitle}>Упрощенные правила</div>
                            <div style={styles.infoList}>
                                • Перетащите пазлы на правую сторону<br />
                                • Автоматическое прилипание к ближайшему месту<br />
                                • Порядок не имеет значения
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={startGame} style={styles.startButton}>
                    НАЧАТЬ ИГРУ
                </button>
            </div>
        </div>
    )

    // Рендер обработки
    const renderProcessing = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    {placedPieces.length === PUZZLE_CONFIG.count ? 'Отлично!' : 'Время вышло!'}
                </h3>
            </div>

            <div style={styles.content}>
                <p>Собрано: {placedPieces.length} из {PUZZLE_CONFIG.count} пазлов</p>
                {placedPieces.length === PUZZLE_CONFIG.count && (
                    <p style={{ color: '#fde047' }}>Очки: {score}</p>
                )}

                <div style={styles.processingBar}>
                    <div style={{
                        ...styles.processingFill,
                        width: `${processingProgress * 100}%`
                    }}>
                        {Math.round(processingProgress * 100)}%
                    </div>
                </div>
            </div>
        </div>
    )

    // Стили
    const styles = {
        modal: {
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            minWidth: '700px',
            border: '3px solid #f59e0b',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '80vh',
            overflowY: 'auto' as const
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        title: {
            margin: 0,
            color: '#f59e0b',
            fontSize: '18px',
            fontWeight: 'bold' as const
        },
        timer: {
            fontSize: '24px',
            fontWeight: 'bold' as const,
            background: 'rgba(0,0,0,0.3)',
            padding: '5px 15px',
            borderRadius: '8px'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px'
        },
        gameArea: {
            display: 'flex',
            gap: '30px',
            marginBottom: '20px',
            height: '400px'
        },
        sidePanel: {
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '15px',
            borderRadius: '10px'
        },
        subtitle: {
            color: '#f59e0b',
            marginBottom: '15px',
            fontSize: '16px'
        },
        piecesContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px'
        },
        piece: {
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold' as const,
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            userSelect: 'none' as const
        },
        targetsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            height: '100%',
            placeItems: 'center'
        },
        target: {
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: '3px dashed',
            transition: 'all 0.3s'
        },
        progress: {
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '10px'
        },
        progressText: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '16px'
        },
        progressCount: {
            fontWeight: 'bold' as const,
            color: '#f59e0b'
        },
        progressBar: {
            height: '10px',
            background: '#334155',
            borderRadius: '5px',
            overflow: 'hidden' as const
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            borderRadius: '5px',
            transition: 'width 0.3s'
        },
        content: {
            lineHeight: 1.5
        },
        infoBox: {
            background: 'linear-gradient(90deg, #92400e, #431407)',
            padding: '12px',
            borderRadius: '8px',
            margin: '15px 0',
            border: '1px solid #fb923c'
        },
        infoItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        infoIcon: {
            background: '#f59e0b',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'black',
            fontWeight: 'bold' as const
        },
        infoTitle: {
            fontWeight: 'bold' as const,
            color: '#fdba74'
        },
        infoList: {
            fontSize: '12px',
            color: '#fed7aa',
            marginTop: '5px'
        },
        startButton: {
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            color: 'black',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold' as const,
            width: '100%',
            marginTop: '20px'
        },
        processingBar: {
            background: '#334155',
            borderRadius: '10px',
            height: '20px',
            marginTop: '20px',
            overflow: 'hidden' as const
        },
        processingFill: {
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            height: '100%',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'black',
            fontWeight: 'bold' as const
        }
    }

    const taskIndicatorStyle = {
        background: 'rgba(236, 178, 9, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold' as const,
        border: '2px solid white',
        boxShadow: '0 0 15px rgba(247, 203, 74, 0.5)',
        animation: !isCompleted && !showDialog && !isProcessing ? 'pulse 2s infinite' : 'none'
    }

    const completedStyle = {
        background: 'rgba(34, 197, 94, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold' as const,
        border: '2px solid white',
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
    }

    return (
        <group position={position} rotation={rotation} ref={missionGroupRef}>
            {/* Триггер */}
            <mesh
                position={[0, 1, 0]}
                onPointerEnter={() => {
                    if (!isCompleted && !isProcessing && !showDialog) {
                        setPlayerNear(true)
                        document.body.style.cursor = 'pointer'
                    }
                }}
                onPointerLeave={() => {
                    setPlayerNear(false)
                    document.body.style.cursor = 'default'
                }}
            >
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial transparent opacity={0} />
            </mesh>

            {/* Диалоги */}
            {showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {gameActive ? renderGame() : renderStart()}
                </Html>
            )}

            {isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {renderProcessing()}
                </Html>
            )}

            {/* Индикаторы */}
            {playerNear && !isCompleted && !showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '50%',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '2px solid #f59e0b',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {isCompleted ? (
                <Html position={[0, 1, 0]}>
                    <div style={completedStyle}>Задание выполнено!</div>
                </Html>
            ) : !showDialog && !isProcessing && (
                <Html position={[0, 1, 0]}>
                    <div style={taskIndicatorStyle}>Задание!</div>
                </Html>
            )}
        </group>
    )
}