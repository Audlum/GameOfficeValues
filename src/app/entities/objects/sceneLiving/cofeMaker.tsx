import { useGLTF } from "@react-three/drei"

interface CoffeMaker {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CoffeMaker({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.005,
}: CoffeMaker) {
    const { scene } = useGLTF('/models/living/sempai_coffee_maker.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}