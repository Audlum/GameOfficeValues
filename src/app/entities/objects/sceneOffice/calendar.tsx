import { useGLTF } from "@react-three/drei"

export default function Calendar() {
    const { scene } = useGLTF('/models/office/office_decor_calendar_desk.glb')
    return (
        <primitive
            rotation={[0, Math.PI / 2, 0]}
            position={[-12, 2.4, 8]} receiveShadow
            object={scene}
            scale={3}

        />
    )
}
useGLTF.preload('/models/office/office_decor_calendar_desk.glb')
