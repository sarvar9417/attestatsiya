// ═══════════════════════════════════════════════════════════════════════════
// RatingBadge — Elo rating daraja badge komponenti
// ═══════════════════════════════════════════════════════════════════════════

import { getEloTierInfo, getEloToNextTier } from '../../utils/eloRating'

interface RatingBadgeProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  /** Qisqa variant (faqat emoji + tier nomi) */
  compact?: boolean
}

const SIZE_MAP = {
  sm: { emoji: 'text-base', rating: 'text-xs', label: 'text-xs', px: 'px-2', py: 'py-0.5' },
  md: { emoji: 'text-xl', rating: 'text-sm', label: 'text-xs', px: 'px-3', py: 'py-1' },
  lg: { emoji: 'text-2xl', rating: 'text-base', label: 'text-sm', px: 'px-4', py: 'py-1.5' },
}

const TIER_BG: Record<string, string> = {
  bronze:    'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  silver:    'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
  gold:      'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
  platinum:  'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
  diamond:   'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  master:    'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  grandmaster: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
}

const TIER_TEXT: Record<string, string> = {
  bronze:    'text-amber-700 dark:text-amber-400',
  silver:    'text-gray-500 dark:text-gray-400',
  gold:      'text-yellow-600 dark:text-yellow-400',
  platinum:  'text-cyan-600 dark:text-cyan-400',
  diamond:   'text-blue-600 dark:text-blue-400',
  master:    'text-purple-600 dark:text-purple-400',
  grandmaster: 'text-red-600 dark:text-red-400',
}

export default function RatingBadge({ rating, size = 'md', showProgress = false, compact = false }: RatingBadgeProps) {
  const tierInfo = getEloTierInfo(rating)
  const s = SIZE_MAP[size]
  const bgClass = TIER_BG[tierInfo.tier] ?? 'bg-gray-50 border-gray-200'
  const textClass = TIER_TEXT[tierInfo.tier] ?? 'text-gray-600'

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 ${s.px} ${s.py} rounded-full border ${bgClass}`}>
        <span className={s.emoji}>{tierInfo.emoji}</span>
        <span className={`font-bold ${s.rating} ${textClass}`}>{rating}</span>
      </span>
    )
  }

  const nextTier = getEloToNextTier(rating)

  return (
    <div className={`inline-flex flex-col ${s.px} ${s.py} rounded-xl border ${bgClass}`}>
      <div className="flex items-center gap-1.5">
        <span className={s.emoji}>{tierInfo.emoji}</span>
        <div>
          <p className={`font-black ${s.rating} ${textClass}`}>{tierInfo.label}</p>
          <p className={`font-semibold ${s.label} text-gray-400`}>{rating} Elo</p>
        </div>
      </div>
      {showProgress && nextTier.pointsNeeded > 0 && (
        <div className="mt-1.5 space-y-0.5">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${TIER_TEXT[tierInfo.tier]?.replace('text-', 'bg-') ?? 'bg-gray-400'}`}
              style={{ width: `${nextTier.progress}%` }}
            />
          </div>
          <p className={`${s.label} text-gray-400`}>
            {nextTier.pointsNeeded} Elo → {nextTier.nextTier}
          </p>
        </div>
      )}
    </div>
  )
}
