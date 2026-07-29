export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'emerald' | 'ruby' | 'sapphire' | 'diamond' | 'master' | 'grandmaster' | 'legend'

export const leagues: { tier: LeagueTier; name: string; minXp: number; color: string; emoji: string }[] = [
  { tier: 'bronze', name: 'Bronze', minXp: 0, color: '#CD7F32', emoji: '🥉' },
  { tier: 'silver', name: 'Silver', minXp: 500, color: '#C0C0C0', emoji: '🥈' },
  { tier: 'gold', name: 'Gold', minXp: 1500, color: '#FFD700', emoji: '🥇' },
  { tier: 'emerald', name: 'Emerald', minXp: 3500, color: '#50C878', emoji: '💎' },
  { tier: 'ruby', name: 'Ruby', minXp: 7000, color: '#E0115F', emoji: '🔮' },
  { tier: 'sapphire', name: 'Sapphire', minXp: 12000, color: '#0F52BA', emoji: '🔥' },
  { tier: 'diamond', name: 'Diamond', minXp: 20000, color: '#B9F2FF', emoji: '💠' },
  { tier: 'master', name: 'Master', minXp: 35000, color: '#9B59B6', emoji: '👑' },
  { tier: 'grandmaster', name: 'Grandmaster', minXp: 55000, color: '#E74C3C', emoji: '🌟' },
  { tier: 'legend', name: 'Legend', minXp: 80000, color: '#F39C12', emoji: '⭐' },
]

// ── League Group System ─────────────────────────────────────────────────────
// Har bir tier uchun ~30 kishilik guruhlar. Foydalanuvchi ID asosida
// guruh raqami aniqlanadi.

export const GROUPS_PER_TIER = 10  // har bir tierda 10 ta group (300 kishi/tier)
export const GROUP_SIZE = 30       // har bir guruhda ~30 kishi

// Promotion/Demotion slots per group
export const PROMOTE_COUNT = 5    // Top 5 → keyingi tier ga o'tadi
export const DEMOTE_COUNT = 5     // Bottom 5 → pastki tier ga tushadi

// League weekly rewards (XP)
export const LEAGUE_REWARDS = {
  promotion: 200,    // Yuqori ligaga ko'tarilganda
  top3: [150, 100, 75], // 1, 2, 3 o'rinlar
  top10: 50,          // 4-10 o'rinlar
  participation: 25,   // Qatnashgan barcha
} as const

// ── Helper: user ID dan group raqamini hisoblash ───────────────────────────

export function getLeagueGroupNumber(userId: string): number {
  // Deterministic: user ID ning oxirgi 4 belgisini hash qilamiz
  let hash = 0
  const idSuffix = userId.slice(-8)
  for (let i = 0; i < idSuffix.length; i++) {
    hash = ((hash << 5) - hash) + idSuffix.charCodeAt(i)
    hash |= 0  // 32-bit integer
  }
  return Math.abs(hash) % GROUPS_PER_TIER + 1
}

// ── Helper: Double XP weekend detection (Tashkent timezone) ────────────────

export function isDoubleXpWeekend(): boolean {
  // Tashkent vaqti bilan Shanba (6) yoki Yakshanba (0)
  const now = new Date()
  const tashkentOffset = 5 * 60  // UTC+5
  const localOffset = now.getTimezoneOffset()
  const tashkentTime = new Date(now.getTime() + (localOffset + tashkentOffset) * 60_000)
  const day = tashkentTime.getUTCDay()
  return day === 0 || day === 6
}

export function getXpMultiplier(): number {
  return isDoubleXpWeekend() ? 2 : 1
}

// ── Helper: Hafta boshi (Dushanba) ────────────────────────────────────────

export function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split('T')[0]
}

// Hafta tugashiga qancha vaqt qoldi (ms)
export function getWeekEndMs(): number {
  const now = new Date()
  const day = now.getDay()
  // Next Monday 00:00 Tashkent
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const nextMonday = new Date(now)
  nextMonday.setDate(now.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  // Adjust to Tashkent time
  const tashkentOffset = 5 * 60 * 60_000
  const localOffset = now.getTimezoneOffset() * 60_000
  const nextMondayTashkent = nextMonday.getTime() + (localOffset + tashkentOffset)
  return Math.max(0, nextMondayTashkent - Date.now())
}
