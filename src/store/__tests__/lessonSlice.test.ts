import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { create } from 'zustand'
import { createAuthSlice } from '../authSlice'
import { createProgressSlice } from '../progressSlice'
import { createLessonSlice } from '../lessonSlice'
import type { AppState } from '../appState'
import type { LessonSessionData } from '../types'
import type { DailyLesson } from '../../data/dailyLessons'
import { saveLessonSessionToDB, clearLessonSessionFromDB, fetchLessons } from '../../services/lessonService'

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

vi.mock('../../services/lessonService', () => ({
  fetchLessons: vi.fn().mockResolvedValue([]),
  saveLessonSessionToDB: vi.fn().mockResolvedValue(undefined),
  clearLessonSessionFromDB: vi.fn().mockResolvedValue(undefined),
  pushLessonProgress: vi.fn().mockResolvedValue(undefined),
  saveLessonSessionLocal: vi.fn(),
  clearLessonSessionLocal: vi.fn(),
  loadAllLessonSessionsLocal: vi.fn().mockReturnValue({}),
}))

const sampleSession: LessonSessionData = {
  tab: 'reading',
  currentSection: 3,
  testSection: 1,
  completedSections: { 0: 80, 1: 90 },
  completedTestSections: { 0: 100 },
  updatedAt: Date.now(),
}

function createTestStore() {
  return create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createProgressSlice(...a),
    ...createLessonSlice(...a),
  }))
}

describe('lessonSlice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has initial default values', () => {
      const store = createTestStore()
      const state = store.getState()

      expect(state.lessonProgress).toEqual({})
      expect(state.lessonSessions).toEqual({})
      expect(state.lessons).toEqual([])
      expect(state.lessonsLoading).toBe(false)
      expect(state.lessonsFetched).toBe(false)
    })
  })

  describe('setLessonProgress', () => {
    it('sets score for a lesson', () => {
      const store = createTestStore()
      store.getState().setLessonProgress('lesson-1', 85)

      expect(store.getState().lessonProgress['lesson-1']).toBe(85)
    })

    it('keeps the highest score', () => {
      const store = createTestStore()
      store.getState().setLessonProgress('lesson-1', 85)
      store.getState().setLessonProgress('lesson-1', 70)

      expect(store.getState().lessonProgress['lesson-1']).toBe(85)
    })

    it('updates score when new score is higher', () => {
      const store = createTestStore()
      store.getState().setLessonProgress('lesson-1', 60)
      store.getState().setLessonProgress('lesson-1', 95)

      expect(store.getState().lessonProgress['lesson-1']).toBe(95)
    })

    it('tracks progress for multiple lessons', () => {
      const store = createTestStore()
      store.getState().setLessonProgress('lesson-1', 80)
      store.getState().setLessonProgress('lesson-2', 90)

      expect(store.getState().lessonProgress['lesson-1']).toBe(80)
      expect(store.getState().lessonProgress['lesson-2']).toBe(90)
    })
  })

  describe('saveLessonSession', () => {
    it('saves session data to state', () => {
      const store = createTestStore()
      store.getState().saveLessonSession('lesson-1', sampleSession)

      const saved = store.getState().lessonSessions['lesson-1']
      expect(saved).toEqual(sampleSession)
    })

    it('calls saveLessonSessionToDB', () => {
      const store = createTestStore()

      store.getState().saveLessonSession('lesson-1', sampleSession)

      expect(saveLessonSessionToDB).toHaveBeenCalledWith('lesson-1', sampleSession)
    })
  })

  describe('clearLessonSession', () => {
    it('removes session from state', () => {
      const store = createTestStore()
      store.getState().saveLessonSession('lesson-1', sampleSession)
      expect(store.getState().lessonSessions['lesson-1']).toBeDefined()

      store.getState().clearLessonSession('lesson-1')

      expect(store.getState().lessonSessions['lesson-1']).toBeUndefined()
    })

    it('calls clearLessonSessionFromDB', () => {
      const store = createTestStore()
      store.getState().saveLessonSession('lesson-1', sampleSession)

      store.getState().clearLessonSession('lesson-1')

      expect(clearLessonSessionFromDB).toHaveBeenCalledWith('lesson-1')
    })
  })

  describe('fetchAndSetLessons', () => {
    it('sets loading state during fetch', async () => {
      const store = createTestStore()

      const promise = store.getState().fetchAndSetLessons()
      expect(store.getState().lessonsLoading).toBe(true)

      await promise
    })

    it('sets lessons after successful fetch', async () => {
      const mockLessons = [{ id: 'lesson-1', title: 'Test' }] as unknown as DailyLesson[]
      vi.mocked(fetchLessons).mockResolvedValue(mockLessons)

      const store = createTestStore()
      await store.getState().fetchAndSetLessons()

      expect(store.getState().lessons).toEqual(mockLessons)
      expect(store.getState().lessonsLoading).toBe(false)
      expect(store.getState().lessonsFetched).toBe(true)
    })
  })
})
