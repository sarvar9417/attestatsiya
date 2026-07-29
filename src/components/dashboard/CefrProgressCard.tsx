import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { useInView } from '../../hooks/useInView'
import { Target, ChevronRight } from 'lucide-react'
import { LESSON_INDEX } from '../../data/daily/lessonsIndex'

export default function CefrProgressCard() {
  const { t } = useI18n()
  const lessonProgress = useStore((s) => s.lessonProgress)
  const navigate = useNavigate()
  const { ref, isInView } = useInView()

  const levels = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2'] as const
  const levelColors: Record<string, string> = {
    A0: 'bg-gray-400',
    A1: 'bg-blue-500',
    A2: 'bg-teal-500',
    B1: 'bg-amber-500',
    'B1+': 'bg-orange-500',
    B2: 'bg-purple-600',
  }

  const levelData = levels.map((level) => {
    const levelLessons = LESSON_INDEX.filter((l) => l.level === level)
    const total = levelLessons.length
    const done = levelLessons.filter((l) => lessonProgress[l.id] !== undefined).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { level, total, done, pct }
  })

  const totalAll = levelData.reduce((s, d) => s + d.total, 0)
  const doneAll = levelData.reduce((s, d) => s + d.done, 0)
  const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0

  return (
    <section ref={ref} className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('cefrProgress.title')}</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          aria-label={t('cefrProgress.viewAll')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          {t('cefrProgress.viewAll')} <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50 dark:border-gray-700">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${isInView ? overallPct : 0}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{doneAll}/{totalAll}</span>
      </div>

      <div className="space-y-2.5">
        {levelData.map(({ level, total, done, pct }, i) => (
          <div key={level} className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-8 flex-shrink-0">{level}</span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${levelColors[level] ?? 'bg-gray-400'}`}
                style={{
                  width: `${isInView ? pct : 0}%`,
                  transitionDelay: `${isInView ? 150 + i * 80 : 0}ms`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right flex-shrink-0">
              {done}/{total}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
