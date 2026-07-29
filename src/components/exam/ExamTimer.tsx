import { Clock, Pause, Play, RotateCcw } from 'lucide-react'
import { useExamTimer } from '../../hooks/useExamTimer'
import { useI18n } from '../../i18n'

export interface ExamTimerProps {
  /** Total duration in seconds (e.g. 3600 for 60 min). */
  duration: number
  /** Unique storage key for persistence. */
  storageKey: string
  /** Callback fired when timer reaches 0. */
  onTimeUp?: () => void
  /** Auto-start on mount. Default: true. */
  autoStart?: boolean
  /** Visual variant. Default: 'default'. */
  variant?: 'default' | 'compact'
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

/**
 * IELTS exam timer (Reading 60min, Writing 60min, Listening 40min).
 *
 * - Sticky-positioned, high-contrast display
 * - Color-coded: <5min red, <10min yellow, otherwise primary
 * - Pause/Resume and Reset controls
 * - localStorage persistence (refresh-safe)
 * - Auto-fires `onTimeUp` once at 0
 */
export default function ExamTimer({
  duration,
  storageKey,
  onTimeUp,
  autoStart = true,
  variant = 'default',
}: ExamTimerProps) {
  const { t } = useI18n()
  const { timeLeft, isRunning, isTimeUp, toggle, reset } = useExamTimer({
    duration,
    storageKey,
    onTimeUp,
    autoStart,
  })

  const minutes = Math.floor(timeLeft / 60)
  const colorClass =
    isTimeUp
      ? 'bg-red-600 text-white'
      : minutes < 5
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        : minutes < 10
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
          : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold ${colorClass}`}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        <Clock size={14} />
        {formatTime(timeLeft)}
      </div>
    )
  }

  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl
        ${colorClass} shadow-sm`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2 font-mono text-lg font-bold tabular-nums">
        <Clock size={18} />
        <span>{formatTime(timeLeft)}</span>
        {isTimeUp && <span className="text-xs uppercase tracking-wider ml-2">Vaqt tugadi</span>}
        {!isRunning && !isTimeUp && (
          <span className="text-xs uppercase tracking-wider ml-2 opacity-70">Pauza</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggle}
          disabled={isTimeUp}
          aria-label={isRunning ? 'Pauza' : 'Davom ettirish'}
          className="p-1.5 rounded-lg hover:bg-black/10 disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={reset}
          aria-label={t('aria.reload')}
          className="p-1.5 rounded-lg hover:bg-black/10
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}
