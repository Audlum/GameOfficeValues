import { useState, useEffect } from 'react'
import { useTaskStore } from '../../stores/TaskStore'
import { useRouter } from 'next/navigation'

interface GameMenuProps {
    isOpen: boolean
    onClose: () => void
    onResetGame: () => void
    onReturnToGame: () => void
}

interface Mission {
    id: string
    name: string
    completed: boolean
    points: number
}

interface Value {
    id: string
    name: string
    description: string
    missions: Mission[]
}

export default function GameMenu({
    isOpen,
    onClose,
    onResetGame,
    onReturnToGame
}: GameMenuProps) {
    const [currentView, setCurrentView] = useState<'main' | 'missions'>('main')
    const [showResetConfirm, setShowResetConfirm] = useState(false)

    const {
        getAllTasks,
        getTotalPoints,
        resetTask
    } = useTaskStore()

    const allTasks = getAllTasks()
    const totalPoints = getTotalPoints()

    const values: Value[] = [
        {
            id: 'responsibility',
            name: 'Ответственность',
            description: 'Умение принимать на себя обязательства и выполнять их',
            missions: [
                {
                    id: 'tableTask',
                    name: 'Задача на столе',
                    completed: allTasks.tableTask?.completed || false,
                    points: allTasks.tableTask?.responsibilityPoints || 0
                },
                {
                    id: 'missionResponsibility',
                    name: 'Миссия ответственности',
                    completed: allTasks.missionResponsibility?.completed || false,
                    points: allTasks.missionResponsibility?.responsibilityPoints || 0
                },
                {
                    id: 'codeReviewMission',
                    name: 'Code Review',
                    completed: allTasks.codeReviewMission?.completed || false,
                    points: allTasks.codeReviewMission?.responsibilityPoints || 0
                }
            ]
        },
        {
            id: 'transparency',
            name: 'Прозрачность',
            description: 'Открытость и честность в коммуникации',
            missions: [
                {
                    id: 'managerMission',
                    name: 'Миссия менеджера',
                    completed: allTasks.managerMission?.completed || false,
                    points: allTasks.managerMission?.responsibilityPoints || 0
                },
                {
                    id: 'confidentialDocumentsMission',
                    name: 'Конфиденциальные документы',
                    completed: allTasks.confidentialDocumentsMission?.completed || false,
                    points: allTasks.confidentialDocumentsMission?.responsibilityPoints || 0
                },
                {
                    id: 'coffeeCatastropheMission',
                    name: 'Кофейная катастрофа',
                    completed: allTasks.coffeeCatastropheMission?.completed || false,
                    points: allTasks.coffeeCatastropheMission?.responsibilityPoints || 0
                }
            ]
        },
        {
            id: 'speed',
            name: 'Скорость',
            description: 'Эффективность и быстрота выполнения задач',
            missions: [
                {
                    id: 'puzzleMission',
                    name: 'Пазлы на скорость',
                    completed: allTasks.puzzleMission?.completed || false,
                    points: allTasks.puzzleMission?.responsibilityPoints || 0
                },
                {
                    id: 'shoppingListMission',
                    name: 'Список покупок',
                    completed: allTasks.shoppingListMission?.completed || false,
                    points: allTasks.shoppingListMission?.responsibilityPoints || 0
                },
                {
                    id: 'pinRunMission',
                    name: 'Забег по точкам',
                    completed: allTasks.pinRunMission?.completed || false,
                    points: allTasks.pinRunMission?.responsibilityPoints || 0
                }
            ]
        }
    ]

    const valueTotals = values.map(value => ({
        ...value,
        totalPoints: value.missions.reduce((sum, mission) => sum + mission.points, 0)
    }))

    const totalAllValues = valueTotals.reduce((sum, value) => sum + value.totalPoints, 0)

    const router = useRouter()

    const handleResetGame = () => {
        Object.keys(allTasks).forEach(taskId => {
            resetTask(taskId)
        })
        onResetGame()
        setShowResetConfirm(false)
        onClose()
        router.push('/')
    }

    const handleReturnToGame = () => {
        onReturnToGame()
        onClose()
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape' && isOpen) {
                if (currentView === 'missions') {
                    setCurrentView('main')
                } else {
                    onClose()
                }
                event.preventDefault()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, currentView, onClose])

    if (!isOpen) return null

    const renderMainMenu = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    Игровое меню
                </h2>

                <div className="points-display">
                    <div className="points-label">Всего баллов:</div>
                    <div className="points-value">{totalPoints}</div>
                </div>

                <div className="menu-buttons">
                    <button
                        onClick={handleReturnToGame}
                        className="menu-button menu-button-green"
                    >
                        Вернуться в игру
                    </button>

                    <button
                        onClick={() => setCurrentView('missions')}
                        className="menu-button menu-button-gray"
                    >
                        Миссии
                    </button>

                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="menu-button menu-button-gray"
                    >
                        Начать с начала
                    </button>
                </div>

                <div className="modal-hint">
                    Нажмите ESC для выхода из меню
                </div>
            </div>
        </div>
    )

    const renderMissionsView = () => (
        <div className="modal-overlay">
            <div className="modal-content large-modal">
                <div className="missions-header">
                    <button
                        onClick={() => setCurrentView('main')}
                        className="back-button"
                    >
                        ← Назад
                    </button>

                    <h2 className="missions-title">
                        Все миссии
                    </h2>
                </div>

                <div className="values-list">
                    {valueTotals.map((value) => (
                        <div
                            key={value.id}
                            className="value-card"
                        >
                            <div className="value-header">
                                <div>
                                    <h3 className="value-name">
                                        {value.name}
                                    </h3>
                                    <p className="value-description">
                                        {value.description}
                                    </p>
                                </div>
                                <div className="value-points">
                                    <div className="value-points-label">Всего баллов:</div>
                                    <div className="value-points-value">{value.totalPoints}</div>
                                </div>
                            </div>

                            <div className="missions-list">
                                {value.missions.map((mission, missionIndex) => (
                                    <div
                                        key={mission.id}
                                        className={`mission-item ${mission.completed ? 'mission-completed' : ''}`}
                                    >
                                        <div className="mission-info">
                                            <div className={`mission-status ${mission.completed ? 'status-completed' : 'status-pending'}`}>
                                                {mission.completed ? '✓' : missionIndex + 1}
                                            </div>
                                            <span className={`mission-name ${mission.completed ? 'mission-name-completed' : ''}`}>
                                                {mission.name}
                                            </span>
                                        </div>
                                        <div className="mission-points">
                                            <span className={`points-display ${mission.completed ? 'points-completed' : ''}`}>
                                                {mission.points} баллов
                                            </span>
                                            {mission.completed && (
                                                <span className="completion-check">✓</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="total-stats">
                    <div className="stats-content">
                        <div>
                            <h3 className="stats-title">Общая статистика</h3>
                            <p className="stats-subtitle">Прогресс по всем ценностям</p>
                        </div>
                        <div className="stats-points">
                            <div className="stats-points-label">Всего баллов:</div>
                            <div className="stats-points-value">{totalAllValues}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleReturnToGame}
                    className="menu-button menu-button-green full-width"
                >
                    Вернуться в игру
                </button>

                <div className="modal-hint">
                    Нажмите ESC для возврата в главное меню
                </div>
            </div>
        </div>
    )

    const renderResetConfirm = () => (
        <div className="confirm-overlay">
            <div className="confirm-content">
                <h3 className="confirm-title">
                    Подтверждение
                </h3>

                <div className="confirm-message">
                    <p>Вы уверены, что хотите начать игру сначала?</p>
                    <div className="confirm-warning">
                        Все ваши баллы и прогресс будут сброшены!
                    </div>
                    <p className="confirm-note">
                        Вы будете перенаправлены на главную страницу.
                    </p>
                </div>

                <div className="confirm-buttons">
                    <button
                        onClick={() => setShowResetConfirm(false)}
                        className="confirm-button confirm-button-cancel"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleResetGame}
                        className="confirm-button confirm-button-reset"
                    >
                        Начать сначала
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {showResetConfirm && renderResetConfirm()}
            {!showResetConfirm && isOpen && (
                currentView === 'main' ? renderMainMenu() : renderMissionsView()
            )}
        </>
    )
}