import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from 'three'

interface Puddle {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
    opacity?: number
    color?: string
}

export default function Puddle({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.0007,
    opacity = 0.5,
    color = "#755a38"
}: Puddle) {
    const { scene } = useGLTF('/models/Boss/puddle.glb')

    const clonedScene = useMemo(() => {
        const sceneClone = scene.clone()

        sceneClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {

                child.material = new THREE.MeshStandardMaterial({
                    color: color,
                    transparent: true,
                    opacity: opacity,
                    roughness: 0.9,
                    metalness: 0.1
                })
            }
        })

        return sceneClone
    }, [scene, color, opacity])

    return (
        <primitive
            object={clonedScene}
            position={position}
            rotation={rotation}
            scale={scale}
            receiveShadow
            castShadow
        />
    )
}