import { useGLTF } from "@react-three/drei"

interface ProjectorScreen {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function ProjectorScreen({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.5,
}: ProjectorScreen) {
    const { scene } = useGLTF('/models/Boss/projector_screen_7mb.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}