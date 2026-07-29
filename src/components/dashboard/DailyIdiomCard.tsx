import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { IDIOMS } from '../../data/idioms'
import { MessageCircle } from 'lucide-react'

export default function DailyIdiomCard() {
  const { t } = useI18n()
  const navigate = useNavigate()

  // Deterministic daily pick based on day of year
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const idiom = IDIOMS[dayOfYear % IDIOMS.length]

  if (!idiom) return null

  return (
    <button
      onClick={() => navigate('/idioms')}
      aria-label={t('dashboard.dailyIdiomTitle')}
      className="card w-full text-left group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700
        transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 text-lg">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
              {t('dashboard.dailyIdiomTitle')}
            </span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
              idiom.level === 'B2'
                ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
                : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            }`}>
              {idiom.level}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0.5">
            {idiom.idiom}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {idiom.actualMeaning}
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <MessageCircle size={12} />
            <span>{t('dashboard.dailyIdiomViewAll')}</span>
          </div>
        </div>
        <span className="text-sm flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors">
          →
        </span>
      </div>
    </button>
  )
}
