import { useGLTF } from "@react-three/drei"

export default function KettleElectric() {
    const { scene } = useGLTF('/models/office/electric_kettle.glb')
    return (
        <primitive
            rotation={[0, -1, 0]}
            position={[3, 0.8, -8]} receiveShadow
            object={scene}
            scale={2}

        />
    )

}
useGLTF.preload('/models/office/electric_kettle.glb')
