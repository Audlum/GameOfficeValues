import { useGLTF } from "@react-three/drei"

export default function MemoryBord() {
    const { scene } = useGLTF('/models/office/office_decor_memory_board.glb')
    return (
        <primitive
            rotation={[0, 0, 0]}
            position={[10, 2, 8.88]} receiveShadow
            object={scene}
            scale={4.3}

        />
    )
}
useGLTF.preload('/models/office/office_decor_memory_board.glb')
