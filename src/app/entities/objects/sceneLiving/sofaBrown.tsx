import { useGLTF } from "@react-three/drei"

interface SofaBrown {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function SofaBrown({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.8,
}: SofaBrown) {
    const { scene } = useGLTF('/models/living/sofa_free.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}