import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { fetchMockTestData, pctToBand, scoreToBand, roundBand } from '../mockTestService'
import { B1_QUESTIONS, B2_QUESTIONS } from '../../data/mockTestData'

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = { from: vi.fn(), rpc: vi.fn() }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

import { buildQB } from '../../test/supabaseMock'

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchMockTestData — integration-level (calls 3 sub-functions)
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchMockTestData', () => {
  it('fetches questions, listening, writing from supabase and combines them', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    // fetchQuestions — mocktest_questions
    qb1.setResult([
      { data: { id: 100, level: 'B1', section: 'grammar', q: 'Test?', opts: ['a','b','c','d'], ans: 0 } },
    ], null)

    // fetchListening — mocktest_listening
    qb2.setResult({
      data: {
        text: 'Listening passage',
        mcq: [{ id: 1, q: 'Question?', opts: ['a','b','c','d'] as [string,string,string,string], ans: 0 }],
      },
    }, null)

    // fetchWriting — mocktest_writing
    qb3.setResult({
      id: 'ielts-writing',
      data: {
        writingTask1: { prompt: 'Task 1', instruction: 'Describe chart' },
        writingTask2: { prompt: 'Task 2', instruction: 'Write essay' },
      },
    }, null)

    // Return different qb for each table name
    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const result = await fetchMockTestData('B1')

    expect(result.questions).toHaveLength(1)
    expect(result.questions[0].id).toBe(100)
    expect(result.listeningText).toBe('Listening passage')
    expect(result.listeningMCQ).toHaveLength(1)
    expect(result.writingTask1.prompt).toBe('Task 1')
    expect(result.writingTask2.prompt).toBe('Task 2')
  })

  it('falls back to local data when supabase returns error', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    qb1.setResult(null, new Error('DB error'))
    qb2.setResult(null, new Error('DB error'))
    qb3.setResult(null, new Error('DB error'))

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const result = await fetchMockTestData('B1')

    // All should fall back to local data
    expect(result.questions).toEqual(B1_QUESTIONS)
    expect(result.listeningText).toBeTruthy()
    expect(result.listeningMCQ).toHaveLength(8)
    expect(result.writingTask1.prompt).toBeTruthy()
    expect(result.writingTask2.prompt).toBeTruthy()
  })

  it('uses B2 local questions for level B2', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    qb1.setResult(null, new Error('DB error'))
    qb2.setResult(null, new Error('DB error'))
    qb3.setResult(null, new Error('DB error'))

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const result = await fetchMockTestData('B2')

    expect(result.questions).toEqual(B2_QUESTIONS)
  })

  it('handles empty listening data gracefully', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    qb1.setResult([], null)
    qb2.setResult(null, null) // no data
    qb3.setResult(null, new Error('DB error'))

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const result = await fetchMockTestData('B1')

    // questions empty → fallback to local B1
    expect(result.questions).toEqual(B1_QUESTIONS)
    // listening null → fallback to local
    expect(result.listeningText).toBeTruthy()
    // writing error → fallback to local
    expect(result.writingTask1.prompt).toBeTruthy()
  })

  it('uses A2 local questions for level A2 on DB error', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    qb1.setResult(null, new Error('DB error'))
    qb2.setResult(null, new Error('DB error'))
    qb3.setResult(null, new Error('DB error'))

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const { A2_QUESTIONS } = await import('../../data/mockTestData')
    const result = await fetchMockTestData('A2')

    expect(result.questions).toEqual(A2_QUESTIONS)
  })

  it('handles listening data without nested data property', async () => {
    const qb1 = buildQB()
    const qb2 = buildQB()
    const qb3 = buildQB()

    // DB returns a row but no `data` property inside it
    qb1.setResult([{ data: { id: 1, level: 'B1', section: 'grammar', q: 'Q?', opts: ['a','b','c','d'] as [string,string,string,string], ans: 0 } }], null)
    qb2.setResult({ level: 'B1' }, null) // row exists but no data.data
    qb3.setResult(null, null)

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'mocktest_questions') return qb1.qb
      if (table === 'mocktest_listening') return qb2.qb
      if (table === 'mocktest_writing') return qb3.qb
      return buildQB().qb
    })

    const result = await fetchMockTestData('B1')

    // Listening should fall back to local since data.data is missing
    expect(result.listeningText).toBeTruthy()
    expect(result.listeningMCQ).toHaveLength(8)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Pure helper functions
// ═══════════════════════════════════════════════════════════════════════════════

describe('pctToBand', () => {
  // Sampled mid-range
  it('returns 8.5 for 90%+', () => { expect(pctToBand(95)).toBe(8.5) })
  it('returns 7.5 for 80-89%', () => { expect(pctToBand(80)).toBe(7.5) })
  it('returns 7.0 for 73-79%', () => { expect(pctToBand(75)).toBe(7.0) })
  it('returns 6.5 for 67-72%', () => { expect(pctToBand(70)).toBe(6.5) })
  it('returns 6.0 for 60-66%', () => { expect(pctToBand(63)).toBe(6.0) })
  it('returns 5.5 for 53-59%', () => { expect(pctToBand(55)).toBe(5.5) })
  it('returns 5.0 for 45-52%', () => { expect(pctToBand(50)).toBe(5.0) })
  it('returns 4.5 for 38-44%', () => { expect(pctToBand(40)).toBe(4.5) })
  it('returns 4.0 for <38%', () => { expect(pctToBand(30)).toBe(4.0) })
  it('handles 100%', () => { expect(pctToBand(100)).toBe(8.5) })
  it('handles 0%', () => { expect(pctToBand(0)).toBe(4.0) })

  // Boundary edges
  it('boundary: 90% is 8.5 (upper edge)', () => { expect(pctToBand(90)).toBe(8.5) })
  it('boundary: 89% is 7.5 (just below 90)', () => { expect(pctToBand(89)).toBe(7.5) })
  it('boundary: 80% is 7.5 (lower edge of 80-89)', () => { expect(pctToBand(80)).toBe(7.5) })
  it('boundary: 79% is 7.0 (just below 80)', () => { expect(pctToBand(79)).toBe(7.0) })
  it('boundary: 73% is 7.0 (lower edge of 73-79)', () => { expect(pctToBand(73)).toBe(7.0) })
  it('boundary: 72% is 6.5 (just below 73)', () => { expect(pctToBand(72)).toBe(6.5) })
  it('boundary: 67% is 6.5 (lower edge of 67-72)', () => { expect(pctToBand(67)).toBe(6.5) })
  it('boundary: 66% is 6.0 (just below 67)', () => { expect(pctToBand(66)).toBe(6.0) })
  it('boundary: 60% is 6.0 (lower edge of 60-66)', () => { expect(pctToBand(60)).toBe(6.0) })
  it('boundary: 59% is 5.5 (just below 60)', () => { expect(pctToBand(59)).toBe(5.5) })
  it('boundary: 53% is 5.5 (lower edge of 53-59)', () => { expect(pctToBand(53)).toBe(5.5) })
  it('boundary: 52% is 5.0 (just below 53)', () => { expect(pctToBand(52)).toBe(5.0) })
  it('boundary: 45% is 5.0 (lower edge of 45-52)', () => { expect(pctToBand(45)).toBe(5.0) })
  it('boundary: 44% is 4.5 (just below 45)', () => { expect(pctToBand(44)).toBe(4.5) })
  it('boundary: 38% is 4.5 (lower edge of 38-44)', () => { expect(pctToBand(38)).toBe(4.5) })
  it('boundary: 37% is 4.0 (just below 38)', () => { expect(pctToBand(37)).toBe(4.0) })
})

describe('scoreToBand', () => {
  it('score 10/10 → band 8.5', () => { expect(scoreToBand(10)).toBe(8.5) })
  it('score 9/10 → band 8.5 (pctToBand(90))', () => { expect(scoreToBand(9)).toBe(8.5) })
  it('score 8/10 → band 7.5 (pctToBand(80))', () => { expect(scoreToBand(8)).toBe(7.5) })
  it('score 7/10 → band 6.5 (pctToBand(70))', () => { expect(scoreToBand(7)).toBe(6.5) })
  it('score 6/10 → band 6.0 (pctToBand(60))', () => { expect(scoreToBand(6)).toBe(6.0) })
  it('score 5/10 → band 5.0', () => { expect(scoreToBand(5)).toBe(5.0) })
  it('score 4/10 → band 4.5 (pctToBand(40))', () => { expect(scoreToBand(4)).toBe(4.5) })
  it('score 3/10 → band 4.0 (pctToBand(30))', () => { expect(scoreToBand(3)).toBe(4.0) })
  it('score 2/10 → band 4.0 (pctToBand(20))', () => { expect(scoreToBand(2)).toBe(4.0) })
  it('score 1/10 → band 4.0', () => { expect(scoreToBand(1)).toBe(4.0) })
  it('score 0/10 → band 4.0 (minimum)', () => { expect(scoreToBand(0)).toBe(4.0) })
})

describe('roundBand', () => {
  it('rounds down: x.0–x.2 → x.0', () => {
    expect(roundBand(4.0)).toBe(4.0)
    expect(roundBand(5.1)).toBe(5.0)
    expect(roundBand(6.2)).toBe(6.0)
  })
  it('rounds up: x.3–x.7 → x.5', () => {
    expect(roundBand(4.3)).toBe(4.5)
    expect(roundBand(5.5)).toBe(5.5)
    expect(roundBand(6.3)).toBe(6.5)
    expect(roundBand(6.4)).toBe(6.5)
    expect(roundBand(6.5)).toBe(6.5)
    expect(roundBand(6.6)).toBe(6.5)
    expect(roundBand(6.7)).toBe(6.5)
  })
  it('rounds up: x.8–x.9 → x+1.0', () => {
    expect(roundBand(6.8)).toBe(7.0)
    expect(roundBand(6.9)).toBe(7.0)
    expect(roundBand(8.8)).toBe(9.0)
  })
  it('preserves exact integer values', () => {
    expect(roundBand(4.0)).toBe(4.0)
    expect(roundBand(5.0)).toBe(5.0)
    expect(roundBand(6.0)).toBe(6.0)
    expect(roundBand(7.0)).toBe(7.0)
    expect(roundBand(8.0)).toBe(8.0)
    expect(roundBand(9.0)).toBe(9.0)
  })
  it('preserves exact half values', () => {
    expect(roundBand(4.5)).toBe(4.5)
    expect(roundBand(5.5)).toBe(5.5)
    expect(roundBand(6.5)).toBe(6.5)
    expect(roundBand(7.5)).toBe(7.5)
    expect(roundBand(8.5)).toBe(8.5)
    expect(roundBand(9.5)).toBe(9.5)
  })
})
