import { useGLTF } from "@react-three/drei"

export default function MapWooden() {
    const { scene } = useGLTF('/models/office/wooden_world_map_decor.glb')
    return (
        <primitive
            rotation={[0, 0, 0]}
            position={[-6, 1, 8.8]} receiveShadow
            object={scene}
            scale={1}

        />
    )
}
useGLTF.preload('/models/office/wooden_world_map_decor.glb')
