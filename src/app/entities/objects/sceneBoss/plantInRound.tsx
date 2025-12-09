import { useGLTF } from "@react-three/drei"

interface PlantInRound {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function PlantInRound({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.7,
}: PlantInRound) {
    const { scene } = useGLTF('/models/Boss/round_potted_plant.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}