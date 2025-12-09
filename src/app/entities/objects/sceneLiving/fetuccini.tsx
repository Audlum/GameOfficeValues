import { useGLTF } from "@react-three/drei"

interface CoffeMaker {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Fetuccini({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.02,
}: CoffeMaker) {
    const { scene } = useGLTF('/models/living/fetuccini_fruto_di_mare.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}