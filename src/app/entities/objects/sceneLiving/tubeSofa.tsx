import { useGLTF } from "@react-three/drei"

interface TubeSofa {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TubeSofa({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.6,
}: TubeSofa) {
    const { scene } = useGLTF('/models/living/asplund_mali_tube_2p_sofa.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}