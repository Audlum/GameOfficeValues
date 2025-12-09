import { useGLTF } from "@react-three/drei"

interface Cactus {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CactusCube({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 5,
}: Cactus) {
    const { scene } = useGLTF('/models/office/cactus_plant_pot_cube_small_model.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/cactus_plant_pot_cube_small_model.glb')