import { useGLTF } from "@react-three/drei"

interface FolderSmile {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function FolderSmile({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 2,
}: FolderSmile) {
    const { scene } = useGLTF('/models/Boss/folder_hfjone.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}