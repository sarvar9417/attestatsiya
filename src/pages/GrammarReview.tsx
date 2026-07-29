import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import {
  ArrowRight, Brain, RefreshCw, ChevronRight,
} from 'lucide-react'
import { getDueReviews, strengthToPercent } from '../lib/grammarSrs'
import { GRAMMAR_TOPICS } from '../data/grammar'
import WeakAreasCard from '../components/grammar/WeakAreasCard'

// Grammar topic id → title + level lookup
const TOPIC_META = new Map(GRAMMAR_TOPICS.map(t => [t.id, { title: t.title, level: t.level }]))

export default function GrammarReview() {
  const navigate = useNavigate()
  const { t } = useI18n()

  const dueReviews = useMemo(() => getDueReviews(), [])
  const dueCount = dueReviews.length

  if (dueCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {t('grammarReview.noReviewsTitle')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
          {t('grammarReview.noReviewsDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/grammar')} className="btn-primary px-8 py-3 font-bold">
            {t('grammarReview.goToLessons')}
          </button>
          <button onClick={() => navigate('/mixed-review')} className="btn-ghost px-8 py-3 font-bold border border-gray-200 dark:border-gray-700 rounded-xl">
            {t('grammarReview.mixedReview')}
          </button>
        </div>
        <div className="w-full max-w-sm mt-8">
          <WeakAreasCard />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Brain size={20} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Grammatika takrorlash
          </h1>
          <p className="text-xs text-gray-500">
            {dueCount} ta mavzuni takrorlash vaqti keldi
          </p>
        </div>
      </div>

      {/* Due review cards */}
      <div className="space-y-2.5">
        {dueReviews.map((review) => {
          const meta = TOPIC_META.get(review.lessonId)
          const strength = strengthToPercent(review.stability)
          const barColor = strength < 40 ? 'bg-rose-500' : strength < 70 ? 'bg-amber-500' : 'bg-emerald-500'

          return (
            <button
              key={review.lessonId}
              onClick={() => navigate('/grammar', { state: { reviewTopicId: review.lessonId } })}
              className="w-full card-hover text-left p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {meta ? meta.title : review.lessonId}
                    </span>
                    {meta && (
                      <span className="badge text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {meta.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Mustahkamlik: {strength}%</span>
                    {review.lapses > 0 && (
                      <span className="text-rose-400">{review.lapses} marta qiyin</span>
                    )}
                    <span>{review.reps} marta takror</span>
                  </div>
                  {/* Strength progress bar */}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all`}
                      style={{ width: `${Math.max(5, strength)}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0 mt-1" />
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/grammar')}
        className="btn-ghost w-full border border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {t('grammarReview.goToLessons')}
      </button>

      <WeakAreasCard />
    </div>
  )
}

// ─── Dashboard overview — eng yaqin due reviewlar ──────────────────────────
export function ReviewOverview() {
  const navigate = useNavigate()
  const dueReviews = useMemo(() => getDueReviews().slice(0, 5), [])

  if (dueReviews.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={18} className="text-violet-500" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          Takrorlash vaqti keldi
        </h3>
        <span className="ml-auto text-xs text-gray-400">{dueReviews.length} ta</span>
      </div>
      <div className="space-y-2">
        {dueReviews.map((review) => {
          const meta = TOPIC_META.get(review.lessonId)
          const strength = strengthToPercent(review.stability)
          return (
            <button
              key={review.lessonId}
              onClick={() => navigate('/grammar', { state: { reviewTopicId: review.lessonId } })}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-xl">{['📖', '📝', '🎯', '📚', '✍️'][dueReviews.indexOf(review) % 5]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {meta ? meta.title : review.lessonId}
                </p>
                <p className="text-xs text-gray-400">
                  Mustahkamlik: {strength}% · {review.reps} marta
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-300 shrink-0" />
            </button>
          )
        })}
      </div>
      <button
        onClick={() => navigate('/review')}
        className="w-full btn-primary mt-3 py-2.5 flex items-center justify-center gap-2 font-bold"
      >
        <RefreshCw size={15} /> Barchasini ko'rish <ArrowRight size={15} />
      </button>
    </div>
  )
}
