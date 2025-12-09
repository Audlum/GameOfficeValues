import { useGLTF } from "@react-three/drei"

export default function CupBlue() {
    const { scene } = useGLTF('/models/office/blueCup.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[0.5, 0.85, -7.8]} receiveShadow
            object={scene}
            scale={0.17}

        />
    )

}
useGLTF.preload('/models/office/blueCup.glb')
