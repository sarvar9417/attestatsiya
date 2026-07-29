import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { useI18n } from '../../i18n'

export default function StreakWarning() {
  const { lastActiveDate, streak } = useStore()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const today = getTodayTashkent()
    if (!lastActiveDate) return

    // If last active was yesterday and today no activity yet
    const yesterday = new Date(today + 'T00:00:00Z')
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastActiveDate === yesterdayStr && streak > 0) {
      setShow(true) // gentle reminder — streak can still be saved
    } else if (lastActiveDate !== today && lastActiveDate !== yesterdayStr && streak > 0) {
      setShow(true) // streak at risk or already broken
    }
  }, [lastActiveDate, streak])

  if (!show) return null

  const today = getTodayTashkent()
  const yesterday = new Date(today + 'T00:00:00Z')
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const isCritical = lastActiveDate !== today && lastActiveDate !== yesterdayStr

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 transition-all ${
        isCritical
          ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCritical ? 'bg-red-100 dark:bg-red-900/50' : 'bg-amber-100 dark:bg-amber-900/50'
        }`}>
          {isCritical
            ? <AlertTriangle size={18} className="text-red-500" />
            : <Sparkles size={18} className="text-amber-500" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Flame size={16} className={isCritical ? 'text-red-500' : 'text-amber-500'} />
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {isCritical ? 'Streakingiz xavf ostida!' : 'Streakingizni davom ettiring!'}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {isCritical
              ? `${streak} kunlik streak'ingizni yo'qotmaslik uchun bugun dars qiling!`
              : `Bugun hali dars qilmadingiz. ${streak + 1} kunlik streakga bir qadam qoldi!`
            }
          </p>
          <button
            onClick={() => navigate('/daily-lesson')}
            className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              isCritical
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            Darsni boshlash <ChevronRight size={12} />
          </button>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label={t('aria.close')}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
