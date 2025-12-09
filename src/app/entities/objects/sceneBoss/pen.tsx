import { useGLTF } from "@react-three/drei"

interface Pen {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Pen({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.4,
}: Pen) {
    const { scene } = useGLTF('/models/Boss/black_pen_high_quality_high-poly_model.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}