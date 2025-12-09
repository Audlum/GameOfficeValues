import { useGLTF } from "@react-three/drei"

export default function MossOffice() {
    const { scene } = useGLTF('/models/office/moss_wall_decor.glb')
    return (
        <primitive
            rotation={[0, 180 * Math.PI / 180, 1.57]}
            position={[-9, 2.3, -8.9]} receiveShadow
            object={scene}
            scale={1.4}

        />
    )
}
useGLTF.preload('/models/office/moss_wall_decor.glb')
