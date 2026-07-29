// ═══════════════════════════════════════════════════════════════════════════
// tandemSlice.test.ts — Tandem store testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; auth: { getSession: Mock } } = {
    from: vi.fn(),
    auth: { getSession: vi.fn() },
  }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseInstance,
}))

vi.mock('../../services/tandemService', () => ({
  getFriends: vi.fn(),
  getTandemPair: vi.fn(),
  getActiveDuels: vi.fn(),
  getDuelHistory: vi.fn(),
  getOpponentPendingDuels: vi.fn(),
  removeFriend: vi.fn(),
  createTandemPair: vi.fn(),
  createDuel: vi.fn(),
  cancelDuel: vi.fn(),
}))

vi.mock('../../services/roleplayDuoService', () => ({
  getRoleplaySessionsForPair: vi.fn(),
  createRoleplaySession: vi.fn(),
  sessionsToDuoItems: vi.fn(),
}))

import { useTandemStore } from '../tandemSlice'
import {
  getFriends,
  getTandemPair,
  getActiveDuels,
  getDuelHistory,
  getOpponentPendingDuels,
  removeFriend,
  createTandemPair,
  createDuel,
  cancelDuel,
} from '../../services/tandemService'
import { getRoleplaySessionsForPair, sessionsToDuoItems, createRoleplaySession } from '../../services/roleplayDuoService'

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  useTandemStore.setState({
    friends: [],
    pendingInvites: [],
    tandemPair: null,
    activeDuels: [],
    duelHistory: [],
    pendingOpponentDuels: [],
    roleplaySessions: [],
    loadingFriends: false,
    loadingPair: false,
    loadingDuels: false,
    loadingRoleplay: false,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  loadAll — Full data load
// ═══════════════════════════════════════════════════════════════════════════════

describe('loadAll — full data load cycle', () => {
  it('loads friends, pair and duels', async () => {
    vi.mocked(getFriends).mockResolvedValue([
      {
        id: 'friend-a', name: 'Ali', level: 'B1', streak: 5,
        last_active: '2026-06-15', status: 'accepted', friendship_id: 'fs-1',
      },
      {
        id: 'friend-b', name: 'Vali', level: 'A2', streak: 3,
        last_active: '2026-06-14', status: 'pending', friendship_id: 'fs-2',
      },
    ] as Awaited<ReturnType<typeof getFriends>>)

    vi.mocked(getTandemPair).mockResolvedValue({
      id: 'pair-1', user_a: 'user-1', user_b: 'friend-a',
      combined_streak: 10, total_xp: 500,
    } as Awaited<ReturnType<typeof getTandemPair>>)

    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })

    vi.mocked(getActiveDuels).mockResolvedValue([])
    vi.mocked(getDuelHistory).mockResolvedValue([
      {
        id: 'duel-old', challenger: 'user-1', opponent: 'friend-a',
        mode: 'vocab', status: 'done', challenger_score: 8, opponent_score: 5,
        is_bot: false,
      },
    ] as Awaited<ReturnType<typeof getDuelHistory>>)
    vi.mocked(getOpponentPendingDuels).mockResolvedValue([])

    await useTandemStore.getState().loadAll()

    const state = useTandemStore.getState()
    expect(state.friends).toHaveLength(1)
    expect(state.friends[0].name).toBe('Ali')
    expect(state.pendingInvites).toHaveLength(1)
    expect(state.pendingInvites[0].name).toBe('Vali')
    expect(state.tandemPair?.id).toBe('pair-1')
    expect(state.duelHistory).toHaveLength(1)
    expect(state.loadingFriends).toBe(false)
    expect(state.loadingPair).toBe(false)
    expect(state.loadingDuels).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Friend management
// ═══════════════════════════════════════════════════════════════════════════════

describe('removeFriend', () => {
  it('removes friend from list on success', async () => {
    useTandemStore.setState({
      friends: [{ friendshipId: 'fs-1', userId: 'friend-a', name: 'Ali', level: 'B1', streak: 5, lastActive: null, status: 'accepted' }],
    })
    vi.mocked(removeFriend).mockResolvedValue({ success: true })

    const result = await useTandemStore.getState().removeFriend('fs-1')

    expect(result).toBe(true)
    expect(useTandemStore.getState().friends).toHaveLength(0)
  })

  it('keeps friend list on error', async () => {
    useTandemStore.setState({
      friends: [{ friendshipId: 'fs-1', userId: 'friend-a', name: 'Ali', level: 'B1', streak: 5, lastActive: null, status: 'accepted' }],
    })
    vi.mocked(removeFriend).mockResolvedValue({ success: false, error: 'Xatolik' })

    const result = await useTandemStore.getState().removeFriend('fs-1')

    expect(result).toBe(false)
    expect(useTandemStore.getState().friends).toHaveLength(1)
  })
})

describe('initTandemPair', () => {
  it('stores pair on successful creation', async () => {
    vi.mocked(createTandemPair).mockResolvedValue({
      success: true,
      pair: { id: 'pair-new', user_a: 'user-1', user_b: 'friend-a', combined_streak: 0, total_xp: 0 },
    } as Awaited<ReturnType<typeof createTandemPair>>)

    const result = await useTandemStore.getState().initTandemPair('friend-a')

    expect(result).toBe(true)
    expect(useTandemStore.getState().tandemPair?.id).toBe('pair-new')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Duel management
// ═══════════════════════════════════════════════════════════════════════════════

describe('startDuel + cancelDuel', () => {
  it('startDuel creates duel and reloads duels', async () => {
    vi.mocked(createDuel).mockResolvedValue({
      success: true,
      duel: { id: 'duel-new', challenger: 'user-1', opponent: 'friend-a', mode: 'vocab', status: 'opponent_turn' },
    } as Awaited<ReturnType<typeof createDuel>>)

    vi.mocked(getActiveDuels).mockResolvedValue([
      { id: 'duel-new', challenger: 'user-1', opponent: 'friend-a', mode: 'vocab', status: 'opponent_turn' },
    ] as Awaited<ReturnType<typeof getActiveDuels>>)
    vi.mocked(getDuelHistory).mockResolvedValue([])
    vi.mocked(getOpponentPendingDuels).mockResolvedValue([])
    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })

    const duel = await useTandemStore.getState().startDuel('friend-a', 'vocab')

    expect(duel?.id).toBe('duel-new')
    expect(createDuel).toHaveBeenCalledWith('friend-a', 'vocab', undefined)
    expect(useTandemStore.getState().activeDuels).toHaveLength(1)
  })

  it('cancelDuel cancels and reloads', async () => {
    vi.mocked(cancelDuel).mockResolvedValue({ success: true })
    vi.mocked(getActiveDuels).mockResolvedValue([])
    vi.mocked(getDuelHistory).mockResolvedValue([])
    vi.mocked(getOpponentPendingDuels).mockResolvedValue([])
    // loadDuels needs auth session
    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })

    const result = await useTandemStore.getState().cancelDuel('duel-1')

    expect(result).toBe(true)
    expect(cancelDuel).toHaveBeenCalledWith('duel-1')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Roleplay Duo
// ═══════════════════════════════════════════════════════════════════════════════

describe('Roleplay Duo store actions', () => {
  it('loadRoleplaySessions loads sessions', async () => {
    mockSupabaseInstance.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })

    vi.mocked(getRoleplaySessionsForPair).mockResolvedValue([
      { id: 'rp-1', pair_id: 'pair-1', scenario_id: 'restaurant', status: 'completed' },
    ] as Awaited<ReturnType<typeof getRoleplaySessionsForPair>>)

    vi.mocked(sessionsToDuoItems).mockReturnValue([
      { id: 'rp-1', scenarioTitle: 'Restaurant', scenarioEmoji: '🍽️', status: 'completed', creatorName: 'Ali', myTurn: false, scoreA: 8, scoreB: 7, createdAt: '2026-06-14' },
    ])

    await useTandemStore.getState().loadRoleplaySessions()

    const state = useTandemStore.getState()
    expect(state.roleplaySessions).toHaveLength(1)
    expect(state.roleplaySessions[0].scenarioTitle).toBe('Restaurant')
    expect(state.loadingRoleplay).toBe(false)
  })

  it('createDuoRoleplay creates new session', async () => {
    useTandemStore.setState({
      tandemPair: { id: 'pair-1', user_a: 'user-1', user_b: 'friend-a', combined_streak: 0, total_xp: 0 } as NonNullable<ReturnType<typeof useTandemStore.getState>['tandemPair']>,
    })

    vi.mocked(createRoleplaySession).mockResolvedValue({
      success: true,
      session: { id: 'rp-new', pair_id: 'pair-1', scenario_id: 'restaurant', status: 'user_a_playing' },
    } as Awaited<ReturnType<typeof createRoleplaySession>>)

    vi.mocked(getRoleplaySessionsForPair).mockResolvedValue([])
    vi.mocked(sessionsToDuoItems).mockReturnValue([])

    const session = await useTandemStore.getState().createDuoRoleplay('restaurant')

    expect(session?.id).toBe('rp-new')
    expect(createRoleplaySession).toHaveBeenCalledWith('pair-1', 'restaurant')
    expect(useTandemStore.getState().activeRoleplaySession?.id).toBe('rp-new')
  })
})
