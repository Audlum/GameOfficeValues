import { useGLTF } from "@react-three/drei"

export default function Clock() {
    const { scene } = useGLTF('/models/lowpoly_wall_clock.glb')
    return (
        <primitive
            rotation={[0, 1.6, 0]}
            position={[6.35, 2, 2.8]} receiveShadow
            object={scene}
            scale={0.5}

        />
    )
}

