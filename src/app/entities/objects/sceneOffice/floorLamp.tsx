import { useGLTF } from "@react-three/drei"

export default function FloorLamp() {
    const { scene } = useGLTF('/models/office/floor_lamp.glb')
    return (
        <primitive
            rotation={[0, 2, 0]}
            position={[-11.5, -0.97, -2.5]} receiveShadow
            object={scene}
            scale={2.1}

        />
    )
}
useGLTF.preload('/models/office/floor_lamp.glb')
