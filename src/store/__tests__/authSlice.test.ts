import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { create } from 'zustand'
import { createAuthSlice } from '../authSlice'
import { createProgressSlice } from '../progressSlice'
import { createLessonSlice } from '../lessonSlice'
import type { AppState } from '../appState'

// Mock tashkentDate
vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

// Create a test store without persist middleware
function createTestStore() {
  return create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createProgressSlice(...a),
    ...createLessonSlice(...a),
  }))
}

describe('authSlice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('has initial default values', () => {
    const store = createTestStore()
    const state = store.getState()

    expect(state.userName).toBe('')
    expect(state.userEmail).toBe('')
    expect(state.onboardingComplete).toBe(false)
    expect(state.startDate).toBe('2026-06-15')
    expect(state.targetDate).toBe('2026-09-13') // 90 days later
    expect(state.currentWeek).toBe(1)
    expect(state.currentDay).toBe(1)
    expect(state.currentLevel).toBe('A2+')
  })

  it('setUserName updates userName', () => {
    const store = createTestStore()
    store.getState().setUserName('Ali')
    expect(store.getState().userName).toBe('Ali')
  })

  it('setUserEmail updates userEmail', () => {
    const store = createTestStore()
    store.getState().setUserEmail('ali@example.com')
    expect(store.getState().userEmail).toBe('ali@example.com')
  })

  it('completeOnboarding sets userName and marks onboarding complete', () => {
    const store = createTestStore()
    store.getState().completeOnboarding('Ali')

    const state = store.getState()
    expect(state.userName).toBe('Ali')
    expect(state.onboardingComplete).toBe(true)
    expect(state.startDate).toBe('2026-06-15')
    expect(state.targetDate).toBe('2026-09-13')
  })

  it('advanceDay increments currentDay and recalculates currentWeek', () => {
    const store = createTestStore()
    expect(store.getState().currentDay).toBe(1)
    expect(store.getState().currentWeek).toBe(1)

    store.getState().advanceDay()
    expect(store.getState().currentDay).toBe(2)
    expect(store.getState().currentWeek).toBe(1) // day 2 = week 1

    // Advance to day 7
    for (let i = 0; i < 5; i++) store.getState().advanceDay()
    expect(store.getState().currentDay).toBe(7)
    expect(store.getState().currentWeek).toBe(1) // day 7 = week 1

    // Advance to day 8
    store.getState().advanceDay()
    expect(store.getState().currentDay).toBe(8)
    expect(store.getState().currentWeek).toBe(2) // day 8 = week 2
  })

  it('advanceDay resets daily progress fields', () => {
    const store = createTestStore()

    // Set some daily progress
    store.getState().addXP(500)
    store.getState().setTodayMinutes(60)
    store.getState().toggleChecklistItem('grammar')

    expect(store.getState().todayXP).toBeGreaterThan(0)
    expect(store.getState().todayMinutes).toBeGreaterThan(0)
    expect(store.getState().todayChecklist.grammar).toBe(true)

    // Advance day
    store.getState().advanceDay()

    const state = store.getState()
    expect(state.todayXP).toBe(0)
    expect(state.todayMinutes).toBe(0)
    expect(state.todayGrammarPct).toBe(0)
    expect(state.todayChecklist.grammar).toBe(false)
    expect(state.todayChecklist.vocabulary).toBe(false)
  })

  it('setLevel updates currentLevel', () => {
    const store = createTestStore()
    store.getState().setLevel('B1')
    expect(store.getState().currentLevel).toBe('B1')
  })
})
