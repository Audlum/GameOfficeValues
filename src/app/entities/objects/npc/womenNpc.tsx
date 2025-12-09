import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import { Bone, Group } from "three"

interface WomenNpcProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number,
    isInteractive?: boolean
    onNpcClick?: () => void
}

export default function WomenNpc({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.5,
    isInteractive = false,
    onNpcClick
}: WomenNpcProps) {
    const { scene } = useGLTF('/models/avatar/npc/mini_modular_character_free_demo.glb')
    const groupRef = useRef<Group>(null)

    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isBone) {
                    if (child.name === 'LeftArm_07') {
                        const bone = child as Bone
                        bone.rotation.x = 0.4
                        bone.rotation.y = 0.4
                    }
                    if (child.name === 'LeftForeArm_08') {
                        const bone = child as Bone
                        bone.rotation.x = -0.1
                    }

                    if (child.name === 'RightArm_026') {
                        const bone = child as Bone
                        bone.rotation.x = 0.4
                        bone.rotation.y = 0.4
                    }
                    if (child.name === 'RightForeArm_027') {
                        const bone = child as Bone
                        bone.rotation.x = -0.1
                    }
                }
            })
        }
    }, [scene])

    // Добавляем userData к группе
    useEffect(() => {
        if (groupRef.current && isInteractive) {
            groupRef.current.userData = {
                isNpc: true,
                onNpcClick: onNpcClick
            }
        }
    }, [isInteractive, onNpcClick])

    return (
        <group ref={groupRef}>
            <primitive
                object={scene}
                position={position}
                rotation={rotation}
                scale={scale}
                receiveShadow
                castShadow
            />
        </group>
    )
}

useGLTF.preload('/models/avatar/npc/mini_modular_character_free_demo.glb')