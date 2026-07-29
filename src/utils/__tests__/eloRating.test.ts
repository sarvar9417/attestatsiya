import { describe, it, expect } from 'vitest'
import {
  calculateElo,
  getKFactor,
  duelScoreToEloScore,
  getEloTier,
  getEloTierInfo,
  getEloToNextTier,
  INITIAL_ELO,
  ELO_TIERS,
} from '../eloRating'

describe('eloRating', () => {
  describe('INITIAL_ELO', () => {
    it('is 1000', () => {
      expect(INITIAL_ELO).toBe(1000)
    })
  })

  describe('getKFactor', () => {
    it('returns 32 for ratings below 1000', () => {
      expect(getKFactor(0)).toBe(32)
      expect(getKFactor(500)).toBe(32)
      expect(getKFactor(999)).toBe(32)
    })
    it('returns 24 for ratings 1000–1999', () => {
      expect(getKFactor(1000)).toBe(24)
      expect(getKFactor(1500)).toBe(24)
      expect(getKFactor(1999)).toBe(24)
    })
    it('returns 16 for ratings 2000+', () => {
      expect(getKFactor(2000)).toBe(16)
      expect(getKFactor(3000)).toBe(16)
    })
  })

  describe('calculateElo', () => {
    it('equal ratings + draw → no change', () => {
      const r = calculateElo(1000, 1000, 0.5, 0.5)
      expect(r.changeA).toBe(0)
      expect(r.changeB).toBe(0)
      expect(r.playerA).toBe(1000)
      expect(r.playerB).toBe(1000)
    })

    it('lower rated player wins → big gain', () => {
      const r = calculateElo(800, 1200, 1, 0)
      expect(r.changeA).toBeGreaterThan(0)
      expect(r.changeB).toBeLessThan(0)
      expect(r.playerA).toBe(800 + r.changeA)
    })

    it('higher rated player wins → small gain', () => {
      const r = calculateElo(1400, 1000, 1, 0)
      expect(r.changeA).toBeGreaterThan(0)
      expect(r.changeA).toBeLessThan(30)
    })

    it('ratings never go below 0', () => {
      const r = calculateElo(10, 2000, 0, 1)
      expect(r.playerA).toBeGreaterThanOrEqual(0)
    })
  })

  describe('duelScoreToEloScore', () => {
    it('returns win/loss for clear winner', () => {
      expect(duelScoreToEloScore(100, 80)).toEqual({ my: 1, their: 0 })
      expect(duelScoreToEloScore(50, 90)).toEqual({ my: 0, their: 1 })
    })
    it('returns draw for equal scores', () => {
      expect(duelScoreToEloScore(75, 75)).toEqual({ my: 0.5, their: 0.5 })
    })
  })

  describe('getEloTier', () => {
    it('returns correct tiers for boundary values', () => {
      expect(getEloTier(0)).toBe('bronze')
      expect(getEloTier(999)).toBe('bronze')
      expect(getEloTier(1000)).toBe('silver')
      expect(getEloTier(1200)).toBe('gold')
      expect(getEloTier(1400)).toBe('platinum')
      expect(getEloTier(1600)).toBe('diamond')
      expect(getEloTier(1800)).toBe('master')
      expect(getEloTier(2000)).toBe('grandmaster')
    })
  })

  describe('getEloTierInfo', () => {
    it('returns tier info with label and emoji', () => {
      const info = getEloTierInfo(1500)
      expect(info.tier).toBe('platinum')
      expect(info.label).toBe('Platinum')
      expect(info.emoji).toBe('💎')
    })
  })

  describe('getEloToNextTier', () => {
    it('returns progress within current tier', () => {
      const result = getEloToNextTier(1100)
      expect(result.nextTier).toBe('Gold')
      expect(result.pointsNeeded).toBe(100)
      expect(result.progress).toBeGreaterThan(0)
      expect(result.progress).toBeLessThanOrEqual(100)
    })
    it('returns 100% for grandmaster', () => {
      const result = getEloToNextTier(2500)
      expect(result.progress).toBe(100)
      expect(result.pointsNeeded).toBe(0)
    })
  })

  describe('ELO_TIERS', () => {
    it('has 7 tiers in order', () => {
      expect(ELO_TIERS).toHaveLength(7)
      for (let i = 1; i < ELO_TIERS.length; i++) {
        expect(ELO_TIERS[i].min).toBeGreaterThan(ELO_TIERS[i - 1].min)
      }
    })
  })
})
