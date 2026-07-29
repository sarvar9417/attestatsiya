// ═══════════════════════════════════════════════════════════════════════════
// battleService.test.ts — Vocab/duel savollarini qurish testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance, mockGrammar, mockReading, mockSpeaking } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn() } as Record<string, unknown>,
  mockGrammar: vi.fn(),
  mockReading: vi.fn(),
  mockSpeaking: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../data/duelQuestions', () => ({
  getGrammarQuestions: mockGrammar,
  getReadingQuestions: mockReading,
  getSpeakingPrompt: mockSpeaking,
}))

import { buildQB } from '../../test/supabaseMock'
import { fetchBattleQuestions, fetchBattleQuestionsByMode } from '../battleService'

beforeEach(() => {
  mockSupabaseInstance.from.mockReset()
})
afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
}

describe('fetchBattleQuestions (vocab)', () => {
  it('returns [] when no words for level', async () => {
    queueQB([], null)           // correct words → empty
    const qs = await fetchBattleQuestions('A1', 5)
    expect(qs).toEqual([])
  })

  it('returns [] on DB error', async () => {
    queueQB(null, { message: 'db down' })
    const qs = await fetchBattleQuestions('A1', 5)
    expect(qs).toEqual([])
  })

  it('builds questions where options[correct] equals the right uzbek', async () => {
    queueQB([
      { id: 1, english: 'cat', uzbek: 'mushuk' },
      { id: 2, english: 'dog', uzbek: 'it' },
    ])
    queueQB([{ uzbek: 'olma' }, { uzbek: 'non' }, { uzbek: 'suv' }]) // distractors

    const qs = await fetchBattleQuestions('A1', 10)
    expect(qs).toHaveLength(2)
    for (const q of qs) {
      expect(q.options).toHaveLength(4)            // 1 correct + 3 distractor
      expect(q.options[q.correct]).toBe(q.uzbek)   // invariant (shuffle'dan mustaqil)
      expect(new Set(q.options).size).toBe(4)      // takror option yo'q
    }
  })

  it('respects count limit', async () => {
    queueQB([
      { id: 1, english: 'a', uzbek: 'a-uz' },
      { id: 2, english: 'b', uzbek: 'b-uz' },
      { id: 3, english: 'c', uzbek: 'c-uz' },
    ])
    queueQB([{ uzbek: 'x' }, { uzbek: 'y' }, { uzbek: 'z' }])
    const qs = await fetchBattleQuestions('A1', 2)
    expect(qs).toHaveLength(2)
  })

  it('pads with ??? when not enough distractors', async () => {
    queueQB([{ id: 1, english: 'cat', uzbek: 'mushuk' }])
    queueQB([]) // distraktorlar yo'q
    const qs = await fetchBattleQuestions('A1', 1)
    expect(qs[0].options).toHaveLength(4)
    expect(qs[0].options.filter(o => o === '???').length).toBe(3)
    expect(qs[0].options[qs[0].correct]).toBe('mushuk')
  })
})

describe('fetchBattleQuestionsByMode (dispatch)', () => {
  it('vocab mode → words table', async () => {
    queueQB([{ id: 1, english: 'cat', uzbek: 'mushuk' }])
    queueQB([{ uzbek: 'olma' }, { uzbek: 'non' }, { uzbek: 'suv' }])
    const { questions } = await fetchBattleQuestionsByMode('A1', 5, 'vocab')
    expect(questions).toHaveLength(1)
    expect(questions[0].english).toBe('cat')
  })

  it('grammar mode → duelQuestions pool', async () => {
    mockGrammar.mockReturnValue([{ id: 7, english: 'She ___ happy', options: ['is', 'are'], correct: 0 }])
    const { questions } = await fetchBattleQuestionsByMode('B1', 5, 'grammar')
    expect(mockGrammar).toHaveBeenCalledWith('B1', 5)
    expect(questions[0].id).toBe(7)
    expect(questions[0].correct).toBe(0)
  })

  it('reading mode → passage + questions', async () => {
    mockReading.mockReturnValue({
      passage: 'A short story.',
      questions: [{ id: 1, english: 'What?', options: ['a', 'b'], correct: 1 }],
    })
    const res = await fetchBattleQuestionsByMode('B2', 4, 'reading')
    expect(res.passage).toBe('A short story.')
    expect(res.questions[0].correct).toBe(1)
  })

  it('speaking mode → single prompt question', async () => {
    mockSpeaking.mockReturnValue({ prompt: 'Describe your day', tips: ['use past tense'] })
    const res = await fetchBattleQuestionsByMode('B1', 1, 'speaking')
    expect(res.questions).toHaveLength(1)
    expect(res.questions[0].english).toBe('Describe your day')
    expect(res.passage).toContain('past tense')
  })
})
