import { useGLTF } from "@react-three/drei"

interface TableTennis {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TableTennis({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.4,
}: TableTennis) {
    const { scene } = useGLTF('/models/living/table_tennis.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}