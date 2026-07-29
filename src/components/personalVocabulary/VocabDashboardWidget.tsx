import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookMarked, Brain, ChevronRight, TrendingUp } from 'lucide-react'
import { getTodayTashkent } from '../../utils/tashkentDate'
import type { PersonalWord } from '../../types/personalVocabulary'

interface VocabDashboardWidgetProps {
  words: PersonalWord[]
}

export default function VocabDashboardWidget({ words }: VocabDashboardWidgetProps) {
  const navigate = useNavigate()
  const today = getTodayTashkent()

  const stats = useMemo(() => {
    const total = words.length
    if (total === 0) return null

    const learned = words.filter(w => w.is_learned).length
    const due = words.filter(w => !w.is_learned && w.next_review <= today).length
    const dueUrgent = words.filter(w => {
      if (w.is_learned) return false
      const diff = new Date(today).getTime() - new Date(w.next_review).getTime()
      return diff > 3 * 24 * 60 * 60 * 1000
    }).length
    const mastered = words.filter(w => w.box >= 6 && w.is_learned).length
    const masteryPct = total > 0 ? Math.round((mastered / total) * 100) : 0
    const accuracy = words.reduce((s, w) => {
      const t = w.correct_count + w.wrong_count
      return t > 0 ? s + (w.correct_count / t) : s
    }, 0) / Math.max(words.filter(w => w.correct_count + w.wrong_count > 0).length, 1)

    return { total, learned, due, dueUrgent, mastered, masteryPct, accuracy: Math.round(accuracy * 100) }
  }, [words, today])

  if (!stats) {
    return (
      <button
        onClick={() => navigate('/personal-vocabulary')}
        className="card w-full text-left hover:shadow-md transition-all group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <BookMarked size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Shaxsiy lug'at
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              So'zlar lug'atingizni yarating
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              So'zlarni qo'shing va FSRS-5 algoritmi bilan yodlang
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
              Boshlash <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookMarked size={18} className="text-primary-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Shaxsiy lug'at</h3>
        </div>
        {stats.due > 0 ? (
          <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
            {stats.due} ta takror ⏰
          </span>
        ) : stats.total > 0 ? (
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">
            Barchasi bajarildi ✅
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 text-center">
          <p className="text-2xl font-black text-primary-700 dark:text-primary-300">{stats.due}</p>
          <p className="text-[10px] font-semibold text-primary-500 dark:text-primary-400 mt-0.5">Bugungi takror</p>
          {stats.dueUrgent > 0 && (
            <p className="text-[9px] text-red-500 font-medium">({stats.dueUrgent} ta kechikkan)</p>
          )}
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
          <p className="text-2xl font-black text-gray-800 dark:text-gray-200">{stats.masteryPct}%</p>
          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">O'zlashtirish</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
          <p className="text-2xl font-black text-gray-800 dark:text-gray-200">{stats.total}</p>
          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Jami so'zlar</p>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <TrendingUp size={12} />
              O'zlashtirilgan
            </span>
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {stats.mastered}/{stats.total}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(2, stats.masteryPct)}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/personal-vocabulary')}
        className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 font-bold text-sm"
      >
        <Brain size={15} />
        {stats.due > 0
          ? `${stats.due} ta so'zni takrorlash`
          : "Lug'atni ko'rish"}
        <ChevronRight size={15} />
      </button>
    </section>
  )
}
