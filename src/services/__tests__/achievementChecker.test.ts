import { describe, it, expect } from 'vitest'
import { evaluateAchievements } from '../achievementChecker'
import type { MockResult } from '../store/types'

const baseState = {
  currentDay: 1,
  totalXP: 0,
  streak: 0,
  totalWordsLearned: 0,
  lastMock: null as MockResult | null,
  unlockedAchievements: [] as string[],
}

const achievements = [
  { id: 'day7', requirement: { type: 'day', value: 7 } },
  { id: 'xp100', requirement: { type: 'xp', value: 100 } },
  { id: 'streak14', requirement: { type: 'streak', value: 14 } },
  { id: 'words50', requirement: { type: 'words', value: 50 } },
  { id: 'mockdone', requirement: { type: 'mocktest', value: 0 } },
  { id: 'mock80', requirement: { type: 'mocktest_score', value: 80 } },
  { id: 'games10', requirement: { type: 'games', value: 10 } },
]

describe('evaluateAchievements', () => {
  it('returns empty when nothing earned', () => {
    expect(evaluateAchievements(achievements, baseState)).toEqual([])
  })

  it('unlocks day achievement when currentDay >= value', () => {
    expect(evaluateAchievements(achievements, { ...baseState, currentDay: 7 })).toEqual(['day7'])
  })

  it('unlocks xp achievement when totalXP >= value', () => {
    expect(evaluateAchievements(achievements, { ...baseState, totalXP: 100 })).toEqual(['xp100'])
  })

  it('unlocks streak achievement when streak >= value', () => {
    expect(evaluateAchievements(achievements, { ...baseState, streak: 14 })).toEqual(['streak14'])
  })

  it('unlocks words achievement when totalWordsLearned >= value', () => {
    expect(evaluateAchievements(achievements, { ...baseState, totalWordsLearned: 50 })).toEqual(['words50'])
  })

  it('unlocks mocktest achievement when lastMock is not null', () => {
    expect(evaluateAchievements(achievements, {
      ...baseState,
      lastMock: { score: 60, totalQuestions: 10, correctAnswers: 6 },
    })).toEqual(['mockdone'])
  })

  it('unlocks mocktest_score when score >= value', () => {
    expect(evaluateAchievements(achievements, {
      ...baseState,
      lastMock: { score: 80, totalQuestions: 10, correctAnswers: 8 },
    })).toEqual(['mockdone', 'mock80'])
  })

  it('does not re-unlock already unlocked achievements', () => {
    expect(evaluateAchievements(achievements, {
      ...baseState,
      currentDay: 7,
      unlockedAchievements: ['day7'],
    })).toEqual([])
  })

  it('unlocks multiple achievements at once', () => {
    expect(evaluateAchievements(achievements, {
      ...baseState,
      currentDay: 7,
      totalXP: 100,
      streak: 14,
      totalWordsLearned: 50,
    })).toEqual(['day7', 'xp100', 'streak14', 'words50'])
  })

  it('games achievement is not yet tracked (returns empty)', () => {
    expect(evaluateAchievements(achievements, baseState)).toEqual([])
  })

  it('returns deduplicated results', () => {
    const dupeAchievements = [
      { id: 'day7', requirement: { type: 'day', value: 7 } },
      { id: 'day7', requirement: { type: 'day', value: 7 } },
    ]
    expect(evaluateAchievements(dupeAchievements, { ...baseState, currentDay: 7 })).toEqual(['day7'])
  })

  it('returns only new achievements (not in unlockedAchievements)', () => {
    expect(evaluateAchievements(achievements, {
      ...baseState,
      currentDay: 10,
      totalXP: 200,
      unlockedAchievements: ['day7'],
    })).toEqual(['xp100'])
  })
})
