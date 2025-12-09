import { useGLTF } from "@react-three/drei"

interface Landscape {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Landscape({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.8,
}: Landscape) {
    const { scene } = useGLTF('/models/Boss/low_poly_city_building.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}