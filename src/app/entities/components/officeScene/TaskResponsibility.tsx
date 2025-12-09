import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTaskStore } from '../../stores/TaskStore'
import * as THREE from 'three'

interface MissionResponsibilityProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
}

const CHOICE_CONFIG = {
    fix: {
        points: 3,
        text: 'исправить проблему сейчас',
        fullText: 'Исправить сейчас',
        description: 'Потратить время, но обеспечить качество',
        color: '#10b981'
    },
    backlog: {
        points: 2,
        text: 'добавить в бэклог',
        fullText: 'Добавить в бэклог',
        description: 'Отложить проблему на потом',
        color: '#f59e0b'
    },
    ignore: {
        points: 1,
        text: 'оставить как есть',
        fullText: 'Оставить как есть',
        description: 'Рисковать проблемами в будущем',
        color: '#ef4444'
    }
} as const

type ChoiceType = keyof typeof CHOICE_CONFIG

const CODE_LINE_OPTIONS = {
    line1: [
        { value: '', label: 'Выбери правильный вариант' },
        { value: 'function calculate(a, b, operator) {', label: 'function calculate(a, b, operator) {' },
        { value: 'function calculate(a, b) {', label: 'function calculate(a, b) {' },
        { value: 'function calculator(a, b, op) {', label: 'function calculator(a, b, op) {' }
    ],
    line2: [
        { value: '', label: 'Выбери правильный вариант' },
        { value: 'if (operator === "+") return a + b;', label: 'if (operator === "+") return a + b;' },
        { value: 'if (operator = "+") return a + b;', label: 'if (operator = "+") return a + b;' },
        { value: 'if (operator == "+") return a + b;', label: 'if (operator == "+") return a + b;' }
    ],
    line3: [
        { value: '', label: 'Выбери правильный вариант' },
        { value: 'if (operator === "-") return a - b;', label: 'if (operator === "-") return a - b;' },
        { value: 'if (operator === "-") return a + b;', label: 'if (operator === "-") return a + b;' },
        { value: 'if (operator = "-") return a - b;', label: 'if (operator = "-") return a - b;' }
    ]
} as const

const CORRECT_ANSWERS = {
    line1: 'function calculate(a, b, operator) {',
    line2: 'if (operator === "+") return a + b;',
    line3: 'if (operator === "-") return a - b;'
} as const

type CodeLine = keyof typeof CODE_LINE_OPTIONS

export default function MissionResponsibility({
    position = [0, 0, 0],
    rotation = [0, 0, 0]
}: MissionResponsibilityProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | ''>('')
    const [currentStep, setCurrentStep] = useState(0)
    const [codeAnswers, setCodeAnswers] = useState({
        line1: '',
        line2: '',
        line3: ''
    })

    const missionGroupRef = useRef<THREE.Group>(null)
    const highlightRef = useRef<THREE.Group>(null)
    const animationRef = useRef<number>()

    const { completeTask, getTaskStatus, activateTask, deactivateTask, getTotalPoints } = useTaskStore()
    const isCompleted = getTaskStatus('missionResponsibility')
    const totalPoints = getTotalPoints()

    useFrame((state) => {
        if (!highlightRef.current || isCompleted || isProcessing) return

        const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2
        highlightRef.current.children.forEach(child => {
            if (child instanceof THREE.PointLight) {
                child.intensity = intensity
            }
        })
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
                if (selectedChoice === 'fix' && currentStep === 0) {
                    setCurrentStep(1)
                    setIsProcessing(false)
                    setProcessingProgress(0)
                } else {
                    if (selectedChoice) {
                        completeTask('missionResponsibility', CHOICE_CONFIG[selectedChoice].points, selectedChoice)
                    }
                    handleResetDialog()
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [isProcessing, selectedChoice, currentStep, completeTask])

    const handleCloseDialog = useCallback(() => {
        if (!isProcessing) {
            handleResetDialog()
        }
    }, [isProcessing])

    const handleResetDialog = useCallback(() => {
        setShowDialog(false)
        deactivateTask('missionResponsibility')
        setIsProcessing(false)
        setProcessingProgress(0)
        setSelectedChoice('')
        setCurrentStep(0)
        setCodeAnswers({ line1: '', line2: '', line3: '' })
    }, [deactivateTask])

    const handleInteraction = useCallback((choice: ChoiceType) => {
        if (isProcessing) return
        setSelectedChoice(choice)
        setIsProcessing(true)
    }, [isProcessing])

    const handleCodeAnswer = useCallback((line: CodeLine, answer: string) => {
        setCodeAnswers(prev => ({
            ...prev,
            [line]: answer
        }))
    }, [])

    const checkCodeSolution = useCallback(() => {
        const isCorrect = Object.keys(CORRECT_ANSWERS).every(
            key => codeAnswers[key as CodeLine] === CORRECT_ANSWERS[key as CodeLine]
        )

        if (isCorrect) {
            completeTask('missionResponsibility', 3, 'fix')
            handleResetDialog()
        } else {
            alert('Есть ошибки! Проверь правильность исправлений.')
        }
    }, [codeAnswers, completeTask, handleResetDialog])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                e.preventDefault()
                setShowDialog(true)
                activateTask('missionResponsibility')
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
            fontSize: '16px'
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
        codeLine: (line: string) => ({
            marginBottom: '15px',
            background: line ? '#1e3a2c' : '#2d2a1e',
            padding: '10px',
            borderRadius: '4px',
            border: line ? '1px solid #10b981' : '1px solid #666'
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

    const renderStep0 = useMemo(() => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}> Миссия: Технический долг</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5', color: '#e5e5e5' }}>
                Обнаружил старый кривой код калькулятора, который работает, но содержит ошибки и может сломаться в будущем.
            </p>

            <div style={{
                background: '#1a1a1a',
                padding: '15px',
                borderRadius: '8px',
                margin: '15px 0',
                fontFamily: 'monospace',
                fontSize: '13px',
                border: '1px solid #333'
            }}>
                <div style={{ color: '#ff6b6b' }}>function calculate(a, b) {'{'}</div>
                <div style={{ color: '#ff6b6b', marginLeft: '20px' }}>return a + b;</div>
                <div style={{ color: '#ff6b6b' }}>{'}'}</div>
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5', color: '#e5e5e5' }}>
                Код работает только для сложения, но должен поддерживать разные операции.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(Object.entries(CHOICE_CONFIG) as [ChoiceType, typeof CHOICE_CONFIG[ChoiceType]][]).map(([key, choice]) => (
                    <button
                        key={key}
                        onClick={() => handleInteraction(key)}
                        style={styles.choiceButton(choice.color, isProcessing)}
                        onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <strong>{choice.fullText}</strong><br />
                        <small>{choice.description} (+{choice.points} {choice.points === 1 ? 'балл' : 'балла'})</small>
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
    ), [styles, handleCloseDialog, handleInteraction, isProcessing, totalPoints])

    const renderStep1 = useMemo(() => {
        const isAllFilled = codeAnswers.line1 && codeAnswers.line2 && codeAnswers.line3

        return (
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Исправление кода</h3>
                    <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
                </div>

                <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5', color: '#e5e5e5' }}>
                    Исправь ошибки в коде калькулятора. Выбери правильные варианты для каждой строки:
                </p>

                <div style={{
                    background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px',
                    margin: '20px 0',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    border: '2px solid #333'
                }}>
                    {(['line1', 'line2', 'line3'] as CodeLine[]).map((line) => (
                        <div key={line} style={styles.codeLine(codeAnswers[line])}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: codeAnswers[line] ? '#10b981' : '#f59e0b' }}>
                                Строка {line.charAt(4)}:
                            </div>
                            <select
                                value={codeAnswers[line]}
                                onChange={(e) => handleCodeAnswer(line, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    background: '#2d2d2d',
                                    color: 'white'
                                }}
                            >
                                {CODE_LINE_OPTIONS[line].map((option, idx) => (
                                    <option key={idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div style={{ color: '#4ade80', marginLeft: '20px' }}>if (operator === "*") return a * b;</div>
                    <div style={{ color: '#4ade80', marginLeft: '20px' }}>if (operator === "/") return a / b;</div>
                    <div style={{ color: '#4ade80', marginLeft: '20px' }}>throw new Error("Неизвестный оператор: " + operator);</div>
                    <div style={{ color: '#4ade80' }}>{'}'}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleCloseDialog}
                        style={{
                            padding: '10px 20px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={checkCodeSolution}
                        disabled={!isAllFilled}
                        style={{
                            padding: '10px 20px',
                            background: !isAllFilled ? '#555' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: !isAllFilled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Проверить решение
                    </button>
                </div>
            </div>
        )
    }, [styles, handleCloseDialog, codeAnswers, handleCodeAnswer, checkCodeSolution])

    const renderProcessing = useMemo(() => {
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
                    <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Обработка выбора...</h3>
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
    }, [selectedChoice, processingProgress])

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
                <Html position={[0, 2.5, 0]} center>
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

            {showDialog && !isProcessing && currentStep === 0 && <Html position={[0, 0, 0]} center>{renderStep0}</Html>}
            {showDialog && !isProcessing && currentStep === 1 && <Html position={[0, 0, 0]} center>{renderStep1}</Html>}
            {isProcessing && <Html position={[0, 3, 0]} center>{renderProcessing}</Html>}

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