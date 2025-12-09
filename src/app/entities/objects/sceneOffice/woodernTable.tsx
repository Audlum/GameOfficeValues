import { useGLTF } from "@react-three/drei"

interface DoorProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function WoodernTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.03,
}: DoorProps) {
    const { scene } = useGLTF('/models/office/table_1_black.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/table_1_black.glb')