import { useGLTF } from "@react-three/drei"

interface Sky {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Sky({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: Sky) {
    const { scene } = useGLTF('/models/Boss/stylized_clouds.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}