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
import { saveGrammarResult, fetchGrammarTopics } from '../grammarService'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
  mockToast.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('saveGrammarResult', () => {
  it('upserts grammar progress with computed score', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveGrammarResult({
      userId: 'user-1',
      topicId: 'present-simple',
      topicTitle: 'Present Simple',
      correctCount: 8,
      total: 10,
      xpEarned: 80,
    })

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('grammar_progress')
    expect(qb.upsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      date: '2026-06-15',
      topic_id: 'present-simple',
      topic_title: 'Present Simple',
      score: 80,
      correct_count: 8,
      total_exercises: 10,
      xp_earned: 80,
      completed_at: '2026-06-15T10:30:00.000Z',
    }, { onConflict: 'user_id,date,topic_id' })
  })

  it('returns score 0 when total is 0', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveGrammarResult({
      userId: 'user-1',
      topicId: 'past-simple',
      topicTitle: 'Past Simple',
      correctCount: 0,
      total: 0,
      xpEarned: 0,
    })

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ score: 0 }),
      expect.any(Object),
    )
  })
})

describe('fetchGrammarTopics', () => {
  it('calls supabase with correct table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await fetchGrammarTopics()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('grammar_topics')
    expect(qb.select).toHaveBeenCalledWith('data')
  })
})
