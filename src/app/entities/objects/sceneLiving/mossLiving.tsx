import { useGLTF } from "@react-three/drei"

export default function MossLiving() {
    const { scene } = useGLTF('/models/office/moss_wall_decor.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            position={[12.8, 2.3, -3]} receiveShadow
            object={scene}
            scale={1.4}

        />
    )
}

