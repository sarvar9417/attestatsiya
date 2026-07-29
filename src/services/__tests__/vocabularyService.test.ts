import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import {
  upsertProgress,
  saveSession,
  fetchMonthSessions,
  fetchProgressStats,
  fetchLevelCounts,
  fetchLearnedCounts,
} from '../vocabularyService'
import { monitoring } from '../../lib/monitoring'
import type { Rating } from '../vocabularyService'

// ─── Hoisted mocks (run before vi.mock factories) ───────────────────────────────

const { mockSupabaseInstance, mockToast } = vi.hoisted(() => {
  const mockToast = vi.fn()
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = { from: vi.fn(), rpc: vi.fn() }
  return { mockSupabaseInstance, mockToast }
})

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseInstance,
}))

vi.mock('../../utils/toastStore', () => ({
  useToastStore: { getState: () => ({ toast: mockToast }) },
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
  addDaysTashkent: (days: number) => {
    const d = new Date('2026-06-15T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + days)
    return d.toISOString().split('T')[0]
  },
}))

import { buildQB } from '../../test/supabaseMock'

// ─── Lifecycle ──────────────────────────────────────────────────────────────────

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
//  upsertProgress
// ═══════════════════════════════════════════════════════════════════════════════

describe('upsertProgress', () => {
  it('upserts a vocabulary progress row on success', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await upsertProgress('user-1', 42, 2, '2026-06-18', 3, 1, false)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('vocabulary_progress')
    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        word_id: 42,
        box: 2,
        next_review: '2026-06-18',
        correct_count: 3,
        wrong_count: 1,
        is_learned: false,
        last_reviewed: '2026-06-15T10:30:00.000Z',
      }),
      { onConflict: 'user_id,word_id' },
    )
    expect(mockToast).not.toHaveBeenCalled()
  })

  it('shows an error toast when upsert fails', async () => {
    const { qb, setResult } = buildQB()
    const dbError = new Error('DB connection lost')
    setResult(null, dbError)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await upsertProgress('user-1', 42, 2, '2026-06-18', 3, 1, false)

    expect(spy).toHaveBeenCalledWith('upsertProgress error: DB connection lost', 'error')
    expect(mockToast).toHaveBeenCalledWith("So'z ma'lumotini saqlashda xatolik", 'error')

    spy.mockRestore()
  })

  it('handles box 0 correctly (new words start at box 0)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await upsertProgress('user-1', 99, 0, '2026-06-16', 0, 0, false)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ box: 0, correct_count: 0, wrong_count: 0 }),
      { onConflict: 'user_id,word_id' },
    )
  })

  it('handles is_learned true correctly', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await upsertProgress('user-2', 55, 6, '2026-09-13', 12, 2, true)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ box: 6, is_learned: true, correct_count: 12 }),
      { onConflict: 'user_id,word_id' },
    )
  })

  it('passes correct_count and wrong_count through unchanged', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await upsertProgress('user-3', 77, 3, '2026-06-22', 5, 2, false)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ correct_count: 5, wrong_count: 2 }),
      { onConflict: 'user_id,word_id' },
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  saveSession
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveSession', () => {
  const wordsJson: Record<string, Rating> = { '1': 'bildim', '2': 'bilmadim', '3': 'bildim' }

  it('upserts a session row', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSession('user-1', 2, wordsJson, 66, 120)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('vocabulary_sessions')
    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        session_date: '2026-06-15',
        batch_number: 2,
        words_json: wordsJson,
        score: 66,
        time_spent: 120,
        completed: true,
      }),
      { onConflict: 'user_id,session_date,batch_number' },
    )
    expect(mockToast).not.toHaveBeenCalled()
  })

  it('uses provided sessionDate instead of today', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSession('user-1', 1, wordsJson, 100, 60, '2026-06-10')

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ session_date: '2026-06-10' }),
      { onConflict: 'user_id,session_date,batch_number' },
    )
  })

  it('handles empty wordsJson', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSession('user-1', 1, {}, 0, 0)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ words_json: {}, score: 0, time_spent: 0 }),
      { onConflict: 'user_id,session_date,batch_number' },
    )
  })

  it('handles zero time_spent', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSession('user-1', 2, wordsJson, 100, 0)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ time_spent: 0 }),
      { onConflict: 'user_id,session_date,batch_number' },
    )
  })

  it('handles large batch_number', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSession('user-1', 100, wordsJson, 85, 300)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ batch_number: 100, score: 85, time_spent: 300 }),
      { onConflict: 'user_id,session_date,batch_number' },
    )
  })

  it('shows error toast when insert fails', async () => {
    const { qb, setResult } = buildQB()
    const dbError = new Error('Duplicate key')
    setResult(null, dbError)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveSession('user-1', 1, wordsJson, 50, 30)

    expect(spy).toHaveBeenCalledWith('saveSession error: Duplicate key', 'error')
    expect(mockToast).toHaveBeenCalledWith('Sessiyani saqlashda xatolik', 'error')

    spy.mockRestore()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchMonthSessions
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchMonthSessions', () => {
  it('returns grouped day sessions from supabase data', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { id: 1, session_date: '2026-06-05', batch_number: 1, score: 80, words_json: { '1': 'bildim', '2': 'bildim' } },
      { id: 2, session_date: '2026-06-05', batch_number: 2, score: 70, words_json: { '3': 'bilmadim' } },
      { id: 3, session_date: '2026-06-10', batch_number: 1, score: 90, words_json: { '4': 'bildim', '5': 'bildim', '6': 'bildim' } },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchMonthSessions('user-1', 2026, 5) // 5 = June

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('vocabulary_sessions')
    expect(qb.select).toHaveBeenCalledWith('id, session_date, batch_number, score, words_json')
    expect(qb.gte).toHaveBeenCalledWith('session_date', '2026-06-01')
    expect(qb.lt).toHaveBeenCalledWith('session_date', '2026-07-01')
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'user-1')
    expect(qb.order).toHaveBeenCalledWith('id', { ascending: true })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(2)

    const day5 = result.get('2026-06-05')!
    expect(day5.completed_batches).toBe(2)
    expect(day5.total_score).toBe(150)
    expect(day5.total_words).toBe(3)
    expect(day5.all_completed).toBe(false)

    const day10 = result.get('2026-06-10')!
    expect(day10.completed_batches).toBe(1)
    expect(day10.total_score).toBe(90)
    expect(day10.total_words).toBe(3)
    expect(day10.all_completed).toBe(false)
  })

  it('marks day as all_completed when 4 batches are done', async () => {
    const { qb, setResult } = buildQB()
    const rows = [1, 2, 3, 4].map((b) => ({
      id: b, session_date: '2026-06-15', batch_number: b,
      score: 50 + b * 10, words_json: { [String(b)]: 'bildim' },
    }))
    setResult(rows, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchMonthSessions('user-1', 2026, 5)

    expect(result.get('2026-06-15')!.all_completed).toBe(true)
    expect(result.get('2026-06-15')!.completed_batches).toBe(4)
  })

  it('deduplicates by keeping the last row for each batch', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { id: 1, session_date: '2026-06-15', batch_number: 1, score: 50, words_json: { a: 'bildim' } },
      { id: 2, session_date: '2026-06-15', batch_number: 1, score: 90, words_json: { a: 'bildim', b: 'bildim' } },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchMonthSessions('user-1', 2026, 5)

    expect(result.get('2026-06-15')!.total_score).toBe(90)
    expect(result.get('2026-06-15')!.completed_batches).toBe(1)
  })

  it('handles null batch_number gracefully', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { id: 1, session_date: '2026-06-15', batch_number: null, score: 50, words_json: { a: 'bildim' } },
      { id: 2, session_date: '2026-06-15', batch_number: 1, score: 80, words_json: { b: 'bildim' } },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchMonthSessions('user-1', 2026, 5)

    expect(result.get('2026-06-15')!.completed_batches).toBe(1)
    expect(result.get('2026-06-15')!.total_score).toBe(80)
  })

  it('handles null words_json', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { id: 1, session_date: '2026-06-15', batch_number: 1, score: 60, words_json: null },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchMonthSessions('user-1', 2026, 5)

    expect(result.get('2026-06-15')!.total_words).toBe(0)
  })

  it('returns empty map when supabase errors', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    const result = await fetchMonthSessions('user-1', 2026, 5)

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
    expect(spy).toHaveBeenCalledWith('fetchMonthSessions error: Network error', 'error')

    spy.mockRestore()
  })

  it('handles December month correctly (year boundary)', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await fetchMonthSessions('user-1', 2026, 11) // December

    expect(qb.gte).toHaveBeenCalledWith('session_date', '2026-12-01')
    expect(qb.lt).toHaveBeenCalledWith('session_date', '2027-01-01')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchProgressStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchProgressStats', () => {
  it('returns data on success', async () => {
    const { qb, setResult } = buildQB()
    const rows = [
      { word_id: 1, box: 3, is_learned: false, correct_count: 5 },
      { word_id: 2, box: 6, is_learned: true, correct_count: 12 },
    ]
    setResult(rows, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchProgressStats('user-1')

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('vocabulary_progress')
    expect(qb.select).toHaveBeenCalledWith('word_id, box, is_learned, correct_count')
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'user-1')
    expect(result).toEqual(rows)
  })

  it('returns empty array on error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('DB error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    const result = await fetchProgressStats('user-1')

    expect(result).toEqual([])
    expect(spy).toHaveBeenCalledWith('fetchProgressStats error: DB error', 'error')

    spy.mockRestore()
  })

  it('returns empty array when data is null', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchProgressStats('user-1')

    expect(result).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchLevelCounts / fetchLearnedCounts
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchLevelCounts', () => {
  it('returns level counts from RPC', async () => {
    const { qb, setResult } = buildQB()
    const levels = [
      { level: 'A1', total: 50 },
      { level: 'A2', total: 100 },
      { level: 'B1', total: 80 },
    ]
    setResult(levels, null)
    mockSupabaseInstance.rpc.mockReturnValue(qb)

    const result = await fetchLevelCounts()

    expect(mockSupabaseInstance.rpc).toHaveBeenCalledWith('get_word_counts_by_level')
    expect(result).toEqual(levels)
  })

  it('returns empty array on RPC error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('RPC failed'))
    mockSupabaseInstance.rpc.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    const result = await fetchLevelCounts()

    expect(result).toEqual([])
    expect(spy).toHaveBeenCalledWith('fetchLevelCounts error: RPC failed', 'error')

    spy.mockRestore()
  })

  it('returns empty array when data is null', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.rpc.mockReturnValue(qb)

    const result = await fetchLevelCounts()

    expect(result).toEqual([])
  })
})

describe('fetchLearnedCounts', () => {
  it('returns learned counts from RPC with user_uuid', async () => {
    const { qb, setResult } = buildQB()
    const learned = [
      { level: 'A1', learned: 20 },
      { level: 'A2', learned: 45 },
    ]
    setResult(learned, null)
    mockSupabaseInstance.rpc.mockReturnValue(qb)

    const result = await fetchLearnedCounts('user-1')

    expect(mockSupabaseInstance.rpc).toHaveBeenCalledWith('get_learned_counts_by_level', { user_uuid: 'user-1' })
    expect(result).toEqual(learned)
  })

  it('returns empty array on RPC error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('RPC failed'))
    mockSupabaseInstance.rpc.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    const result = await fetchLearnedCounts('user-1')

    expect(result).toEqual([])
    expect(spy).toHaveBeenCalledWith('fetchLearnedCounts error: RPC failed', 'error')

    spy.mockRestore()
  })
})
