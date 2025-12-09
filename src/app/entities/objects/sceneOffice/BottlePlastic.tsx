import { useGLTF } from "@react-three/drei"

interface BottlePlastic {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function BottlePlastic({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 3,
}: BottlePlastic) {
    const { scene } = useGLTF('/models/office/plastic_water_bottle.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/plastic_water_bottle.glb')