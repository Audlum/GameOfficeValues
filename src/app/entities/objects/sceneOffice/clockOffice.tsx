import { useGLTF } from "@react-three/drei"

interface CofeTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function ClockOffice({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.5,
}: CofeTable) {
    const { scene } = useGLTF('/models/lowpoly_wall_clock.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/lowpoly_wall_clock.glb')
