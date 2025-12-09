import { useGLTF } from "@react-three/drei"

export default function SofaBlue() {
    const { scene } = useGLTF('/models/office/blue_sofa.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 2, 0]}
            position={[-11.5, -1, -5.7]} receiveShadow
            object={scene}
            scale={2.6}

        />
    )
}
useGLTF.preload('/models/office/blue_sofa.glb')
