import { useGLTF } from "@react-three/drei"

interface ChairBoss {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function ChairBoss({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.7,
}: ChairBoss) {
    const { scene } = useGLTF('/models/Boss/office_chair.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}