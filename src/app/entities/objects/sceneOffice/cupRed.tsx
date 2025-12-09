
import { useGLTF } from "@react-three/drei"

interface CupRed {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CupRed({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.2,
}: CupRed) {
    const { scene } = useGLTF('/models/office/cup_red.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/cup_red.glb')