'use client'

import { Html, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from 'three';
import Door from "../objects/sceneAdmin/door";
import WoodernPanel from "../objects/sceneOffice/woodenPanel";
import WoodernTable from "../objects/sceneOffice/woodernTable";
import Chair from "../objects/sceneOffice/chair";
import SofaBlue from "../objects/sceneOffice/sofaBlue";
import SofaTable from "../objects/sceneOffice/sofaTable";
import ArmchairOffice from "../objects/sceneOffice/armchair";
import FloorLamp from "../objects/sceneOffice/floorLamp";
import MossOffice from "../objects/sceneOffice/mossOffice";
import MarkerBoard from "../objects/sceneOffice/markerBoard";
import BookcaseOffice from "../objects/sceneOffice/BookcaseOffice";
import BlockWooden from "../objects/sceneOffice/blockWooden";
import CofeTable from "../objects/sceneOffice/cofeTable";
import WhaterCooler from "../objects/sceneOffice/whaterCooler";
import PlasticCup from "../objects/sceneOffice/plasticCup";
import WallLampCoffe from "../objects/sceneOffice/wallLampCoffe";
import KettleElectric from "../objects/sceneOffice/kettleElect";
import CupRed from "../objects/sceneOffice/cupRed";
import CupBlue from "../objects/sceneOffice/blueCup";
import MonsteraOffice from "../objects/sceneOffice/monsteraOffice";
import CornerShelf from "../objects/sceneOffice/cornerShelf";
import FoldersShelf from "../objects/sceneOffice/foldersShelf";
import Calendar from "../objects/sceneOffice/calendar";
import MemoryBord from "../objects/sceneOffice/memoryBord";
import ClockOffice from "../objects/sceneOffice/clockOffice";
import MapWooden from "../objects/sceneOffice/mapWooden";
import Cactus from "../objects/sceneOffice/plant/cactus";
import CactusCube from "../objects/sceneOffice/plant/cactusCube";
import MiniPlant from "../objects/sceneOffice/plant/miniPlant";
import GamingLaptop from "../objects/sceneOffice/gamingLaptop";
import MoonLamp from "../objects/sceneOffice/moonLamp";
import IMac from "../objects/sceneOffice/imac";
import PlieOfPaperOffice from "../objects/sceneOffice/paperOffice";
import { useRouter } from "next/navigation";
import Player from "../components/Player";
import TableTask from "../components/officeScene/TableTask";

import { useTaskStore } from "../stores/TaskStore";
import TaskProgress from "../components/TaskProgress";
import MissionResponsibility from "../components/officeScene/TaskResponsibility";
import MenNpc from "../objects/npc/MenNpcOffice";
import CodeReviewMission from "../components/officeScene/CodeReviewMission";
import CeilingLamp from "../objects/sceneBoss/ceilingLamp";
import GameMenu from "../components/modalGameMenu/gameMenu";
import MissionCounter from "../components/modalGameMenu/missionCounter";
import GameCompletionModal from "../components/modalGameMenu/gameCompletion";

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
        width: 12.5,
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

function PlayerController() {
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
        { position: [-6.5, 0.5, 2], radius: 3, name: 'WoodernTable' },
        { position: [-6.5, 0.5, 4], radius: 3, name: 'WoodernTable' },
        { position: [6.5, 0.5, 2], radius: 3, name: 'WoodernTable' },
        { position: [6.5, 0.5, 4], radius: 3, name: 'WoodernTable' },

        { position: [-11.5, -1.5, -5.7], radius: 2, name: 'SofaBlue' },
        { position: [-11.5, -1.5, -5], radius: 2, name: 'SofaBlue' },
        { position: [-9.6, 1, -7.5], radius: 2, name: 'SofaTable' },
        { position: [-6, 0, -7], radius: 1.5, name: 'Armchair' },

        { position: [1, 0, -7.7], radius: 1.5, name: 'CofeTable' },
        { position: [3.3, 0, -7.7], radius: 1.5, name: 'CofeTable' },
        { position: [5.5, 0, -8], radius: 1.5, name: 'WhaterCooler' },

        { position: [8, 0, -8], radius: 1, name: 'Monstera' },
        { position: [-12.5, 0, -8.8], radius: 1, name: 'CornerShelf' },

        { position: [11, 0, -3.5], radius: 1.5, name: 'MarkerBoard' },

        { position: [-9, -1, -6], radius: 1, name: 'MenNpc' },
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
    }, [nearDoor, doorCallback])

    useFrame((_, delta) => {
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
                console.log(door.position)
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
            {nearDoor && (
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



export default function Office() {


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
            }}>

                <OrbitControls />

                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[5, 3.5, 3]} intensity={3} color={'white'} />



                <CameraController />
                <PlayerController />
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
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>


                <Door position={[0, -1, 12.1]} rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorFirst}
                    isInteractive={true}
                />

                <WoodernPanel />
                <MossOffice />


                <mesh position={[0, -0.12, 1.8]}>

                    <TableTask />

                    <WoodernTable position={[7, 0.5, 1]} rotation={[0, Math.PI / 2, 0]} />


                    <Chair position={[6.5, -2.5, 4.5]} rotation={[0, Math.PI / 2 + (10 * Math.PI / 180), 0]} />
                    <Chair position={[6.5, -2.5, 1.5]} rotation={[0, Math.PI / 2 + (10 * Math.PI / -190), 0]} />
                    <Chair position={[6.5, -2.5, 0.5]} rotation={[0, Math.PI / 2 + (10 * Math.PI / 150), 0]} />

                    <Chair position={[7.5, -2.5, 2.2]} rotation={[0, Math.PI / -2 + (10 * Math.PI / 180), 0]} />
                    <Chair position={[7.5, -2.5, 1]} rotation={[0, Math.PI / -2 + (10 * Math.PI / -190), 0]} />
                    <Chair position={[7.5, -2.5, -3]} rotation={[0, Math.PI / -2 + (10 * Math.PI / 150), 0]} />

                </mesh>


                <SofaBlue />
                <SofaTable />
                <ArmchairOffice />
                <FloorLamp />
                <pointLight position={[-11.5, 3, -2.5]} intensity={3} distance={50} color={'#dcdbd0'} />


                <MarkerBoard />
                <BookcaseOffice />

                <BlockWooden position={[12.4, 1.7, 8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 7.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 7.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 6.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 6.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 5.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 5.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 4.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[12.4, 1.7, 4.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />


                <BlockWooden position={[-12.4, 2, -4.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.2, 0.01]} />
                <BlockWooden position={[-12.4, 2, -4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.4, 0.01]} />
                <BlockWooden position={[-12.4, 2, -3.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.5, 0.01]} />
                <BlockWooden position={[-12.4, 2, -3.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[-12.4, 2, -2.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.7, 0.01]} />
                <BlockWooden position={[-12.4, 2, -2.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.75, 0.01]} />
                <BlockWooden position={[-12.4, 2, -2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.7, 0.01]} />
                <BlockWooden position={[-12.4, 2, -1.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[-12.4, 2, -1.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.5, 0.01]} />
                <BlockWooden position={[-12.4, 2, -0.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.4, 0.01]} />
                <BlockWooden position={[-12.4, 2, -0.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.2, 0.01]} />


                <CofeTable position={[1, -0.97, -7.7]} />
                <CofeTable position={[3.3, -0.97, -7.7]} />
                <WhaterCooler position={[5.4, -1, -8]} />

                <PlasticCup position={[4, 0.8, -8]} />
                <PlasticCup position={[3.7, 0.8, -8.5]} />

                <WallLampCoffe />
                <pointLight position={[0, 3, -8.1]} intensity={5} color={'#dcdbd0'} />

                <KettleElectric />

                <CupRed rotation={[0, 1, 0]} position={[1.2, 1.07, -8.2]} />
                <CupBlue />

                <MonsteraOffice />


                <CornerShelf />
                <FoldersShelf />
                <Calendar />

                <MemoryBord />
                <ClockOffice rotation={[0, -6.3, 0]} position={[5, 2.3, 8.8]} />
                <pointLight position={[5, 3.5, 8.3]} intensity={3} color={'#dcdbd0'} />

                <MapWooden />


                <Cactus position={[7.5, 0.7, 6]} />
                <CactusCube position={[9.5, 1.5, 4]} />

                <GamingLaptop position={[8.5, 0.6, 5]} rotation={[0, 0.3, 0]} />
                <GamingLaptop position={[5.7, 0.6, 0.4]} rotation={[0, 2.9, 0]} />

                <MoonLamp position={[7, 0.6, 2]} />
                <pointLight position={[7, 1.3, 2]} intensity={3} color={'#dcdbd0'} />

                <IMac position={[8.5, 2, 0.5]} rotation={[0, Math.PI / 2, 0]} />

                <MissionResponsibility position={[8.5, -1, 0.5]} />

                <PlieOfPaperOffice />

                <MenNpc position={[-9, -1, -6]} rotation={[0, 1, 0]} />
                <CodeReviewMission position={[-9, 0, -6]} />


                <CeilingLamp position={[-7, -0.5, 2.6]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[-7, 2, 2.6]} intensity={20} color={'#dcdbd0'} />
                <CeilingLamp position={[7, -0.5, 2.6]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[-7, 2, 2.6]} intensity={20} color={'#dcdbd0'} />

            </Canvas>
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