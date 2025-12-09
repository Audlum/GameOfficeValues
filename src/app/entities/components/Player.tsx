import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'



export default function Player() {
    const group = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/models/avatar/mini_chibi_kid_free_demo.glb')
    const { actions, mixer } = useAnimations(animations, group)

    const previousPosition = useRef(new THREE.Vector3())
    const isMoving = useRef(false)

    useFrame((state, delta) => {
        if (!group.current || !mixer) return

        const player = group.current

        const currentPosition = player.position.clone()
        const distanceMoved = currentPosition.distanceTo(previousPosition.current)
        const moving = distanceMoved > 0.01

        if (moving !== isMoving.current) {
            isMoving.current = moving

            if (moving) {

                actions['Idle 01']?.stop()
                actions['Walk 01']?.play()
            } else {

                actions['Walk 01']?.stop()
                actions['Idle 01']?.play()
            }
        }

        mixer.update(delta)

        previousPosition.current.copy(currentPosition)
        player.name = 'player'
    })

    useEffect(() => {
        console.log('Available animations:', Object.keys(actions))

        actions['Idle 01']?.play()

        return () => {

            Object.values(actions).forEach(action => action?.stop())
        }
    }, [actions])

    return (
        <group ref={group} name="player">
            <primitive
                object={scene}
                position={[0, -1, 0]}
                rotation={[0, 0, 0]}
                scale={1.5}
            />
        </group>
    )
}