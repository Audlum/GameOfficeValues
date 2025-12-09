import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'
import Pin from '../../objects/sceneLiving/pin'

interface PinRunMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    onMissionStart?: () => void
    onMissionEnd?: () => void
}

interface Checkpoint {
    id: number
    position: [number, number, number]
    reached: boolean
    color: string
}

export default function PinRunMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    onMissionStart,
    onMissionEnd
}: PinRunMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [pinRunGameActive, setPinRunGameActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(40)
    const [checkpointsReached, setCheckpointsReached] = useState(0)
    const [score, setScore] = useState(0)
    const [blockControls, setBlockControls] = useState(false)

    const missionGroupRef = useRef<THREE.Group>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const {
        completeTask,
        getTaskStatus,
        isTaskActive,
        activateTask,
        deactivateTask,
        getTotalPoints
    } = useTaskStore()

    const isCompleted = getTaskStatus('pinRunMission')
    const isActive = isTaskActive('pinRunMission')
    const totalPoints = getTotalPoints()

    const checkpoints = useMemo<Checkpoint[]>(() => [
        { id: 1, position: [3, -0.5, 2], reached: false, color: '#ff6b6b' },
        { id: 2, position: [-1, -1, 9], reached: false, color: '#3498db' },
        { id: 3, position: [-5, -1, 12], reached: false, color: '#2ecc71' }
    ], [])

    useEffect(() => {
        const shouldBlock = showDialog || pinRunGameActive || isProcessing
        setBlockControls(shouldBlock)

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
    }, [showDialog, pinRunGameActive, isProcessing, onMissionStart, onMissionEnd])

    useEffect(() => {
        if (!pinRunGameActive || !showDialog) {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            return
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!)
                    endPinRunGame(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [pinRunGameActive, showDialog])

    useEffect(() => {
        if (pinRunGameActive && checkpointsReached === checkpoints.length) {
            endPinRunGame(true)
        }
    }, [checkpointsReached, pinRunGameActive, checkpoints.length])

    // Обработка достижения точки
    const handleCheckpointReached = useCallback((checkpointId: number) => {
        if (!pinRunGameActive) return

        setCheckpointsReached(prev => prev + 1)
    }, [pinRunGameActive])

    const endPinRunGame = useCallback((success: boolean) => {
        setPinRunGameActive(false)

        const finalScore = success ? Math.max(timeLeft * 15, 0) + 150 * checkpoints.length + 200 : 0
        setScore(finalScore)

        setIsProcessing(true)
        const startTime = Date.now()
        const duration = 1500

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            setProcessingProgress(progress)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                if (success) {
                    completeTask('pinRunMission', Math.floor(finalScore / 10), 'completed')
                }
                setShowDialog(false)
                deactivateTask('pinRunMission')
                setIsProcessing(false)
                setProcessingProgress(0)
            }
        }

        animate()
    }, [timeLeft, checkpoints.length, completeTask, deactivateTask])

    const startPinRunGame = useCallback(() => {
        setPinRunGameActive(true)
        setTimeLeft(40)
        setCheckpointsReached(0)
        setScore(0)
    }, [])

    const handleCloseDialog = useCallback(() => {
        if (!isProcessing && !pinRunGameActive) {
            setShowDialog(false)
            deactivateTask('pinRunMission')
        }
    }, [isProcessing, pinRunGameActive, deactivateTask])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                setShowDialog(true)
                activateTask('pinRunMission')
                event.preventDefault()
            }
            if (event.code === 'Escape' && showDialog && !isProcessing && !pinRunGameActive) {
                handleCloseDialog()
                event.preventDefault()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [playerNear, isCompleted, showDialog, isProcessing, pinRunGameActive, activateTask, handleCloseDialog])

    const taskIndicatorStyle = useMemo(() => ({
        background: 'rgba(236, 178, 9, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold' as const,
        border: '2px solid white',
        boxShadow: '0 0 15px rgba(247, 203, 74, 0.5)',
        ...(!isCompleted && !showDialog && !isProcessing && { animation: 'pulse 2s infinite' })
    }), [isCompleted, showDialog, isProcessing])

    const completedStyle = useMemo(() => ({
        background: 'rgba(34, 197, 94, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold' as const,
        border: '2px solid white',
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
    }), [])

    const renderGameDialog = () => (
        <div className="pinrun-dialog" style={{
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            minWidth: '500px',
            maxWidth: '600px',
            width: '80vw',
            border: '3px solid #9b59b6',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '70vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#9b59b6', fontSize: '18px', fontWeight: 'bold' }}>
                    Забег по точкам
                </h3>
                <div style={{
                    fontSize: '24px',
                    color: timeLeft < 10 ? '#ef4444' : '#4ade80',
                    fontWeight: 'bold',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '5px 15px',
                    borderRadius: '8px'
                }}>
                    {timeLeft} сек
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#9b59b6', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                    Достигнуто точек:
                </div>
                <div style={{
                    background: 'rgba(155, 89, 182, 0.1)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid #9b59b6',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px'
                }}>
                    {checkpoints.map(checkpoint => (
                        <div key={checkpoint.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: checkpoint.reached ? '#4ade80' : checkpoint.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: checkpoint.reached ? '0 0 15px rgba(74, 222, 128, 0.7)' : '0 0 10px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s'
                            }}>
                                {checkpoint.reached ? '✓' : checkpoint.id}
                            </div>
                            <div style={{ fontSize: '12px', color: checkpoint.reached ? '#94a3b8' : 'white' }}>
                                Точка {checkpoint.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>Прогресс:</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#9b59b6' }}>
                        {checkpointsReached} / {checkpoints.length}
                    </span>
                </div>
                <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${(checkpointsReached / checkpoints.length) * 100}%`,
                        background: 'linear-gradient(90deg, #9b59b6, #8e44ad)',
                        borderRadius: '5px',
                        transition: 'width 0.3s'
                    }} />
                </div>
            </div>

            <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
                Порядок не важен - нужно достигнуть всех {checkpoints.length} точек
            </div>
        </div>
    )

    const renderStartDialog = () => (
        <div style={{
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            minWidth: '500px',
            maxWidth: '600px',
            width: '80vw',
            border: '3px solid #9b59b6',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '70vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#9b59b6', fontSize: '18px', fontWeight: 'bold' }}>
                    Забег по точкам
                </h3>
                <button
                    onClick={handleCloseDialog}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0',
                        width: '24px',
                        height: '24px'
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#e5e5e5' }}>
                    <strong>Цель:</strong> Достигни {checkpoints.length} точек в комнате за 40 секунд!
                </p>

                <button
                    onClick={startPinRunGame}
                    style={{
                        background: 'linear-gradient(90deg, #9b59b6, #8e44ad)',
                        color: 'white',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        width: '100%',
                        marginTop: '10px'
                    }}
                >
                    НАЧАТЬ ЗАБЕГ
                </button>

                <div style={{ marginTop: '15px', fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
                    Нажмите ESC или ✕ чтобы закрыть
                </div>
            </div>
        </div>
    )

    const renderProcessing = () => (
        <div style={{
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '350px',
            border: '3px solid #9b59b6'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#9b59b6', fontSize: '18px' }}>
                    {checkpointsReached === checkpoints.length ? 'Отлично!' : 'Время вышло!'}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#e5e5e5' }}>
                    Достигнуто: {checkpointsReached} из {checkpoints.length} точек
                </p>
                {checkpointsReached === checkpoints.length && (
                    <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#fde047' }}>
                        Очки: {score}
                    </p>
                )}
            </div>

            <div style={{ background: '#334155', borderRadius: '10px', height: '20px', marginBottom: '15px', overflow: 'hidden' }}>
                <div style={{
                    background: 'linear-gradient(90deg, #9b59b6, #8e44ad)',
                    height: '100%',
                    width: `${processingProgress * 100}%`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {Math.round(processingProgress * 100)}%
                </div>
            </div>
        </div>
    )

    return (
        <group position={position} rotation={rotation} ref={missionGroupRef}>

            <mesh
                position={[0, 1, 0]}
                onPointerEnter={() => {
                    if (!isCompleted && !isProcessing && !showDialog && !blockControls) {
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

            {pinRunGameActive && showDialog && checkpoints.map(checkpoint => (
                <Pin
                    key={checkpoint.id}
                    scale={35}
                    position={checkpoint.position}
                    color={checkpoint.reached ? '#4ade80' : checkpoint.color}
                    onReached={() => handleCheckpointReached(checkpoint.id)}
                    isActive={!checkpoint.reached}
                    reached={checkpoint.reached}
                />
            ))}

            {playerNear && !isCompleted && !showDialog && !isProcessing && !blockControls && (
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '50%',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '2px solid #9b59b6',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {showDialog && !isProcessing && (
                <Html position={[-3, 0, 0]} center>
                    {pinRunGameActive ? renderGameDialog() : renderStartDialog()}
                </Html>
            )}

            {isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {renderProcessing()}
                </Html>
            )}

            {isCompleted ? (
                <Html position={[0, 0, 0]}>
                    <div style={completedStyle}>
                        Задание выполнено!
                    </div>
                </Html>
            ) : !showDialog && !isProcessing && !blockControls && (
                <Html position={[0, 0, 0]}>
                    <div style={taskIndicatorStyle}>
                        Задание!
                    </div>
                </Html>
            )}
        </group>
    )
}