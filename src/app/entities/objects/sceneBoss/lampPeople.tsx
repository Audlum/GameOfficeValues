import { useGLTF } from "@react-three/drei"

interface LampPeople {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function LampPeople({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: LampPeople) {
    const { scene } = useGLTF('/models/Boss/floor_lamp.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}