import { useGLTF } from "@react-three/drei"

export default function DocFolder() {
    const { scene } = useGLTF('/models/tablet_folder.glb')
    return (
        <primitive
            rotation={[0, Math.PI / -2.4, 0]}
            position={[-4.3, -0.16, 2.3]} receiveShadow
            object={scene}
            scale={0.02}

        />
    )
}

