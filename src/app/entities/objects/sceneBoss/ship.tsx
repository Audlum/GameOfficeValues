import { useGLTF } from "@react-three/drei"

interface Ship {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Ship({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.1,
}: Ship) {
    const { scene } = useGLTF('/models/Boss/sailing_ship_model.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}