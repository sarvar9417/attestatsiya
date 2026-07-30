import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface TopicProgress {
  completed: boolean
  correctCount: number
  totalCount: number
  lastScore: number
}

export interface ModuleProgress {
  completedTopics: string[]            // subtopic id
  topicProgress: Record<string, TopicProgress>
  mockExamScore: number | null
  mockExamCompleted: boolean
  mockExamAnswers: Record<string, number>
}

interface ProgressState {
  moduleProgress: Record<string, ModuleProgress>

  completeTopic: (moduleId: string, subtopicId: string, correct: number, total: number) => void
  setMockExamResult: (moduleId: string, score: number, answers: Record<string, number>) => void
  setMockExamScore: (moduleId: string, score: number) => void
  resetModule: (moduleId: string) => void

  getModuleProgress: (moduleId: string) => ModuleProgress
  isModuleComplete: (moduleId: string, totalTopics: number) => boolean
}

const defaultModuleProgress = (): ModuleProgress => ({
  completedTopics: [],
  topicProgress: {},
  mockExamScore: null,
  mockExamCompleted: false,
  mockExamAnswers: {},
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      moduleProgress: {},

      completeTopic: (moduleId, subtopicId, correct, total) => {
        set(state => {
          const mp = { ...state.moduleProgress }
          if (!mp[moduleId]) mp[moduleId] = defaultModuleProgress()

          const module = { ...mp[moduleId] }
          module.topicProgress = { ...module.topicProgress }
          module.topicProgress[subtopicId] = {
            completed: true,
            correctCount: correct,
            totalCount: total,
            lastScore: Math.round((correct / total) * 100),
          }
          if (!module.completedTopics.includes(subtopicId)) {
            module.completedTopics = [...module.completedTopics, subtopicId]
          }
          mp[moduleId] = module
          return { moduleProgress: mp }
        })
      },

      setMockExamResult: (moduleId, score, answers) => {
        set(state => {
          const mp = { ...state.moduleProgress }
          if (!mp[moduleId]) mp[moduleId] = defaultModuleProgress()
          mp[moduleId] = {
            ...mp[moduleId],
            mockExamScore: score,
            mockExamCompleted: true,
            mockExamAnswers: answers,
          }
          return { moduleProgress: mp }
        })
      },

      setMockExamScore: (moduleId, score) => {
        set(state => {
          const mp = { ...state.moduleProgress }
          if (!mp[moduleId]) mp[moduleId] = defaultModuleProgress()
          mp[moduleId] = {
            ...mp[moduleId],
            mockExamScore: score,
            mockExamCompleted: true,
          }
          return { moduleProgress: mp }
        })
      },

      resetModule: (moduleId) => {
        set(state => ({
          moduleProgress: { ...state.moduleProgress, [moduleId]: defaultModuleProgress() },
        }))
      },

      getModuleProgress: (moduleId) => {
        return get().moduleProgress[moduleId] ?? defaultModuleProgress()
      },

      isModuleComplete: (moduleId, totalTopics) => {
        const mp = get().moduleProgress[moduleId]
        if (!mp) return false
        return mp.completedTopics.length >= totalTopics && mp.mockExamCompleted
      },
    }),
    {
      name: 'attestatsiya-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
