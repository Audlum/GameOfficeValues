import { useGLTF } from "@react-three/drei"

export default function Sofa() {
    const { scene } = useGLTF('/models/sofa_6.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[-4, -1, 3.8]} receiveShadow
            object={scene}
            scale={2}

        />
    )

}

