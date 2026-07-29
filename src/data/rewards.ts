// ═══════════════════════════════════════════════════════════════════════════
// rewards.ts — Profil badge/emblem reward tizimi
// 7 kun → +100XP bonus · 30 kun → Badge · 90 kun → Emblem
// ═══════════════════════════════════════════════════════════════════════════

export type RewardTier = 'bronze' | 'silver' | 'gold'

export interface ProfileReward {
  /** Unique identifier */
  id: string
  /** Required streak days */
  streakDays: number
  /** Reward turi */
  type: 'xp_bonus' | 'badge' | 'emblem'
  /** Display name */
  title: string
  /** Description */
  description: string
  /** Emoji icon */
  icon: string
  /** Visual tier */
  tier: RewardTier
  /** XP bonus amount (if type === 'xp_bonus') */
  xpBonus?: number
  /** Gradient class for badge/emblem */
  gradient: string
  /** Order for display */
  order: number
}

export const PROFILE_REWARDS: ProfileReward[] = [
  {
    id: 'reward-7',
    streakDays: 7,
    type: 'xp_bonus',
    title: "7 kun — Katta bonus!",
    description: "Bir hafta to'xtovsiz o'qish uchun +100 XP",
    icon: '🎯',
    tier: 'bronze',
    xpBonus: 100,
    gradient: 'from-amber-400 to-yellow-500',
    order: 1,
  },
  {
    id: 'reward-30',
    streakDays: 30,
    type: 'badge',
    title: "30 kun — Bardoshli Talaba",
    description: "Bir oy davomida barqaror o'qish — badge bilan nishonlanadi",
    icon: '🏅',
    tier: 'silver',
    gradient: 'from-blue-400 to-purple-500',
    order: 2,
  },
  {
    id: 'reward-90',
    streakDays: 90,
    type: 'emblem',
    title: "90 kun — EnglishPath Afsonasi",
    description: "To'liq 90 kunlik kursni yakunlash — maxsus emblem!",
    icon: '👑',
    tier: 'gold',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    order: 3,
  },
]

/** Get all rewards that should be claimable for a given streak */
export function getClaimableRewards(
  streak: number,
  claimedIds: string[],
): ProfileReward[] {
  return PROFILE_REWARDS.filter(
    r => streak >= r.streakDays && !claimedIds.includes(r.id),
  )
}

/** Get the highest unlocked emblem (for profile header display) */
export function getHighestEmblem(
  claimedIds: string[],
): ProfileReward | null {
  // Return the highest claimed emblem or badge
  const claimed = PROFILE_REWARDS.filter(r => claimedIds.includes(r.id))
  if (claimed.length === 0) return null
  return claimed.reduce((a, b) => (a.order > b.order ? a : b))
}

/** Get reward progress info */
export function getNextReward(streak: number): {
  next: ProfileReward | null
  progress: number // 0-100
  current: number
  target: number
} {
  const next = PROFILE_REWARDS.find(r => streak < r.streakDays)
  if (!next) {
    return { next: null, progress: 100, current: streak, target: streak }
  }
  const prev = PROFILE_REWARDS
    .filter(r => r.streakDays < next.streakDays)
    .pop()
  const prevStreak = prev?.streakDays ?? 0
  const progress = ((streak - prevStreak) / (next.streakDays - prevStreak)) * 100
  return {
    next,
    progress: Math.min(100, Math.max(0, progress)),
    current: streak,
    target: next.streakDays,
  }
}
