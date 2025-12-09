import { useGLTF } from "@react-three/drei"

interface CofeTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CofeTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.037,
}: CofeTable) {
    const { scene } = useGLTF('/models/office/coffeTableMirr.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/coffeTableMirr.glb')