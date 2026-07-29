import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Target } from 'lucide-react'
import type { DailyExercise } from '../../data/dailyLessons'
import { checkAnswer, getExerciseContext, getCorrectText } from './helpers'
import { getLessonCanDo } from '../../data/cefrCanDo'

interface Props {
  lessonId: string
  score: number
  sectionExercises: DailyExercise[]
  answers: Record<number, string[]>
  aiResults: Record<number, boolean>
  sectionTitle: string
  sectionCelebration: 'idle' | 'visible' | 'fading'
  isLastSection: boolean
  onClear: () => void
  onNext: () => void
}

export default function ExerciseResultsView({
  lessonId,
  score,
  sectionExercises,
  answers,
  aiResults,
  sectionTitle,
  sectionCelebration,
  isLastSection,
  onClear,
  onNext,
}: Props) {
  const total = sectionExercises.length
  const canDo = getLessonCanDo(lessonId)

  return (
    <>
      {/* Score card */}
      <div
        className={`card border text-center py-5 ${
          score >= 8
            ? 'bg-green-50 border-green-200'
            : score >= 5
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
        }`}
      >
        <p
          className={`text-3xl font-bold font-mono mb-1 ${
            score >= 8 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-500'
          }`}
        >
          {score}
          <span className="text-lg text-gray-400">/{total}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {score === total
            ? "🎯 Mukammal! Hech qanday xato yo'q!"
            : score >= 8
              ? "👍 Zo'r! Davom eting!"
              : score >= 5
                ? '📚 Yaxshi, biroz ko\'proq e\'tibor kerak'
                : "💪 Qiyin bo'ldimi? Qayta urinib ko'ring"}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-yellow-600 font-bold">
            <Trophy size={14} /> +{score * 10} XP
          </span>
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle size={14} /> {score}
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <XCircle size={14} /> {total - score}
          </span>
        </div>

        {sectionCelebration !== 'idle' && (
          <div
            className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 text-center animate-slide-down transition-opacity duration-300 ${
              sectionCelebration === 'fading' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="text-base font-bold text-green-800">
              🎉 Ajoyib! {sectionTitle} bo'limi yakunlandi! +50 XP
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={onClear} className="btn-secondary flex-1 text-sm py-2">
            <RotateCcw size={14} /> Tozlash
          </button>
          {!isLastSection && (
            <button onClick={onNext} className="btn-primary flex-1 text-sm py-2">
              Keyingi bosqich <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* CEFR Can-Do Statement */}
      {canDo && (
        <div className="card border-emerald-200 bg-emerald-50/60 dark:bg-emerald-900/20 dark:border-emerald-800">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center flex-shrink-0">
              <Target size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
                🎯 Endi men...
              </p>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
                {canDo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed results table */}
      <div className="card border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">{total} ta mashq</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="pb-2 pr-2 font-semibold w-8">#</th>
                <th className="pb-2 pr-3 font-semibold">Savol</th>
                <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                <th className="pb-2 pr-3 font-semibold">To'g'ri javob</th>
                <th className="pb-2 font-semibold w-10">Natija</th>
              </tr>
            </thead>
            <tbody>
              {sectionExercises.map((ex, i) => {
                const userAnsArr = answers[ex.id] ?? []
                const ok = aiResults[ex.id] ?? checkAnswer(ex, userAnsArr)
                let userAnsStr: string
                let correctStr = getCorrectText(ex)
                if (ex.type === 'fill-blank' || ex.type === 'passage') {
                  userAnsStr = userAnsArr.join(' / ') || "(bo'sh)"
                } else if (ex.type === 'fill-table') {
                  const parts = ex.rows.map(
                    (r, idx) => `${r.adj}: C=${userAnsArr[idx * 2] ?? '—'} S=${userAnsArr[idx * 2 + 1] ?? '—'}`,
                  )
                  userAnsStr = parts.join('; ')
                  correctStr = ex.rows
                    .map((r) => `${r.adj}: C=${r.comp || '—'} S=${r.sup || '—'}`)
                    .join('; ')
                } else {
                  userAnsStr = userAnsArr[0] || "(bo'sh)"
                }
                return (
                  <tr
                    key={ex.id}
                    className={`border-b border-gray-50 dark:border-gray-800 ${
                      ok
                        ? 'bg-green-50/40 dark:bg-green-900/20'
                        : 'bg-red-50/40 dark:bg-red-900/20'
                    }`}
                  >
                    <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                    <td className="py-2.5 pr-3">
                      <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">
                        {ex.type === 'fill-blank'
                          ? ex.question.replace(/_{3,}/g, '___')
                          : getExerciseContext(ex)}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded max-w-[400px] ${
                          ok ? 'text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {userAnsStr}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded max-w-[400px]">
                        {correctStr}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          ok
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {ok ? '✓' : '✗'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
