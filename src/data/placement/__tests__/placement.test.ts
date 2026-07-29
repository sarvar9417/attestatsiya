import { test, expect, describe } from 'vitest'
import { PLACEMENT_QUESTIONS, BAND_ORDER, TOTAL_PLACEMENT_QUESTIONS } from '../index'
import {
  createSession, pickNextQuestion, applyAnswer, isComplete, computeResult,
  PLACEMENT_TEST_LENGTH,
} from '../adaptive'
import type { PlacementQuestion } from '../types'

// ── Kontent auditi ──
describe('savol banki', () => {
  test('25 ta savol, har band 5 ta', () => {
    expect(TOTAL_PLACEMENT_QUESTIONS).toBe(25)
    for (const band of BAND_ORDER) {
      expect(PLACEMENT_QUESTIONS.filter(q => q.band === band).length).toBe(5)
    }
  })

  test('id lar noyob', () => {
    const ids = PLACEMENT_QUESTIONS.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('har savol 4 variant va to\'g\'ri indeks 0..3', () => {
    for (const q of PLACEMENT_QUESTIONS) {
      expect(q.options.length).toBe(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(q.options.length)
      expect(q.question.trim().length).toBeGreaterThan(0)
    }
  })

  test('o\'zbekcha izohlarda kirill yo\'q', () => {
    const cyr = /[Ѐ-ӿ]/
    for (const q of PLACEMENT_QUESTIONS) {
      expect(cyr.test(q.explanation ?? ''), q.id).toBe(false)
    }
  })
})

// ── Adaptiv mantiq ──
function runTest(answer: (q: PlacementQuestion) => boolean) {
  let s = createSession()
  while (!isComplete(s)) {
    const q = pickNextQuestion(s)
    if (!q) break
    s = applyAnswer(s, q, answer(q))
  }
  return { result: computeResult(s), session: s }
}

describe('adaptiv test', () => {
  test('hammasi to\'g\'ri → B2', () => {
    const { result, session } = runTest(() => true)
    expect(session.asked).toBe(PLACEMENT_TEST_LENGTH)
    expect(result.level).toBe('B2')
  })

  test('hammasi noto\'g\'ri → A2+ (pol)', () => {
    const { result } = runTest(() => false)
    expect(result.level).toBe('A2+')
  })

  test('B1 gacha to\'g\'ri, undan yuqori noto\'g\'ri → B1', () => {
    const maxB1 = BAND_ORDER.indexOf('B1')
    const { result } = runTest(q => BAND_ORDER.indexOf(q.band) <= maxB1)
    expect(result.level).toBe('B1')
  })

  test('savol takrorlanmaydi', () => {
    const { session } = runTest(() => Math.random() > 0.5)
    expect(new Set(session.askedIds).size).toBe(session.askedIds.length)
  })
})
