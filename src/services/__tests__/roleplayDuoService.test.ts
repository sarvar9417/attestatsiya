// ═══════════════════════════════════════════════════════════════════════════
// roleplayDuoService.test.ts — Tandem AI Roleplay Duo servis testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance, mockNotify, mockGetScenario, mockGenReport } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn(), auth: { getSession: vi.fn() } } as Record<string, unknown>,
  mockNotify: vi.fn(),
  mockGetScenario: vi.fn(),
  mockGenReport: vi.fn(),
}))

const mockSession = { data: { session: { user: { id: 'user-a' } } } }

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../hooks/useNotifications', () => ({ sendBrowserNotification: mockNotify }))
vi.mock('../../data/conversationScenarios', () => ({ getScenario: mockGetScenario }))
vi.mock('../../lib/claude', () => ({ generateDuoRoleplayReport: mockGenReport }))

import { buildQB } from '../../test/supabaseMock'
import {
  createRoleplaySession, getRoleplaySession, getRoleplaySessionsForPair,
  updateSessionStatus, saveUserAMessages, saveRoleplayEvaluations,
  sessionsToDuoItems, evaluateDuoRoleplay,
} from '../roleplayDuoService'
import type { RoleplaySession } from '../../types/tandem'

beforeEach(() => {
  mockSupabaseInstance.auth.getSession.mockResolvedValue(mockSession)
  mockSupabaseInstance.from.mockReset()
  mockNotify.mockReset()
  mockGetScenario.mockReset()
  mockGetScenario.mockReturnValue({
    titleUz: 'Restoranda', emoji: '🍽️', aiRole: 'waiter', userRole: 'customer',
    opening: 'Welcome', title: 'Restaurant', goalUz: 'Buyurtma bering',
  })
  mockGenReport.mockReset()
})

afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
  return qb
}

describe('createRoleplaySession', () => {
  it('creates session when pair exists', async () => {
    queueQB({ user_a: 'user-a', user_b: 'user-b' })          // pair fetch
    const ins = queueQB({ id: 'rp-1', status: 'invited', pair_id: 'pair-1' }) // insert
    queueQB({ name: 'Ali' })                                  // getUserName (notification)

    const res = await createRoleplaySession('pair-1', 'restaurant')
    expect(res.success).toBe(true)
    expect(res.session?.id).toBe('rp-1')
    expect(ins.insert).toHaveBeenCalledWith(expect.objectContaining({
      pair_id: 'pair-1', scenario_id: 'restaurant', creator_id: 'user-a', status: 'invited',
    }))
    expect(mockNotify).toHaveBeenCalled()
  })

  it('fails without auth', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue({ data: { session: null } })
    const res = await createRoleplaySession('pair-1', 'restaurant')
    expect(res.success).toBe(false)
    expect(res.error).toContain('Auth')
  })

  it('fails when pair not found', async () => {
    queueQB(null) // pair fetch → null
    const res = await createRoleplaySession('pair-x', 'restaurant')
    expect(res.success).toBe(false)
    expect(res.error).toContain('juftlik')
  })
})

describe('getRoleplaySession', () => {
  it('returns session', async () => {
    queueQB({ id: 'rp-1', status: 'invited' })
    const s = await getRoleplaySession('rp-1')
    expect(s?.id).toBe('rp-1')
  })

  it('returns null on error', async () => {
    queueQB(null, { message: 'not found' })
    const s = await getRoleplaySession('rp-x')
    expect(s).toBeNull()
  })
})

describe('getRoleplaySessionsForPair', () => {
  it('returns [] when no pair', async () => {
    queueQB(null) // pair lookup → null
    const list = await getRoleplaySessionsForPair()
    expect(list).toEqual([])
  })

  it('returns sessions for pair', async () => {
    queueQB({ id: 'pair-1' })                                  // pair lookup
    queueQB([{ id: 'rp-1' }, { id: 'rp-2' }])                  // sessions
    const list = await getRoleplaySessionsForPair()
    expect(list).toHaveLength(2)
  })
})

describe('update/save helpers', () => {
  it('updateSessionStatus returns true on success', async () => {
    queueQB(null, null)
    expect(await updateSessionStatus('rp-1', 'completed')).toBe(true)
  })

  it('updateSessionStatus returns false on error', async () => {
    queueQB(null, { message: 'fail' })
    expect(await updateSessionStatus('rp-1', 'completed')).toBe(false)
  })

  it('saveUserAMessages returns true on success', async () => {
    queueQB(null, null)
    expect(await saveUserAMessages('rp-1', [{ role: 'user', content: 'hi' }])).toBe(true)
  })

  it('saveRoleplayEvaluations returns false on error', async () => {
    queueQB(null, { message: 'fail' })
    const evalA = { fluency: 8, taskSuccess: 7, newWords: [], mistakes: [], feedback: '' }
    expect(await saveRoleplayEvaluations('rp-1', evalA, evalA)).toBe(false)
  })
})

describe('sessionsToDuoItems (navbat mantig\'i)', () => {
  const base = {
    pair_id: 'pair-1', scenario_id: 'restaurant', creator_id: 'user-a',
    user_a_messages: [], user_b_messages: [], created_at: '2026-06-15',
  }

  it('invited → creator (user-a) navbati', () => {
    const sessions = [{ ...base, id: 'rp-1', status: 'invited' }] as unknown as RoleplaySession[]
    const items = sessionsToDuoItems(sessions, 'user-a')
    expect(items[0].myTurn).toBe(true)
    const itemsB = sessionsToDuoItems(sessions, 'user-b')
    expect(itemsB[0].myTurn).toBe(false)
  })

  it('user_a_done → ikkinchi a\'zo (user-b) navbati', () => {
    const sessions = [{ ...base, id: 'rp-1', status: 'user_a_done' }] as unknown as RoleplaySession[]
    expect(sessionsToDuoItems(sessions, 'user-b')[0].myTurn).toBe(true)
    expect(sessionsToDuoItems(sessions, 'user-a')[0].myTurn).toBe(false)
  })

  it('completed → hech kimning navbati emas + ballar hisoblanadi', () => {
    const sessions = [{
      ...base, id: 'rp-1', status: 'completed',
      user_a_evaluation: { fluency: 8, taskSuccess: 6 },
      user_b_evaluation: { fluency: 9, taskSuccess: 7 },
    }] as unknown as RoleplaySession[]
    const item = sessionsToDuoItems(sessions, 'user-a')[0]
    expect(item.myTurn).toBe(false)
    expect(item.scoreA).toBe(7)  // round((8+6)/2)
    expect(item.scoreB).toBe(8)  // round((9+7)/2)
    expect(item.scenarioEmoji).toBe('🍽️')
  })
})

describe('evaluateDuoRoleplay', () => {
  it('idempotent: completed session → AI chaqirmaydi (BUG 10)', async () => {
    queueQB({ id: 'rp-1', status: 'completed', pair_id: 'pair-1' }) // getRoleplaySession
    const res = await evaluateDuoRoleplay('rp-1')
    expect(res.success).toBe(true)
    expect(mockGenReport).not.toHaveBeenCalled()      // qimmat AI chaqirilmadi
    expect(mockSupabaseInstance.from).toHaveBeenCalledTimes(1) // faqat session o'qildi
  })

  it('session topilmasa xato qaytaradi', async () => {
    queueQB(null, { message: 'not found' }) // getRoleplaySession → null
    const res = await evaluateDuoRoleplay('rp-x')
    expect(res.success).toBe(false)
    expect(res.error).toContain('Session')
  })
})
