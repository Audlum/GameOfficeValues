import { useGLTF } from "@react-three/drei"

export default function FoldersShelf() {
    const { scene } = useGLTF('/models/office/folders.glb')
    return (
        <primitive
            rotation={[0, 0, 0]}
            position={[-11.3, 1.7, 8.5]} receiveShadow
            object={scene}
            scale={0.2}

        />
    )
}
useGLTF.preload('/models/office/folders.glb')
