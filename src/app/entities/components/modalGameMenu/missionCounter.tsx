
'use client'

import { useEffect, useState } from 'react'
import { useTaskStore } from '../../stores/TaskStore'

export default function MissionCounter() {
    const { getAllTasks } = useTaskStore()
    const [missionStats, setMissionStats] = useState({
        completed: 0,
        total: 9
    })

    useEffect(() => {
        const updateStats = () => {
            const allTasks = getAllTasks()

            const allMissionIds = [
                'tableTask',
                'missionResponsibility',
                'codeReviewMission',
                'managerMission',
                'confidentialDocumentsMission',
                'coffeeCatastropheMission',
                'puzzleMission',
                'shoppingListMission',
                'pinRunMission'
            ]

            const completedCount = allMissionIds.filter(id =>
                allTasks[id]?.completed
            ).length

            setMissionStats({
                completed: completedCount,
                total: allMissionIds.length
            })
        }

        updateStats()
        const intervalId = setInterval(updateStats, 500)

        return () => clearInterval(intervalId)
    }, [getAllTasks])

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            border: '1px solid #3498db',
            minWidth: '180px',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                fontSize: '12px',
                color: '#95a5a6',
                marginBottom: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                Прогресс миссий
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <span style={{
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    {missionStats.completed} / {missionStats.total}
                </span>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#3498db'
                    }} />
                    <span style={{
                        fontSize: '14px',
                        color: '#ecf0f1'
                    }}>
                        {missionStats.total > 0
                            ? Math.round((missionStats.completed / missionStats.total) * 100)
                            : 0}%
                    </span>
                </div>
            </div>

            <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                marginTop: '8px',
                overflow: 'hidden'
            }}>
                <div
                    style={{
                        width: `${missionStats.total > 0
                            ? (missionStats.completed / missionStats.total) * 100
                            : 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3498db, #2ecc71)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }}
                />
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#95a5a6',
                marginTop: '4px'
            }}>
                <span>Выполнено: {missionStats.completed}</span>
                <span>Осталось: {missionStats.total - missionStats.completed}</span>
            </div>
        </div>
    )
}