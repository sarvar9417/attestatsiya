import { ArrowLeft, Target } from 'lucide-react'
import type { DailyExercise } from '../../data/dailyLessons'
import { getExerciseContext, getCorrectText } from './helpers'

interface Props {
  wrongExerciseIds: number[]
  exercises: DailyExercise[]
  onBack: () => void
}

export default function ReviewWrongView({ wrongExerciseIds, exercises, onBack }: Props) {
  const wrongExercises = exercises.filter(ex => wrongExerciseIds.includes(ex.id))

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Mashqlarga qaytish
        </button>
      </div>
      <div className="card bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-red-600 dark:text-red-400" />
          <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Xatolar tahlili</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Qayta ko'rib chiqish</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {wrongExerciseIds.length} ta xato — barcha bo'limlar bo'yicha jamlangan
        </p>
      </div>
      <div className="space-y-3">
        {wrongExercises.map((ex, i) => {
          const correctStr = getCorrectText(ex)
          return (
            <div key={ex.id} className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">{getExerciseContext(ex)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">✓ {correctStr}</p>
                  {'explanation' in ex && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{ex.explanation}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {wrongExerciseIds.length > 0 && (
        <button onClick={onBack} className="btn-primary w-full bg-amber-600 hover:bg-amber-700 border-amber-600">
          Mashqlarga qaytish
        </button>
      )}
    </div>
  )
}
