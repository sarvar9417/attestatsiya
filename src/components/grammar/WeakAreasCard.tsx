// Shaxsiy "Zaif tomonlar" kartasi — grammar SRS ma'lumotidan eng zaif
// mavzularni ko'rsatadi (FSRS-5 stability asosida). Foydalanuvchiga nimani
// mustahkamlash kerakligini aytadi (audit F3-8-lite).

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, ChevronRight } from 'lucide-react'
import { getAllReviews, strengthToPercent } from '../../lib/grammarSrs'
import { LESSON_INDEX } from '../../data/daily/lessonsIndex'

const META_BY_ID = new Map(LESSON_INDEX.map((l) => [l.id, { title: l.title, level: l.level }]))

export default function WeakAreasCard() {
  const navigate = useNavigate()

  const weak = useMemo(
    () =>
      getAllReviews()
        .filter((r) => r.reps > 0)
        .map((r) => ({
          lessonId: r.lessonId,
          lapses: r.lapses,
          strength: strengthToPercent(r.stability),
          meta: META_BY_ID.get(r.lessonId),
        }))
        .sort((a, b) => a.strength - b.strength || b.lapses - a.lapses)
        .slice(0, 5),
    [],
  )

  if (weak.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={18} className="text-amber-500" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">Zaif tomonlaringiz</h3>
      </div>

      <div className="space-y-2.5">
        {weak.map((w) => {
          const color = w.strength < 40 ? 'bg-rose-500' : w.strength < 70 ? 'bg-amber-500' : 'bg-emerald-500'
          return (
            <div key={w.lessonId}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                  {w.meta ? `${w.meta.level} · ${w.meta.title}` : w.lessonId}
                </span>
                <span className="text-gray-400 shrink-0 ml-2">{w.strength}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.max(5, w.strength)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => navigate('/mixed-review')}
          className="btn-ghost text-sm font-semibold flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2"
        >
          🔀 Aralash <ChevronRight size={14} />
        </button>
        <button
          onClick={() => navigate('/active-recall')}
          className="btn-ghost text-sm font-semibold flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2"
        >
          🧠 Recall <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
