import { useGLTF } from "@react-three/drei"

export default function Door() {
    const { scene } = useGLTF('/models/tableMagazine.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[-4, -1, 2]} receiveShadow
            object={scene}
            scale={2}

        />
    )
}

