import { useGLTF } from "@react-three/drei"

export default function WoodernPanel() {
    const { scene } = useGLTF('/models/office/wooden__panel_2ft_by_3ft_by_0.75in.glb')
    return (
        <primitive
            position={[-5, 2.5, -8.7]}
            rotation={[Math.PI / 2, Math.PI, Math.PI]}
            receiveShadow
            object={scene}
            scale={4}
        />
    )
}
useGLTF.preload('/models/office/wooden__panel_2ft_by_3ft_by_0.75in.glb')