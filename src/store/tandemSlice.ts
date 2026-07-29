// ═══════════════════════════════════════════════════════════════════════════
// tandemSlice.ts — Tandem holati (Zustand)
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FriendWithProfile, TandemPair, Duel, DuellistItem, DuelMode, RoleplaySession, RoleplayDuoItem } from '../types/tandem'
import { monitoring } from '../lib/monitoring'
import {
  getFriends,
  getTandemPair,
  getActiveDuels,
  getDuelHistory,
  getOpponentPendingDuels,
  removeFriend as removeFriendService,
  createTandemPair,
  createDuel,
  cancelDuel as cancelDuelService,
} from '../services/tandemService'
import {
  getRoleplaySessionsForPair,
  createRoleplaySession,
  sessionsToDuoItems,
} from '../services/roleplayDuoService'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface TandemState {
  // Do'stlar
  friends: FriendWithProfile[]
  pendingInvites: FriendWithProfile[]
  loadingFriends: boolean

  // Juftlik
  tandemPair: TandemPair | null
  loadingPair: boolean

  // Duellar
  activeDuels: DuellistItem[]
  duelHistory: DuellistItem[]
  pendingOpponentDuels: DuellistItem[]
  loadingDuels: boolean

  // Roleplay Duo
  roleplaySessions: RoleplayDuoItem[]
  activeRoleplaySession: RoleplaySession | null
  loadingRoleplay: boolean

  // Invite
  inviteCode: string

  // Actions
  loadFriends: () => Promise<void>
  loadTandemPair: () => Promise<void>
  loadDuels: () => Promise<void>
  loadAll: () => Promise<void>
  removeFriend: (friendshipId: string) => Promise<boolean>
  initTandemPair: (friendId: string) => Promise<boolean>
  startDuel: (opponentId: string | null, mode: DuelMode, level?: string) => Promise<Duel | null>
  cancelDuel: (duelId: string) => Promise<boolean>
  setInviteCode: (code: string) => void
  loadRoleplaySessions: () => Promise<void>
  createDuoRoleplay: (scenarioId: string) => Promise<RoleplaySession | null>
  setActiveRoleplaySession: (session: RoleplaySession | null) => void
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function duelToListItem(duel: Duel, userId: string): DuellistItem {
  const isChallenger = duel.challenger === userId
  return {
    id: duel.id,
    opponentId: isChallenger ? (duel.opponent ?? 'ai') : duel.challenger,
    opponentName: isChallenger ? (duel.is_bot ? 'AI Bot' : 'Raqib') : 'Siz',
    mode: duel.mode,
    status: duel.status,
    myScore: isChallenger ? duel.challenger_score : duel.opponent_score,
    theirScore: isChallenger ? duel.opponent_score : duel.challenger_score,
    expiresAt: duel.expires_at,
    isBot: duel.is_bot,
    lessonTitle: duel.lesson_title ?? null,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════════════════════════════

export const useTandemStore = create<TandemState>()(
  persist(
    (set, get) => ({
      friends: [],
      pendingInvites: [],
      loadingFriends: false,
      tandemPair: null,
      loadingPair: false,
      activeDuels: [],
      duelHistory: [],
      pendingOpponentDuels: [],
      loadingDuels: false,
      roleplaySessions: [],
      activeRoleplaySession: null,
      loadingRoleplay: false,
      inviteCode: '',

      loadFriends: async () => {
        set({ loadingFriends: true })
        const friends = await getFriends()
        const accepted = friends.filter(f => f.status === 'accepted').map(f => ({
          friendshipId: f.friendship_id,
          userId: f.id,
          name: f.name,
          level: f.level,
          streak: f.streak,
          lastActive: f.last_active,
          status: f.status as FriendWithProfile['status'],
        }))
        const pending = friends.filter(f => f.status === 'pending').map(f => ({
          friendshipId: f.friendship_id,
          userId: f.id,
          name: f.name,
          level: f.level,
          streak: f.streak,
          lastActive: f.last_active,
          status: f.status as FriendWithProfile['status'],
        }))
        set({ friends: accepted, pendingInvites: pending, loadingFriends: false })
      },

      loadTandemPair: async () => {
        set({ loadingPair: true })
        const pair = await getTandemPair()
        set({ tandemPair: pair, loadingPair: false })
      },

      loadDuels: async () => {
        set({ loadingDuels: true })
        const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession()
        const userId = session?.user.id
        if (!userId) { set({ loadingDuels: false }); return }

        const [activeDuelRows, historyRows, pendingRows] = await Promise.all([
          getActiveDuels(),
          getDuelHistory(),
          getOpponentPendingDuels(),
        ])

        set({
          activeDuels: activeDuelRows.map(d => duelToListItem(d, userId)),
          duelHistory: historyRows.map(d => duelToListItem(d, userId)),
          pendingOpponentDuels: pendingRows.map(d => duelToListItem(d, userId)),
          loadingDuels: false,
        })
      },

      loadAll: async () => {
        await Promise.all([
          get().loadFriends(),
          get().loadTandemPair(),
          get().loadDuels(),
        ])
      },

      removeFriend: async (friendshipId) => {
        const result = await removeFriendService(friendshipId)
        if (result.success) {
          set(s => ({
            friends: s.friends.filter(f => f.friendshipId !== friendshipId),
            pendingInvites: s.pendingInvites.filter(f => f.friendshipId !== friendshipId),
          }))
        }
        return result.success
      },

      initTandemPair: async (friendId) => {
        const result = await createTandemPair(friendId)
        if (result.success && result.pair) {
          set({ tandemPair: result.pair })
        }
        return result.success
      },

      startDuel: async (opponentId, mode, level) => {
        const result = await createDuel(opponentId, mode, level)
        if (result.success && result.duel) {
          await get().loadDuels()
          return result.duel  // return full Duel object
        }
        return null
      },

      cancelDuel: async (duelId) => {
        const result = await cancelDuelService(duelId)
        if (result.success) {
          await get().loadDuels()
        }
        return result.success
      },

      loadRoleplaySessions: async () => {
        set({ loadingRoleplay: true })
        try {
          const { supabase } = await import('../lib/supabase')
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user.id) { set({ loadingRoleplay: false }); return }

          const sessions = await getRoleplaySessionsForPair()
          const items = sessionsToDuoItems(sessions, session.user.id)
          set({ roleplaySessions: items, loadingRoleplay: false })
        } catch (e) {
          monitoring.captureMessage('loadRoleplaySessions failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          set({ loadingRoleplay: false })
        }
      },

      createDuoRoleplay: async (scenarioId) => {
        const pair = get().tandemPair
        if (!pair) return null

        const result = await createRoleplaySession(pair.id, scenarioId)
        if (result.success && result.session) {
          await get().loadRoleplaySessions()
          set({ activeRoleplaySession: result.session })
          return result.session
        }
        return null
      },

      setActiveRoleplaySession: (session) => set({ activeRoleplaySession: session }),
      setInviteCode: (code) => set({ inviteCode: code }),

      // Invite kodi komponentda componentDidMount da hisoblanadi
    }),
    {
      name: 'tandem-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        inviteCode: state.inviteCode,
      }),
    }
  )
)
