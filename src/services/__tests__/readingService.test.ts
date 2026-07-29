import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

const { mockSupabaseInstance, mockToast } = vi.hoisted(() => {
  const mockToast = vi.fn()
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = { from: vi.fn(), rpc: vi.fn() }
  return { mockSupabaseInstance, mockToast }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../utils/toastStore', () => ({
  useToastStore: { getState: () => ({ toast: mockToast }) },
}))

import { buildQB } from '../../test/supabaseMock'
import { saveReadingResult, fetchReadingTexts } from '../readingService'
import { READING_TEXTS } from '../../data/reading'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
  mockToast.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  saveReadingResult
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveReadingResult', () => {
  it('upserts reading progress with computed score', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-1',
      textId: 'my-day',
      textTitle: 'My Day',
      correctCount: 3,
      totalQuestions: 4,
      xpEarned: 75,
    })

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('reading_progress')
    expect(qb.upsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      date: '2026-06-15',
      text_id: 'my-day',
      text_title: 'My Day',
      score: 75,
      correct_count: 3,
      total_questions: 4,
      xp_earned: 75,
      completed_at: '2026-06-15T10:30:00.000Z',
    }, { onConflict: 'user_id,date,text_id' })
  })

  it('handles perfect score', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-1',
      textId: 'test',
      textTitle: 'Test',
      correctCount: 5,
      totalQuestions: 5,
      xpEarned: 100,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 100 }),
      expect.any(Object),
    )
  })

  it('returns score 0 when totalQuestions is 0', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-2',
      textId: 'empty-test',
      textTitle: 'Empty Test',
      correctCount: 0,
      totalQuestions: 0,
      xpEarned: 0,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 0 }),
      expect.any(Object),
    )
  })

  it('calculates score as 0 when 0 correct out of some total', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-3',
      textId: 'hard-test',
      textTitle: 'Hard Test',
      correctCount: 0,
      totalQuestions: 5,
      xpEarned: 0,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 0 }),
      expect.any(Object),
    )
  })

  it('rounds score to nearest integer', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // 2/3 = 0.666... → 67% after round
    await saveReadingResult({
      userId: 'user-4',
      textId: 'rounding-test',
      textTitle: 'Rounding Test',
      correctCount: 2,
      totalQuestions: 3,
      xpEarned: 67,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 67 }),
      expect.any(Object),
    )
  })

  it('handles 1 correct out of 2 (50%)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-5',
      textId: 'half-test',
      textTitle: 'Half Test',
      correctCount: 1,
      totalQuestions: 2,
      xpEarned: 50,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 50 }),
      expect.any(Object),
    )
  })

  it('passes xpEarned through unchanged', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveReadingResult({
      userId: 'user-6',
      textId: 'xp-test',
      textTitle: 'XP Test',
      correctCount: 4,
      totalQuestions: 5,
      xpEarned: 42,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ xp_earned: 42 }),
      expect.any(Object),
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchReadingTexts
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchReadingTexts', () => {
  it('calls supabase with correct table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await fetchReadingTexts()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('reading_texts')
    expect(qb.select).toHaveBeenCalledWith('data')
  })

  it('returns data from supabase on success', async () => {
    const { qb, setResult } = buildQB()
    const dbRows = [{ data: { id: 'r1', title: 'My Day' } }, { data: { id: 'r2', title: 'City Life' } }]
    setResult(dbRows, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchReadingTexts()

    expect(result).toEqual([{ id: 'r1', title: 'My Day' }, { id: 'r2', title: 'City Life' }])
  })

  it('falls back to local READING_TEXTS on error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchReadingTexts()

    expect(result).toEqual(READING_TEXTS)
  })

  it('falls back to local when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchReadingTexts()

    expect(result).toEqual(READING_TEXTS)
  })
})
