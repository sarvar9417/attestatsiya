import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = { from: vi.fn(), rpc: vi.fn() }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

import { buildQB } from '../../test/supabaseMock'
import { savePlacementResult, getLatestPlacement } from '../placementService'
import type { PlacementResult } from '../../data/placement/types'

beforeEach(() => { mockSupabaseInstance.from.mockReset() })
afterEach(() => { vi.restoreAllMocks() })

const result: PlacementResult = {
  level: 'B1',
  bandScores: { A2: { correct: 1, total: 1 }, 'A2+': { correct: 2, total: 2 }, B1: { correct: 2, total: 3 }, 'B1+': { correct: 0, total: 2 }, B2: { correct: 0, total: 0 } },
  correctCount: 5,
  totalAsked: 8,
  takenAt: '2026-06-15T10:00:00Z',
}

describe('savePlacementResult', () => {
  it('insert qiladi (kamel→snake map)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await savePlacementResult('u1', result)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('placement_results')
    const row = qb.insert.mock.calls[0][0] as Record<string, unknown>
    expect(row.user_id).toBe('u1')
    expect(row.level).toBe('B1')
    expect(row.correct_count).toBe(5)
    expect(row.total_asked).toBe(8)
    expect(row.taken_at).toBe('2026-06-15T10:00:00Z')
    expect(row.scores).toEqual(result.bandScores)
  })
})

describe('getLatestPlacement', () => {
  it('oxirgi natijani qaytaradi', async () => {
    const { qb, setResult } = buildQB()
    setResult({ level: 'B1+', taken_at: '2026-06-14T09:00:00Z' }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const r = await getLatestPlacement('u1')
    expect(r).toEqual({ level: 'B1+', takenAt: '2026-06-14T09:00:00Z' })
  })

  it('natija yo\'q bo\'lsa null', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    expect(await getLatestPlacement('u1')).toBeNull()
  })
})
