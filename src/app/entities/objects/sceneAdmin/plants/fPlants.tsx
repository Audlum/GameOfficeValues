import { useGLTF } from "@react-three/drei"

export default function Monstera() {
    const { scene } = useGLTF('/models/monstera.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[5.5, 0, -4.3]} receiveShadow
            object={scene}
            scale={2}

        />
    )
}

