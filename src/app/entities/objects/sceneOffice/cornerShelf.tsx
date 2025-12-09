import { useGLTF } from "@react-three/drei"

export default function CornerShelf() {
    const { scene } = useGLTF('/models/office/corner_wall_shelf.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 2, 0]}
            position={[-12.3, 1, 8.8]} receiveShadow
            object={scene}
            scale={2.8}

        />
    )
}
useGLTF.preload('/models/office/corner_wall_shelf.glb')
