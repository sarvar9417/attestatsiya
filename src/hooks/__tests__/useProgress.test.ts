import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { buildQB } from '../../test/supabaseMock'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: { getSession: vi.fn() },
  },
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../utils/tashkentDate', () => ({ getTodayTashkent: () => '2026-06-15' }))

async function importHook() {
  const { useProgress } = await import('../useProgress')
  return useProgress
}

describe('useProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })
  })

  it('loads progress data on mount', async () => {
    const qbs: Record<string, ReturnType<typeof buildQB>> = {
      dailyProgress: buildQB(),
      days: buildQB(),
      mocks: buildQB(),
      grammar: buildQB(),
      listening: buildQB(),
      reading: buildQB(),
      speaking: buildQB(),
      writing: buildQB(),
    }

    const dailyCalls: string[] = []
    mockSupabaseInstance.from.mockImplementation((table: string) => {
      let key: string
      if (table === 'daily_progress') {
        dailyCalls.push(table)
        key = dailyCalls.length === 1 ? 'dailyProgress' : 'days'
      } else {
        const map: Record<string, string> = {
          mock_tests: 'mocks',
          grammar_progress: 'grammar',
          listening_progress: 'listening',
          reading_progress: 'reading',
          speaking_progress: 'speaking',
          writings: 'writing',
        }
        key = map[table]
      }
      return qbs[key].qb
    })

    qbs.dailyProgress.setResult({ date: '2026-06-15', total_minutes: 30 })
    qbs.days.setResult([{ date: '2026-06-15' }, { date: '2026-06-14' }])
    qbs.mocks.setResult([])
    qbs.grammar.setResult([])
    qbs.listening.setResult([])
    qbs.reading.setResult([])
    qbs.speaking.setResult([])
    qbs.writing.setResult([])

    const useProgress = await importHook()
    const { result } = renderHook(() => useProgress())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.todayProgress).toEqual({ date: '2026-06-15', total_minutes: 30 })
    expect(result.current.lastMockTest).toBeNull()
    expect(result.current.dbStreak).toBe(2)
  })

  it('returns nulls when not authenticated', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: null },
    })

    const useProgress = await importHook()
    const { result } = renderHook(() => useProgress())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.todayProgress).toBeNull()
    expect(result.current.lastMockTest).toBeNull()
    expect(result.current.dbStreak).toBe(0)
  })

  it('handles empty data gracefully', async () => {
    const qbs: Record<string, ReturnType<typeof buildQB>> = {
      dailyProgress: buildQB(),
      days: buildQB(),
      mocks: buildQB(),
      grammar: buildQB(),
      listening: buildQB(),
      reading: buildQB(),
      speaking: buildQB(),
      writing: buildQB(),
    }
    const dailyCalls: string[] = []
    mockSupabaseInstance.from.mockImplementation((table: string) => {
      let key: string
      if (table === 'daily_progress') {
        dailyCalls.push(table)
        key = dailyCalls.length === 1 ? 'dailyProgress' : 'days'
      } else {
        const map: Record<string, string> = {
          mock_tests: 'mocks',
          grammar_progress: 'grammar',
          listening_progress: 'listening',
          reading_progress: 'reading',
          speaking_progress: 'speaking',
          writings: 'writing',
        }
        key = map[table]
      }
      return qbs[key].qb
    })

    qbs.dailyProgress.setResult(null)
    qbs.days.setResult(null)
    qbs.mocks.setResult(null)
    qbs.grammar.setResult(null)
    qbs.listening.setResult(null)
    qbs.reading.setResult(null)
    qbs.speaking.setResult(null)
    qbs.writing.setResult(null)

    const useProgress = await importHook()
    const { result } = renderHook(() => useProgress())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.todayProgress).toBeNull()
    expect(result.current.dbStreak).toBe(0)
    expect(result.current.error).toBeNull()
    expect(result.current.recentGrammar).toEqual([])
    expect(result.current.recentListening).toEqual([])
  })

  it('upsertTodayProgress does not throw when called', async () => {
    const { qb } = buildQB()
    mockSupabaseInstance.from.mockReturnValue(qb)
    qb.select.mockReturnValue(qb)
    qb.upsert.mockReturnValue(qb)
    qb.maybeSingle.mockReturnValue(qb)

    const useProgress = await importHook()
    const { result } = renderHook(() => useProgress())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(result.current.upsertTodayProgress({ total_minutes: 45 })).resolves.toBeUndefined()
  })

})
