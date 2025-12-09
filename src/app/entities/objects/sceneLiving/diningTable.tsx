import { useGLTF } from "@react-three/drei"

interface DiningTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function DiningTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: DiningTable) {
    const { scene } = useGLTF('/models/living/sleek_modern_dining_table_set.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}