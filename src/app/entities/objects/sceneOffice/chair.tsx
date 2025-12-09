import { useGLTF } from "@react-three/drei"

interface Chair {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Chair({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.022,
}: Chair) {
    const { scene } = useGLTF('/models/office/chair.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/chair.glb')