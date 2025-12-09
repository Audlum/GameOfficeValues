import { useGLTF } from "@react-three/drei"

export default function WallLampCoffe() {
    const { scene } = useGLTF('/models/office/floor_lampCoffe.glb')
    return (
        <primitive
            rotation={[0, 0, 0]}
            position={[-0.5, -1, -8.2]} receiveShadow
            object={scene}
            scale={2.3}

        />
    )

}
useGLTF.preload('/models/office/floor_lampCoffe.glb')
