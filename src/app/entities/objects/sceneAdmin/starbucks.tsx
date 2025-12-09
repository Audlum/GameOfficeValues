import { useGLTF } from "@react-three/drei"

export default function Starbucks() {
    const { scene } = useGLTF('/models/starbucks_disposable_cup.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[1, 0.7, 0]} receiveShadow
            object={scene}
            scale={4}

        />
    )
}

