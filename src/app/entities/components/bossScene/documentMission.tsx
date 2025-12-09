import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface ConfidentialDocumentsMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
}

const CHOICE_CONFIG = {
    return: {
        text: 'Немедленно вернуть боссу',
        desc: 'Уважение к конфиденциальности и личному пространству руководителя',
        points: 3,
        color: '#10b981'
    },
    secretary: {
        text: 'Передать секретарю',
        desc: 'Формально правильно, но может показаться перекладыванием ответственности',
        points: 2,
        color: '#f59e0b'
    },
    read: {
        text: 'Быстро просмотреть из любопытства',
        desc: 'Нарушение этики и доверия, возможные последствия для карьеры',
        points: 1,
        color: '#ef4444'
    }
} as const

type ChoiceType = keyof typeof CHOICE_CONFIG

export default function ConfidentialDocumentsMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0]
}: ConfidentialDocumentsMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | ''>('')

    const missionGroupRef = useRef<THREE.Group>(null)
    const animationRef = useRef<number>()

    const {
        completeTask,
        getTaskStatus,
        activateTask,
        deactivateTask,
        getTotalPoints
    } = useTaskStore()

    const isCompleted = getTaskStatus('confidentialDocumentsMission')
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
                    completeTask('confidentialDocumentsMission',
                        CHOICE_CONFIG[selectedChoice].points,
                        selectedChoice)
                }
                setShowDialog(false)
                deactivateTask('confidentialDocumentsMission')
                setIsProcessing(false)
                setProcessingProgress(0)
                setSelectedChoice('')
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isProcessing, selectedChoice, completeTask, deactivateTask])

    const handleCloseDialog = useCallback(() => {
        if (!isProcessing) {
            setShowDialog(false)
            deactivateTask('confidentialDocumentsMission')
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
                activateTask('confidentialDocumentsMission')
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
        scenarioBox: {
            background: '#1e293b',
            padding: '12px',
            borderRadius: '8px',
            margin: '12px 0',
            border: '1px solid #475569',
            fontFamily: 'monospace',
            fontSize: '13px'
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
                <h3 style={styles.title}>Конфиденциальные документы</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                <p>
                    <strong>Ситуация:</strong> Зайдя в кабинет босса, вы заметили на столе открытую папку с конфиденциальными финансовыми отчетами компании. Босса нет на месте.
                </p>

                <div style={styles.scenarioBox}>
                    <div style={{ color: '#60a5fa' }}>УРОВЕНЬ ДОСТУПА: ТОЛЬКО ДЛЯ РУКОВОДСТВА</div>
                    <div style={{ color: '#d1d5db', fontSize: '12px', marginTop: '8px' }}>
                        Содержит: прибыль компании, зарплаты топ-менеджеров, планы сокращений
                    </div>
                </div>

                <p>Как ответственный сотрудник, вы должны принять решение:</p>
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
                            }}>
                                +{choice.points} балла
                            </div>
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
                    <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Принимаем решение...</h3>
                    {choice && (
                        <p style={{ margin: 0, fontSize: '14px', color: '#e5e5e5' }}>
                            Вы выбрали: <strong>{choice.text}</strong>
                        </p>
                    )}
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
                    }}>
                        {Math.round(processingProgress * 100)}%
                    </div>
                </div>

                {choice && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
                        <span>Обработка...</span>
                        <span>+{choice.points} баллов</span>
                    </div>
                )}
            </div>
        )
    }

    const renderEIndicator = () => (
        <Html position={[0, 1, 0]} center>
            <div style={{
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '10px 14px',
                borderRadius: '50%',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '2px solid #4ade80',
                transform: 'translate(-50%, -50%)'
            }}>
                E
            </div>
        </Html>
    )

    return (
        <group position={position} rotation={rotation} ref={missionGroupRef}>

            <mesh
                position={[0, 1, 0]}
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

            {playerNear && !isCompleted && !showDialog && !isProcessing && renderEIndicator()}

            {showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {renderDialog()}
                </Html>
            )}

            {isProcessing && (
                <Html position={[0, 0, 0]} center>
                    {renderProcessing()}
                </Html>
            )}

            {isCompleted ? (
                <Html position={[0, 1, 0]}>
                    <div style={styles.completed}>Задание выполнено!</div>
                </Html>
            ) : !showDialog && !isProcessing && (
                <Html position={[0, 1.5, 0]}>
                    <div style={styles.taskIndicator}>Задание!</div>
                </Html>
            )}
        </group>
    )
}