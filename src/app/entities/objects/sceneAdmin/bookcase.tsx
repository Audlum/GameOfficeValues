import { useGLTF } from "@react-three/drei"

export default function BookCase() {
    const { scene } = useGLTF('/models/bookcase.glb')
    return (
        <primitive
            rotation={[0, -9, 0]}
            position={[5.8, -1, -2.8]} receiveShadow
            object={scene}
            scale={1.7}

        />
    )
}

useGLTF.preload('/model/bookcase.glb')        