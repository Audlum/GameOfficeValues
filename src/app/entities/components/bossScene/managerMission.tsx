import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface ManagerMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
}

const CHOICE_CONFIG = {
    askForHelp: {
        text: 'Попрошу помощи у команды',
        desc: 'Честность и командная работа. Признать проблему и найти решение вместе',
        points: 3,
        color: '#10b981'
    },
    workNights: {
        text: 'Буду работать ночами',
        desc: 'Взвалить всё на себя. Риск выгорания и снижения качества',
        points: 1,
        color: '#f59e0b'
    },
    lie: {
        text: 'Скажу, что всё хорошо',
        desc: 'Скрыть проблему. Риск сорвать сроки и подвести команду',
        points: 1,
        color: '#ef4444'
    }
} as const

type ChoiceType = keyof typeof CHOICE_CONFIG

export default function ManagerMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0]
}: ManagerMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | ''>('')

    const missionGroupRef = useRef<THREE.Group>(null)
    const animationRef = useRef<number>()

    const { completeTask, getTaskStatus, activateTask, deactivateTask, getTotalPoints } = useTaskStore()
    const isCompleted = getTaskStatus('managerMission')
    const totalPoints = getTotalPoints()

    useEffect(() => {
        if (!isProcessing) return

        const startTime = Date.now()
        const duration = 1500

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            setProcessingProgress(progress)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                if (selectedChoice) {
                    completeTask('managerMission',
                        CHOICE_CONFIG[selectedChoice].points,
                        selectedChoice)
                }
                setShowDialog(false)
                deactivateTask('managerMission')
                setIsProcessing(false)
                setProcessingProgress(0)
                setSelectedChoice('')
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [isProcessing, selectedChoice, completeTask, deactivateTask])

    const handleCloseDialog = useCallback(() => {
        if (!isProcessing) {
            setShowDialog(false)
            deactivateTask('managerMission')
        }
    }, [isProcessing, deactivateTask])

    const handleInteraction = useCallback((choice: ChoiceType) => {
        if (isProcessing) return
        setSelectedChoice(choice)
        setIsProcessing(true)
    }, [isProcessing])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                e.preventDefault()
                setShowDialog(true)
                activateTask('managerMission')
            }
            if (e.code === 'Escape' && showDialog && !isProcessing) {
                e.preventDefault()
                handleCloseDialog()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [playerNear, isCompleted, showDialog, isProcessing, activateTask, handleCloseDialog])

    const styles = useMemo(() => ({
        modal: {
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            minWidth: '600px',
            border: '3px solid #4ade80',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '70vh',
            overflowY: 'auto' as const
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        title: {
            margin: 0,
            color: '#4ade80',
            fontSize: '18px'
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
        managerBox: {
            background: '#1e3a8a',
            padding: '15px',
            borderRadius: '8px',
            margin: '0 0 15px 0',
            border: '1px solid #3b82f6'
        },
        choiceButton: (color: string, disabled: boolean) => ({
            padding: '12px',
            background: disabled ? '#666' : color,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px' as const,
            margin: '5px 0',
            transition: 'all 0.2s',
            opacity: disabled ? 0.6 : 1,
            textAlign: 'left' as const,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
        }),
        taskIndicator: {
            background: 'rgba(236, 178, 9, 0.95)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold' as const,
            border: '2px solid white',
            boxShadow: '0 0 15px rgba(247, 203, 74, 0.5)',
            animation: !isCompleted && !showDialog && !isProcessing ? 'pulse 2s infinite' : 'none'
        },
        completed: {
            background: 'rgba(34, 197, 94, 0.95)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold' as const,
            border: '2px solid white',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
        }
    }), [isCompleted, showDialog, isProcessing])

    const renderDialog = () => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>Диалог с менеджером</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                <div style={styles.managerBox}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{
                            background: '#3b82f6',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '10px',
                            fontSize: '20px'
                        }}>M</div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#bfdbfe' }}>Менеджер:</p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#e0f2fe' }}>
                                "Ты не успеваешь сделать задачу к сроку. Что будешь делать?"
                            </p>
                        </div>
                    </div>
                </div>

                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#e5e5e5' }}>
                    Выбери, как ответить менеджеру. Помни о ценностях компании:
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '12px' }}>
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #22c55e',
                        flex: 1
                    }}>
                        <strong style={{ color: '#22c55e' }}> Ответственность:</strong>
                        <div style={{ color: '#86efac' }}>Быть честным о проблемах</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(Object.entries(CHOICE_CONFIG) as [ChoiceType, typeof CHOICE_CONFIG[ChoiceType]][]).map(([key, choice]) => (
                    <button
                        key={key}
                        onClick={() => handleInteraction(key)}
                        style={styles.choiceButton(choice.color, isProcessing)}
                        onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ flex: 1 }}>
                            <strong>{choice.text}</strong><br />
                            <small>{choice.desc}</small>
                            <div style={{
                                marginTop: '5px',
                                fontSize: '11px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                display: 'inline-block'
                            }}>+{choice.points} балла</div>
                        </div>
                    </button>
                ))}
            </div>

            <div style={{
                marginTop: '15px',
                fontSize: '12px',
                color: '#94a3b8',
                textAlign: 'center',
                borderTop: '1px solid #334155',
                paddingTop: '10px'
            }}>
                Текущие баллы ответственности: <strong>{totalPoints}</strong>
            </div>
        </div>
    )

    const renderProcessing = () => {
        const choice = selectedChoice ? CHOICE_CONFIG[selectedChoice] : null

        return (
            <div style={{
                background: 'rgba(0,0,0,0.97)',
                color: 'white',
                padding: '30px',
                borderRadius: '15px',
                minWidth: '350px',
                border: '3px solid #f59e0b'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Отправляем ответ...</h3>
                    {choice && <p style={{ margin: 0, fontSize: '14px', color: '#e5e5e5' }}>Вы ответили: <strong>{choice.text}</strong></p>}
                </div>

                <div style={{ background: '#334155', borderRadius: '10px', height: '20px', overflow: 'hidden' }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                        height: '100%',
                        width: `${processingProgress * 100}%`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'black',
                        fontWeight: 'bold'
                    }}>{Math.round(processingProgress * 100)}%</div>
                </div>

                {choice && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
                        <span>Отправка менеджеру...</span>
                        <span>+{choice.points} баллов</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <group position={position} rotation={rotation} ref={missionGroupRef}>
            <mesh
                position={[0, 0, 0]}
                onPointerEnter={() => {
                    if (!isCompleted && !isProcessing) {
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

            {playerNear && !isCompleted && !showDialog && !isProcessing && (
                <Html position={[0, 1.5, 0]} center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '50%',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '2px solid #4ade80',
                        transform: 'translate(-50%, -50%)'
                    }}>E</div>
                </Html>
            )}

            {showDialog && !isProcessing && <Html position={[0, 0, 0]} center>{renderDialog()}</Html>}
            {isProcessing && <Html position={[0, 0, 0]} center>{renderProcessing()}</Html>}

            {isCompleted ? (
                <Html position={[0, 1, 0]}>
                    <div style={styles.completed}>Задание выполнено!</div>
                </Html>
            ) : !showDialog && !isProcessing && (
                <Html position={[0, 1, 0]}>
                    <div style={styles.taskIndicator}>Задание!</div>
                </Html>
            )}
        </group>
    )
}