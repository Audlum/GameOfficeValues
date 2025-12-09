import { useGLTF } from "@react-three/drei"

export default function Armchair() {
    const { scene } = useGLTF('/models/armchair.glb')
    return (
        <primitive
            rotation={[0, -1, 0]}
            position={[-5.4, -1, -4]} receiveShadow
            object={scene}
            scale={2}

        />
    )
}

