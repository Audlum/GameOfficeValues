import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface CodeReviewMissionProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
}

const CHOICE_CONFIG = {
    honest: {
        points: 3,
        text: 'честно сказать о своей загрузке',
        description: 'Объяснить ситуацию и предложить перенести ревью',
        color: '#10b981'
    },
    compromise: {
        points: 2,
        text: 'предложить компромисс',
        description: 'Быстро просмотреть критичные части сейчас, остальное позже',
        color: '#f59e0b'
    },
    ignore: {
        points: 1,
        text: 'взять всё на себя',
        description: 'Взять ревью и работать сверхурочно над багом',
        color: '#ef4444'
    }
} as const

type ChoiceType = keyof typeof CHOICE_CONFIG

export default function CodeReviewMission({
    position = [0, 0, 0],
    rotation = [0, 0, 0]
}: CodeReviewMissionProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | ''>('')

    const missionGroupRef = useRef<THREE.Group>(null)
    const markerRef = useRef<THREE.Mesh>(null)
    const highlightRef = useRef<THREE.Group>(null)
    const animationRef = useRef<number>()

    const {
        completeTask,
        getTaskStatus,
        activateTask,
        deactivateTask,
        getTotalPoints
    } = useTaskStore()

    const isCompleted = getTaskStatus('codeReviewMission')
    const totalPoints = getTotalPoints()

    useFrame((state) => {
        if (!markerRef.current || isCompleted || isProcessing) return

        const time = state.clock.elapsedTime
        markerRef.current.position.y = 2 + Math.sin(time * 2) * 0.1
        markerRef.current.rotation.y = time * 0.5

        if (highlightRef.current) {
            const intensity = 0.5 + Math.sin(time * 3) * 0.2
            highlightRef.current.children.forEach(child => {
                if (child instanceof THREE.PointLight) {
                    child.intensity = intensity
                }
            })
        }
    })

    useEffect(() => {
        if (!isProcessing) return

        const startTime = Date.now()
        const duration = 2000

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            setProcessingProgress(progress)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                if (selectedChoice) {
                    completeTask('codeReviewMission',
                        CHOICE_CONFIG[selectedChoice].points,
                        selectedChoice)
                }
                setShowDialog(false)
                deactivateTask('codeReviewMission')
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
            deactivateTask('codeReviewMission')
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
                activateTask('codeReviewMission')
            }
            if (e.code === 'Escape' && showDialog && !isProcessing) {
                e.preventDefault()
                handleCloseDialog()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [playerNear, isCompleted, showDialog, isProcessing, activateTask, handleCloseDialog])

    const handlePointerEnter = useCallback(() => {
        if (!isCompleted && !isProcessing) {
            setPlayerNear(true)
            document.body.style.cursor = 'pointer'
        }
    }, [isCompleted, isProcessing])

    const handlePointerLeave = useCallback(() => {
        setPlayerNear(false)
        document.body.style.cursor = 'default'
    }, [])

    const styles = useMemo(() => ({
        modal: {
            background: 'rgba(0,0,0,0.97)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            minWidth: '600px',
            maxWidth: '700px',
            width: '80vw',
            border: '3px solid #4ade80',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
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
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        infoBox: {
            background: '#1e3a8a',
            padding: '12px',
            borderRadius: '8px',
            margin: '12px 0',
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
            width: '100%'
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
                <h3 style={styles.title}>👨‍💻 Миссия: Приоритеты в работе</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <div style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#e5e5e5' }}>
                    <strong>Ситуация:</strong> Коллега попросил помочь с код-ревью до конца дня, но у тебя срочная задача по фиксу критического бага.
                </p>

                <div style={styles.infoBox}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#bfdbfe' }}>
                        <strong>Твоя задача:</strong> Фикс критического бага в продакшене (дедлайн: сегодня)
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#bfdbfe' }}>
                        <strong>Запрос коллеги:</strong> Код-ревью для важного фича (нужно до конца дня)
                    </p>
                </div>

                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#e5e5e5' }}>
                    Нужно правильно расставить приоритеты и принять ответственное решение.
                </p>
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
                            <strong>{key === 'honest' ? 'Быть честным и прозрачным' :
                                key === 'compromise' ? 'Найти компромисс' :
                                    'Взять на себя всё'}</strong><br />
                            <small>{choice.description}</small>
                            <div style={{
                                marginTop: '5px',
                                fontSize: '11px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                display: 'inline-block'
                            }}>+{choice.points} {choice.points === 1 ? 'балл' : choice.points === 2 ? 'балла' : 'балла'}</div>
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
                border: '3px solid #f59e0b',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Принимаем решение...</h3>
                    {choice && <p style={{ margin: 0, fontSize: '14px', color: '#e5e5e5' }}>
                        Вы выбрали: <strong>{choice.text}</strong>
                    </p>}
                </div>

                <div style={{
                    background: '#334155',
                    borderRadius: '10px',
                    height: '20px',
                    marginBottom: '15px',
                    overflow: 'hidden'
                }}>
                    <div
                        style={{
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            height: '100%',
                            width: `${processingProgress * 100}%`,
                            borderRadius: '10px',
                            transition: 'width 0.1s ease-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'black',
                            fontWeight: 'bold'
                        }}
                    >
                        {Math.round(processingProgress * 100)}%
                    </div>
                </div>

                {choice && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#94a3b8'
                    }}>
                        <span>Обработка...</span>
                        <span>+{choice.points} {choice.points === 1 ? 'балл' : 'балла'}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <group position={position} rotation={rotation} ref={missionGroupRef}>
            {!isCompleted && (
                <group ref={highlightRef}>
                    <pointLight
                        position={[0, 2, 0]}
                        intensity={0.5}
                        color="#4ade80"
                        distance={4}
                    />
                </group>
            )}

            <mesh
                position={[0, 1, 0]}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial transparent opacity={0} />
            </mesh>

            {playerNear && !isCompleted && !showDialog && !isProcessing && (
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '50%',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '2px solid #4ade80',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 15px rgba(74, 222, 128, 0.5)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {showDialog && !isProcessing && <Html position={[0, 0, 0]} center>{renderDialog()}</Html>}
            {isProcessing && <Html position={[0, 3, 0]} center>{renderProcessing()}</Html>}

            {isCompleted ? (
                <Html position={[0, 2, 0]}>
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