import { useGLTF } from "@react-three/drei"

interface gamingLaptop {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function GamingLaptop({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.3,
}: gamingLaptop) {
    const { scene } = useGLTF('/models/office/gaming_laptop.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/gaming_laptop.glb')