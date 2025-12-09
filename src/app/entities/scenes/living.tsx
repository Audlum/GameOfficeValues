'use client'

import { OrbitControls, Html } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import Player from '../components/Player';
import Door from '../objects/sceneAdmin/door';
import DiningTable from '../objects/sceneLiving/diningTable';
import KitchenPanel from '../objects/sceneLiving/kitchenPanel';
import TvTable from '../objects/sceneLiving/tvTable';
import WoodernTable from '../objects/sceneLiving/wodernTable';
import BarTable from '../objects/sceneLiving/barTable';
import BlackShelf from '../objects/sceneBoss/blackShelf';
import TvPlasma from '../objects/sceneLiving/tvPlasma';
import TubeSofa from '../objects/sceneLiving/tubeSofa';
import SofaBrown from '../objects/sceneLiving/sofaBrown';
import TableGlass from '../objects/sceneBoss/tableGlass';
import TableTennis from '../objects/sceneLiving/tableTennis';
import MiniPlant from '../objects/sceneOffice/plant/miniPlant';
import Cactus from '../objects/sceneOffice/plant/cactus';
import CactusCube from '../objects/sceneOffice/plant/cactusCube';
import BooksForShelf from '../objects/sceneBoss/booksForShelf';
import CupRed from '../objects/sceneOffice/cupRed';
import CoffeMaker from '../objects/sceneLiving/cofeMaker';
import WhaterCooler from '../objects/sceneOffice/whaterCooler';
import Fetuccini from '../objects/sceneLiving/fetuccini';
import Plates from '../objects/sceneLiving/plates';
import FruitPlate from '../objects/sceneLiving/fruitPlate';
import Soda from '../objects/sceneLiving/soda';
import TreeS2 from '../objects/sceneLiving/treeS2';
import Ficus from '../objects/sceneAdmin/plants/ficus';
import MossLiving from '../objects/sceneLiving/mossLiving';
import ClockOffice from '../objects/sceneOffice/clockOffice';
import CeilingLamp from '../objects/sceneBoss/ceilingLamp';
import PuzzleMission from '../components/livingScene/puzlesTask';
import ShoppingListMission from '../components/livingScene/ShoppingListMission';
import BoardCork from '../objects/sceneLiving/board';
import Pin from '../objects/sceneLiving/pin';
import PinRunMission from '../components/livingScene/pinRunMiss';
import GameMenu from '../components/modalGameMenu/gameMenu';
import { useTaskStore } from '../stores/TaskStore';
import MissionCounter from '../components/modalGameMenu/missionCounter';
import GameCompletionModal from '../components/modalGameMenu/gameCompletion';

type DoorCallback = (() => void) | null

type DoorUserData = THREE.Object3D['userData'] & {
    isDoor?: boolean
    onDoorClick?: () => void
}

type DoorObject = THREE.Object3D & {
    userData: DoorUserData
}

function CameraController() {
    const { scene, camera } = useThree()

    const roomSize = {
        width: 12,
        height: 3.5,
        depth: 9
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

function PlayerController({ controlsBlocked = false }: { controlsBlocked?: boolean }) {
    const { scene, camera } = useThree()
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false
    })
    const [nearDoor, setNearDoor] = useState(false)
    const [currentDoor, setCurrentDoor] = useState<DoorObject | null>(null)
    const [doorCallback, setDoorCallback] = useState<DoorCallback>(null)

    const boundsPlayer = {
        minX: -12,
        maxX: 12,
        minZ: -8.5,
        maxZ: 8.5
    }

    const furnitureColliders = [
        { position: [0, 0, -7.5], radius: 2, name: 'SofaGreen' },
        { position: [2.7, 0, -7.5], radius: 1, name: 'SofaGreen' },
        { position: [-1, 0, -5.5], radius: 1, name: 'BlackShelf' },
        { position: [-8, 0, -3], radius: 1, name: 'BlackShelS' },
        { position: [-9, 0, -3], radius: 1, name: 'BlackShelS' },
        { position: [-10.5, 0, -3], radius: 1, name: 'BlackShelS' },
        { position: [-11.2, 0, -3], radius: 1, name: 'BlackShelS' },
        { position: [-4.8, 0, -7.4], radius: 1, name: 'BarTableF' },
        { position: [-4.8, 0, -8], radius: 1, name: 'BarTableF' },
        { position: [-5.2, 0, -8], radius: 1, name: 'BarTableF' },
        { position: [-3.5, 0, -7.3], radius: 1, name: 'BarTableF' },
        { position: [-8.5, 0, -7.3], radius: 1, name: 'BarTableS' },
        { position: [-10, 0, -8.5], radius: 1, name: 'BarTableS' },
        { position: [-10.1, 0, -6.9], radius: 1, name: 'BarTableS' },
        { position: [-9.9, 0, -0.3], radius: 1, name: 'обеденный стол' },
        { position: [-11.1, 0, -0.3], radius: 1, name: 'обеденный стол' },
        { position: [-12, 0, -0.3], radius: 1, name: 'обеденный стол' },
        { position: [-12, 0, 4.1], radius: 1, name: 'kitchen' },
        { position: [-12, 0, 5.5], radius: 1, name: 'kitchen' },
        { position: [-12, 0, 6.8], radius: 1, name: 'kitchen' },
        { position: [-12, 0, 8.2], radius: 1, name: 'kitchen' },
        { position: [-12, 0, 8.55], radius: 1, name: 'kitchen' },
        { position: [-7.8, 0, 5.8], radius: 1, name: 'стол с газировками' },
        { position: [-8.3, 0, 7.2], radius: 1, name: 'стол с газировками' },
        { position: [-7.4, 0, 8.4], radius: 1, name: 'стол с газировками' },
        { position: [-6.1, 0, 8.4], radius: 1, name: 'cooler' },
        { position: [-4.8, 0, 8.4], radius: 1, name: 'tree' },
        { position: [5.5, 0, 7.8], radius: 1, name: 'sofa brown' },
        { position: [5.7, 0, 6.4], radius: 2, name: 'sofa brown' },
        { position: [6, 0, 4], radius: 1, name: 'sofa brown' },
        { position: [9, 0, 7], radius: 1, name: 'tableGlass' },
        { position: [12, 0, 7.9], radius: 1, name: 'TV' },
        { position: [12, 0, 5.1], radius: 1, name: 'TV' },
        { position: [12, 0, 6.5], radius: 1, name: 'TV' },
        { position: [12, 0, 3.7], radius: 1, name: 'TV' },
        { position: [9.6, 0, -1.3], radius: 1, name: 'pinPongF' },
        { position: [9.6, 0, -2.6], radius: 1, name: 'pinPongF' },
        { position: [8.2, 0, -2.6], radius: 1, name: 'pinPongF' },
        { position: [8.2, 0, -1.2], radius: 1, name: 'pinPongF' },
        { position: [6.8, 0, -1.3], radius: 1, name: 'pinPongF' },
        { position: [6.4, 0, -2.5], radius: 1, name: 'pinPongF' },
        { position: [6.4, 0, -5.3], radius: 1, name: 'pinPongS' },
        { position: [6.5, 0, -6.7], radius: 1, name: 'pinPongS' },
        { position: [7.9, 0, -6.7], radius: 1, name: 'pinPongS' },
        { position: [7.7, 0, -5.3], radius: 1, name: 'pinPongS' },
        { position: [9, 0, -5.3], radius: 1, name: 'pinPongS' },
        { position: [9.2, 0, -6.6], radius: 1, name: 'pinPongS' },
    ]

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (controlsBlocked) return

            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: true })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: true })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: true })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: true })); break
                case 'KeyE':
                    if (nearDoor && doorCallback) {
                        doorCallback()
                    }
                    break
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            if (controlsBlocked) return

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
    }, [nearDoor, doorCallback, controlsBlocked])

    useFrame((_, delta) => {
        if (controlsBlocked) return

        const player = scene.getObjectByName('player')
        if (!player) return

        const playerPos = player.position.clone()
        const speed = 4 * delta

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

        const doors = scene.children.filter((child): child is DoorObject => {
            const data = child.userData as DoorUserData
            return Boolean(data?.isDoor && typeof data.onDoorClick === 'function')
        })

        let isNearDoor = false
        let closestDoor: DoorObject | null = null
        let closestDoorCallback: DoorCallback = null
        let minDistance = Infinity

        for (const door of doors) {
            const doorPositionWithOffset = new THREE.Vector3(
                door.position.x,
                door.position.y,
                door.position.z - 2.5
            )

            const distance = playerPos.distanceTo(doorPositionWithOffset)
            if (distance < 1.5) {
                if (distance < minDistance) {
                    minDistance = distance
                    closestDoor = door
                    closestDoorCallback = door.userData.onDoorClick
                    isNearDoor = true
                }
            }
        }

        setNearDoor(isNearDoor)
        setCurrentDoor(closestDoor)
        setDoorCallback(() => closestDoorCallback)

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
            {nearDoor && !controlsBlocked && (
                <Html
                    position={[
                        currentDoor?.position.x || 0,
                        (currentDoor?.position.y || 0) + 1.2,
                        (currentDoor?.position.z || 0) - 2.5
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

export default function LivingScene() {
    const [controlsBlocked, setControlsBlocked] = useState<boolean>(false)



    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const { getAllTasks } = useTaskStore()

    const checkGameCompletion = () => {
        const allTasks = getAllTasks()
        const completedMissions = Object.values(allTasks).filter(task => task.completed).length
        const totalMissions = Object.keys(allTasks).length

        if (completedMissions === totalMissions && !showCompletionModal) {
            setShowCompletionModal(true)
        }
    }
    useEffect(() => {
        checkGameCompletion()
    }, [getAllTasks()])

    const handleReturnToOffice = () => {
        console.log('Возвращаемся в офис')
        setShowCompletionModal(false)
    }

    const handleRestartGame = () => {
        console.log('Перезапускаем игру')
    }




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
        router.push('/pages/Admin')
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
            }} >

                <OrbitControls enabled={!controlsBlocked} />
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <CameraController />
                <PlayerController controlsBlocked={controlsBlocked} />
                <Player />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[25, 18]} />
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

                <mesh position={[0, 1.5, 9]}>
                    <boxGeometry args={[25, 7, 0.2]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[0, 1.5, -9]}>
                    <boxGeometry args={[25, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[12.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[18, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-12.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[18, 7, 0.2]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>

                <Door position={[0, -1, 12.1]} rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorFirst}
                    isInteractive={true}
                />

                <group>
                    <DiningTable position={[-10.9, -1, 2]} rotation={[0, 0, 0]} />
                    <CupRed position={[-12, 0.25, 0]} />
                    <Fetuccini position={[-11, 0.05, 0.1]} />
                </group>
                <CoffeMaker rotation={[0, Math.PI / -2, 0]} position={[-12, 0.5, 6]} />
                <Plates position={[-8, 0.25, 6.5]} />
                <KitchenPanel position={[-11.9, -1, 6.9]} />
                <FruitPlate rotation={[0, Math.PI / 1, 0]} position={[-12, 0.5, 5]} />


                <ShoppingListMission position={[-5, 0, -3]} />

                <Soda position={[-8, 0.3, 8.5]} />
                <pointLight position={[-8, 1.3, 7.7]} intensity={5} color={'#dcdbd0'} />

                <WhaterCooler position={[-6.6, -1, 8.5]} rotation={[0, Math.PI / 1, 0]} />

                <WoodernTable position={[-8, -1.3, 7]} />
                <BarTable position={[-10, -1.3, -8]} rotation={[0, Math.PI / -1.24, 0]} />
                <BarTable position={[-5, -1.3, -8]} rotation={[0, Math.PI / -1.24, 0]} />

                <group>
                    <BlackShelf position={[-10.3, -1, -3.8]} />
                    <MiniPlant position={[-10, 0, -4]} />
                    <Cactus position={[-12, 1.25, -4]} />
                    <BooksForShelf position={[-8.9, 1.45, -4]} scale={0.24} rotation={[0, Math.PI / 2, 0]} />
                </group>

                <group>
                    <BlackShelf position={[-1, -1, -6.9]} rotation={[0, Math.PI / 2, 0]} />
                    <MiniPlant position={[-1, 1.95, -7.5]} />
                    <CactusCube position={[1.5, 2.1, -6]} />
                    <BooksForShelf position={[-1, 0, -8]} />
                </group>

                <TvTable position={[12, -1, 6]} scale={2.2} rotation={[0, Math.PI / -2, 0]} />
                <TvPlasma rotation={[0, Math.PI / 1, 0]} position={[12.4, 0.5, 6]} />

                <TubeSofa position={[1.8, -1, -7.8]} />

                <TableTennis position={[8, -1, -6]} rotation={[0, Math.PI / 2, 0]} />
                <TableTennis position={[8, -1, -2]} rotation={[0, Math.PI / -2, 0]} />

                <SofaBrown position={[6, -1, 5.8]} rotation={[0, Math.PI / 2, 0]} />
                <TableGlass position={[8, -1, 8]} />

                <PuzzleMission
                    position={[10, 0, 8]}
                    rotation={[0, 0, 0]}
                    onMissionStart={() => setControlsBlocked(true)}
                    onMissionEnd={() => setControlsBlocked(false)}
                />

                <MiniPlant position={[9, -0.3, 7]} />

                <TreeS2 position={[-1.3, -1, -4]} />
                <TreeS2 position={[-8, -1, -3.3]} />
                <TreeS2 position={[11.5, -1, 3.5]} />

                <Ficus rotation={[0, Math.PI / 1, 0]} position={[-5, -1, 8.3]} />

                <MossLiving />
                <ClockOffice rotation={[0, Math.PI / 2, 0]} position={[12.3, 2.3, -6]} />
                <pointLight position={[11, 3, -6]} intensity={3} color={'#dcdbd0'} />

                <CeilingLamp position={[8, -0.5, 4]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[8, 2, 4]} intensity={20} color={'#dcdbd0'} />
                <CeilingLamp position={[-8, -0.5, 4]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[-8, 2, 4]} intensity={20} color={'#dcdbd0'} />
                <CeilingLamp position={[-8, -0.5, -4]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[-8, 2, -4]} intensity={20} color={'#dcdbd0'} />
                <CeilingLamp position={[8, -0.5, -4]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[8, 2, -4]} intensity={20} color={'#dcdbd0'} />



                <BoardCork position={[3.5, 1, -8.8]} />

                <PinRunMission position={[3.5, 1.5, -9]} />


            </Canvas >


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



            <GameCompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                onReturnToOffice={handleReturnToOffice}
                onRestartGame={handleRestartGame}
            />




        </>
    )
}