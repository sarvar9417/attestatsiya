// ═══════════════════════════════════════════════════════════════════════════
// reactionService.test.ts — Profil reaksiyalari (🔥💪😂) testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn(), auth: { getSession: vi.fn() } } as Record<string, unknown>,
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))

import { buildQB } from '../../test/supabaseMock'
import { addReaction, removeReaction, getReactions } from '../reactionService'

const meSession = { data: { session: { user: { id: 'me' } } } }

beforeEach(() => {
  mockSupabaseInstance.auth.getSession.mockResolvedValue(meSession)
  mockSupabaseInstance.from.mockReset()
})
afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
  return qb
}

describe('addReaction', () => {
  it('rejects self-reaction (no DB call)', async () => {
    const ok = await addReaction('me', 'fire')
    expect(ok).toBe(false)
    expect(mockSupabaseInstance.from).not.toHaveBeenCalled()
  })

  it('rejects when not authenticated', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue({ data: { session: null } })
    expect(await addReaction('friend', 'fire')).toBe(false)
  })

  it('inserts reaction and returns true', async () => {
    const qb = queueQB(null, null)
    const ok = await addReaction('friend', 'muscle')
    expect(ok).toBe(true)
    expect(qb.insert).toHaveBeenCalledWith(expect.objectContaining({
      target_user_id: 'friend', reactor_user_id: 'me', reaction_type: 'muscle',
    }))
  })

  it('returns false on DB error', async () => {
    queueQB(null, { message: 'fail' })
    expect(await addReaction('friend', 'fire')).toBe(false)
  })
})

describe('removeReaction', () => {
  it('deletes and returns true', async () => {
    const qb = queueQB(null, null)
    const ok = await removeReaction('friend', 'fire')
    expect(ok).toBe(true)
    expect(qb.delete).toHaveBeenCalled()
  })

  it('returns false without auth', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue({ data: { session: null } })
    expect(await removeReaction('friend', 'fire')).toBe(false)
  })
})

describe('getReactions (aggregation)', () => {
  it('counts per type and flags iReacted', async () => {
    queueQB([
      { reaction_type: 'fire', reactor_user_id: 'me' },
      { reaction_type: 'fire', reactor_user_id: 'other' },
      { reaction_type: 'muscle', reactor_user_id: 'other' },
    ])
    const res = await getReactions('friend')
    const fire = res.find(r => r.type === 'fire')!
    const muscle = res.find(r => r.type === 'muscle')!
    const laugh = res.find(r => r.type === 'laugh')!
    expect(fire.count).toBe(2)
    expect(fire.iReacted).toBe(true)   // 'me' fire bosgan
    expect(muscle.count).toBe(1)
    expect(muscle.iReacted).toBe(false)
    expect(laugh.count).toBe(0)
    expect(res).toHaveLength(5)        // barcha 5 tur qaytadi
  })

  it('returns [] when no data', async () => {
    queueQB(null)
    expect(await getReactions('friend')).toEqual([])
  })
})
