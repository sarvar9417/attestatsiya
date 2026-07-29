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
import { saveListeningResult, fetchListeningLessons } from '../listeningService'
import { LISTENING_LESSONS } from '../../data/listeningLessons'

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
//  saveListeningResult
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveListeningResult', () => {
  it('upserts listening progress with combined score (fill + tf + summary)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveListeningResult({
      userId: 'user-1',
      lessonId: 'ordering-food',
      lessonTitle: 'Ordering Food',
      fillCorrect: 4,
      fillTotal: 5,
      tfCorrect: 3,
      tfTotal: 3,
      summaryDone: true,
      xpEarned: 150,
    })

    const expectedScore = Math.round(((4 + 3 + 1) / (5 + 3 + 1)) * 100)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('listening_progress')
    expect(qb.upsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      date: '2026-06-15',
      lesson_id: 'ordering-food',
      lesson_title: 'Ordering Food',
      score: expectedScore,
      fill_correct: 4,
      fill_total: 5,
      tf_correct: 3,
      tf_total: 3,
      summary_done: true,
      xp_earned: 150,
      completed_at: '2026-06-15T10:30:00.000Z',
    }, { onConflict: 'user_id,date,lesson_id' })
  })

  it('handles summary not done (summary counts as 0 in score)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // total = 0 + 0 + 1 = 1, correct = 0 + 0 + 0 = 0 → score = 0
    await saveListeningResult({
      userId: 'user-1',
      lessonId: 'test',
      lessonTitle: 'Test',
      fillCorrect: 0,
      fillTotal: 0,
      tfCorrect: 0,
      tfTotal: 0,
      summaryDone: false,
      xpEarned: 0,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 0, summary_done: false }),
      expect.any(Object),
    )
  })

  it('calculates score correctly with only fill questions and no summary', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // total = 5 + 0 + 1 = 6, correct = 3 + 0 + 0 = 3 → score = 50
    await saveListeningResult({
      userId: 'user-2',
      lessonId: 'fill-only',
      lessonTitle: 'Fill Only',
      fillCorrect: 3,
      fillTotal: 5,
      tfCorrect: 0,
      tfTotal: 0,
      summaryDone: false,
      xpEarned: 50,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 50 }),
      expect.any(Object),
    )
  })

  it('calculates score correctly with only TF questions and summary done', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // total = 0 + 4 + 1 = 5, correct = 0 + 3 + 1 = 4 → score = 80
    await saveListeningResult({
      userId: 'user-3',
      lessonId: 'tf-only',
      lessonTitle: 'TF Only',
      fillCorrect: 0,
      fillTotal: 0,
      tfCorrect: 3,
      tfTotal: 4,
      summaryDone: true,
      xpEarned: 80,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 80 }),
      expect.any(Object),
    )
  })

  it('rounds score to nearest integer', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // total = 3 + 0 + 1 = 4, correct = 1 + 0 + 0 = 1 → 25%
    await saveListeningResult({
      userId: 'user-4',
      lessonId: 'rounding',
      lessonTitle: 'Rounding',
      fillCorrect: 1,
      fillTotal: 3,
      tfCorrect: 0,
      tfTotal: 0,
      summaryDone: false,
      xpEarned: 25,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 25 }),
      expect.any(Object),
    )
  })

  it('handles perfect score across all sections', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveListeningResult({
      userId: 'user-5',
      lessonId: 'perfect',
      lessonTitle: 'Perfect',
      fillCorrect: 5,
      fillTotal: 5,
      tfCorrect: 3,
      tfTotal: 3,
      summaryDone: true,
      xpEarned: 200,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 100 }),
      expect.any(Object),
    )
  })

  it('passes xpEarned through unchanged', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveListeningResult({
      userId: 'user-6',
      lessonId: 'xp-check',
      lessonTitle: 'XP Check',
      fillCorrect: 2,
      fillTotal: 4,
      tfCorrect: 1,
      tfTotal: 2,
      summaryDone: true,
      xpEarned: 99,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ xp_earned: 99 }),
      expect.any(Object),
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchListeningLessons
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchListeningLessons', () => {
  it('calls supabase with correct table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await fetchListeningLessons()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('listening_lessons')
    expect(qb.select).toHaveBeenCalledWith('data')
  })

  it('returns data from supabase on success', async () => {
    const { qb, setResult } = buildQB()
    const dbRows = [{ data: { id: 'l1', title: 'Ordering Food' } }, { data: { id: 'l2', title: 'Directions' } }]
    setResult(dbRows, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchListeningLessons()

    expect(result).toEqual([{ id: 'l1', title: 'Ordering Food' }, { id: 'l2', title: 'Directions' }])
  })

  it('falls back to local LISTENING_LESSONS on error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchListeningLessons()

    expect(result).toEqual(LISTENING_LESSONS)
  })

  it('falls back to local when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchListeningLessons()

    expect(result).toEqual(LISTENING_LESSONS)
  })
})
