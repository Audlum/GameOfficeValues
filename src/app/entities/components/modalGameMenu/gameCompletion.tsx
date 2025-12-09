import { useState, useEffect } from 'react'
import { useTaskStore } from '../../stores/TaskStore'
import { useRouter } from 'next/navigation'

interface GameCompletionModalProps {
    isOpen: boolean
    onClose: () => void
    onReturnToOffice: () => void
    onRestartGame: () => void
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

export default function GameCompletionModal({
    isOpen,
    onClose,
    onReturnToOffice,
    onRestartGame
}: GameCompletionModalProps) {
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

    const completedMissions = values.reduce((sum, value) =>
        sum + value.missions.filter(mission => mission.completed).length, 0
    )
    const allMissionsCompleted = completedMissions === 9

    const router = useRouter()

    const handleResetGame = () => {
        Object.keys(allTasks).forEach(taskId => {
            resetTask(taskId)
        })
        onRestartGame()
        setShowResetConfirm(false)
        onClose()
        router.push('/')
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape' && isOpen) {
                onClose()
                event.preventDefault()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

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

            <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                <div className="modal-content large-modal" style={{ background: '#1a1a1a', color: '#fff' }}>
                    <h2 className="modal-title" style={{ color: '#4ade80', fontSize: '32px', marginBottom: '20px' }}>
                        Игра пройдена!
                    </h2>

                    <div className="completion-stats" style={{ marginBottom: '30px' }}>
                        <div className="stats-grid" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <div className="stat-card" style={{ background: '#2a2a2a', padding: '20px', borderRadius: '10px', flex: 1 }}>
                                <div className="stat-label" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                                    Всего баллов
                                </div>
                                <div className="stat-value" style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}>
                                    {totalPoints}
                                </div>
                            </div>
                            <div className="stat-card" style={{ background: '#2a2a2a', padding: '20px', borderRadius: '10px', flex: 1 }}>
                                <div className="stat-label" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                                    Завершено миссий
                                </div>
                                <div className="stat-value" style={{ color: '#3b82f6', fontSize: '32px', fontWeight: 'bold' }}>
                                    {completedMissions}/9
                                </div>
                            </div>
                            <div className="stat-card" style={{ background: '#2a2a2a', padding: '20px', borderRadius: '10px', flex: 1 }}>
                                <div className="stat-label" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                                    Прогресс
                                </div>
                                <div className="stat-value" style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}>
                                    {Math.round((completedMissions / 9) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="completion-message" style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#e5e5e5', fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>
                            Вы ознакомились со всеми ценностями компании:
                        </p>
                        <div className="values-summary" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {values.map(value => (
                                <div key={value.id} className="value-item" style={{
                                    borderLeft: '4px solid #4ade80',
                                    padding: '15px 20px',
                                    background: '#2a2a2a',
                                    borderRadius: '8px'
                                }}>
                                    <div className="value-name" style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                                        {value.name}
                                    </div>
                                    <div className="value-description" style={{ color: '#cbd5e1', fontSize: '14px' }}>
                                        {value.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {allMissionsCompleted && (
                        <div className="achievement-notice" style={{
                            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(59, 130, 246, 0.2))',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '25px',
                            textAlign: 'center',
                            border: '2px solid #4ade80'
                        }}>
                            <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '16px' }}>
                                Вы успешно освоили все ценности компании!
                            </span>
                        </div>
                    )}

                    <div className="menu-buttons" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <button
                            onClick={onReturnToOffice}
                            style={{
                                flex: 1,
                                padding: '15px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Вернуться в офис
                        </button>

                        <button
                            onClick={() => setShowResetConfirm(true)}
                            style={{
                                flex: 1,
                                padding: '15px',
                                background: '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                        >
                            Начать сначала
                        </button>
                    </div>

                    <div className="modal-hint" style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        textAlign: 'center',
                        paddingTop: '15px',
                        borderTop: '1px solid #374151'
                    }}>
                        Нажмите ESC для выхода
                    </div>
                </div>
            </div>
        </>
    )
}