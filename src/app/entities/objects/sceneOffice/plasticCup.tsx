import { useGLTF } from "@react-three/drei"

interface PlasticCup {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function PlasticCup({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.8,
}: PlasticCup) {
    const { scene } = useGLTF('/models/office/plastic_cup.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/plastic_cup.glb')