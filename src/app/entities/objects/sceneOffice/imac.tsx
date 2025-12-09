import { useGLTF } from "@react-three/drei"

interface IMac {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function IMac({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.0028,
}: IMac) {
    const { scene } = useGLTF('/models/office/iMac.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/iMac.glb')