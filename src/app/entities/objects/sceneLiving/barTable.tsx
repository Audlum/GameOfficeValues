import { useGLTF } from "@react-three/drei"

interface BarTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function BarTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: BarTable) {
    const { scene } = useGLTF('/models/living/bar_stool_and_table.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}