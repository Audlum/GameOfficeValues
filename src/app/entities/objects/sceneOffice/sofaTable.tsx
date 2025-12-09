import { useGLTF } from "@react-three/drei"

export default function SofaTable() {
    const { scene } = useGLTF('/models/office/modern_bentwood_sofa_side_table.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[-9.6, 1, -7.5]} receiveShadow
            object={scene}
            scale={2.8}

        />
    )
}
useGLTF.preload('/models/office/modern_bentwood_sofa_side_table.glb')
