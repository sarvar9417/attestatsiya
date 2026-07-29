import { getMasteryLevel } from './ReviewHelpers'

interface ExerciseSection {
  title: string
  icon: string
  ids: number[]
}

interface Props {
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  exerciseSections: ExerciseSection[]
  totalExercises: number
  totalTests: number
}

export default function ReviewMasteryMeter({
  completedSections, completedTestSections, exerciseSections,
  totalExercises, totalTests,
}: Props) {
  const totalExerciseCorrect = Object.values(completedSections).reduce((a, b) => a + b, 0)
  const totalTestCorrect = Object.values(completedTestSections).reduce((a, b) => a + b, 0)
  const combined = totalExerciseCorrect + totalTestCorrect
  const combinedMax = totalExercises + totalTests
  const combinedPct = combinedMax > 0 ? Math.round((combined / combinedMax) * 100) : 0
  const mastery = getMasteryLevel(combinedPct)

  const hasAny = Object.keys(completedSections).length > 0 || Object.keys(completedTestSections).length > 0
  if (!hasAny) return null

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{mastery.emoji}</span>
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">O'zlashtirish</p>
            <p className={`text-sm font-bold ${mastery.color}`}>{mastery.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold font-mono ${mastery.color}`}>{combinedPct}%</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{combined} / {combinedMax}</p>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 animate-count-up"
          style={{ width: `${combinedPct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {exerciseSections.map((s, i) => {
          const sectionScore = completedSections[i]
          const sectionTotal = s.ids.length
          const sectionPct = sectionScore !== undefined && sectionTotal > 0
            ? Math.round((sectionScore / sectionTotal) * 100)
            : null
          return (
            <div key={s.title} className={`rounded-lg p-2 text-center transition-all ${sectionPct !== null ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
              <p className="text-xs mb-0.5">{s.icon}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{s.title}</p>
              {sectionPct !== null ? (
                <p className={`text-xs font-bold font-mono ${
                  sectionPct >= 80 ? 'text-green-600 dark:text-green-400' :
                  sectionPct >= 50 ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-500 dark:text-red-400'
                }`}>{sectionPct}%</p>
              ) : (
                <p className="text-xs text-gray-300 dark:text-gray-600">—</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
