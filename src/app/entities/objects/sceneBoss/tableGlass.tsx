import { useGLTF } from "@react-three/drei"

interface TableGlass {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TableGlass({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.01,
}: TableGlass) {
    const { scene } = useGLTF('/models/Boss/glass_table.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}