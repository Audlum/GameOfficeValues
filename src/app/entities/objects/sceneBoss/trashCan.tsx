import { useGLTF } from "@react-three/drei"

interface TrashCan {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TrashCan({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 3,
}: TrashCan) {
    const { scene } = useGLTF('/models/Boss/trash_can.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}