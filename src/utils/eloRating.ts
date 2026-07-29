// ═══════════════════════════════════════════════════════════════════════════
// eloRating.ts — Elo rating tizimi (Tandem duel uchun)
// ═══════════════════════════════════════════════════════════════════════════

/** Elo rating hisoblash natijasi */
export interface EloResult {
  playerA: number  // yangi rating (A — joriy foydalanuvchi)
  playerB: number  // yangi rating (B — raqib/bot)
  changeA: number  // o'zgarish miqdori
  changeB: number
}

/** Elo tier */
export type EloTier =
  | 'bronze'     // 0–999
  | 'silver'     // 1000–1199
  | 'gold'       // 1200–1399
  | 'platinum'   // 1400–1599
  | 'diamond'    // 1600–1799
  | 'master'     // 1800–2000
  | 'grandmaster' // 2000+

export const ELO_TIERS: { tier: EloTier; min: number; max: number; label: string; emoji: string; color: string }[] = [
  { tier: 'bronze',    min: 0,     max: 999,   label: 'Bronze',    emoji: '🥉', color: 'text-amber-700' },
  { tier: 'silver',    min: 1000,  max: 1199,  label: 'Silver',    emoji: '🥈', color: 'text-gray-400' },
  { tier: 'gold',      min: 1200,  max: 1399,  label: 'Gold',      emoji: '🥇', color: 'text-yellow-500' },
  { tier: 'platinum',  min: 1400,  max: 1599,  label: 'Platinum',  emoji: '💎', color: 'text-cyan-500' },
  { tier: 'diamond',   min: 1600,  max: 1799,  label: 'Diamond',   emoji: '💠', color: 'text-blue-400' },
  { tier: 'master',    min: 1800,  max: 1999,  label: 'Master',    emoji: '👑', color: 'text-purple-500' },
  { tier: 'grandmaster', min: 2000, max: 9999, label: 'Grandmaster', emoji: '🌟', color: 'text-red-500' },
]

export const INITIAL_ELO = 1000

/** Berilgan rating uchun K-factorni qaytaradi */
export function getKFactor(rating: number): number {
  if (rating < 1000) return 32   // yangi foydalanuvchilar
  if (rating < 2000) return 24   // o'rtacha
  return 16                       // yuqori daraja
}

/** Elo rating hisoblash */
export function calculateElo(
  ratingA: number,
  ratingB: number,
  scoreA: number,   // 1 = g'alaba, 0.5 = durang, 0 = mag'lubiyat
  scoreB: number,   // 1 - scoreA
): EloResult {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  const expectedB = 1 - expectedA

  const kA = getKFactor(ratingA)
  const kB = getKFactor(ratingB)

  const changeA = Math.round(kA * (scoreA - expectedA))
  const changeB = Math.round(kB * (scoreB - expectedB))

  return {
    playerA: Math.max(0, ratingA + changeA),
    playerB: Math.max(0, ratingB + changeB),
    changeA,
    changeB,
  }
}

/** Duel natijasidan score (1/0.5/0) hisoblash */
export function duelScoreToEloScore(
  myScore: number,
  theirScore: number,
): { my: number; their: number } {
  if (myScore > theirScore) return { my: 1, their: 0 }
  if (myScore < theirScore) return { my: 0, their: 1 }
  return { my: 0.5, their: 0.5 }
}

/** Berilgan rating uchun tier nomini qaytaradi */
export function getEloTier(rating: number): EloTier {
  for (const t of ELO_TIERS) {
    if (rating >= t.min && rating <= t.max) return t.tier
  }
  return 'bronze'
}

/** Berilgan rating uchun tier ma'lumotlarini qaytaradi */
export function getEloTierInfo(rating: number) {
  const tier = getEloTier(rating)
  return ELO_TIERS.find(t => t.tier === tier)!
}

/** Keyingi tier ga necha ball qolganini hisoblash */
export function getEloToNextTier(rating: number): { nextTier: string; pointsNeeded: number; progress: number } {
  const current = getEloTierInfo(rating)
  const currentIdx = ELO_TIERS.findIndex(t => t.tier === current.tier)
  if (currentIdx >= ELO_TIERS.length - 1) {
    return { nextTier: current.label, pointsNeeded: 0, progress: 100 }
  }
  const nextTier = ELO_TIERS[currentIdx + 1]
  const pointsNeeded = nextTier.min - rating
  const tierRange = nextTier.min - current.min
  const progress = Math.min(100, Math.round(((rating - current.min) / tierRange) * 100))
  return { nextTier: nextTier.label, pointsNeeded, progress }
}
