'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useGLTF } from "@react-three/drei"
import { useMemo } from 'react'
import * as THREE from 'three'

import Door from "../objects/sceneAdmin/door";
import AdminDesk from "../objects/sceneAdmin/adminDesk";
import ChairAdmin from "../objects/sceneAdmin/chairAdmin";
import SofaAdmin from "../objects/sceneAdmin/sofaAdmin";
import TableMagazine from "../objects/sceneAdmin/tablemagazine";
import FPlants from "../objects/sceneAdmin/plants/fPlants";
import Ficus from "../objects/sceneAdmin/plants/ficus";
import TableHaworthia from "../objects/sceneAdmin/plants/tableHaworthia";
import Starbucks from "../objects/sceneAdmin/starbucks";
import CupOfCoffe from "../objects/sceneAdmin/cupOfCoffe";
import DocFolder from "../objects/sceneAdmin/dokFolder";
import LaptopAdmin from "../objects/sceneAdmin/laptop";
import TablePlant from "../objects/sceneAdmin/tablePlant";
import PlieOfPaper from "../objects/sceneAdmin/pileOfPaper";
import Organiser from "../objects/sceneAdmin/oficeDecor";
import BookCase from "../objects/sceneAdmin/bookcase";
import Moss from "../objects/sceneAdmin/moss";
import Clock from "../objects/sceneAdmin/clock";
import Armchair from '../objects/sceneAdmin/armchair'
import PictureDecor from '../objects/sceneAdmin/pictureDecoration'

useGLTF.preload('/models/door.glb')

function OfficeSceneContent() {
    const controlsRef = useRef<any>(null)

    useEffect(() => {
        if (!controlsRef.current) return

        let animationId: number
        const animate = () => {
            if (controlsRef.current) {
                controlsRef.current.azimuthAngle += 0.01
            }
            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => cancelAnimationFrame(animationId)
    }, [])

    const tileTexture = useMemo(() => {
        if (typeof document === 'undefined') return null

        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const context = canvas.getContext('2d')

        if (!context) return null

        context.fillStyle = '#f4f1ec'
        context.fillRect(0, 0, 256, 256)

        const tileSize = 64
        const gap = 4

        context.fillStyle = '#e6e9e2'
        for (let y = 0; y < 256; y += tileSize + gap) {
            for (let x = 0; x < 256; x += tileSize + gap) {
                context.fillRect(x, y, tileSize, tileSize)
            }
        }

        context.fillStyle = '#a0a0a0'
        for (let y = tileSize; y < 256; y += tileSize + gap) {
            context.fillRect(0, y - gap / 2, 256, gap)
        }
        for (let x = tileSize; x < 256; x += tileSize + gap) {
            context.fillRect(x - gap / 2, 0, gap, 256)
        }

        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(4, 4)

        return texture
    }, [])

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={1.5}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 6}
                minDistance={3}
                maxDistance={8}
            />

            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[5, 3.5, 3]} intensity={3} color={'white'} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[13, 10]} />
                <meshStandardMaterial
                    map={tileTexture}
                    roughness={0.4}
                    metalness={0.05}
                />
            </mesh>

            <mesh position={[0, 1.5, 5]}>
                <boxGeometry args={[13, 5, 0.2]} />
                <meshStandardMaterial color="#6e6e6e" />
            </mesh>
            <mesh position={[0, 1.5, -5]}>
                <boxGeometry args={[13, 5, 0.2]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh position={[6.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10, 5, 0.2]} />
                <meshStandardMaterial color="#6e6e6e" />
            </mesh>
            <mesh position={[-6.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10, 5, 0.2]} />
                <meshStandardMaterial color="#fff" />
            </mesh>

            <Door position={[0, -1, -1.5]} rotation={[0, Math.PI / 2, 0]} />
            <Door position={[3, -1, -1.5]} rotation={[0, Math.PI / 2, 0]} />
            <Door position={[-3, -1, -1.5]} rotation={[0, Math.PI / 2, 0]} />

            <AdminDesk />
            <ChairAdmin />
            <SofaAdmin />
            <TableMagazine />
            <FPlants />
            <Ficus rotation={[0, Math.PI / 1, 0]} position={[-1.4, -1, 4.3]} />
            <TableHaworthia />
            <Starbucks />
            <CupOfCoffe />
            <DocFolder />
            <LaptopAdmin />
            <TablePlant />
            <PlieOfPaper />
            <Organiser />
            <BookCase />
            <Moss />
            <Clock />
            <Armchair />
            <PictureDecor />

            <mesh position={[4, 2.5, 4.8]} rotation={[0, 9.42, 0]}>
                <Text fontSize={0.4}
                    letterSpacing={0.1}
                    lineHeight={1}>
                    Office Values
                </Text>
                <meshStandardMaterial
                    roughness={0.8}
                    metalness={0.2}
                    color="#ffffff"
                />

            </mesh>
        </>
    )
}

export default function RotatingOfficeScene() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'block',
                    position: 'fixed',
                    top: 0,
                    left: 0
                }}

                camera={{
                    position: [0, 2, 4],
                    fov: 60,
                    near: 0.1,
                    far: 50
                }}
            >
                <OfficeSceneContent />
            </Canvas>
        </div>
    )
}