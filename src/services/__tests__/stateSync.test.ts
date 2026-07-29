// ═══════════════════════════════════════════════════════════════════════════
// stateSync.test.ts — User state / kunlik progress sinxronizatsiyasi
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn(), auth: { getSession: vi.fn() } } as Record<string, unknown>,
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../utils/tashkentDate', () => ({ getTodayTashkent: () => '2026-06-15' }))

import { buildQB } from '../../test/supabaseMock'
import { syncUserState, loadUserState, loadTodayProgress } from '../stateSync'

const session = { data: { session: { user: { id: 'u1' } } } }
const noSession = { data: { session: null } }

beforeEach(() => {
  mockSupabaseInstance.from.mockReset()
})
afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
  return qb
}

describe('syncUserState', () => {
  it('no-op without session', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(noSession)
    await syncUserState({ xp: 10 })
    expect(mockSupabaseInstance.from).not.toHaveBeenCalled()
  })

  it('updates users.state when authenticated', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    // First from() call: select existing state (returns null — no existing state)
    const qb1 = queueQB(null, null)
    // Second from() call: update with merged state
    const qb2 = queueQB(null, null)
    await syncUserState({ xp: 42 })
    // First query: select('state')
    expect(qb1.select).toHaveBeenCalledWith('state')
    // Second query: update with state
    expect(qb2.update).toHaveBeenCalledWith(expect.objectContaining({ state: { xp: 42 } }))
    expect(qb2.eq).toHaveBeenCalledWith('id', 'u1')
  })

  it('smart-merges when remote state exists with higher values', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    // First from() call: select existing state (remote has higher XP)
    const _qb1 = queueQB({ state: { totalXP: 1000, streak: 30 } }, null)
    // Second from() call: update with merged state
    const qb2 = queueQB(null, null)
    await syncUserState({ totalXP: 500, streak: 20 })
    // Merged state should keep the higher values
    expect(qb2.update).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ totalXP: 1000, streak: 30 }),
      }),
    )
    expect(qb2.eq).toHaveBeenCalledWith('id', 'u1')
  })

  it('preserves local higher values when remote has lower', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    // First from() call: select existing state (local has higher XP)
    const _qb1 = queueQB({ state: { totalXP: 200, streak: 5 } }, null)
    // Second from() call: update with merged state
    const qb2 = queueQB(null, null)
    await syncUserState({ totalXP: 500, streak: 10 })
    // Merged state should keep the higher local values
    expect(qb2.update).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ totalXP: 500, streak: 10 }),
      }),
    )
  })
})

describe('loadUserState', () => {
  it('returns null without session', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(noSession)
    expect(await loadUserState()).toBeNull()
  })

  it('returns persisted state', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    queueQB({ state: { xp: 99 } })
    expect(await loadUserState()).toEqual({ xp: 99 })
  })

  it('returns null when no state row', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    queueQB(null)
    expect(await loadUserState()).toBeNull()
  })
})

describe('loadTodayProgress', () => {
  it('returns null without session', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(noSession)
    expect(await loadTodayProgress()).toBeNull()
  })

  it('fetches today progress row', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue(session)
    const qb = queueQB({ date: '2026-06-15', xp: 5 })
    const res = await loadTodayProgress()
    expect(res).toEqual({ date: '2026-06-15', xp: 5 })
    expect(qb.eq).toHaveBeenCalledWith('date', '2026-06-15')
  })
})
