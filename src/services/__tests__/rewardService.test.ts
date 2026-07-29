// ═══════════════════════════════════════════════════════════════════════════
// rewardService.test.ts — Profil badge/reward tizimi testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance, mockAddXP } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn() } as Record<string, unknown>,
  mockAddXP: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../store/useStore', () => ({ useStore: { getState: () => ({ addXP: mockAddXP }) } }))

import { buildQB } from '../../test/supabaseMock'
import {
  getRewardById, getClaimedRewardIds, getUserRewards, claimPendingRewards,
} from '../rewardService'
import { PROFILE_REWARDS } from '../../data/rewards'

beforeEach(() => {
  mockSupabaseInstance.from.mockReset()
  mockAddXP.mockReset()
})
afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
  return qb
}

describe('getRewardById (pure)', () => {
  it('finds an existing reward', () => {
    const first = PROFILE_REWARDS[0]
    expect(getRewardById(first.id)?.id).toBe(first.id)
  })
  it('returns undefined for unknown id', () => {
    expect(getRewardById('nope')).toBeUndefined()
  })
})

describe('getClaimedRewardIds', () => {
  it('maps reward_id rows', async () => {
    queueQB([{ reward_id: 'reward-7' }, { reward_id: 'reward-30' }])
    expect(await getClaimedRewardIds('u1')).toEqual(['reward-7', 'reward-30'])
  })
  it('returns [] when none', async () => {
    queueQB(null)
    expect(await getClaimedRewardIds('u1')).toEqual([])
  })
})

describe('getUserRewards (highest + next)', () => {
  it('computes highest badge and next reward', async () => {
    // Eng past order'li rewardni claim qilgan deb faraz qilamiz
    const sorted = [...PROFILE_REWARDS].sort((a, b) => a.order - b.order)
    const claimedId = sorted[0].id
    queueQB([{ reward_id: claimedId }])

    const res = await getUserRewards('u1')
    expect(res.claimed.map(r => r.id)).toContain(claimedId)
    expect(res.highestBadge?.id).toBe(claimedId)
    // Keyingi reward — order bo'yicha undan yuqorisi
    expect(res.nextReward?.order).toBeGreaterThan(sorted[0].order)
  })

  it('no claims → null badge, first reward as next', async () => {
    queueQB([])
    const res = await getUserRewards('u1')
    expect(res.claimed).toEqual([])
    expect(res.highestBadge).toBeNull()
    expect(res.nextReward).not.toBeNull()
  })
})

describe('claimPendingRewards', () => {
  it('claims xp_bonus reward at streak=7 and awards XP', async () => {
    // 7-kunlik reward (reward-7, xpBonus 100) — qator misolida birinchi
    const reward7 = PROFILE_REWARDS.find(r => r.streakDays === 7)!
    queueQB(null, null) // insert muvaffaqiyatli

    const newly = await claimPendingRewards('u1', 7, [])
    expect(newly.map(r => r.id)).toContain(reward7.id)
    if (reward7.xpBonus) expect(mockAddXP).toHaveBeenCalledWith(reward7.xpBonus)
  })

  it('returns [] when nothing claimable (streak too low)', async () => {
    const newly = await claimPendingRewards('u1', 0, [])
    expect(newly).toEqual([])
    expect(mockSupabaseInstance.from).not.toHaveBeenCalled() // hech qanday insert yo'q
  })

  it('skips already-claimed rewards', async () => {
    const allIds = PROFILE_REWARDS.map(r => r.id)
    const newly = await claimPendingRewards('u1', 999, allIds) // hammasi claimed
    expect(newly).toEqual([])
  })
})
