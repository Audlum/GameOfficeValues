import { useGLTF } from "@react-three/drei"

interface WoodernTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function WoodernTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: WoodernTable) {
    const { scene } = useGLTF('/models/living/dining_table_wood_with_black_metal.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}