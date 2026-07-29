import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from 'lucide-react'
import type { ReviewLesson, DailyExercise } from '../../data/dailyLessons'

interface Props {
  lesson: ReviewLesson
  testSection: number
  testAnswers: Record<number, string>
  testSubmitted: boolean
  testScore: number
  testResults: Record<number, boolean>
  completedTestSections: Record<number, number>
  shuffledTestOptionsMap: Map<number, string[]>
  onJumpToTestSection: (idx: number) => void
  onSetTestAnswers: (fn: (prev: Record<number, string>) => Record<number, string>) => void
  onSubmit: () => void
  onClear: () => void
  onNextTestSection: () => void
}

export default function ReviewTestsTab({
  lesson, testSection, testAnswers, testSubmitted, testScore, testResults,
  completedTestSections, shuffledTestOptionsMap,
  onJumpToTestSection, onSetTestAnswers,
  onSubmit, onClear, onNextTestSection,
}: Props) {
  const sec = lesson.testSections[testSection]
  if (!sec) return null

  const sectionTests = lesson.tests
    .filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))

  return (
    <div className="space-y-4">
      {/* Section nav */}
      <div className="flex items-center gap-1.5">
        {lesson.testSections.map((s, i) => {
          const done = completedTestSections[i] !== undefined
          const active = i === testSection
          return (
            <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onJumpToTestSection(i)}>
              <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <p className={`text-xs mt-0.5 text-center font-medium ${active ? 'text-amber-700 dark:text-amber-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {s.icon} <span className="hidden sm:inline">{s.title}</span>
              </p>
            </button>
          )
        })}
      </div>

      <div className={`rounded-xl p-4 text-white ${sec.color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-80">Test {testSection + 1} / {lesson.testSections.length}</p>
            <p className="font-bold text-lg">{sec.icon} {sec.title}</p>
            <p className="text-sm opacity-80">{sec.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{sectionTests.length}</p>
            <p className="text-xs opacity-80">savol</p>
          </div>
        </div>
      </div>

      {testSubmitted ? (
        <>
          <div className={`card border text-center py-5 ${testScore >= sectionTests.length * 0.8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : testScore >= sectionTests.length * 0.5 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
            <p className={`text-3xl font-bold font-mono ${testScore >= sectionTests.length * 0.8 ? 'text-green-600 dark:text-green-400' : testScore >= sectionTests.length * 0.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'} mb-1`}>
              {testScore}<span className="text-lg text-gray-400 dark:text-gray-500">/{sectionTests.length}</span>
            </p>
            <div className="flex items-center justify-center gap-3 text-xs mt-2">
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold"><Trophy size={14} /> +{testScore * 10} XP</span>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14} /> {testScore}</span>
              <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><XCircle size={14} /> {sectionTests.length - testScore}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={onClear} className="btn-secondary flex-1 text-sm py-2">
                <RotateCcw size={14} /> Tozlash
              </button>
              {testSection < lesson.testSections.length - 1 && (
                <button onClick={onNextTestSection} className="btn-primary flex-1 text-sm py-2 bg-amber-600 hover:bg-amber-700 border-amber-600">
                  Keyingi <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Wrong answers explanation */}
          <div className="space-y-2">
            {sectionTests.filter(t => !testResults[t.id]).map((t, i) => (
              <div key={t.id} className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">✗ Savol {i + 1}: {t.question}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-semibold text-red-600">Sizniki:</span> {testAnswers[t.id] || '(tanlanmadi)'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-semibold text-green-600">To'g'ri:</span> {t.correct}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{t.explanation}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {sectionTests.map((t, i) => {
              const selected = testAnswers[t.id] || ''
              return (
                <div key={t.id} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm bg-amber-500 text-white">{i + 1}</div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">🧪 Test savoli</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{t.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(shuffledTestOptionsMap.get(t.id) ?? t.options).map((opt, oi) => {
                      const sel = selected === opt
                      const cls = sel
                        ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold'
                        : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      return (
                        <button key={opt} onClick={() => onSetTestAnswers(prev => ({ ...prev, [t.id]: opt }))}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">{['A', 'B', 'C', 'D'][oi]}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <button onClick={onSubmit} disabled={Object.keys(testAnswers).length < sectionTests.length}
            className={`btn-primary w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 border-amber-600 ${Object.keys(testAnswers).length < sectionTests.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <CheckCircle size={18} /> Testni tekshirish (+{sectionTests.length * 10} XP)
          </button>
        </>
      )}
    </div>
  )
}
