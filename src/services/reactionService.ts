// ═══════════════════════════════════════════════════════════════════════════
// reactionService.ts — Profil reaksiyalari (🔥💪😂)
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

export type ReactionType = 'fire' | 'muscle' | 'laugh' | 'clap' | 'party'

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  fire: '🔥',
  muscle: '💪',
  laugh: '😂',
  clap: '👏',
  party: '🎉',
}

export const REACTION_LABELS: Record<ReactionType, string> = {
  fire: 'Qizg\'in!',
  muscle: 'Kuch!',
  laugh: 'Kulgili',
  clap: 'Barakalla',
  party: 'Tantana!',
}

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

/** Reaksiya qo'shish */
export async function addReaction(
  targetUserId: string,
  reactionType: ReactionType,
): Promise<boolean> {
  const userId = await getUserId()
  if (!userId || userId === targetUserId) return false

  try {
    const { error } = await supabase
      .from('profile_reactions')
      .insert({ target_user_id: targetUserId, reactor_user_id: userId, reaction_type: reactionType })

    if (error) throw error
    return true
  } catch (e) {
    // UNIQUE constraint xatosi — reaksiya allaqachon mavjud
    if (e instanceof Error && e.message.includes('duplicate')) return false
    monitoring.captureMessage('addReaction failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/** Reaksiyani olib tashlash */
export async function removeReaction(
  targetUserId: string,
  reactionType: ReactionType,
): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const { error } = await supabase
      .from('profile_reactions')
      .delete()
      .eq('target_user_id', targetUserId)
      .eq('reactor_user_id', userId)
      .eq('reaction_type', reactionType)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('removeReaction failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/** Foydalanuvchining barcha reaksiyalarini olish (count bilan) */
export async function getReactions(
  targetUserId: string,
): Promise<{ type: ReactionType; count: number; iReacted: boolean }[]> {
  const userId = await getUserId()

  try {
    const { data } = await supabase
      .from('profile_reactions')
      .select('reaction_type, reactor_user_id')
      .eq('target_user_id', targetUserId)

    if (!data) return []

    const counts = new Map<string, number>()
    const iReactedSet = new Set<string>()

    for (const row of data) {
      const t = row.reaction_type as ReactionType
      counts.set(t, (counts.get(t) ?? 0) + 1)
      if (userId && row.reactor_user_id === userId) iReactedSet.add(t)
    }

    const allTypes: ReactionType[] = ['fire', 'muscle', 'laugh', 'clap', 'party']
    return allTypes.map(type => ({
      type,
      count: counts.get(type) ?? 0,
      iReacted: iReactedSet.has(type),
    }))
  } catch (e) {
    monitoring.captureMessage('getReactions failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}
