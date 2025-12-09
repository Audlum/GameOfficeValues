'use client'

import { Html, OrbitControls, Text, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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
import Armchair from "../objects/sceneAdmin/armchair";
import PictureDecor from "../objects/sceneAdmin/pictureDecoration";
import { useRouter } from "next/navigation";
import Player from "../components/Player";
import WomenNpc from "../objects/npc/womenNpc";
import ModalNearWomenNpc from "../components/Modal/modalNearWomenNpc";
import MissionCounter from "../components/modalGameMenu/missionCounter";
import GameMenu from "../components/modalGameMenu/gameMenu";

useGLTF.preload('/models/door.glb')


function CameraController() {
    const { scene, camera } = useThree()
    const [cameraRotation, setCameraRotation] = useState(0)

    const roomSize = {
        width: 6.5,
        height: 3.5,
        depth: 6
    }

    useFrame(() => {
        const player = scene.getObjectByName('player')

        if (player) {
            const playerPos = player.position.clone()

            const cameraDistance = 3
            const cameraHeight = 1.5

            const cameraOffsetX = Math.sin(player.rotation.y) * cameraDistance
            const cameraOffsetZ = Math.cos(player.rotation.y) * cameraDistance

            const targetCameraPosition = new THREE.Vector3(
                playerPos.x - cameraOffsetX,
                playerPos.y + cameraHeight,
                playerPos.z - cameraOffsetZ
            )

            camera.position.lerp(targetCameraPosition, 0.05)

            const targetLookAt = new THREE.Vector3(
                playerPos.x,
                playerPos.y + 0.8,
                playerPos.z
            )

            camera.lookAt(targetLookAt)

            camera.position.x = THREE.MathUtils.clamp(camera.position.x, -roomSize.width, roomSize.width)
            camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1, roomSize.height + 1)
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, -roomSize.depth, roomSize.depth)
        }
    })

    return null
}

function PlayerController() {
    const { scene, camera } = useThree()
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false
    })
    const [nearDoor, setNearDoor] = useState(false)
    const [currentDoor, setCurrentDoor] = useState(null)
    const [doorCallback, setDoorCallback] = useState(null)

    const [nearDoorSec, setNearDoorSec] = useState(false)
    const [currentDoorSec, setCurrentDoorSec] = useState(null)
    const [doorSecCallback, setDoorSecCallback] = useState(null)

    const [nearDoorTh, setNearDoorTh] = useState(false)
    const [currentDoorTh, setCurrentDoorTh] = useState(null)
    const [doorThCallback, setDoorThCallback] = useState(null)

    const [nearWomenNpc, setNearWomenNpc] = useState(false)
    const [currentWomenNpc, setCurrentWomenNpc] = useState(null)
    const [womenNpcCallback, setWomenNpcCallback] = useState(null)

    const boundsPlayer = {
        minX: -6,
        maxX: 6,
        minZ: -4.5,
        maxZ: 4.5
    }

    const furnitureColliders = [
        { position: [-6, 0, -7], radius: 0.8, name: 'ArmchairAdmin' },
        { position: [3.7, 0.3, 3], radius: 2, name: 'AdminDesk' },
        { position: [3, 0.3, 3], radius: 2, name: 'AdminDesk' },
        { position: [-4, 0, 3.8], radius: 0.8, name: 'SofaAdmin' },
        { position: [-3, 0, 3.8], radius: 0.8, name: 'SofaAdmin' },
        { position: [-4, 0, 2], radius: 1, name: 'TableMagazine' },
        { position: [-3.5, 0, 2], radius: 1, name: 'TableMagazine' },
        { position: [-4.5, 0, 2], radius: 1, name: 'TableMagazine' },
        { position: [5.5, 0, -4.3], radius: 0.3, name: 'FPlants' },
        { position: [-1.4, 0, 4.3], radius: 0.3, name: 'Ficus' },
        { position: [5.8, 0, -2.8], radius: 0.8, name: 'Bookcase' },
        { position: [-2.5, 2, 5], radius: 0.2, name: 'Moss' },
        { position: [-5.4, 2, -4], radius: 0.6, name: 'Armchair' },
        { position: [5, 0, 0], radius: 0.6, name: 'WomenNpc' },
    ]

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: true })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: true })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: true })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: true })); break
                case 'KeyE':
                    if (nearDoor && doorCallback) {
                        doorCallback()
                    }
                    if (nearDoorSec && doorSecCallback) {
                        doorSecCallback()
                    }
                    if (nearDoorTh && doorThCallback) {
                        doorThCallback()
                    }
                    if (nearWomenNpc && womenNpcCallback) {
                        womenNpcCallback()
                    }
                    break
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: false })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: false })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: false })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: false })); break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [nearDoor, doorCallback, nearDoorSec, doorSecCallback, nearDoorTh, doorThCallback, nearWomenNpc, womenNpcCallback])

    useFrame((state, delta) => {
        const player = scene.getObjectByName('player')
        if (!player) return
        const playerPos = player.position.clone()
        const speed = 4 * delta
        const playerRotationSpeed = 8 * delta

        const cameraDirection = new THREE.Vector3()
        camera.getWorldDirection(cameraDirection)
        cameraDirection.y = 0
        cameraDirection.normalize()

        const cameraRight = new THREE.Vector3()
        cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize()

        const moveDirection = new THREE.Vector3(0, 0, 0)

        if (movement.forward) {
            moveDirection.add(cameraDirection.clone().multiplyScalar(1))
        }
        if (movement.backward) {
            moveDirection.add(cameraDirection.clone().multiplyScalar(-1))
        }

        if (movement.left) {
            moveDirection.add(cameraRight.clone().multiplyScalar(-1))
        }
        if (movement.right) {
            moveDirection.add(cameraRight.clone().multiplyScalar(1))
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize()

            playerPos.add(moveDirection.multiplyScalar(speed))

            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z)

            player.rotation.y = targetRotation
        }

        const doors = scene.children.filter(child =>
            child.userData && child.userData.isDoor && child.userData.onDoorClick
        )
        const doorsSec = scene.children.filter(child =>
            child.userData && child.userData.isDoorSec && child.userData.onDoorSecClick
        )

        const doorsTh = scene.children.filter(child =>
            child.userData && child.userData.isDoorTh && child.userData.onDoorThClick
        )
        const womenNpcs = scene.children.filter(child =>
            child.userData && child.userData.isNpc && child.userData.onNpcClick
        )


        let isNearDoor = false
        let closestDoor = null
        let closestDoorCallback = null
        let minDistance = Infinity

        let isNearDoorSec = false
        let closestDoorSec = null
        let closestDoorSecCallback = null
        let minDistanceSec = Infinity

        let isNearDoorTh = false
        let closestDoorTh = null
        let closestDoorThCallback = null
        let minDistanceTh = Infinity

        let isNearNpc = false
        let closestNpc = null
        let closestNpcCallback = null
        let minDistanceNpc = Infinity

        for (const door of doors) {
            const doorPositionWithOffset = new THREE.Vector3(
                door.position.x,
                door.position.y,
                door.position.z - 2.5
            )

            const distance = playerPos.distanceTo(doorPositionWithOffset)
            if (distance < 1.5) {
                console.log(door.position)
                if (distance < minDistance) {
                    minDistance = distance
                    closestDoor = door
                    closestDoorCallback = door.userData.onDoorClick
                    isNearDoor = true
                }
            }
        }

        for (const doorSec of doorsSec) {
            const doorPositionWithOffset = new THREE.Vector3(
                doorSec.position.x,
                doorSec.position.y,
                doorSec.position.z - 2.5
            )

            const distance = playerPos.distanceTo(doorPositionWithOffset)
            if (distance < 1.5) {
                console.log(doorSec.position)
                if (distance < minDistanceSec) {
                    minDistanceSec = distance
                    closestDoorSec = doorSec
                    closestDoorSecCallback = doorSec.userData.onDoorSecClick
                    isNearDoorSec = true
                }
            }
        }

        for (const doorTh of doorsTh) {
            const doorPositionWithOffset = new THREE.Vector3(
                doorTh.position.x,
                doorTh.position.y,
                doorTh.position.z - 2.5
            )

            const distance = playerPos.distanceTo(doorPositionWithOffset)
            if (distance < 1.5) {
                console.log(doorTh.position)
                if (distance < minDistanceSec) {
                    minDistanceSec = distance
                    closestDoorSec = doorTh
                    closestDoorSecCallback = doorTh.userData.onDoorSecClick
                    isNearDoorSec = true
                }
            }
        }

        for (const npc of womenNpcs) {
            const npcPosition = new THREE.Vector3(
                npc.position.x + 3,
                npc.position.y,
                npc.position.z - 1
            )

            const distance = playerPos.distanceTo(npcPosition)
            if (distance < 1.5) {
                console.log(npc.position)
                if (distance < minDistanceNpc) {
                    minDistanceNpc = distance
                    closestNpc = npc
                    closestNpcCallback = npc.userData.onNpcClick
                    isNearNpc = true
                }
            }
        }

        setNearDoor(isNearDoor)
        setCurrentDoor(closestDoor)
        setDoorCallback(() => closestDoorCallback)

        setNearDoorSec(isNearDoorSec)
        setCurrentDoorSec(closestDoorSec)
        setDoorSecCallback(() => closestDoorSecCallback)

        setNearDoorTh(isNearDoorTh)
        setCurrentDoorTh(closestDoorTh)
        setDoorThCallback(() => closestDoorThCallback)

        setNearWomenNpc(isNearNpc)
        setCurrentWomenNpc(closestNpc)
        setWomenNpcCallback(() => closestNpcCallback)

        if (playerPos.x < boundsPlayer.minX) playerPos.x = boundsPlayer.minX
        if (playerPos.x > boundsPlayer.maxX) playerPos.x = boundsPlayer.maxX
        if (playerPos.z < boundsPlayer.minZ) playerPos.z = boundsPlayer.minZ
        if (playerPos.z > boundsPlayer.maxZ) playerPos.z = boundsPlayer.maxZ

        for (const furniture of furnitureColliders) {
            const distance = Math.sqrt(
                Math.pow(playerPos.x - furniture.position[0], 2) +
                Math.pow(playerPos.z - furniture.position[2], 2)
            )

            if (distance < furniture.radius + 0.3) {
                const direction = new THREE.Vector3(
                    playerPos.x - furniture.position[0],
                    0,
                    playerPos.z - furniture.position[2]
                ).normalize()

                playerPos.add(direction.multiplyScalar(0.05))
            }
        }

        player.position.copy(playerPos)
    })

    return (
        <>
            {nearDoor && (
                <Html
                    position={[
                        currentDoor?.position.x || 0,
                        (currentDoor?.position.y || 0) + 1.2,
                        (currentDoor?.position.z || 0) - 3.5
                    ]}
                    center
                >
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {nearDoorSec && (
                <Html
                    position={[
                        currentDoor?.position.x || 0,
                        (currentDoor?.position.y || 0) + 1.2,
                        (currentDoor?.position.z || 0) - 3.5
                    ]}
                    center
                >
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {nearDoorTh && (
                <Html
                    position={[
                        currentDoor?.position.x || 0,
                        (currentDoor?.position.y || 0) + 1.2,
                        (currentDoor?.position.z || 0) - 3.5
                    ]}
                    center
                >
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

            {nearWomenNpc && (
                <Html
                    position={[
                        currentWomenNpc?.position.x || 0 + 4.5,
                        (currentWomenNpc?.position.y || 0) + 1,
                        (currentWomenNpc?.position.z || 0)
                    ]}
                    center
                >
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        E
                    </div>
                </Html>
            )}

        </>
    )
}


export default function Test() {


    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code === 'KeyM' || event.key.toLowerCase() === 'm') {
            event.preventDefault()
            setIsMenuOpen(prev => !prev)
        }

        if (event.code === 'Escape' && isMenuOpen) {
            event.preventDefault()
            setIsMenuOpen(false)
        }
    }, [isMenuOpen])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    const handleResetGame = useCallback(() => {
        console.log('Игра сброшена')

    }, [])

    const handleReturnToGame = useCallback(() => {
        setIsMenuOpen(false)

    }, [])



    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }


    const tileTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        if (!context) return null;

        context.fillStyle = '#f4f1ec';
        context.fillRect(0, 0, 256, 256);

        const tileSize = 64;
        const gap = 4;

        context.fillStyle = '#e6e9e2';
        for (let y = 0; y < 256; y += tileSize + gap) {
            for (let x = 0; x < 256; x += tileSize + gap) {
                context.fillRect(x, y, tileSize, tileSize);
            }
        }

        context.fillStyle = '#a0a0a0';
        for (let y = tileSize; y < 256; y += tileSize + gap) {
            context.fillRect(0, y - gap / 2, 256, gap);
        }
        for (let x = tileSize; x < 256; x += tileSize + gap) {
            context.fillRect(x - gap / 2, 0, gap, 256);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

        return texture;
    }, []);

    const router = useRouter()

    const clickDoorFirst = () => {
        router.push('/pages/Office')
    }

    const clickDoorSec = () => {
        router.push('/pages/Boss')
    }
    const clickDoorTh = () => {
        router.push('/pages/living')
    }

    return (
        <>
            <Canvas style={{
                width: '100vw',
                height: '100vh',
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0
            }}>

                {/* <OrbitControls enableZoom={true} enablePan={true} /> */}

                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[5, 3.5, 3]} intensity={3} color={'white'} />
                <CameraController />
                <PlayerController />
                <Player />

                <WomenNpc
                    position={[5, -1, 0]}
                    rotation={[0, -2, 0]}
                    isInteractive={true}
                    onNpcClick={openModal}
                />
                <Html position={[5, 2.6, -0.4]}>
                    <div style={{
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                        padding: '16px 20px',
                        maxWidth: 500,
                        width: 150,
                        margin: 20,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        position: 'relative'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: 10,
                            lineHeight: 1.5,
                            color: '#333'
                        }}>
                            Привет! Я расскажу, что тебе надо сделать!
                        </p>
                        <div style={{
                            position: 'absolute',
                            bottom: -8,
                            left: 20,
                            width: 16,
                            height: 16,
                            background: 'white',
                            transform: 'rotate(45deg)',
                            borderRight: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0',
                            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.05)'
                        }}></div>
                    </div>
                </Html>
                <WomenNpc
                    position={[5, -1, 0]}
                    rotation={[0, -2, 0]}
                    isInteractive={true}
                    onNpcClick={openModal}
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

                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
                    <planeGeometry args={[25, 18]} />
                    <meshStandardMaterial
                        color="#6e6e6e"
                        roughness={0.4}
                        metalness={0.05}
                    />
                </mesh>

                <mesh position={[0, 1.5, 5]}>
                    <boxGeometry args={[13, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[0, 1.5, -5]}>
                    <boxGeometry args={[13, 7, 0.2]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[6.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[10, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-6.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[10, 7, 0.2]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>

                <Door position={[0, -1, -1.5]} rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorSec}
                    isInteractive={true} />

                <Door position={[3, -1, -1.5]} rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorTh} isInteractive={true} />

                <Door
                    position={[-3, -1, -1.5]}
                    rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorFirst}
                    isInteractive={true}
                />


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



            </Canvas >

            <ModalNearWomenNpc isOpen={isModalOpen} onClose={closeModal} title="Привет!" />

            <GameMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onResetGame={handleResetGame}
                onReturnToGame={handleReturnToGame}
            />
            {!isMenuOpen && <MissionCounter />}

            {!isMenuOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #f59e0b',
                    backdropFilter: 'blur(4px)'
                }}>
                    <span style={{
                        background: '#f59e0b',
                        color: 'black',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }}>
                        M
                    </span>
                    <span>Меню</span>
                </div>
            )}

        </>
    )
}