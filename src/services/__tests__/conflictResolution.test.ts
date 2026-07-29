// ═══════════════════════════════════════════════════════════════════════════
// conflictResolution.test.ts — Smart merge strategiyalari testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import {
  mergeMax,
  mergeSum,
  mergeByTimestamp,
  mergeObjects,
  mergeSectionProgress,
  mergeArrayUnion,
  mergeRecordMax,
  mergeUserState,
  mergeLessonProgress,
  mergeVocabProgress,
  mergeDailyProgress,
  mergeLessonSession,
  shouldSkipUpsertForScore,
} from '../conflictResolution'

// ═══════════════════════════════════════════════════════════════════════════
//  mergeMax
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeMax', () => {
  it('returns the larger of two numbers', () => {
    expect(mergeMax(5, 10)).toBe(10)
    expect(mergeMax(10, 5)).toBe(10)
    expect(mergeMax(0, -5)).toBe(0)
    expect(mergeMax(-1, -10)).toBe(-1)
  })

  it('returns same value when both equal', () => {
    expect(mergeMax(7, 7)).toBe(7)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeSum
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeSum', () => {
  it('adds two numbers', () => {
    expect(mergeSum(5, 10)).toBe(15)
    expect(mergeSum(0, 0)).toBe(0)
    expect(mergeSum(-5, 3)).toBe(-2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeByTimestamp
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeByTimestamp', () => {
  it('returns remote when remote timestamp is newer', () => {
    expect(mergeByTimestamp('local', 'remote', 100, 200)).toBe('remote')
  })

  it('returns local when local timestamp is newer', () => {
    expect(mergeByTimestamp('local', 'remote', 300, 200)).toBe('local')
  })

  it('returns remote when timestamps are equal (remote wins tie)', () => {
    expect(mergeByTimestamp('local', 'remote', 100, 100)).toBe('remote')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeObjects
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeObjects', () => {
  it('merges two flat objects with remote keys overriding local', () => {
    const local = { name: 'Alice', age: 25 }
    const remote = { name: 'Bob', city: 'NYC' }
    const result = mergeObjects(local, remote)
    expect(result).toEqual({ name: 'Bob', age: 25, city: 'NYC' })
  })

  it('takes max for numeric keys listed in numericKeys', () => {
    const local = { totalXP: 100, streak: 5, name: 'Alice' }
    const remote = { totalXP: 80, streak: 10, name: 'Bob' }
    const result = mergeObjects(local, remote, ['totalXP', 'streak'])
    expect(result.totalXP).toBe(100)  // local 100 > remote 80
    expect(result.streak).toBe(10)    // remote 10 > local 5
    expect(result.name).toBe('Bob')   // remote wins for non-numeric
  })

  it('does not add numeric keys absent from both sides', () => {
    const local = { totalXP: 50 }
    const remote = { name: 'Test' }
    const result = mergeObjects(local, remote, ['totalXP', 'missingKey'])
    expect(result.totalXP).toBe(50)
    // missingKey not in either side — should NOT be added to result
    expect((result as Record<string, unknown>).missingKey).toBeUndefined()
  })

  it('handles boolean keys with OR logic', () => {
    const local = { onboardingComplete: true, notificationsEnabled: false }
    const remote = { onboardingComplete: false, notificationsEnabled: true }
    const result = mergeObjects(local, remote, [], ['onboardingComplete', 'notificationsEnabled'])
    expect(result.onboardingComplete).toBe(true)   // true || false
    expect(result.notificationsEnabled).toBe(true) // false || true
  })

  it('returns remote keys not present in local', () => {
    const local = { a: 1 }
    const remote = { a: 2, b: 3, c: 4 }
    const result = mergeObjects(local, remote)
    expect(result).toEqual({ a: 2, b: 3, c: 4 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeSectionProgress
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeSectionProgress', () => {
  it('merges two section maps, taking max per section', () => {
    const local = { 0: 50, 1: 80, 2: 90 }
    const remote = { 0: 70, 1: 60, 3: 100 }
    const result = mergeSectionProgress(local, remote)
    expect(result[0]).toBe(70)   // remote 70 > local 50
    expect(result[1]).toBe(80)   // local 80 > remote 60
    expect(result[2]).toBe(90)   // local only
    expect(result[3]).toBe(100)  // remote only
  })

  it('returns local when remote is empty', () => {
    const local = { 0: 100, 1: 50 }
    expect(mergeSectionProgress(local, {})).toEqual({ 0: 100, 1: 50 })
  })

  it('returns remote when local is empty', () => {
    const remote = { 0: 100, 1: 50 }
    expect(mergeSectionProgress({}, remote)).toEqual({ 0: 100, 1: 50 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeArrayUnion
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeArrayUnion', () => {
  it('creates a unique union of two arrays', () => {
    expect(mergeArrayUnion([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4])
  })

  it('handles empty arrays', () => {
    expect(mergeArrayUnion([], [1, 2])).toEqual([1, 2])
    expect(mergeArrayUnion([1, 2], [])).toEqual([1, 2])
  })

  it('handles string arrays', () => {
    expect(mergeArrayUnion(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeRecordMax
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeRecordMax', () => {
  it('merges two records taking max per key', () => {
    const local = { score1: 80, score2: 90 }
    const remote = { score1: 95, score3: 70 }
    expect(mergeRecordMax(local, remote)).toEqual({ score1: 95, score2: 90, score3: 70 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeUserState
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeUserState', () => {
  it('merges user state with max for numeric fields', () => {
    const local = {
      totalXP: 500,
      streak: 10,
      totalWordsLearned: 100,
      userName: 'Alice',
      onboardingComplete: true,
    }
    const remote = {
      totalXP: 300,
      streak: 15,
      totalWordsLearned: 120,
      userName: 'Bob',
      onboardingComplete: false,
    }
    const result = mergeUserState({ local, remote })
    expect(result.totalXP).toBe(500)       // max
    expect(result.streak).toBe(15)         // max
    expect(result.totalWordsLearned).toBe(120) // max
    expect(result.userName).toBe('Bob')    // remote wins for non-numeric
    expect(result.onboardingComplete).toBe(true) // true || false
  })

  it('adds remote keys not present in local', () => {
    const local = { totalXP: 100 }
    const remote = { totalXP: 80, todayMinutes: 30 }
    const result = mergeUserState({ local, remote })
    expect(result.totalXP).toBe(100) // local wins
    expect(result.todayMinutes).toBe(30) // from remote
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeLessonProgress
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeLessonProgress', () => {
  it('merges lesson progress taking max for all fields', () => {
    const result = mergeLessonProgress({
      localScore: 80,
      remoteScore: 90,
      localCorrectCount: 8,
      remoteCorrectCount: 7,
      localTotalExercises: 10,
      remoteTotalExercises: 10,
      localXpEarned: 80,
      remoteXpEarned: 90,
      localCompletedAt: 1000,
      remoteCompletedAt: 2000,
    })
    expect(result.score).toBe(90)
    expect(result.correctCount).toBe(8)
    expect(result.totalExercises).toBe(10)
    expect(result.xpEarned).toBe(90)
    expect(result.completedAt).toBe(2000)
  })

  it('handles equal values', () => {
    const result = mergeLessonProgress({
      localScore: 100, remoteScore: 100,
      localCorrectCount: 10, remoteCorrectCount: 10,
      localTotalExercises: 10, remoteTotalExercises: 10,
      localXpEarned: 100, remoteXpEarned: 100,
      localCompletedAt: 5000, remoteCompletedAt: 5000,
    })
    expect(result).toEqual({ score: 100, correctCount: 10, totalExercises: 10, xpEarned: 100, completedAt: 5000 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeVocabProgress
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeVocabProgress', () => {
  it('merges vocabulary progress taking max per field', () => {
    const result = mergeVocabProgress({
      localBox: 2,
      remoteBox: 5,
      localCorrectCount: 10,
      remoteCorrectCount: 8,
      localWrongCount: 3,
      remoteWrongCount: 5,
    })
    expect(result.box).toBe(5)        // higher SRS box
    expect(result.correctCount).toBe(10) // max
    expect(result.wrongCount).toBe(5)    // max
  })

  it('handles local having higher box', () => {
    const result = mergeVocabProgress({
      localBox: 7, remoteBox: 3,
      localCorrectCount: 20, remoteCorrectCount: 15,
      localWrongCount: 2, remoteWrongCount: 4,
    })
    expect(result.box).toBe(7)
    expect(result.correctCount).toBe(20)
    expect(result.wrongCount).toBe(4)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeDailyProgress
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeDailyProgress', () => {
  it('merges daily progress taking max per field', () => {
    const result = mergeDailyProgress({
      localMinutes: 30,
      remoteMinutes: 45,
      localXp: 100,
      remoteXp: 80,
      localGrammarPct: 70,
      remoteGrammarPct: 80,
      localVocabPct: 90,
      remoteVocabPct: 85,
      localListeningPct: 60,
      remoteListeningPct: 50,
      localWritingPct: 40,
      remoteWritingPct: 60,
      localStreak: 10,
      remoteStreak: 12,
    })
    expect(result.totalMinutes).toBe(45)
    expect(result.xpEarned).toBe(100)
    expect(result.grammarPct).toBe(80)
    expect(result.vocabPct).toBe(90)
    expect(result.listeningPct).toBe(60)
    expect(result.writingPct).toBe(60)
    expect(result.streak).toBe(12)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  mergeLessonSession
// ═══════════════════════════════════════════════════════════════════════════

describe('mergeLessonSession', () => {
  it('merges session with latest tab/section and merged progress', () => {
    const result = mergeLessonSession({
      localTab: 'theory',
      remoteTab: 'exercise',
      localCurrentSection: 1,
      remoteCurrentSection: 2,
      localTestSection: 0,
      remoteTestSection: 1,
      localCompletedSections: { 0: 80, 1: 90 },
      remoteCompletedSections: { 1: 70, 2: 100 },
      localCompletedTestSections: { 0: 50 },
      remoteCompletedTestSections: { 0: 60, 1: 80 },
      localUpdatedAt: 100,
      remoteUpdatedAt: 200,
    })
    // remote timestamp is newer → uses remote tab/section
    expect(result.tab).toBe('exercise')
    expect(result.currentSection).toBe(2)
    expect(result.testSection).toBe(1)
    // completedSections merged: max per section
    expect(result.completedSections).toEqual({ 0: 80, 1: 90, 2: 100 })
    expect(result.completedTestSections).toEqual({ 0: 60, 1: 80 })
    expect(result.updatedAt).toBe(200)
  })

  it('uses local when local timestamp is newer', () => {
    const result = mergeLessonSession({
      localTab: 'theory',
      remoteTab: 'exercise',
      localCurrentSection: 1,
      remoteCurrentSection: 2,
      localTestSection: 0,
      remoteTestSection: 1,
      localCompletedSections: { 0: 80 },
      remoteCompletedSections: { 1: 100 },
      localCompletedTestSections: {},
      remoteCompletedTestSections: {},
      localUpdatedAt: 300,
      remoteUpdatedAt: 200,
    })
    expect(result.tab).toBe('theory')
    expect(result.currentSection).toBe(1)
    // Progress still merged even if local wins
    expect(result.completedSections).toEqual({ 0: 80, 1: 100 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
//  shouldSkipUpsertForScore
// ═══════════════════════════════════════════════════════════════════════════

describe('shouldSkipUpsertForScore', () => {
  it('returns true when local score >= remote score', () => {
    expect(shouldSkipUpsertForScore(80, 70)).toBe(true)
    expect(shouldSkipUpsertForScore(100, 100)).toBe(true)
  })

  it('returns false when local score < remote score', () => {
    expect(shouldSkipUpsertForScore(60, 90)).toBe(false)
  })

  it('returns false when local is null/undefined', () => {
    expect(shouldSkipUpsertForScore(null, 80)).toBe(false)
    expect(shouldSkipUpsertForScore(undefined, 80)).toBe(false)
  })

  it('returns false when remote is undefined', () => {
    expect(shouldSkipUpsertForScore(80, undefined)).toBe(false)
  })
})
