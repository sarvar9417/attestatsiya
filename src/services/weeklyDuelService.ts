// ═══════════════════════════════════════════════════════════════════════════
// weeklyDuelService.ts — Haftalik Duel CRUD
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

export interface WeeklyDuelData {
  id: string
  pair_id: string
  week_start: string
  user_a_xp: number
  user_b_xp: number
  winner_id: string | null
  settled_at: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
//  WEEKLY DUEL
// ═══════════════════════════════════════════════════════════════════════════

/** Joriy haftadagi weekly duelni olish yoki yaratish */
export async function getOrCreateWeeklyDuel(pairId: string): Promise<WeeklyDuelData | null> {
  try {
    const { getWeekStart } = await import('../data/leagues')
    const weekStart = getWeekStart()

    const { data: existing } = await supabase
      .from('weekly_duels')
      .select('*')
      .eq('pair_id', pairId)
      .eq('week_start', weekStart)
      .maybeSingle()

    if (existing) return existing as WeeklyDuelData

    await settleWeeklyDuel(pairId)

    const { data: newDuel } = await supabase
      .from('weekly_duels')
      .insert({
        pair_id: pairId,
        week_start: weekStart,
        user_a_xp: 0,
        user_b_xp: 0,
      })
      .select()
      .single()

    return newDuel as WeeklyDuelData | null
  } catch (e) {
    monitoring.captureMessage('getOrCreateWeeklyDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}

/** Weekly duel XP ni yangilash (tandem pair a'zosi XP oshganda) */
export async function updateWeeklyDuelXP(userId: string, xpAmount: number): Promise<void> {
  const { getTandemPair } = await import('./tandemPairService')
  const pair = await getTandemPair()
  if (!pair) return

  const { getWeekStart } = await import('../data/leagues')
  const weekStart = getWeekStart()

  const isUserA = pair.user_a === userId
  const field = isUserA ? 'user_a_xp' : 'user_b_xp'

  try {
    await supabase.rpc('increment_weekly_xp', {
      p_pair_id: pair.id,
      p_week_start: weekStart,
      p_field: field,
      p_amount: xpAmount,
    })
  } catch (e) {
    monitoring.captureMessage('updateWeeklyDuelXP RPC failed, trying upsert: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    try {
      const duel = await getOrCreateWeeklyDuel(pair.id)
      if (!duel) return

      const xpValue = (isUserA ? duel.user_a_xp : duel.user_b_xp) + xpAmount
      if (isUserA) {
        await supabase.from('weekly_duels').update({ user_a_xp: xpValue }).eq('id', duel.id)
      } else {
        await supabase.from('weekly_duels').update({ user_b_xp: xpValue }).eq('id', duel.id)
      }
    } catch (e) {
      monitoring.captureMessage('updateWeeklyDuelXP upsert fallback failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    }
  }
}

/** Hafta yakunida g'olibni aniqlash va belgilash */
export async function settleWeeklyDuel(pairId: string): Promise<{ winnerId: string | null; draw: boolean }> {
  try {
    const { getWeekStart } = await import('../data/leagues')
    const weekStart = getWeekStart()

    const lastMonday = new Date(weekStart + 'T00:00:00Z')
    lastMonday.setUTCDate(lastMonday.getUTCDate() - 7)
    const lastWeekStart = lastMonday.toISOString().split('T')[0]

    const { data: duel } = await supabase
      .from('weekly_duels')
      .select('*')
      .eq('pair_id', pairId)
      .eq('week_start', lastWeekStart)
      .maybeSingle()

    if (!duel || duel.settled_at) return { winnerId: null, draw: false }

    const userA = duel.user_a_xp
    const userB = duel.user_b_xp

    let winnerId: string | null = null
    if (userA !== userB) {
      const { data: pair } = await supabase
        .from('tandem_pairs')
        .select('user_a, user_b')
        .eq('id', pairId)
        .single()
      if (pair) {
        winnerId = userA > userB ? pair.user_a : pair.user_b
      }
    }

    const draw = userA === userB

    const { data: settled } = await supabase
      .from('weekly_duels')
      .update({
        winner_id: winnerId,
        settled_at: new Date().toISOString(),
      })
      .eq('id', duel.id)
      .is('settled_at', null)
      .select('id')

    if (!settled || settled.length === 0) return { winnerId, draw }

    if (winnerId) {
      const currentUserId = await getUserId()
      if (currentUserId === winnerId) {
        import('../store/useStore').then(({ useStore }) => {
          useStore.getState().addXP(100)
        }).catch(() => {
          import('../utils/toastStore').then(({ useToastStore }) => {
            useToastStore.getState().toast('Haftalik g\'alaba bonusi yuklanmadi', 'warning', 4000)
          }).catch(() => {})
        })
      }
    }

    return { winnerId, draw }
  } catch (e) {
    monitoring.captureMessage('settleWeeklyDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { winnerId: null, draw: false }
  }
}

/** Foydalanuvchining jami g'alabalari soni */
export async function getWeeklyDuelWins(userId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('weekly_duels')
      .select('*', { count: 'exact', head: true })
      .eq('winner_id', userId)
    return count ?? 0
  } catch (e) {
    monitoring.captureMessage('getWeeklyDuelWins failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return 0
  }
}
