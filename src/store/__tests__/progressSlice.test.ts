import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { create } from 'zustand'
import { createAuthSlice } from '../authSlice'
import { createProgressSlice, getPendingStreakMilestones, getNextStreakMilestone } from '../progressSlice'
import { createLessonSlice } from '../lessonSlice'
import type { AppState } from '../appState'

// Mock tashkentDate
vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

// Mock achievements data
vi.mock('../../data/achievements', () => ({
  ACHIEVEMENTS: [
    { id: 'xp_100', title: '100 XP', requirement: { type: 'xp', value: 100 } },
    { id: 'streak_3', title: '3-Day Streak', requirement: { type: 'streak', value: 3 } },
    { id: 'words_10', title: '10 Words', requirement: { type: 'words', value: 10 } },
    { id: 'mock_done', title: 'First Mock', requirement: { type: 'mocktest', value: 1 } },
    { id: 'mock_80', title: 'Mock Score 80', requirement: { type: 'mocktest_score', value: 80 } },
  ],
}))

function createTestStore() {
  return create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createProgressSlice(...a),
    ...createLessonSlice(...a),
  }))
}

describe('progressSlice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('addXP', () => {
    it('adds XP to both total and today', () => {
      const store = createTestStore()
      store.getState().addXP(150)

      expect(store.getState().totalXP).toBe(150)
      expect(store.getState().todayXP).toBe(150)
    })

    it('accumulates XP across multiple calls', () => {
      const store = createTestStore()
      store.getState().addXP(100)
      store.getState().addXP(50)
      store.getState().addXP(200)

      expect(store.getState().totalXP).toBe(350)
      expect(store.getState().todayXP).toBe(350)
    })
  })

  describe('incrementStreak', () => {
    it('sets streak to 1 when no previous activity', () => {
      const store = createTestStore()
      store.getState().incrementStreak()

      expect(store.getState().streak).toBe(1)
      expect(store.getState().lastActiveDate).toBe('2026-06-15')
    })

    it('increments streak when last active was yesterday', () => {
      const store = createTestStore()
      // Set yesterday
      store.setState({ streak: 5, lastActiveDate: '2026-06-14' })

      store.getState().incrementStreak()

      expect(store.getState().streak).toBe(6)
      expect(store.getState().lastActiveDate).toBe('2026-06-15')
    })

    it('does not change streak if already active today', () => {
      const store = createTestStore()
      store.setState({ streak: 3, lastActiveDate: '2026-06-15' })

      store.getState().incrementStreak()

      // Streak stays the same since already logged in today
      expect(store.getState().streak).toBe(3)
    })
  })

  describe('resetStreak', () => {
    it('resets streak to 0', () => {
      const store = createTestStore()
      store.setState({ streak: 10 })

      store.getState().resetStreak()
      expect(store.getState().streak).toBe(0)
    })
  })

  describe('toggleChecklistItem', () => {
    it('toggles an item from false to true', () => {
      const store = createTestStore()
      expect(store.getState().todayChecklist.grammar).toBe(false)

      store.getState().toggleChecklistItem('grammar')
      expect(store.getState().todayChecklist.grammar).toBe(true)
    })

    it('toggles an item from true to false', () => {
      const store = createTestStore()
      store.getState().toggleChecklistItem('grammar')
      expect(store.getState().todayChecklist.grammar).toBe(true)

      store.getState().toggleChecklistItem('grammar')
      expect(store.getState().todayChecklist.grammar).toBe(false)
    })

    it('awards XP when completing a task', () => {
      const store = createTestStore()
      expect(store.getState().totalXP).toBe(0)

      store.getState().toggleChecklistItem('vocabulary')

      // Should award 50 XP for completing a task
      expect(store.getState().totalXP).toBe(50)
    })

    it('does not award XP when unchecking', () => {
      const store = createTestStore()
      store.getState().toggleChecklistItem('vocabulary')
      expect(store.getState().totalXP).toBe(50)

      store.getState().toggleChecklistItem('vocabulary')

      // XP should not change when unchecking
      expect(store.getState().totalXP).toBe(50)
    })
  })

  describe('addLearnedWords', () => {
    it('increments totalWordsLearned', () => {
      const store = createTestStore()
      store.getState().addLearnedWords(5)
      expect(store.getState().totalWordsLearned).toBe(5)

      store.getState().addLearnedWords(3)
      expect(store.getState().totalWordsLearned).toBe(8)
    })
  })

  describe('resetDailyProgress', () => {
    it('resets all daily fields to zero', () => {
      const store = createTestStore()
      store.getState().addXP(100)
      store.getState().setTodayMinutes(30)
      store.getState().toggleChecklistItem('reading')

      store.getState().resetDailyProgress()

      const state = store.getState()
      expect(state.todayMinutes).toBe(0)
      expect(state.todayXP).toBe(0)
      expect(state.todayGrammarPct).toBe(0)
      expect(state.todayVocabPct).toBe(0)
      expect(state.todayChecklist.reading).toBe(false)
      // totalXP should not be affected
      expect(state.totalXP).toBe(150) // 100 from addXP + 50 from toggleChecklistItem
    })
  })
})

describe('getPendingStreakMilestones', () => {
  it('returns milestones for achieved streak days', () => {
    const result = getPendingStreakMilestones(7, [])
    expect(result).toHaveLength(2) // 3-day and 7-day
    expect(result[0].days).toBe(3)
    expect(result[1].days).toBe(7)
  })

  it('excludes already claimed milestones', () => {
    const result = getPendingStreakMilestones(14, [3, 7])
    expect(result).toHaveLength(1) // only 14-day
    expect(result[0].days).toBe(14)
  })

  it('returns empty when all milestones claimed', () => {
    const result = getPendingStreakMilestones(90, [3, 7, 14, 21, 30, 60, 90])
    expect(result).toHaveLength(0)
  })

  it('returns empty when streak is 0', () => {
    const result = getPendingStreakMilestones(0, [])
    expect(result).toHaveLength(0)
  })
})

describe('getNextStreakMilestone', () => {
  it('returns next unclaimed milestone after current streak', () => {
    const result = getNextStreakMilestone(2, [])
    expect(result).not.toBeNull()
    expect(result!.days).toBe(3)
    expect(result!.label).toBe('Boshlang\'ich')
  })

  it('returns null when no further milestones', () => {
    const result = getNextStreakMilestone(100, [3, 7, 14, 30, 60, 90])
    expect(result).toBeNull()
  })

  it('returns null when no milestone days exceed the current streak', () => {
    // Streak 90, max milestone is 90 — no milestone with days > 90
    const result = getNextStreakMilestone(90, [3, 7, 14, 30])
    expect(result).toBeNull()
  })
})

describe('claimStreakBonuses', () => {
  it('claims pending milestones and awards XP', () => {
    const store = createTestStore()
    store.setState({ streak: 7 })

    const amounts = store.getState().claimStreakBonuses()

    // 3-day (10 XP) + 7-day (25 XP) = 35 XP
    expect(amounts).toEqual([10, 25])
    expect(store.getState().totalXP).toBe(35)
    expect(store.getState().todayXP).toBe(35)
    expect(store.getState().streakBonusesClaimed).toEqual([3, 7])
  })

  it('returns empty when no pending milestones', () => {
    const store = createTestStore()
    store.setState({ streak: 1 })

    const amounts = store.getState().claimStreakBonuses()
    expect(amounts).toEqual([])
  })

  it('does not double-claim milestones', () => {
    const store = createTestStore()
    store.setState({ streak: 14, streakBonusesClaimed: [3, 7] })

    const amounts = store.getState().claimStreakBonuses()

    // Only 14-day milestone
    expect(amounts).toEqual([50])
    expect(store.getState().totalXP).toBe(50)
    expect(store.getState().streakBonusesClaimed).toEqual([3, 7, 14])
  })
})

describe('setLastMock', () => {
  it('stores mock test result', () => {
    const store = createTestStore()
    const result = { score: 85, level: 'B1' as const, date: '2026-06-15' }

    store.getState().setLastMock(result)
    expect(store.getState().lastMock).toEqual(result)
  })
})

describe('checkAchievements', () => {
  it('unlocks no achievement when only currentDay is set and XP is 0', () => {
    const store = createTestStore()
    store.setState({ currentDay: 1 })

    store.getState().checkAchievements()

    // Mock ACHIEVEMENTS has no 'first_day' type, so nothing should unlock
    expect(store.getState().unlockedAchievements).toHaveLength(0)
  })

  it('unlocks achievement based on XP', () => {
    const store = createTestStore()
    store.setState({ totalXP: 150 })

    store.getState().checkAchievements()

    expect(store.getState().unlockedAchievements).toContain('xp_100')
  })

  it('unlocks achievement based on streak', () => {
    const store = createTestStore()
    store.setState({ streak: 5 })

    store.getState().checkAchievements()

    expect(store.getState().unlockedAchievements).toContain('streak_3')
  })

  it('unlocks achievement based on totalWordsLearned', () => {
    const store = createTestStore()
    store.setState({ totalWordsLearned: 15 })

    store.getState().checkAchievements()

    expect(store.getState().unlockedAchievements).toContain('words_10')
  })

  it('does not re-unlock already earned achievements', () => {
    const store = createTestStore()
    store.setState({ unlockedAchievements: ['xp_100'], totalXP: 150 })

    store.getState().checkAchievements()

    // Should still only have 1 achievement (no new ones)
    expect(store.getState().unlockedAchievements).toHaveLength(1)
  })

  it('sets lastUnlockedAchievement when new achievement is earned', () => {
    const store = createTestStore()
    store.setState({ totalXP: 100 })

    store.getState().checkAchievements()

    // xp_100 is the only mock achievement with type: 'xp'
    expect(store.getState().lastUnlockedAchievement).toBe('xp_100')
  })
})
