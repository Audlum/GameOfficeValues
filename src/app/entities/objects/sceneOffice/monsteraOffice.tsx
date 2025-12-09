import { useGLTF } from "@react-three/drei"

export default function MonsteraOffice() {
    const { scene } = useGLTF('/models/monstera.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[8, 0, -8]} receiveShadow
            object={scene}
            scale={2.5}

        />
    )
}
useGLTF.preload('/models/monstera.glb')
