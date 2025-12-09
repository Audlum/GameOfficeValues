import { useGLTF } from "@react-three/drei"

export default function CupOfCoffe() {
    const { scene } = useGLTF('/models/cup_of_cappuccino.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 1, 0]}
            position={[-3.7, -0.2, 2]} receiveShadow
            object={scene}
            scale={2.5}

        />
    )
}

