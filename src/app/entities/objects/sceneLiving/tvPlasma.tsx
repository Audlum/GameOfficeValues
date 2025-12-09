import { useGLTF } from "@react-three/drei"

interface TvPlasma {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TvPlasma({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2.5,
}: TvPlasma) {
    const { scene } = useGLTF('/models/living/tv_plasma.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}