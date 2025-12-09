import { useGLTF } from "@react-three/drei"

interface TableBoss {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TableBoss({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: TableBoss) {
    const { scene } = useGLTF('/models/Boss/office_table.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}