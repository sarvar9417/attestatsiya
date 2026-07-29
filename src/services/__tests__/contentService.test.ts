import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { todayDate, fetchContent, saveScore } from '../contentService'
import { monitoring } from '../../lib/monitoring'

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

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

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

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
//  requireSession
// ═══════════════════════════════════════════════════════════════════════════════

describe('requireSession', () => {
  it('returns userId when session exists', async () => {
    const { requireSession } = await import('../contentService')
    // Set up session mock
    const origGetSession = mockSupabaseInstance.auth?.getSession
    mockSupabaseInstance.auth = {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
      }),
    }

    const result = await requireSession()

    expect(result).toBe('user-123')

    // Restore
    mockSupabaseInstance.auth = { getSession: origGetSession ?? vi.fn() }
  })

  it('throws error when no session exists', async () => {
    const { requireSession } = await import('../contentService')
    const origGetSession = mockSupabaseInstance.auth?.getSession
    mockSupabaseInstance.auth = {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
      }),
    }

    await expect(requireSession()).rejects.toThrow('auth required')

    mockSupabaseInstance.auth = { getSession: origGetSession ?? vi.fn() }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  todayDate
// ═══════════════════════════════════════════════════════════════════════════════

describe('todayDate', () => {
  it('returns today date in YYYY-MM-DD format', () => {
    expect(todayDate()).toBe('2026-06-15')
  })

  it('respects fake timers', () => {
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
    expect(todayDate()).toBe('2025-01-01')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchContent
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchContent', () => {
  const fallback = [{ id: 'local-1', title: 'Local' }]

  it('returns data from supabase on success', async () => {
    const { qb, setResult } = buildQB()
    const dbRows = [{ data: { id: 'db-1' } }, { data: { id: 'db-2' } }]
    setResult(dbRows, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchContent('lessons', fallback)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('lessons')
    expect(qb.select).toHaveBeenCalledWith('data')
    expect(result).toEqual([{ id: 'db-1' }, { id: 'db-2' }])
  })

  it('applies order when provided', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await fetchContent('grammar_topics', fallback, 'order_index')

    expect(qb.order).toHaveBeenCalledWith('order_index')
  })

  it('returns fallback on supabase error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network fail'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    const result = await fetchContent('lessons', fallback)

    expect(result).toEqual(fallback)
    expect(spy).toHaveBeenCalledWith('lessons fetch error: Network fail', 'warn')

    spy.mockRestore()
  })

  it('returns fallback when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchContent('lessons', fallback)

    expect(result).toEqual(fallback)
  })

  it('returns fallback when data is null', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchContent('lessons', fallback)

    expect(result).toEqual(fallback)
  })

  it('returns empty array when data is not an array', async () => {
    const { qb, setResult } = buildQB()
    setResult({ id: 'not-array' }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchContent('lessons', fallback)

    expect(result).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  saveScore
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveScore', () => {
  const payload = {
    user_id: 'user-1',
    date: '2026-06-15',
    topic_id: 'topic-1',
    score: 80,
    correct_count: 8,
    total_exercises: 10,
    xp_earned: 80,
    completed_at: '2026-06-15T10:30:00.000Z',
  }

  it('upserts score to the given table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveScore('grammar_progress', ['user_id', 'date', 'topic_id'], payload)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('grammar_progress')
    expect(qb.upsert).toHaveBeenCalledWith(payload, { onConflict: 'user_id,date,topic_id' })
    expect(mockToast).not.toHaveBeenCalled()
  })

  it('shows error toast on upsert failure', async () => {
    const { qb, setResult } = buildQB()
    const dbError = new Error('Duplicate')
    setResult(null, dbError)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveScore('grammar_progress', ['user_id', 'date', 'topic_id'], payload)

    expect(spy).toHaveBeenCalledWith('grammar_progress upsert error: Duplicate', 'error')

    spy.mockRestore()
  })
})
