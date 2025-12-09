import { useGLTF } from "@react-three/drei"

interface Plates {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Plates({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.0035,
}: Plates) {
    const { scene } = useGLTF('/models/living/plates.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}