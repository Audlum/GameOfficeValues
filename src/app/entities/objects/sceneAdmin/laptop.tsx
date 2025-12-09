import { useGLTF } from "@react-three/drei"

export default function LaptopAdmin() {
    const { scene } = useGLTF('/models/laptop.glb')
    return (
        <primitive
            rotation={[0, -2, 0]}
            position={[3, 0.7, 2.5]} receiveShadow
            object={scene}
            scale={0.0025}

        />
    )
}

