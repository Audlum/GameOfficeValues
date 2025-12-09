import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react"

interface MenNpc {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
}

export default function MenNpc({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.9,
}: MenNpc) {
    const { scene, animations } = useGLTF('/models/avatar/npc/lowpoly_toon_characters_free_demo__animations.glb')
    // const { scene, animations } = useGLTF('/models/avatar/npc/mini_simple_character_free_demo__animations.glb')
    const { actions, mixer } = useAnimations(animations, scene)

    useEffect(() => {

        const idleAction = actions['Idle']

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