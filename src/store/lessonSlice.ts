import type { StateCreator } from 'zustand'
import { fetchLessons, saveLessonSessionToDB, clearLessonSessionFromDB, saveLessonSessionLocal, clearLessonSessionLocal, loadAllLessonSessionsLocal } from '../services/lessonService'
import { clearAllLessonProgress as clearLocalLessonProgress } from '../db/database'
import { monitoring } from '../lib/monitoring'
import type { DailyLesson, ReviewLesson } from '../data/dailyLessons'
import type { LessonSessionData } from './types'
import type { AppState } from './appState'

export interface LessonSlice {
  lessonProgress: Record<string, number>
  lessonSessions: Record<string, LessonSessionData>
  lessons: (DailyLesson | ReviewLesson)[]
  lessonsLoading: boolean
  lessonsFetched: boolean

  setLessonProgress: (lessonId: string, score: number) => void
  saveLessonSession: (lessonId: string, data: LessonSessionData) => void
  clearLessonSession: (lessonId: string) => void
  clearAllLessonProgress: () => void
  fetchAndSetLessons: () => Promise<void>
}

export const createLessonSlice: StateCreator<AppState, [], [], LessonSlice> = (set, get) => {
  let fetchPromise: Promise<void> | null = null

  return {
  lessonProgress: {},
  // localStorage'dan seed — sahifa yangilangach (auth bo'lmasa ham) "davom etish"
  // holati va LearnHub'dagi in-progress ko'rsatkichlari to'g'ri ko'rinadi.
  lessonSessions: loadAllLessonSessionsLocal(),
  lessons: [],
  lessonsLoading: false,
  lessonsFetched: false,

  setLessonProgress: (lessonId, score) => {
    set((s) => ({
      lessonProgress: {
        ...s.lessonProgress,
        [lessonId]: Math.max(s.lessonProgress[lessonId] ?? 0, score),
      },
    }))
  },

  saveLessonSession: (lessonId, data) => {
    set((s) => ({
      lessonSessions: { ...s.lessonSessions, [lessonId]: data },
    }))
    // Local (sinxron, auth'siz refresh resume uchun) + Supabase (cross-device sync)
    saveLessonSessionLocal(lessonId, data, data.updatedAt)
    saveLessonSessionToDB(lessonId, data).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'saveLessonSessionToDB' }))
  },

  clearLessonSession: (lessonId) => {
    set((s) => {
      const { [lessonId]: _omit, ...rest } = s.lessonSessions
      return { lessonSessions: rest }
    })
    clearLessonSessionLocal(lessonId)
    clearLessonSessionFromDB(lessonId).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'clearLessonSessionFromDB' }))
  },

  clearAllLessonProgress: () => {
    for (const id of Object.keys(get().lessonSessions)) clearLessonSessionLocal(id)
    set({ lessonProgress: {}, lessonSessions: {} })
    clearLocalLessonProgress().catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'clearAllLessonProgress' }))
  },

  fetchAndSetLessons: async () => {
    if (get().lessonsFetched && get().lessons.length > 0) return
    if (fetchPromise) return fetchPromise
    set({ lessonsLoading: true })
    fetchPromise = (async () => {
      try {
        const lessons = await fetchLessons()
        set({ lessons, lessonsLoading: false, lessonsFetched: true })
      } catch (e) {
        monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'fetchAndSetLessons' })
        set({ lessonsLoading: false, lessonsFetched: true })
      } finally {
        fetchPromise = null
      }
    })()
    return fetchPromise
  },
}}
