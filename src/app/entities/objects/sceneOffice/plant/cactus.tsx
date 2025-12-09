import { useGLTF } from "@react-three/drei"

interface Cactus {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Cactus({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.05,
}: Cactus) {
    const { scene } = useGLTF('/models/office/mini_cactus.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
// useGLTF.preload('/models/office/mini_cactus.glb')