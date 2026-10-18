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
        // Do not turn an untested 0/0 lesson into a 100% mastery mark.
        // Appendix reading is not a server-scored topic examination.
        if (!Number.isFinite(total) || !Number.isFinite(correct) ||
          total <= 0 || correct < 0 || correct > total) return
        set(state => {
          const mp = { ...state.moduleProgress }
          if (!mp[moduleId]) mp[moduleId] = defaultModuleProgress()

          const module = { ...mp[moduleId] }
          module.topicProgress = { ...module.topicProgress }
          module.topicProgress[subtopicId] = {
            completed: true,
            correctCount: correct,
            totalCount: total,
            // testsiz ma'lumotnoma mavzusi: o'qib chiqilgani yetarli
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
        const mp = get().moduleProgress[moduleId] ?? defaultModuleProgress()
        // Older client releases persisted "completed 0/0 = 100%" records.
        // Ignore those on read without deleting localStorage or real exam history.
        return {
          ...mp,
          completedTopics: mp.completedTopics.filter(id => {
            const record = mp.topicProgress[id]
            return record?.completed === true &&
              Number.isFinite(record.totalCount) && record.totalCount > 0 &&
              Number.isFinite(record.correctCount) &&
              record.correctCount >= 0 && record.correctCount <= record.totalCount
          }),
        }
      },

      isModuleComplete: (moduleId, totalTopics) => {
        const mp = get().getModuleProgress(moduleId)
        return totalTopics > 0 &&
          mp.completedTopics.length >= totalTopics && mp.mockExamCompleted
      },
    }),
    {
      name: 'attestatsiya-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
