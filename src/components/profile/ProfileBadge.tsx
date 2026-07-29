// ═══════════════════════════════════════════════════════════════════════════
// ProfileBadge — Profil headeridagi badge/emblem ko'rinishi
// 30 kun → Badge · 90 kun → Emblem
// ═══════════════════════════════════════════════════════════════════════════

import { Sparkles, Flame, Crown } from 'lucide-react'
import type { ProfileReward } from '../../data/rewards'
import { getNextReward, PROFILE_REWARDS } from '../../data/rewards'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** Foydalanuvchining hozirgi streak i */
  streak: number
  /** Claim qilingan reward IDlari */
  claimedRewardIds: string[]
  /** Rewardlar yuklanayotgan bo'lsa */
  loading?: boolean
  /** Badge/emblem bosilganda chaqiriladi */
  onRewardClick?: (reward: ProfileReward) => void
}

// ─── Badge Component ──────────────────────────────────────────────────────────

function RewardBadge({
  reward,
  unlocked,
  onClick,
}: {
  reward: ProfileReward
  unlocked: boolean
  onClick?: () => void
}) {
  const baseCls = 'relative flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95'

  if (!unlocked) {
    return (
      <div className={`${baseCls} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50`} onClick={onClick}>
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
          🔒
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {reward.streakDays} kun
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {reward.type === 'emblem' ? 'Emblem' : reward.type === 'badge' ? 'Badge' : 'Bonus'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${baseCls} bg-gradient-to-br ${reward.gradient} text-white shadow-lg border-transparent`}
      onClick={onClick}
    >
      {/* Glow effect for emblem */}
      {reward.type === 'emblem' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 rounded-2xl blur opacity-40 -z-10 animate-pulse" />
      )}

      <div className={`w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm`}>
        {reward.icon}
      </div>

      <div className="text-left">
        <p className="text-xs font-bold drop-shadow-sm">{reward.title}</p>
        <p className="text-xs text-white/80 drop-shadow-sm">
          {reward.type === 'emblem' ? '🏆 Maxsus Emblem' : reward.type === 'badge' ? '🏅 Badge' : '✨ Bonus'}
        </p>
      </div>

      {/* Sparkle for unlocked */}
      <Sparkles size={12} className="absolute -top-1 -right-1 text-white/70" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileBadges({
  streak,
  claimedRewardIds,
  loading,
  onRewardClick,
}: Props) {
  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-28 rounded-xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  const nextInfo = getNextReward(streak)

  return (
    <div className="space-y-3">
      {/* Badge/Emblem chain */}
      <div className="flex gap-2 flex-wrap">
        {PROFILE_REWARDS.map((reward: ProfileReward) => {
          const unlocked = claimedRewardIds.includes(reward.id)
          return (
            <RewardBadge
              key={reward.id}
              reward={reward}
              unlocked={unlocked}
              onClick={() => onRewardClick?.(reward)}
            />
          )
        })}
      </div>

      {/* Next reward progress */}
      {nextInfo.next && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <Flame size={12} className="text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {nextInfo.next.type === 'emblem' ? `"${nextInfo.next.title}"` : nextInfo.next.title}
              </span>
            </div>
            <span className="text-gray-400">
              {streak}/{nextInfo.target} kun
            </span>
          </div>

          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
              style={{ width: `${nextInfo.progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-1.5">
            {nextInfo.next.type === 'xp_bonus'
              ? `+${nextInfo.next.xpBonus} XP bonus`
              : nextInfo.next.type === 'badge'
                ? 'Badge ochish uchun'
                : 'Maxsus Emblem ochish uchun'}
          </p>
        </div>
      )}

      {/* All rewards unlocked */}
      {!nextInfo.next && streak > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <Crown size={14} />
          Barcha rewardlar ochildi! 🎉
        </div>
      )}
    </div>
  )
}
