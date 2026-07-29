import { describe, it, expect, vi, beforeEach } from 'vitest'
import { feelAnswer, feelLevelUp, feelStreakMilestone, feelCombo, feelXpTick, feelTap, rollCritical } from '../gameFeel'

vi.mock('../sfx', () => ({
  playSfx: vi.fn(),
}))

vi.mock('../haptics', () => ({
  hapticFeedback: vi.fn(),
}))

describe('gameFeel', () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe('feelAnswer', () => {
    it('plays correct sfx + light haptic for correct answer', async () => {
      const { playSfx } = await import('../sfx')
      const { hapticFeedback } = await import('../haptics')
      feelAnswer({ correct: true })
      expect(playSfx).toHaveBeenCalledWith('correct')
      expect(hapticFeedback).toHaveBeenCalledWith('light')
    })

    it('plays combo sfx for combo >= 3', async () => {
      const { playSfx } = await import('../sfx')
      feelAnswer({ correct: true, combo: 3 })
      expect(playSfx).toHaveBeenCalledWith('combo')
    })

    it('plays wrong sfx + medium haptic for wrong answer', async () => {
      const { playSfx } = await import('../sfx')
      const { hapticFeedback } = await import('../haptics')
      feelAnswer({ correct: false })
      expect(playSfx).toHaveBeenCalledWith('wrong')
      expect(hapticFeedback).toHaveBeenCalledWith('medium')
    })

    it('uses heavy haptic for critical answers', async () => {
      const { hapticFeedback } = await import('../haptics')
      feelAnswer({ correct: true, critical: true })
      expect(hapticFeedback).toHaveBeenCalledWith('heavy')
    })
  })

  describe('feelLevelUp', () => {
    it('plays levelup sfx + heavy haptic', async () => {
      const { playSfx } = await import('../sfx')
      const { hapticFeedback } = await import('../haptics')
      feelLevelUp()
      expect(playSfx).toHaveBeenCalledWith('levelup')
      expect(hapticFeedback).toHaveBeenCalledWith('heavy')
    })
  })

  describe('feelStreakMilestone', () => {
    it('plays milestone sfx', async () => {
      const { playSfx } = await import('../sfx')
      feelStreakMilestone(5)
      expect(playSfx).toHaveBeenCalledWith('milestone')
    })

    it('plays streak-burn for 7+ day streaks', async () => {
      vi.useFakeTimers()
      const { playSfx } = await import('../sfx')
      feelStreakMilestone(7)
      vi.advanceTimersByTime(500)
      expect(playSfx).toHaveBeenCalledWith('streak-burn')
      vi.useRealTimers()
    })
  })

  describe('feelCombo', () => {
    it('plays combo sfx for combo >= 2', async () => {
      const { playSfx } = await import('../sfx')
      feelCombo(2)
      expect(playSfx).toHaveBeenCalledWith('combo')
    })

    it('does nothing for combo < 2', async () => {
      const { playSfx } = await import('../sfx')
      feelCombo(1)
      expect(playSfx).not.toHaveBeenCalled()
    })
  })

  describe('feelXpTick', () => {
    it('plays xp-tick sfx', async () => {
      const { playSfx } = await import('../sfx')
      feelXpTick()
      expect(playSfx).toHaveBeenCalledWith('xp-tick')
    })
  })

  describe('feelTap', () => {
    it('triggers light haptic', async () => {
      const { hapticFeedback } = await import('../haptics')
      feelTap()
      expect(hapticFeedback).toHaveBeenCalledWith('light')
    })
  })

  describe('rollCritical', () => {
    it('returns a boolean', () => {
      const result = rollCritical()
      expect(typeof result).toBe('boolean')
    })
  })
})
