import { useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"
import * as THREE from "three"

interface DoorProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
    onDoorClick?: () => void
    isInteractive?: boolean
}

export default function Door({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
    onDoorClick,
    isInteractive = false
}: DoorProps) {
    const { scene } = useGLTF('/models/door.glb')
    const doorRef = useRef<THREE.Object3D | null>(null)

    useEffect(() => {
        if (doorRef.current && isInteractive) {
            // Добавляем userData для идентификации интерактивной двери
            doorRef.current.userData = {
                isDoor: true,
                onDoorClick: onDoorClick
            }
        }
    }, [onDoorClick, isInteractive])

    return (
        <primitive
            ref={doorRef}
            position={position}
            object={scene.clone()}
            scale={scale}
            rotation={rotation}
        />
    )
}