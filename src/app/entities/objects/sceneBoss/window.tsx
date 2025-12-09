import { useGLTF } from "@react-three/drei"

interface Window {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Window({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: Window) {
    const { scene } = useGLTF('/models/Boss/window_glass.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}