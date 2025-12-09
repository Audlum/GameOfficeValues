import { useGLTF } from "@react-three/drei"

interface BlackShelf {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function BlackShelf({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 5.5,
}: BlackShelf) {
    const { scene } = useGLTF('/models/Boss/black_steel_shelf_interior_design.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}