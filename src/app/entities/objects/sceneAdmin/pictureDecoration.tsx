import { useGLTF } from "@react-three/drei"

export default function PictureDecor() {
    const { scene } = useGLTF('/models/picture_decoration__wall_decoration.glb')
    return (
        <primitive
            rotation={[1.5, 0, -1.6]}
            position={[-6.33, 1.3, -2]} receiveShadow
            object={scene}
            scale={2}

        />
    )
}

