import { useGLTF } from "@react-three/drei"

export default function AdminDesk() {
    const { scene } = useGLTF('/models/adminDesk.glb')
    return (
        <primitive
            rotation={[0, Math.PI / -2, 0]}
            position={[3.7, 0.3, 3]} receiveShadow
            object={scene}
            scale={2}

        />
    )

}

