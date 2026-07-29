// ═══════════════════════════════════════════════════════════════════════════
// analyticsService.test.ts — Zaif joylar / analitika agregatori testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn() } as Record<string, unknown>,
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))

import { buildQB } from '../../test/supabaseMock'
import { fetchAnalytics, fetchQuickWeakSpots } from '../analyticsService'

beforeEach(() => {
  mockSupabaseInstance.from.mockReset()
})
afterEach(() => vi.clearAllMocks())

// Promise.all tartibi: vocab, phrase, grammar, writing, speaking, listening, reading
function queueAll(results: unknown[]) {
  for (const data of results) {
    const { qb, setResult } = buildQB()
    setResult(data, null)
    mockSupabaseInstance.from.mockReturnValueOnce(qb)
  }
}

describe('fetchAnalytics', () => {
  it('returns an empty-but-valid summary when no data', async () => {
    queueAll([[], [], [], [], [], [], []])
    const a = await fetchAnalytics('u1')
    expect(a.weakSpots).toEqual([])
    expect(a.overallScore).toBe(0)
    expect(a.strongestCategory).toBeNull()
    expect(a.weakestCategory).toBeNull()
    expect(a.totalExercisesDone).toBe(0)
    expect(a.weeklyTrends).toHaveLength(7) // oxirgi 7 kun grammar trendi
  })

  it('aggregates grammar + listening and sorts weakest-first', async () => {
    queueAll([
      [],                                                        // vocabulary
      [],                                                        // phrases
      [{ date: '2000-01-01', score: 60, topic_title: 'Tenses' }], // grammar (avg 60)
      [],                                                        // writing
      [],                                                        // speaking
      [{ date: '2000-01-01', score: 90 }],                       // listening (avg 90)
      [],                                                        // reading
    ])
    const a = await fetchAnalytics('u1')

    // Faqat ma'lumotli kategoriyalar (totalAttempts>0): grammar + listening
    expect(a.weakSpots.map(w => w.category)).toEqual(['grammar', 'listening']) // zaifdan kuchli
    expect(a.weakestCategory).toBe('Grammar')   // 60%
    expect(a.strongestCategory).toBe('Listening') // 90%
    expect(a.overallScore).toBe(75)             // round((60+90)/2)
    expect(a.totalExercisesDone).toBe(2)
  })

  it('handles null data rows gracefully', async () => {
    queueAll([null, null, null, null, null, null, null])
    const a = await fetchAnalytics('u1')
    expect(a.weakSpots).toEqual([])
    expect(a.overallScore).toBe(0)
  })

  it('computes vocabulary accuracy from correct/wrong counts', async () => {
    queueAll([
      [{ correct_count: 8, wrong_count: 2, box: 5, is_learned: true }], // vocab 80%
      [], [], [], [], [], [],
    ])
    const a = await fetchAnalytics('u1')
    const vocab = a.weakSpots.find(w => w.category === 'vocabulary')!
    expect(vocab.score).toBe(80)        // (10-2)/10
    expect(vocab.totalAttempts).toBe(10)
    expect(vocab.errorCount).toBe(2)
  })
})

describe('fetchQuickWeakSpots', () => {
  it('returns up to 3 lightweight weak spots', async () => {
    queueAll([
      [{ correct_count: 5, wrong_count: 5, box: 1, is_learned: false }], // vocab 50%
      [],
      [{ date: '2000-01-01', score: 60, topic_title: 'X' }],             // grammar 60%
      [],
      [],
      [{ date: '2000-01-01', score: 90 }],                              // listening 90%
      [],
    ])
    const spots = await fetchQuickWeakSpots('u1')
    expect(spots.length).toBeLessThanOrEqual(3)
    // Eng zaif birinchi (vocab 50%)
    expect(spots[0].category).toBe('vocabulary')
    expect(spots[0]).toHaveProperty('icon')
    expect(spots[0]).toHaveProperty('detail')
  })
})
