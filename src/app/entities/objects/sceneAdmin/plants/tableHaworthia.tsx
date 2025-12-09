import { useGLTF } from "@react-three/drei"

export default function TableHaworthia() {
    const { scene } = useGLTF('/models/tableHaworthia_plant.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[-5, -0.3, 2]} receiveShadow
            object={scene}
            scale={0.7}

        />
    )
}

