import { useGLTF } from "@react-three/drei"

export default function Organiser() {
    const { scene } = useGLTF('/models/office_decor_organiser_pen.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[4.6, 0.337, 1.3]} receiveShadow
            object={scene}
            scale={1.3}

        />
    )
}

