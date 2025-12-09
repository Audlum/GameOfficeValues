import { useGLTF } from "@react-three/drei"

interface KitchenPanel {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function KitchenPanel({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: KitchenPanel) {
    const { scene } = useGLTF('/models/living/kitchenPanel.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}