import { useGLTF } from "@react-three/drei"

interface Plates {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Soda({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.003,
}: Plates) {
    const { scene } = useGLTF('/models/living/soda_cans.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}