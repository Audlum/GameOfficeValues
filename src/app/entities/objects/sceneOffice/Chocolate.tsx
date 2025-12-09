import { useGLTF } from "@react-three/drei"

interface Chocolate {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Chocolate({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.2,
}: Chocolate) {
    const { scene } = useGLTF('/models/office/chocolate_bar.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/chocolate_bar.glb')