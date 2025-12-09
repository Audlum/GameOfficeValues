import { useGLTF } from "@react-three/drei"

interface CoffeMaker {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Board({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: CoffeMaker) {
    const { scene } = useGLTF('/models/living/whiteboard_low-poly.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}