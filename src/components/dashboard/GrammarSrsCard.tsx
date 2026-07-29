// ═══════════════════════════════════════════════════════════════════════════
// Grammar SRS Card — Dashboard widget
// Ko'rsatadi: due review soni, o'rtacha mustahkamlik, eng zaif mavzular
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ChevronRight, RefreshCw, TrendingUp } from 'lucide-react'
// i18n: all strings are Uzbek-specific (platform default)
import {
  getDueCount,
  getScheduledCount,
  getAllReviews,
  getWeakGrammarLessonIds,
  getReviewStatus,
  strengthToPercent,
} from '../../lib/grammarSrs'
import { GRAMMAR_TOPICS } from '../../data/grammar'

const TOPIC_META = new Map(GRAMMAR_TOPICS.map(t => [t.id, { title: t.title, level: t.level }]))

function StrengthBar({ value }: { value: number }) {
  const color = value < 30 ? 'bg-rose-500' : value < 60 ? 'bg-amber-500' : value < 85 ? 'bg-emerald-400' : 'bg-emerald-500'
  return (
    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  )
}

export default function GrammarSrsCard() {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const dueCount = getDueCount()
    const scheduledCount = getScheduledCount()
    const all = getAllReviews()
    const totalReviewed = all.length

    // O'rtacha mustahkamlik
    const avgStrength = totalReviewed > 0
      ? Math.round(all.reduce((s, r) => s + strengthToPercent(r.stability), 0) / totalReviewed)
      : 0

    // Eng zaif 3 ta mavzu
    const weakIds = getWeakGrammarLessonIds(3)
    const weakTopics = weakIds.map(id => {
      const meta = TOPIC_META.get(id)
      const review = getReviewStatus(id)
      return {
        id,
        title: meta?.title ?? id,
        level: meta?.level ?? '',
        strength: review ? strengthToPercent(review.stability) : 0,
      }
    })

    return { dueCount, scheduledCount, totalReviewed, avgStrength, weakTopics }
  }, [])

  // Hech qanday grammar SRS ma'lumoti yo'q
  if (stats.totalReviewed === 0) {
    return (
      <button
        onClick={() => navigate('/lesson')}
        className="card w-full text-left hover:shadow-md transition-all group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Grammatika SRS
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Grammatika takrorlashni boshlang
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Har bir grammatika mavzusini FSRS-5 algoritmi bilan mustahkamlang
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-violet-600 dark:text-violet-400 group-hover:gap-2 transition-all">
              Darslarga o'tish <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </button>
    )
  }

  // Overall strength color
  const overallColor = stats.avgStrength >= 70 ? 'bg-emerald-500' : stats.avgStrength >= 40 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <section className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-violet-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Grammatika SRS</h3>
        </div>
        {stats.dueCount > 0 ? (
          <span className="text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full">
            {stats.dueCount} ta takror ⏰
          </span>
        ) : stats.totalReviewed > 0 ? (
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">
            Barchasi bajarildi ✅
          </span>
        ) : null}
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="rounded-xl bg-violet-50 dark:bg-violet-900/20 p-3 text-center">
          <p className="text-2xl font-black text-violet-700 dark:text-violet-300">{stats.dueCount}</p>
          <p className="text-[10px] font-semibold text-violet-500 dark:text-violet-400 mt-0.5">Bugungi takror</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
          <p className="text-2xl font-black text-gray-800 dark:text-gray-200">{stats.avgStrength}%</p>
          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">O'rtacha mustahkamlik</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
          <p className="text-2xl font-black text-gray-800 dark:text-gray-200">{stats.scheduledCount}</p>
          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Rejadagi takrorlar</p>
        </div>
      </div>

      {/* Overall strength bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <TrendingUp size={12} />
            Umumiy mustahkamlik
          </span>
          <span className="font-bold text-gray-700 dark:text-gray-300">{stats.avgStrength}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${overallColor}`}
            style={{ width: `${stats.avgStrength}%` }}
          />
        </div>
      </div>

      {/* Weakest topics */}
      {stats.weakTopics.length > 0 && (
        <div className="space-y-1.5 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Eng zaif mavzular
          </p>
          {stats.weakTopics.map((topic) => (
            <div key={topic.id}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{topic.title}</span>
                  {topic.level && (
                    <span className="badge text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {topic.level}
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-500 dark:text-gray-400 ml-2 shrink-0">{topic.strength}%</span>
              </div>
              <StrengthBar value={topic.strength} />
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => navigate(stats.dueCount > 0 ? '/review' : '/lesson')}
        className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 font-bold text-sm"
      >
        <RefreshCw size={15} />
        {stats.dueCount > 0
          ? `${stats.dueCount} ta takrorlashni boshlash`
          : 'Grammatika darslariga o\'tish'}
        <ChevronRight size={15} />
      </button>
    </section>
  )
}
