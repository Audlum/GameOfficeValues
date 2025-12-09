import { useGLTF } from "@react-three/drei"

interface BooksForShelf {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function BooksForShelf({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.3,
}: BooksForShelf) {
    const { scene } = useGLTF('/models/Boss/variety_of_books.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position} receiveShadow
            scale={scale}
            rotation={rotation}

        />
    )
}