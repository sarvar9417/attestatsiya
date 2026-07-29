import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkSpeakingAchievements } from '../speakingAchievementService'

vi.mock('../speakingPathService', () => ({
  getSpeakingProgress: vi.fn(),
  loadSrsMap: vi.fn(),
}))

vi.mock('../../data/achievements', () => ({
  ACHIEVEMENTS: [
    { id: 'first_day', category: 'speaking', requirement: { type: 'speaking_days', value: 1 } },
    { id: 'five_days', category: 'speaking', requirement: { type: 'speaking_days', value: 5 } },
    { id: 'ten_days', category: 'speaking', requirement: { type: 'speaking_days', value: 10 } },
    { id: 'streak_3', category: 'speaking', requirement: { type: 'speaking_streak', value: 3 } },
    { id: 'perfect_score', category: 'speaking', requirement: { type: 'speaking_perfect_day', value: 90 } },
    { id: 'vocab_achievement', category: 'vocabulary', requirement: { type: 'words_learned', value: 10 } },
  ],
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

describe('speakingAchievementService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkSpeakingAchievements', () => {
    it('returns empty when no achievements earned', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 0,
        streakDays: 0,
        chunksMastered: 0,
        bestSpeakScore: 0,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).toEqual([])
    })

    it('unlocks first_day when completedCount >= 1', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 1,
        streakDays: 0,
        chunksMastered: 0,
        bestSpeakScore: 50,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).toContain('first_day')
    })

    it('unlocks five_days when completedCount >= 5', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 5,
        streakDays: 0,
        chunksMastered: 0,
        bestSpeakScore: 50,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).toContain('five_days')
    })

    it('does not re-unlock already unlocked achievements', async () => {
      const result = await checkSpeakingAchievements('user1', ['first_day'], {
        completedCount: 5,
        streakDays: 0,
        chunksMastered: 0,
        bestSpeakScore: 50,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).not.toContain('first_day')
      expect(result.newlyUnlocked).toContain('five_days')
    })

    it('unlocks streak achievement', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 10,
        streakDays: 3,
        chunksMastered: 0,
        bestSpeakScore: 50,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).toContain('streak_3')
    })

    it('unlocks perfect_score when bestSpeakScore >= 90', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 1,
        streakDays: 0,
        chunksMastered: 0,
        bestSpeakScore: 95,
        cefr: 'A0',
      })
      expect(result.newlyUnlocked).toContain('perfect_score')
    })

    it('does not unlock non-speaking achievements', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 100,
        streakDays: 100,
        chunksMastered: 100,
        bestSpeakScore: 100,
        cefr: 'B2',
      })
      expect(result.newlyUnlocked).not.toContain('vocab_achievement')
    })

    it('returns correct progress stats', async () => {
      const result = await checkSpeakingAchievements('user1', [], {
        completedCount: 7,
        streakDays: 5,
        chunksMastered: 20,
        bestSpeakScore: 85,
        cefr: 'A1',
      })
      expect(result.progress.daysCompleted).toBe(7)
      expect(result.progress.speakingStreak).toBe(5)
      expect(result.progress.chunksMastered).toBe(20)
      expect(result.progress.bestSpeakScore).toBe(85)
      expect(result.progress.cefr).toBe('A1')
    })
  })
})
