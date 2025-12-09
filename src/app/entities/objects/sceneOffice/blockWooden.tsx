import { useGLTF } from "@react-three/drei"

interface BlockWooden {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
}

export default function BlockWooden({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [0, 0, 0],
}: BlockWooden) {
    const { scene } = useGLTF('/models/office/unit_block.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            // scale={[0.05, 0.6, 0.01]}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/unit_block.glb')