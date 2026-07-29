import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { saveWritingResult, fetchWritingPrompts, getDailyWritingPrompt } from '../writingService'
import { WRITING_PROMPTS } from '../../data/writingPrompts'
import { monitoring } from '../../lib/monitoring'
import type { WritingPrompt } from '../writingService'

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = {
    from: vi.fn(), rpc: vi.fn(),
  }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

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
//  saveWritingResult
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveWritingResult', () => {
  const baseParams = {
    userId: 'user-1',
    day: 5,
    prompt: 'Write about your hobby',
    essay: 'I enjoy reading books...',
    wordCount: 120,
    feedback: 'Great essay! Could improve grammar.',
    avgScore: 7.5,
    xpEarned: 75,
  }

  it('inserts into writings table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveWritingResult(baseParams)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('writings')
    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        date: '2026-06-15',
        day: 5,
        prompt: 'Write about your hobby',
        user_text: 'I enjoy reading books...',
        word_count: 120,
        score: 7.5,
        ai_feedback: 'Great essay! Could improve grammar.',
      }),
    )
  })

  it('truncates feedback to 5000 chars', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const longFeedback = 'x'.repeat(6000)

    await saveWritingResult({ ...baseParams, feedback: longFeedback })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        ai_feedback: longFeedback.slice(0, 5000),
      }),
    )
  })

  it('logs error on insert failure', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('DB error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveWritingResult(baseParams)

    expect(spy).toHaveBeenCalledWith('saveWritingResult error: DB error', 'error')

    spy.mockRestore()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchWritingPrompts
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchWritingPrompts', () => {
  it('returns supabase data on success', async () => {
    const { qb, setResult } = buildQB()
    setResult([{ data: { id: 'db-1', type: 'opinion' } }], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchWritingPrompts()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('writing_prompts')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: 'db-1', type: 'opinion' })
  })

  it('falls back to local WRITING_PROMPTS on error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchWritingPrompts()

    expect(result).toEqual(WRITING_PROMPTS)
  })

  it('falls back to local when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchWritingPrompts()

    expect(result).toEqual(WRITING_PROMPTS)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  getDailyWritingPrompt — pure helper
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDailyWritingPrompt', () => {
  const makePrompt = (id: string): WritingPrompt => ({
    id,
    type: 'opinion',
    prompt: `Prompt ${id}`,
    wordLimit: 250,
    timeMinutes: 35,
    tips: [],
  })

  const prompts: WritingPrompt[] = [
    makePrompt('p1'),
    makePrompt('p2'),
    makePrompt('p3'),
  ]

  it('returns first prompt for day 1', () => {
    const result = getDailyWritingPrompt(1, prompts)
    expect(result.id).toBe('p1')
  })

  it('returns second prompt for day 2', () => {
    const result = getDailyWritingPrompt(2, prompts)
    expect(result.id).toBe('p2')
  })

  it('wraps around to first prompt when day exceeds array length', () => {
    const result = getDailyWritingPrompt(4, prompts)
    expect(result.id).toBe('p1')
  })

  it('handles day number 0 gracefully (negative JS modulus)', () => {
    const day0 = getDailyWritingPrompt(0, prompts)
    expect(day0).toBeUndefined()
  })

  it('handles day number 3 wrapping to index 2', () => {
    const day3 = getDailyWritingPrompt(3, prompts)
    expect(day3.id).toBe('p3')
  })
})
