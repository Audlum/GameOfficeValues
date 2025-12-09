import { useGLTF } from "@react-three/drei"

export default function Moss() {
    const { scene } = useGLTF('/models/moss_wall_decor.glb')
    return (
        <primitive
            rotation={[0, 0, 1.57]}
            position={[-2.5, 2, 5]} receiveShadow
            object={scene}
            scale={1}

        />
    )
}

