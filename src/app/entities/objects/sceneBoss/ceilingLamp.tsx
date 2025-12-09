import { useGLTF } from "@react-three/drei"

interface CeilingLamp {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CeilingLamp({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: CeilingLamp) {
    const { scene } = useGLTF('/models/Boss/ceiling_lamp.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}