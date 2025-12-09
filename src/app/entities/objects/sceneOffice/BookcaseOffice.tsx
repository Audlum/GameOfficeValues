import { useGLTF } from "@react-three/drei"

export default function BookcaseOffice() {
    const { scene } = useGLTF('/models/office/open_back_bookcase.glb')
    return (
        <primitive
            rotation={[0, Math.PI / -2, 0]}
            position={[10.7, -0.9, -8]} receiveShadow
            object={scene}
            scale={1.7}

        />
    )
}
useGLTF.preload('/models/office/open_back_bookcase.glb')

