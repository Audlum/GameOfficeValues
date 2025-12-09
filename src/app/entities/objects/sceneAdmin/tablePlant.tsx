import { useGLTF } from "@react-three/drei"

export default function TablePlant() {
    const { scene } = useGLTF('/models/table_plant_pots.glb')
    return (
        <primitive
            rotation={[0, -2, 0]}
            position={[2.5, 0.7, 4.5]} receiveShadow
            object={scene}
            scale={2}

        />
    )
}

