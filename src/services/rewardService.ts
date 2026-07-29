// ═══════════════════════════════════════════════════════════════════════════
// rewardService.ts — Profil badge/emblem reward tizimi
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import {
  PROFILE_REWARDS,
  getClaimableRewards,
  type ProfileReward,
} from '../data/rewards'
import { useStore } from '../store/useStore'

/** Foydalanuvchining qo'lga kiritgan reward IDlari */
export async function getClaimedRewardIds(userId: string): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('profile_rewards')
      .select('reward_id')
      .eq('user_id', userId)

    return (data ?? []).map(r => r.reward_id)
  } catch (e) {
    monitoring.captureMessage('getClaimedRewardIds error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

/** Streak bo'yicha rewardlarni claim qilish. Yangi claim qilingan rewardlarni qaytaradi. */
export async function claimPendingRewards(
  userId: string,
  streak: number,
  alreadyClaimed: string[],
): Promise<ProfileReward[]> {
  const pending = getClaimableRewards(streak, alreadyClaimed)
  if (pending.length === 0) return []

  const newClaimed: ProfileReward[] = []

  for (const reward of pending) {
    const { error } = await supabase
      .from('profile_rewards')
      .insert({ user_id: userId, reward_id: reward.id })

      if (!error) {
        newClaimed.push(reward)
        // Award XP bonus if applicable
        if (reward.xpBonus && reward.xpBonus > 0) {
          useStore.getState().addXP(reward.xpBonus)
        }
      } else if (!error.message.includes('duplicate')) {
      monitoring.captureMessage('claimReward error: ' + error.message + ' reward: ' + reward.id, 'warn')
    }
  }

  return newClaimed
}

/** Reward ma'lumotini id bo'yicha topish */
export function getRewardById(rewardId: string): ProfileReward | undefined {
  return PROFILE_REWARDS.find(r => r.id === rewardId)
}

/** Foydalanuvchining barcha rewardlarini to'liq obyekt sifatida */
export async function getUserRewards(userId: string): Promise<{
  claimed: ProfileReward[]
  highestBadge: ProfileReward | null
  nextReward: ProfileReward | null
}> {
  const ids = await getClaimedRewardIds(userId)
  const claimed = PROFILE_REWARDS.filter(r => ids.includes(r.id))

  // Highest badge/emblem
  const highestBadge = claimed.length > 0
    ? claimed.reduce((a, b) => (a.order > b.order ? a : b))
    : null

  // Next reward
  const highestClaimed = claimed.reduce((max, r) => Math.max(max, r.order), 0)
  const nextReward = PROFILE_REWARDS.find(r => r.order > highestClaimed) ?? null

  return { claimed, highestBadge, nextReward }
}
