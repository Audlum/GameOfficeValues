import { useGLTF } from "@react-three/drei"

interface PaperForm {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function PaperForm({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1.5,
}: PaperForm) {
    const { scene } = useGLTF('/models/Boss/paper_tablet.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}