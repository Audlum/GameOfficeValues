import { useGLTF } from "@react-three/drei"

export default function Floor() {
    const { scene } = useGLTF('/models/floor.glb')
    return (
        <primitive
            // rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -7.2, 0]} receiveShadow
            object={scene}
            scale={15}

        />
    )

}

