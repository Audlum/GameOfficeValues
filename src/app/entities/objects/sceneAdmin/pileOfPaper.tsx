import { useGLTF } from "@react-three/drei"

export default function PlieOfPaper() {
    const { scene } = useGLTF('/models/pile_of_papers.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[4, 0.337, 1.5]} receiveShadow
            object={scene}
            scale={1.3}

        />
    )
}

