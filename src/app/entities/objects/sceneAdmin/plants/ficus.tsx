import { useGLTF } from "@react-three/drei"

interface Ficus {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Ficus({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.7,
}: Ficus) {
    const { scene } = useGLTF('/models/ficus.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}

