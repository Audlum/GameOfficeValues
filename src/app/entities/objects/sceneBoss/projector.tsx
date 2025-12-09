import { useGLTF } from "@react-three/drei"

interface Projector {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Projector({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.23,
}: Projector) {
    const { scene } = useGLTF('/models/Boss/projector_asset.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}