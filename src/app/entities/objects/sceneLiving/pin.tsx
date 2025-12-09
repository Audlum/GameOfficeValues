import { useGLTF } from "@react-three/drei"
import { useRef, useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PinProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
    color?: string
    onReached?: () => void
    isActive?: boolean
    reached?: boolean
}

export default function Pin({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 35,
    color = '#9b59b6',
    onReached,
    isActive = true,
    reached = false
}: PinProps) {
    const { scene } = useGLTF('/models/living/cc0_-_pin_2.glb')
    const pinRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const [localReached, setLocalReached] = useState(reached)

    // Создаем материалы с разными цветами
    const [originalMaterials, setOriginalMaterials] = useState<THREE.Material[]>([])
    const [highlightMaterial, setHighlightMaterial] = useState<THREE.MeshStandardMaterial | null>(null)
    const [reachedMaterial, setReachedMaterial] = useState<THREE.MeshStandardMaterial | null>(null)

    // Инициализация материалов
    useEffect(() => {
        if (scene) {
            // Сохраняем оригинальные материалы
            const materials: THREE.Material[] = []
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                    materials.push(child.material)
                }
            })
            setOriginalMaterials(materials)

            // Создаем материал для подсветки при наведении
            const highlightMat = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2
            })
            setHighlightMaterial(highlightMat)

            // Создаем материал для достигнутой точки
            const reachedMat = new THREE.MeshStandardMaterial({
                color: '#4ade80',
                emissive: '#4ade80',
                emissiveIntensity: 0.7,
                metalness: 0.9,
                roughness: 0.1
            })
            setReachedMaterial(reachedMat)
        }
    }, [scene, color])

    // Обновление состояния reached
    useEffect(() => {
        setLocalReached(reached)
    }, [reached])

    // Анимация и вращение
    useFrame((state) => {
        if (pinRef.current && isActive && !localReached) {
            // Плавное вращение
            pinRef.current.rotation.y += 0.005

            // Плавающая анимация
            pinRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05

            // Масштабирование при наведении
            if (hovered) {
                pinRef.current.scale.setScalar(scale * 1.1)
            } else {
                pinRef.current.scale.setScalar(scale)
            }
        }
    })

    // Обновляем материалы в зависимости от состояния
    useEffect(() => {
        if (!pinRef.current || !highlightMaterial || !reachedMaterial) return

        pinRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (localReached && reachedMaterial) {
                    child.material = reachedMaterial
                } else if (hovered && isActive && highlightMaterial) {
                    child.material = highlightMaterial
                } else if (originalMaterials.length > 0) {
                    // Возвращаем оригинальный материал
                    child.material = originalMaterials[0]
                }
            }
        })
    }, [hovered, localReached, isActive, originalMaterials, highlightMaterial, reachedMaterial])

    const handleClick = (e: any) => {
        e.stopPropagation()
        if (isActive && !localReached && onReached) {
            setLocalReached(true)
            onReached()
        }
    }

    // Создаем свет для подсветки
    const lightPosition: [number, number, number] = [
        position[0],
        position[1] + 2,
        position[2]
    ]

    const currentColor = localReached ? '#4ade80' : (hovered && isActive ? color : '#ffffff')

    return (
        <>
            {/* Точечный свет для подсветки */}
            {isActive && (
                <pointLight
                    position={lightPosition}
                    intensity={localReached ? 1.5 : (hovered ? 1.2 : 0.8)}
                    color={currentColor}
                    distance={localReached ? 8 : 6}
                    decay={2}
                />
            )}

            {/* Амбиентный свет вокруг */}
            {isActive && (
                <pointLight
                    position={position}
                    intensity={localReached ? 0.5 : 0.3}
                    color={currentColor}
                    distance={4}
                />
            )}

            {/* Модель пина */}
            <group
                ref={pinRef}
                position={position}
                rotation={rotation}
                scale={scale}
                onPointerEnter={(e) => {
                    e.stopPropagation()
                    if (isActive && !localReached) {
                        setHovered(true)
                        document.body.style.cursor = 'pointer'
                    }
                }}
                onPointerLeave={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'default'
                }}
                onClick={handleClick}
            >
                <primitive object={scene.clone()} />
            </group>

            {/* HTML подсказка */}
            {isActive && (
                <Html position={[position[0], position[1] + 4, position[2]]} center>
                    <div style={{
                        background: `rgba(0, 0, 0, 0.9)`,
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: `3px solid ${currentColor}`,
                        boxShadow: `0 0 25px ${currentColor}`,
                        transform: 'translate(-50%, -50%)',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s',
                        animation: hovered && !localReached ? 'pulse 1.2s infinite' : 'none',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap'
                    }}>
                        {localReached ? (
                            <>
                                <span style={{ fontSize: '18px' }}>✓</span>
                                <span>Достигнуто!</span>
                            </>
                        ) : hovered ? (
                            <>
                                <span style={{ fontSize: '18px' }}>🎯</span>
                                <span>Нажми чтобы достигнуть!</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '18px' }}>📍</span>
                                <span>Точка маршрута</span>
                            </>
                        )}
                    </div>
                </Html>
            )}

            {/* Луч света над точкой */}
            {isActive && !localReached && (
                <mesh position={[position[0], position[1] + 2, position[2]]}>
                    <cylinderGeometry args={[0.1, 0.3, 3, 8]} />
                    <meshBasicMaterial
                        color={currentColor}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Эффект частиц для достигнутых точек */}
            {localReached && (
                <mesh position={[position[0], position[1] + 1, position[2]]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial
                        color="#4ade80"
                        transparent
                        opacity={0.2}
                        wireframe={true}
                    />
                </mesh>
            )}
        </>
    )
}

// Предзагрузка модели
useGLTF.preload('/models/living/cc0_-_pin_2.glb')