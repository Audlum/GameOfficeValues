import { useGLTF } from "@react-three/drei"

interface Plates {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TreeS2({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.2,
}: Plates) {
    const { scene } = useGLTF('/models/living/tree_s2.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}