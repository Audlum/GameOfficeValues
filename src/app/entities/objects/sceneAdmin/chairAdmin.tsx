import { useGLTF } from "@react-three/drei"

export default function ChairAdmin() {
    const { scene } = useGLTF('/models/office_chair.glb')
    return (
        <primitive
            rotation={[0, Math.PI / -2, 0]}
            position={[4, -1, 3]} receiveShadow
            object={scene}
            scale={2}

        />
    )

}

