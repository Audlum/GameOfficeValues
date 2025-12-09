// components/TableTask.tsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTaskStore } from '../../stores/TaskStore'
import Chair from "../../objects/sceneOffice/chair"
import GamingLaptop from "../../objects/sceneOffice/gamingLaptop"
import IMac from "../../objects/sceneOffice/imac"
import Cactus from "../../objects/sceneOffice/plant/cactus"
import MiniPlant from "../../objects/sceneOffice/plant/miniPlant"
import WoodernTable from "../../objects/sceneOffice/woodernTable"
import NotePaper from '../../objects/sceneOffice/notePaper'
import CupRed from '../../objects/sceneOffice/cupRed'
import Chocolate from '../../objects/sceneOffice/Chocolate'
import BottlePlastic from '../../objects/sceneOffice/BottlePlastic'
import * as THREE from 'three'

interface TableTaskProps {
    position?: [number, number, number]
}

const CHOICE_CONFIG = {
    A: {
        points: 1,
        text: 'пройти мимо',
        fullText: 'Пройти мимо - "Это не мой стол"',
        color: '#ef4444'
    },
    B: {
        points: 2,
        text: 'убрать свою чашку',
        fullText: 'Убрать хотя бы свою чашку',
        color: '#f59e0b'
    },
    C: {
        points: 3,
        text: 'привести в порядок весь стол',
        fullText: 'Привести в порядок весь стол',
        color: '#10b981'
    }
} as const

type ChoiceType = keyof typeof CHOICE_CONFIG

const CHAIR_POSITIONS = [
    { pos: [-0.5, -2.5, 3.5], rot: [0, Math.PI / 2 + (10 * Math.PI / 180), 0] },
    { pos: [-0.8, -2.5, 0.5], rot: [0, Math.PI / 2 + (10 * Math.PI / -190), 0] },
    { pos: [-0.5, -2.5, -0.5], rot: [0, Math.PI / 2 + (10 * Math.PI / 150), 0] },
    { pos: [0.5, -2.5, 1.2], rot: [0, Math.PI / -2 + (10 * Math.PI / 180), 0] },
    { pos: [0.5, -2.5, 0], rot: [0, Math.PI / -2 + (10 * Math.PI / -190), 0] },
    { pos: [0.5, -2.5, -4], rot: [0, Math.PI / -2 + (10 * Math.PI / 150), 0] }
] as const

const CLUTTER_ITEMS = [
    { Component: NotePaper, pos: [0.2, 0.7, -3], rot: [0, 0.5, 0] },
    { Component: NotePaper, pos: [1, 0.7, 1.8], rot: [0, -2, 0] },
    { Component: CupRed, pos: [1.2, 0.8, 0], rot: [0, 1, 0] },
    { Component: CupRed, pos: [-1, 0.8, -3], rot: [0, 2, 0] },
    { Component: CupRed, pos: [-1, 0.8, 0.8], rot: [0, 0, 0] },
    { Component: Chocolate, pos: [-1.5, 0.7, 0], rot: [0, 2, 0] },
    { Component: Chocolate, pos: [-1.5, 0.7, -2], rot: [0, 0, 0] },
    { Component: Chocolate, pos: [0, 0.7, 2], rot: [0, -2, 0] },
    { Component: BottlePlastic, pos: [0, 0.4, 0], rot: [0, 1, 0] },
    { Component: BottlePlastic, pos: [1, 0.4, -2], rot: [0, 2, 0] },
    { Component: BottlePlastic, pos: [-1.5, 0.4, 3], rot: [0, 2, 0] }
] as const

export default function TableTask({ position = [-7, 0, 1] }: TableTaskProps) {
    const [playerNear, setPlayerNear] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | ''>('')

    const tableGroupRef = useRef<THREE.Group>(null)
    const highlightRef = useRef<THREE.Group>(null)
    const animationRef = useRef<number>()

    const { completeTask, getTaskStatus, activateTask, deactivateTask, getTotalPoints } = useTaskStore()
    const isCompleted = getTaskStatus('tableTask')
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
                if (selectedChoice) {
                    completeTask('tableTask', CHOICE_CONFIG[selectedChoice].points, selectedChoice)
                }
                setShowDialog(false)
                deactivateTask('tableTask')
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
            deactivateTask('tableTask')
        }
    }, [isProcessing, deactivateTask])

    const handleInteraction = useCallback((choice: ChoiceType) => {
        if (isProcessing) return
        setSelectedChoice(choice)
        setIsProcessing(true)
    }, [isProcessing])

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

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'KeyE' && playerNear && !isCompleted && !showDialog && !isProcessing) {
                e.preventDefault()
                setShowDialog(true)
                activateTask('tableTask')
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
            padding: '25px',
            borderRadius: '15px',
            minWidth: '350px',
            border: '3px solid #4ade80',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)'
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
            padding: '10px',
            background: disabled ? '#666' : color,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '12px' as const,
            margin: '2px',
            transition: 'all 0.2s',
            opacity: disabled ? 0.6 : 1,
            textAlign: 'center' as const,
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

    const renderDialog = useMemo(() => (
        <div style={styles.modal}>
            <div style={styles.header}>
                <h3 style={styles.title}>📋 Задание: Ответственность</h3>
                <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5', color: '#e5e5e5' }}>
                Стол коллеги в беспорядке перед важной встречей. Проявите ответственность!
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
                        {choice.fullText} (+{choice.points} {choice.points === 1 ? 'балл' : 'балла'})
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
        <group position={position} ref={tableGroupRef}>
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

            <group>
                <WoodernTable position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} />

                {CHAIR_POSITIONS.map((chair, index) => (
                    <Chair
                        key={index}
                        position={chair.pos as [number, number, number]}
                        rotation={chair.rot as [number, number, number]}
                    />
                ))}

                <Cactus position={[-0.8, 0.9, -1.8]} />
                <GamingLaptop position={[1, 0.6, 3]} rotation={[0, 0.3, 0]} />
                <IMac position={[-1.7, 2.1, 2]} rotation={[0, -1.6, 0]} />
                <MiniPlant position={[0, 0.6, -1]} />
            </group>

            {!isCompleted && (
                <>
                    {CLUTTER_ITEMS.map((item, index) => (
                        <item.Component
                            key={index}
                            position={item.pos as [number, number, number]}
                            rotation={item.rot as [number, number, number]}
                        />
                    ))}
                </>
            )}

            <mesh
                position={[0, 1, 0]}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                <boxGeometry args={[4, 2, 4]} />
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

            {showDialog && !isProcessing && <Html position={[0, 3, 0]} center>{renderDialog}</Html>}
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