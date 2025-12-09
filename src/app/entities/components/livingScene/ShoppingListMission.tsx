import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface ShoppingListMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    onMissionStart?: () => void
    onMissionEnd?: () => void
}

const GAME_CONFIG = {
    timeLimit: 60,
    itemCount: 3,
    itemPoints: 100,
    timeMultiplier: 10,
    colors: ['#3498db', '#e74c3c', '#8B4513'] as const
} as const

export default function ShoppingListMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    onMissionStart,
    onMissionEnd
}: ShoppingListMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [gameActive, setGameActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.timeLimit)
    const [foundItems, setFoundItems] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [hoveredItem, setHoveredItem] = useState<number | null>(null)

    const missionGroupRef = useRef<THREE.Group>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const processingRef = useRef<number | null>(null)

    const { completeTask, getTaskStatus, activateTask, deactivateTask } = useTaskStore()
    const isCompleted = getTaskStatus('shoppingListMission')

    // Мемоизированные данные
    const shoppingItems = useMemo(() => [
        {
            id: 1,
            name: 'кулер с водой',
            position: [-1.5, 0, 11] as [number, number, number],
            color: GAME_CONFIG.colors[0],
            clickAreaSize: 3.0
        },
        {
            id: 2,
            name: 'клубника',
            position: [-7, 0.5, 7.8] as [number, number, number],
            color: GAME_CONFIG.colors[1],
            clickAreaSize: 2.5
        },
        {
            id: 3,
            name: 'кружка кофе',
            position: [-7, 0, 3] as [number, number, number],
            color: GAME_CONFIG.colors[2],
            clickAreaSize: 2.0
        }
    ], [])

    // Управление состоянием
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
        if (gameActive && foundItems.length === GAME_CONFIG.itemCount) {
            endGame(true)
        }
    }, [foundItems, gameActive])

    // Завершение игры
    const endGame = useCallback((success: boolean) => {
        setGameActive(false)
        if (timerRef.current) clearInterval(timerRef.current)

        const finalScore = success
            ? Math.max(timeLeft * GAME_CONFIG.timeMultiplier, 0) +
            GAME_CONFIG.itemPoints * GAME_CONFIG.itemCount
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
                    completeTask('shoppingListMission', Math.floor(finalScore / 10), 'completed')
                }
                setShowDialog(false)
                deactivateTask('shoppingListMission')
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
        setTimeLeft(GAME_CONFIG.timeLimit)
        setFoundItems([])
        setScore(0)
        setHoveredItem(null)
    }, [])

    // Закрытие диалога
    const handleCloseDialog = useCallback(() => {
        if (!isProcessing && !gameActive) {
            setShowDialog(false)
            deactivateTask('shoppingListMission')
        }
    }, [isProcessing, gameActive, deactivateTask])

    // Клик по предмету
    const handleItemClick = useCallback((itemId: number) => {
        if (!gameActive || foundItems.includes(itemId)) return
        setFoundItems(prev => [...prev, itemId])
    }, [gameActive, foundItems])

    // Обработчики клавиш
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                e.preventDefault()
                setShowDialog(true)
                activateTask('shoppingListMission')
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
    const renderGameDialog = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>🛒 Список покупок</h3>
                <div style={{ ...styles.timer, color: timeLeft < 10 ? '#ef4444' : '#4ade80' }}>
                    {timeLeft} сек
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.subtitle}>Найди эти предметы:</h4>
                <div style={styles.itemsList}>
                    {shoppingItems.map(item => (
                        <div key={item.id} style={styles.itemRow(foundItems.includes(item.id))}>
                            <div style={styles.itemIcon(item.color, foundItems.includes(item.id))}>
                                {foundItems.includes(item.id) ? '✓' : '○'}
                            </div>
                            <span style={styles.itemName(foundItems.includes(item.id))}>
                                {item.name}
                            </span>
                            {foundItems.includes(item.id) && (
                                <div style={styles.foundBadge}>✓ Найдено</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.progressSection}>
                <div style={styles.progressText}>
                    <span>Найдено:</span>
                    <span style={styles.progressCount}>
                        {foundItems.length} / {GAME_CONFIG.itemCount}
                    </span>
                </div>
                <div style={styles.progressBar}>
                    <div style={{
                        ...styles.progressFill,
                        width: `${(foundItems.length / GAME_CONFIG.itemCount) * 100}%`
                    }} />
                </div>
            </div>
        </div>
    )

    // Рендер стартового экрана
    const renderStartDialog = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>🛒 Список покупок</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <div style={styles.section}>
                <p><strong>Цель:</strong> Найди {GAME_CONFIG.itemCount} предмета за {GAME_CONFIG.timeLimit} секунд!</p>

                <div style={styles.infoBox}>
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>{GAME_CONFIG.itemCount}</div>
                        <div>
                            <div style={styles.infoTitle}>Что искать:</div>
                            <div style={styles.infoList}>
                                • Кулер с водой<br />
                                • Клубника<br />
                                • Кружка кофе
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={startGame} style={styles.startButton}>
                    НАЧАТЬ ПОИСК
                </button>
            </div>
        </div>
    )

    // Рендер обработки
    const renderProcessing = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    {foundItems.length === GAME_CONFIG.itemCount ? 'Отлично!' : 'Время вышло!'}
                </h3>
            </div>

            <div style={styles.section}>
                <p>Найдено: {foundItems.length} из {GAME_CONFIG.itemCount} предметов</p>
                {foundItems.length === GAME_CONFIG.itemCount && (
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
            minWidth: '500px',
            border: '3px solid #3498db',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '70vh',
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
            color: '#3498db',
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
        section: {
            marginBottom: '20px',
            lineHeight: '1.5'
        },
        subtitle: {
            color: '#3498db',
            fontSize: '16px',
            fontWeight: 'bold' as const,
            marginBottom: '10px'
        },
        itemsList: {
            background: 'rgba(52, 152, 219, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #3498db'
        },
        itemRow: (isFound: boolean) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            background: isFound ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
            borderRadius: '5px',
            marginBottom: '8px',
            transition: 'all 0.3s'
        }),
        itemIcon: (color: string, isFound: boolean) => ({
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: isFound ? '#4ade80' : color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            fontSize: '16px',
            color: 'white'
        }),
        itemName: (isFound: boolean) => ({
            textDecoration: isFound ? 'line-through' : 'none',
            opacity: isFound ? 0.7 : 1,
            color: isFound ? '#94a3b8' : 'white'
        }),
        foundBadge: {
            marginLeft: 'auto',
            color: '#4ade80',
            fontWeight: 'bold' as const
        },
        progressSection: {
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
        },
        progressText: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '16px'
        },
        progressCount: {
            fontWeight: 'bold' as const,
            color: '#3498db'
        },
        progressBar: {
            height: '10px',
            background: '#334155',
            borderRadius: '5px',
            overflow: 'hidden' as const
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(90deg, #3498db, #2980b9)',
            borderRadius: '5px',
            transition: 'width 0.3s'
        },
        infoBox: {
            background: 'linear-gradient(90deg, #1e3a8a, #1e40af)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #60a5fa',
            margin: '15px 0'
        },
        infoItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        infoIcon: {
            background: '#3498db',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            fontWeight: 'bold' as const
        },
        infoTitle: {
            fontWeight: 'bold' as const,
            color: '#93c5fd'
        },
        infoList: {
            fontSize: '12px',
            color: '#dbeafe',
            marginTop: '5px'
        },
        startButton: {
            background: 'linear-gradient(90deg, #3498db, #2980b9)',
            color: 'white',
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
            background: 'linear-gradient(90deg, #3498db, #2980b9)',
            height: '100%',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
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

            {/* Предметы */}
            {gameActive && showDialog && shoppingItems.map(item => {
                const isFound = foundItems.includes(item.id)

                return (
                    <group key={item.id}>
                        {!isFound && (
                            <mesh
                                position={item.position}
                                onPointerEnter={() => {
                                    setHoveredItem(item.id)
                                    document.body.style.cursor = 'pointer'
                                }}
                                onPointerLeave={() => {
                                    setHoveredItem(null)
                                    document.body.style.cursor = 'default'
                                }}
                                onClick={() => handleItemClick(item.id)}
                            >
                                <boxGeometry args={[item.clickAreaSize, 2, item.clickAreaSize]} />
                                <meshStandardMaterial transparent opacity={0} />
                            </mesh>
                        )}

                        <Html position={[item.position[0], item.position[1] + 2, item.position[2]]} center>
                            <div style={{
                                background: isFound ? 'rgba(34, 197, 94, 0.95)' : 'rgba(0,0,0,0.85)',
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: 'bold' as const,
                                border: `3px solid ${isFound ? 'white' : item.color}`,
                                boxShadow: `0 0 15px ${isFound ? 'rgba(34, 197, 94, 0.7)' : item.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transform: 'translate(-50%, -50%)',
                                animation: isFound ? 'pulse 2s infinite' :
                                    (hoveredItem === item.id ? 'pulse 1s infinite' : 'none')
                            }}>
                                {isFound ? (
                                    <>
                                        <span style={{ fontSize: '20px' }}>✓</span>
                                        <span>{item.name} - найдено!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{item.name}</span>
                                        {hoveredItem === item.id && (
                                            <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                                                (кликни!)
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </Html>
                    </group>
                )
            })}

            {/* Индикатор E */}
            {playerNear && !isCompleted && !showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '50%',
                        fontSize: '18px',
                        fontWeight: 'bold' as const,
                        border: '2px solid #3498db',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {/* Диалоги */}
            {showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {gameActive ? renderGameDialog() : renderStartDialog()}
                </Html>
            )}

            {isProcessing && (
                <Html position={[0, 3, 0]} center>
                    {renderProcessing()}
                </Html>
            )}

            {/* Статус */}
            {isCompleted ? (
                <Html position={[0, 2, 0]}>
                    <div style={completedStyle}>Задание выполнено!</div>
                </Html>
            ) : !showDialog && !isProcessing && (
                <Html position={[0, 1.5, 0]}>
                    <div style={taskIndicatorStyle}>Задание!</div>
                </Html>
            )}
        </group>
    )
}