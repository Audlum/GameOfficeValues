
import { create } from 'zustand'

interface Task {
    completed: boolean
    responsibilityPoints: number
    choices: string[]
    isActive: boolean
}

interface TasksState {
    [key: string]: Task
}

interface TaskStore {
    tasks: TasksState
    totalPoints: number
    completeTask: (taskId: string, points?: number, choice?: string | null) => void
    resetTask: (taskId: string) => void
    activateTask: (taskId: string) => void
    deactivateTask: (taskId: string) => void
    getTaskStatus: (taskId: string) => boolean
    getTaskPoints: (taskId: string) => number
    isTaskActive: (taskId: string) => boolean
    getTotalPoints: () => number
    getAllTasks: () => TasksState
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: {
        tableTask: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        missionResponsibility: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        codeReviewMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },

        managerMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        confidentialDocumentsMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        coffeeCatastropheMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },

        puzzleMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        shoppingListMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        },
        pinRunMission: {
            completed: false,
            responsibilityPoints: 0,
            choices: [],
            isActive: false
        }
    },
    totalPoints: 0,

    completeTask: (taskId: string, points: number = 0, choice: string | null = null) => set((state) => {
        const newTotalPoints = state.totalPoints + points
        return {
            tasks: {
                ...state.tasks,
                [taskId]: {
                    completed: true,
                    responsibilityPoints: points,
                    choices: [...(state.tasks[taskId]?.choices || []), choice].filter(Boolean) as string[],
                    isActive: false
                }
            },
            totalPoints: newTotalPoints
        }
    }),

    resetTask: (taskId: string) => set((state) => ({
        tasks: {
            ...state.tasks,
            [taskId]: {
                completed: false,
                responsibilityPoints: 0,
                choices: [],
                isActive: false
            }
        }
    })),

    activateTask: (taskId: string) => set((state) => ({
        tasks: {
            ...state.tasks,
            [taskId]: {
                ...state.tasks[taskId],
                isActive: true
            }
        }
    })),

    deactivateTask: (taskId: string) => set((state) => ({
        tasks: {
            ...state.tasks,
            [taskId]: {
                ...state.tasks[taskId],
                isActive: false
            }
        }
    })),

    getTaskStatus: (taskId: string) => get().tasks[taskId]?.completed || false,

    getTaskPoints: (taskId: string) => get().tasks[taskId]?.responsibilityPoints || 0,

    isTaskActive: (taskId: string) => get().tasks[taskId]?.isActive || false,

    getTotalPoints: () => get().totalPoints,

    getAllTasks: () => get().tasks
}))