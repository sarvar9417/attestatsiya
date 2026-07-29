import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { Sun, ChevronRight } from 'lucide-react'

export default function LessonProgressCard() {
  const { t } = useI18n()
  const lessonProgress = useStore((s) => s.lessonProgress)
  const lessons = useStore((s) => s.lessons)
  const navigate = useNavigate()
  if (lessons.length === 0) return null
  const pcts = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    pct: lessonProgress[l.id] ?? 0,
    done: lessonProgress[l.id] !== undefined,
  }))
  const completed = pcts.filter((p) => p.done).length
  const avgPct = pcts.length > 0 ? Math.round(pcts.reduce((a, p) => a + p.pct, 0) / pcts.length) : 0

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-primary-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('dashboard.lessonProgressTitle')}</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          aria-label={t('dashboard.lessonProgressViewAll')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          {t('dashboard.lessonProgressViewAll')} <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{t('dashboard.lessonProgressCompleted')}</span>
          <span className="font-bold text-gray-900">{completed}/{pcts.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{t('dashboard.lessonProgressAverage')}</span>
          <span className={`font-bold ${
            avgPct >= 80 ? 'text-green-600' : avgPct >= 50 ? 'text-yellow-600' : 'text-red-500'
          }`}>{avgPct}%</span>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {pcts.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('/lesson')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all
              hover:border-primary-200 hover:bg-primary-50 group"
            title={`${p.title}: ${p.pct}%`}
            aria-label={`${p.title}: ${p.pct}%`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                p.pct >= 80 ? 'bg-green-500' :
                p.pct >= 50 ? 'bg-yellow-500' :
                p.done ? 'bg-red-400' : 'bg-gray-200'
              }`}
            />
            <span className="text-gray-600 group-hover:text-primary-700">{p.title}</span>
            {p.done && (
              <span className={`text-xs font-bold ml-auto ${
                p.pct >= 80 ? 'text-green-600' :
                p.pct >= 50 ? 'text-yellow-600' :
                'text-red-500'
              }`}>{p.pct}%</span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
