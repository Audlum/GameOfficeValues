import { useGLTF } from "@react-three/drei"

interface SofaBoss {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function SofaBoss({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.6,
}: SofaBoss) {
    const { scene } = useGLTF('/models/Boss/big_sofa_with_pillows.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}