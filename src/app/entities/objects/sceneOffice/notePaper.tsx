import { useGLTF } from "@react-three/drei"

interface NotePaper {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function NotePaper({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.07,
}: NotePaper) {
    const { scene } = useGLTF('/models/office/notepad_with_ringbinders.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/notepad_with_ringbinders.glb')