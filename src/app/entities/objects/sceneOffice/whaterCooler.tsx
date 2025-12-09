import { useGLTF } from "@react-three/drei"

interface WhaterCooler {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function WhaterCooler({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.035,
}: WhaterCooler) {
    const { scene } = useGLTF('/models/office/water_cooler.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/water_cooler.glb')
