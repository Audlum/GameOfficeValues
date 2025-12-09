import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react"

interface CoffeAnimate {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function CoffeAnimate({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.087,
}: CoffeAnimate) {
    // const { scene, animations } = useGLTF('/models/avatar/npc/lowpoly_toon_characters_free_demo__animations.glb')
    const { scene, animations } = useGLTF('/models/Boss/coffe_cafe.glb')
    const { actions, mixer } = useAnimations(animations, scene)

    useEffect(() => {

        const idleAction = actions['Armature|ArmatureAction']


        if (idleAction) {
            idleAction.play()
        }

        return () => {
            Object.values(actions).forEach(action => action?.stop())
        }
    }, [actions])

    return (
        <primitive
            object={scene}
            position={position}
            receiveShadow
            castShadow
            scale={scale}
            rotation={rotation}
        />
    )
}