// ═══════════════════════════════════════════════════════════════════════════
// tandemPairService.ts — Tandem Pair (juftlik) CRUD
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import type { TandemPair } from '../types/tandem'
import { getTodayTashkent, addDaysTashkent } from '../utils/tashkentDate'

// ─── Helpers ─────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
//  JUFTLIK (Tandem Pair)
// ═══════════════════════════════════════════════════════════════════════════

/** Juftlikni olish (agar mavjud bo'lsa) */
export async function getTandemPair(): Promise<TandemPair | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from('tandem_pairs')
    .select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .maybeSingle()

  if (error) {
    monitoring.captureMessage('getTandemPair error: ' + error.message, 'warn')
    return null
  }

  return data as TandemPair
}

/** Juftlik yaratish (do'stlik qabul qilingandan keyin) */
export async function createTandemPair(friendId: string): Promise<{ success: boolean; pair?: TandemPair; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { data: existing } = await supabase
    .from('tandem_pairs')
    .select('*')
    .or(`and(user_a.eq.${userId},user_b.eq.${friendId}),and(user_a.eq.${friendId},user_b.eq.${userId})`)
    .maybeSingle()

  if (existing) return { success: true, pair: existing as TandemPair }

  const [ua, ub] = userId < friendId ? [userId, friendId] : [friendId, userId]

  const { data, error } = await supabase
    .from('tandem_pairs')
    .insert({
      user_a: ua,
      user_b: ub,
      combined_streak: 0,
      last_both_active: null,
      total_xp: 0,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: race } = await supabase
        .from('tandem_pairs')
        .select('*')
        .or(`and(user_a.eq.${userId},user_b.eq.${friendId}),and(user_a.eq.${friendId},user_b.eq.${userId})`)
        .maybeSingle()
      if (race) return { success: true, pair: race as TandemPair }
    }
    monitoring.captureMessage('createTandemPair error: ' + error.message, 'error')
    return { success: false, error: 'Juftlik yaratishda xatolik' }
  }

  return { success: true, pair: data as TandemPair }
}

/** Juftlik streakini yangilash (ikkalasi ham bugun dars qilgan bo'lsa) */
export async function updateTandemStreak(): Promise<void> {
  const pair = await getTandemPair()
  if (!pair) return

  const today = getTodayTashkent()
  const yesterday = addDaysTashkent(-1)

  const { data: users } = await supabase
    .from('users')
    .select('id, last_active, streak')
    .in('id', [pair.user_a, pair.user_b])

  if (!users || users.length < 2) return

  const userA = users.find(u => u.id === pair.user_a)
  const userB = users.find(u => u.id === pair.user_b)
  if (!userA || !userB) return

  const aActive = userA.last_active === today
  const bActive = userB.last_active === today

  if (aActive && bActive) {
    if (pair.last_both_active === today) return
    const newStreak = pair.combined_streak + 1
    await supabase
      .from('tandem_pairs')
      .update({
        combined_streak: newStreak,
        last_both_active: today,
        freeze_used_on: null,
      })
      .eq('id', pair.id)

    // ─── Juftlik Streak Milestone XP Bonus ────────────────────────
    const TANDEM_STREAK_MILESTONES: { days: number; xp: number }[] = [
      { days: 7, xp: 30 },
      { days: 14, xp: 60 },
      { days: 21, xp: 100 },
      { days: 30, xp: 150 },
      { days: 60, xp: 300 },
      { days: 90, xp: 500 },
    ]

    const milestone = TANDEM_STREAK_MILESTONES.find(m => m.days === newStreak)
    if (milestone) {
      import('../store/useStore').then(({ useStore }) => {
        useStore.getState().addXP(milestone.xp)
        import('../utils/toastStore').then(({ useToastStore }) => {
          useToastStore.getState().toast(
            `🎉 Juftlik Streak ${milestone.days} kun! +${milestone.xp} XP!`,
            'success', 5000,
          )
        }).catch(() => monitoring.captureMessage('tandem milestone toast failed', 'warn'))
      }).catch(() => {
        monitoring.captureMessage('tandem milestone addXP failed', 'warn')
        import('../utils/toastStore').then(({ useToastStore }) => {
          useToastStore.getState().toast('Juftlik Streak bonusi yuklanmadi', 'warning', 4000)
        }).catch(() => {})
      })

      try {
        await supabase
          .from('tandem_pairs')
          .update({ total_xp: pair.total_xp + milestone.xp })
          .eq('id', pair.id)
      } catch (e) {
        monitoring.captureMessage('tandem milestone total_xp update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }
  } else if (pair.last_both_active === yesterday) {
    // Kecha ikkalasi ham faol edi, bugun hali emas
  } else if (pair.last_both_active && pair.last_both_active < yesterday) {
    const dayBeforeYesterday = addDaysTashkent(-2)
    if (pair.last_both_active === dayBeforeYesterday) {
      await supabase
        .from('tandem_pairs')
        .update({ freeze_used_on: today })
        .eq('id', pair.id)
    } else {
      await supabase
        .from('tandem_pairs')
        .update({ combined_streak: 0, freeze_used_on: null, last_both_active: null })
        .eq('id', pair.id)
    }
  }
}
