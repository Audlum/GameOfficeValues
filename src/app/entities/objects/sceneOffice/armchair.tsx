import { useGLTF } from "@react-three/drei"

export default function ArmchairOffice() {
    const { scene } = useGLTF('/models/office/armchair_poppi.glb')
    return (
        <primitive
            rotation={[0, 2, 0]}
            position={[-6, -0.97, -7]} receiveShadow
            object={scene}
            scale={0.027}

        />
    )
}
useGLTF.preload('/models/office/armchair_poppi.glb')

