'use clien'

import { Html, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useCallback, useMemo } from "react";
import * as THREE from 'three';
import Door from "../objects/sceneAdmin/door";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Window from "../objects/sceneBoss/window";
import Landscape from "../objects/sceneBoss/landscape";
import Sky from "../objects/sceneBoss/sky";
import BlackShelf from "../objects/sceneBoss/blackShelf";
import BooksForShelf from "../objects/sceneBoss/booksForShelf";
import Cactus from "../objects/sceneOffice/plant/cactus";
import FolderSmile from "../objects/sceneBoss/folderSmile";
import Ship from "../objects/sceneBoss/ship";
import CactusCube from "../objects/sceneOffice/plant/cactusCube";
import TableBoss from "../objects/sceneBoss/tableBoss";
import ChairBoss from "../objects/sceneBoss/chairBoss";
import IMac from "../objects/sceneOffice/imac";
import PaperForm from "../objects/sceneBoss/paperForm";
import Pen from "../objects/sceneBoss/pen";
import CupRed from "../objects/sceneOffice/cupRed";
import CofeTable from "../objects/sceneOffice/cofeTable";
import Printer from "../objects/sceneBoss/printer";
import TrashCan from "../objects/sceneBoss/trashCan";
import WoodernTable from "../objects/sceneOffice/woodernTable";
import Chair from "../objects/sceneOffice/chair";
import PlantInRound from "../objects/sceneBoss/plantInRound";
import NotePaper from "../objects/sceneOffice/notePaper";
import ProjectorScreen from "../objects/sceneBoss/projectorScreen";
import Projector from "../objects/sceneBoss/projector";
import SofaBoss from "../objects/sceneBoss/sofaBoss";
import LampPeople from "../objects/sceneBoss/lampPeople";
import TableGlass from "../objects/sceneBoss/tableGlass";
import Player from "../components/Player";
import BlockWooden from "../objects/sceneOffice/blockWooden";
import BossNpc from "../objects/npc/bossNpc";
import CeilingLamp from "../objects/sceneBoss/ceilingLamp";
import ManagerMission from "../components/bossScene/managerMission";
import ConfidentialDocumentsMission from "../components/bossScene/documentMission";
import Puddle from "../objects/sceneBoss/puddle";
import CupOfCoffe from "../objects/sceneAdmin/cupOfCoffe";
import Starbucks from "../objects/sceneAdmin/starbucks";
import CoffeAnimate from "../objects/sceneBoss/coffe";
import CoffeeCatastropheMission from "../components/bossScene/cofeMission";
import MissionCounter from "../components/modalGameMenu/missionCounter";
import GameMenu from "../components/modalGameMenu/gameMenu";
import GameCompletionModal from "../components/modalGameMenu/gameCompletion";
import { useTaskStore } from "../stores/TaskStore";



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
        width: 6.5,
        height: 4,
        depth: 8.5
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
        minX: -6.5,
        maxX: 6.5,
        minZ: -8.5,
        maxZ: 8.5
    }

    const furnitureColliders = [
        { position: [-5, 0.5, -5], radius: 2, name: 'TableBoss' },
        { position: [-4, 0.5, -5], radius: 2, name: 'TableBoss' },

        { position: [-5, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-6.5, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-7, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-8, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-9, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-4, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-3, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-2, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [-1, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [0, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [1, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [2, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [3, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [4, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [5, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [5.5, 0, -8], radius: 1, name: 'BlackShelf' },
        { position: [6.5, 0, -8], radius: 1, name: 'CofeTable' },

        { position: [3.5, 0, 0], radius: 2, name: 'WoodernTable' },
        { position: [3.5, 0, 1], radius: 2, name: 'WoodernTable' },
        { position: [3.5, 0, 2], radius: 2, name: 'WoodernTable' },
        { position: [3.5, 0, -2], radius: 2, name: 'WoodernTable' },
        { position: [3.5, 0, -1], radius: 2, name: 'WoodernTable' },

        { position: [5, 0, 2], radius: 2, name: 'Chair' },
        { position: [5, 0, -1], radius: 2, name: 'Chair' },
        { position: [2.5, 0, -1], radius: 2, name: 'Chair' },
        { position: [2.5, 0, 1], radius: 2, name: 'Chair' },
        { position: [4, 0, -3], radius: 2, name: 'Chair' },

        { position: [-4.5, 0, 5], radius: 2, name: 'TableGlass' },
        { position: [-3.4, 0, 3], radius: 1, name: 'TableGlass' },
        { position: [-7.5, 0, 4], radius: 2.5, name: 'SofaBoss' },
        { position: [-7.5, 0, 6], radius: 1, name: 'SofaBoss' },
        { position: [-7.5, 0, 8], radius: 1, name: 'SofaBoss' },
        { position: [-4, 0, 9], radius: 1, name: 'SofaBoss' },
        { position: [-5.3, 0, 7], radius: 1, name: 'SofaBoss' },

        { position: [-3, -1, -7], radius: 1, name: 'Boss' },

        { position: [-6.5, -1, 0.1], radius: 1, name: 'Women' },

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


        // console.log(player.position)

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



export default function BossScene() {


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

                <OrbitControls />

                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[5, 3.5, 3]} intensity={3} color={'white'} />

                <CameraController />
                <PlayerController />
                <Player />



                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[15, 18]} />
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
                    <boxGeometry args={[15, 7, 0.2]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[0, 1.5, -9]}>
                    <boxGeometry args={[15, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[7.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[18, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>


                <mesh position={[-7.5, 1.5, 7.9]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-7.5, 1.5, -7.9]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2, 7, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>

                <mesh position={[-7.5, 4.2, 4]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[6, 1.6, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-7.5, 4.2, -4]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[6, 1.6, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>

                <mesh position={[-7.5, -0.2, -4]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[6, 1.6, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-7.5, -0.2, 4]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[6, 1.6, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>
                <mesh position={[-7.5, -0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2, 10.4, 0.2]} />
                    <meshStandardMaterial color="#6e6e6e" />
                </mesh>

                <Door position={[0, -1, 12.1]} rotation={[0, Math.PI / 2, 0]}
                    onDoorClick={clickDoorFirst}
                    isInteractive={true}
                />


                <Window position={[-7.4, 1.5, -4]} rotation={[0, Math.PI / -2, 0]} />
                <Window position={[-7.4, 1.5, 4]} rotation={[0, Math.PI / -2, 0]} />

                <Landscape position={[-14, -12, -7]} />

                <group>
                    <mesh position={[-23, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <boxGeometry args={[55, 20, 0.2]} />
                        <meshStandardMaterial color="#a9e0ea" />
                    </mesh>
                    <mesh position={[-23, 1.5, 10]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[55, 20, 0.2]} />
                        <meshStandardMaterial color="#a9e0ea" />
                    </mesh>
                    <mesh position={[-23, 1.5, -10]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[55, 20, 0.2]} />
                        <meshStandardMaterial color="#a9e0ea" />
                    </mesh>
                    <Sky position={[-22, 4, 0]} scale={0.3} rotation={[0, -1, 0]} />
                    <Sky position={[-22, 5, 7]} scale={0.3} rotation={[0, -2, 0]} />
                    <Sky position={[-14, 2, -7]} scale={0.3} rotation={[0, -2, 0]} />
                    <Sky position={[-14, 2, 7]} scale={0.3} rotation={[0, -2, 0]} />
                </group>

                <group>
                    <BlackShelf position={[-5.3, -1, -8.5]} />
                    <BlackShelf position={[-1.5, -1, -8.5]} />
                    <BlackShelf position={[2.4, -1, -8.5]} />

                    <BooksForShelf rotation={[0, Math.PI / -2, 0]} position={[-6.3, 1, -8.5]} />
                    <BooksForShelf rotation={[0, Math.PI / -2, 0]} position={[3.5, 0, -8.5]} />
                    <BooksForShelf rotation={[0, Math.PI / 2, 0]} position={[1.7, 1, -8.5]} />

                    <Cactus position={[0, 0.3, -8.6]} />
                    <Cactus position={[3, 2.25, -8.6]} />
                    <CactusCube position={[1.5, 3.1, -8.5]} />
                    <CactusCube position={[-1.5, 1.2, -8.5]} />

                    <FolderSmile position={[4, 1.8, -9]} rotation={[0, -0.5, 0]} />

                    <Ship position={[-2.8, -0.4, -8.5]} />

                </group>

                <group>
                    <TableBoss position={[-5, -0.2, -5]} />
                    <ChairBoss position={[-5, -0.9, -6.5]} rotation={[0, 0.5, 0]} />
                    <ChairBoss position={[-4.5, -0.9, -3.5]} rotation={[0, -2.8, 0]} />

                    <IMac position={[-6, 2.05, -5.5]} rotation={[0, Math.PI / 1, 0]} />

                    <PaperForm rotation={[1.5, Math.PI / 1, 0.5]} position={[-4.5, 0.6, -4.8]} />

                    <Pen position={[-3.5, 0.55, -5.3]} />

                    <CupRed position={[-3, 0.75, -5]} rotation={[0, 1, 0]} />

                </group>

                <CofeTable position={[6.5, -0.9, -8]} />
                <Printer position={[6.6, 1.4, -8.2]} />
                <TrashCan position={[5, -1, -8.5]} />

                <WoodernTable position={[3.5, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.025} />
                <Chair position={[3, -2.6, 1]} rotation={[0, 1, 0]} />
                <Chair position={[3, -2.6, -1]} rotation={[0, 1.5, 0]} />
                <Chair position={[4.2, -2.6, -1]} rotation={[0, -2, 0]} />
                <Chair position={[3.2, -2.6, 0]} rotation={[0, -1, 0]} />

                <Chair position={[4, -2.6, -1]} rotation={[0, Math.PI / 1, 0]} />


                <PaperForm rotation={[1.5, Math.PI / 1, 2.5]} position={[3, 0.6, 3]} />
                <ConfidentialDocumentsMission position={[3, 0, 3]} />

                <PaperForm rotation={[1.5, Math.PI / 1, 3.7]} position={[-3, -0.2, 4.4]} />
                <Puddle position={[-3, -0.17, 4.4]} />
                <CoffeAnimate position={[-3, -0.25, 4]} />
                <CoffeeCatastropheMission position={[-3, -1, 4]} />


                <PlantInRound position={[3.6, 0.8, 0]} />
                <NotePaper position={[4, 0.55, -2.5]} rotation={[0, 0.5, 0]} />



                <ProjectorScreen rotation={[0, Math.PI / -2, 0]} position={[4, 2.5, 8.8]} />
                <Projector position={[4, 2, 5]} />


                <SofaBoss rotation={[0, 1.2, 0]} position={[-9, -1.8, 0.3]} />
                <LampPeople rotation={[0, 1, 0]} position={[-6.6, 1, 0.5]} />
                <pointLight position={[-6.6, 2.5, 0.5]} intensity={20} color={'#dcdbd0'} />
                <TableGlass position={[-4.5, -1, 5]} />


                <BlockWooden position={[7.4, 1.7, 8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 7.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 7.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 6.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 6.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 5.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 5.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 4.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 4.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 3.6]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 3.2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 2.8]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 2.4]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />
                <BlockWooden position={[7.4, 1.7, 2]} rotation={[0, Math.PI / 2, 0]} scale={[0.05, 0.6, 0.01]} />


                <CeilingLamp position={[3.5, -0.5, 0]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[3.5, 2, 0]} intensity={20} color={'#dcdbd0'} />
                <CeilingLamp position={[-3.5, -0.5, 0]} rotation={[0, Math.PI / 2, 0]} />
                <pointLight position={[-3.5, 2, 0]} intensity={20} color={'#dcdbd0'} />


                <BossNpc position={[-3, -1, -7]} rotation={[0, 1, 0]} />
                <ManagerMission position={[-3, 0, -7]} />


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