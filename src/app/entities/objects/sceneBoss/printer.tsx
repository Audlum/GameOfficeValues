import { useGLTF } from "@react-three/drei"

interface Printer {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function Printer({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.5,
}: Printer) {
    const { scene } = useGLTF('/models/Boss/printer.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}