import { useGLTF } from "@react-three/drei"

export default function MarkerBoard() {
    const { scene } = useGLTF('/models/office/low_poly_whiteboard.glb')
    return (
        <primitive
            rotation={[0, 0.5, 0]}
            position={[11, -0.9, -3.5]} receiveShadow
            object={scene}
            scale={0.9}

        />
    )
}
useGLTF.preload('/models/office/low_poly_whiteboard.glb')
