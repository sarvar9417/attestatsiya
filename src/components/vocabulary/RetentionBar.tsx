import { useI18n } from '../../i18n'

interface RetentionBarProps {
  box: number
  nextReview: string
}

const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]

export function RetentionBar({ box, nextReview }: RetentionBarProps) {
  const { t } = useI18n()
  const interval = SRS_INTERVALS[box - 1] ?? 1

  // `nextReview` is the date when the word is due for review.
  // The days until expiry = (nextReview - today) + interval days from now.
  // Actually, the formula: how much time has passed since the last review,
  // relative to the total interval length.
  const now = Date.now()
  const reviewTime = new Date(nextReview).getTime()
  const elapsed = (now - reviewTime + interval * 86_400_000) / 86_400_000
  const daysSinceReview = Math.max(0, elapsed)

  // Ebbinghaus exponential forgetting curve
  const retention = Math.max(10, Math.round(100 * Math.exp(-daysSinceReview / interval)))

  const color =
    retention >= 80 ? 'bg-green-400' :
    retention >= 50 ? 'bg-yellow-400' :
    'bg-red-400'

  const textColor =
    retention >= 80 ? 'text-green-600 dark:text-green-400' :
    retention >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-red-500 dark:text-red-400'

  return (
    <div
      className="flex items-center gap-1.5"
      title={t('retentionBar.tooltip', { retention, box, interval })}
    >
      <div className="w-14 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${retention}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${textColor}`}>
        {retention}%
      </span>
    </div>
  )
}
