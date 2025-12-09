import { useGLTF } from "@react-three/drei"

interface MoonLamp {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function MoonLamp({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: MoonLamp) {
    const { scene } = useGLTF('/models/office/moon_-_table_lamp.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}
useGLTF.preload('/models/office/moon_-_table_lamp.glb')