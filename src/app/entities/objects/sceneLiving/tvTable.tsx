import { useGLTF } from "@react-three/drei"

interface TvTable {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function TvTable({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: TvTable) {
    const { scene } = useGLTF('/models/living/tv_cabinet_3d_model.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={scale}
            rotation={rotation}

        />
    )
}