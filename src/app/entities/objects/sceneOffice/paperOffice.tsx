import { useGLTF } from "@react-three/drei"

export default function PlieOfPaperOffice() {
    const { scene } = useGLTF('/models/pile_of_papers.glb')
    return (
        <primitive
            rotation={[0, 1, 0]}
            position={[6, 0.5, 5]} receiveShadow
            object={scene}
            scale={1.3}

        />
    )
}
useGLTF.preload('/models/pile_of_papers.glb')
