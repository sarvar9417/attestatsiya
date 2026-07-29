import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Target } from 'lucide-react'
import type { DailyExercise } from '../../data/dailyLessons'
import { resolveSectionItems } from './lessonHelpers'
import { getExerciseContext } from './helpers'
import { getLessonCanDo } from '../../data/cefrCanDo'

interface SectionDef {
  ids: number[]
  title: string
  icon: string
  desc: string
  color: string
}

interface Props {
  lessonId: string
  testSections: SectionDef[]
  tests: DailyExercise[]
  testSection: number
  testAnswers: Record<number, string>
  testSubmitted: boolean
  testScore: number
  testResults: Record<number, boolean>
  completedTestSections: Record<number, number>
  shuffledTestOptionsMap: Map<number, string[]>
  onJumpToSection: (idx: number) => void
  onChangeAnswer: (id: number, value: string) => void
  onSubmit: () => void
  onClear: () => void
}

export default function TestSectionArea({
  lessonId,
  testSections,
  tests,
  testSection,
  testAnswers,
  testSubmitted,
  testScore,
  testResults,
  completedTestSections,
  shuffledTestOptionsMap,
  onJumpToSection,
  onChangeAnswer,
  onSubmit,
  onClear,
}: Props) {
  const section = testSections[testSection]
  const sectionTests = section ? resolveSectionItems(testSections, testSection, tests, tests) : []

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          🧪 Testlar
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Test sections progress */}
      <div className="flex items-center gap-1.5 mb-4">
        {testSections.map((s, i) => {
          const done = completedTestSections[i] !== undefined
          const active = i === testSection
          return (
            <button
              key={s.title}
              className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onJumpToSection(i)}
            >
              <div
                className={`h-1.5 rounded-full transition-all ${
                  done ? 'bg-green-500' : active ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <p
                className={`text-xs mt-0.5 text-center font-medium ${
                  active
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : done
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {s.icon} <span className="hidden sm:inline">{s.title}</span>
              </p>
            </button>
          )
        })}
      </div>

      {section && (
        <>
          {/* Test section header */}
          <div className={`rounded-xl p-4 text-white ${section.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold opacity-80">
                  Test {testSection + 1} / {testSections.length}
                </p>
                <p className="font-bold text-lg">
                  {section.icon} {section.title}
                </p>
                <p className="text-sm opacity-80">{section.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{sectionTests.length}</p>
                <p className="text-xs opacity-80">savol</p>
              </div>
            </div>
          </div>

          {testSubmitted ? (
            <TestSubmittedView
              lessonId={lessonId}
              testScore={testScore}
              sectionTests={sectionTests}
              testAnswers={testAnswers}
              testResults={testResults}
              testSection={testSection}
              testSections={testSections}
              onClear={onClear}
              onJumpToSection={onJumpToSection}
            />
          ) : (
            <TestQuestionsView
              sectionTests={sectionTests}
              testAnswers={testAnswers}
              testResults={testResults}
              testSubmitted={testSubmitted}
              shuffledTestOptionsMap={shuffledTestOptionsMap}
              onChangeAnswer={onChangeAnswer}
              onSubmit={onSubmit}
            />
          )}

          {/* Test summary */}
          {Object.keys(completedTestSections).length > 0 && (
            <div className="card bg-gray-50 border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Umumiy: {Object.values(completedTestSections).reduce((a, b) => a + b, 0)} / {tests.length} ta to'g'ri
                {' · '}
                {testSections.filter((_, i) => completedTestSections[i] !== undefined).length} / {testSections.length} bosqich
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Submitted view: score card + results table ────────────────────────────
function TestSubmittedView({
  lessonId,
  testScore,
  sectionTests,
  testAnswers,
  testResults,
  testSection,
  testSections,
  onClear,
  onJumpToSection,
}: {
  lessonId: string
  testScore: number
  sectionTests: DailyExercise[]
  testAnswers: Record<number, string>
  testResults: Record<number, boolean>
  testSection: number
  testSections: SectionDef[]
  onClear: () => void
  onJumpToSection: (idx: number) => void
}) {
  const canDo = getLessonCanDo(lessonId)
  const total = sectionTests.length
  return (
    <>
      {/* Score card */}
      <div
        className={`card border text-center py-5 ${
          testScore >= 8
            ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
            : testScore >= 5
              ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
        }`}
      >
        <p
          className={`text-3xl font-bold font-mono mb-1 ${
            testScore >= 8
              ? 'text-green-600 dark:text-green-400'
              : testScore >= 5
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-500 dark:text-red-400'
          }`}
        >
          {testScore}
          <span className="text-lg text-gray-400 dark:text-gray-500">/{total}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {testScore === total
            ? "🎯 Mukammal! Barcha savollarga to'g'ri javob berdingiz!"
            : testScore >= 8
              ? "👍 Zo'r! Davom eting!"
              : testScore >= 5
                ? '📚 Yaxshi, biroz ko\'proq takrorlash kerak'
                : "💪 Qayta urinib ko'ring — qoidalarni takrorlang"}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
            <Trophy size={14} /> +{testScore * 10} XP
          </span>
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle size={14} /> {testScore}
          </span>
          <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
            <XCircle size={14} /> {total - testScore}
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClear} className="btn-secondary flex-1 text-sm py-2">
            <RotateCcw size={14} /> Tozlash
          </button>
          {testSection < testSections.length - 1 && (
            <button
              onClick={() => onJumpToSection(testSection + 1)}
              className="btn-primary flex-1 text-sm py-2"
            >
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

      {/* Results table */}
      <div className="card border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">{total} ta savol</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-2 pr-2 font-semibold w-8">#</th>
                <th className="pb-2 pr-3 font-semibold">Savol</th>
                <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                <th className="pb-2 pr-3 font-semibold">To'g'ri javob</th>
                <th className="pb-2 font-semibold w-10">Natija</th>
              </tr>
            </thead>
            <tbody>
              {sectionTests.map((t, i) => {
                const ans = testAnswers[t.id] || ''
                const ok = testResults[t.id]
                const correctAnswer =
                  t.type === 'fill-blank'
                    ? t.blanks.join(' / ')
                    : t.type === 'multiple-choice' || t.type === 'error-correction' || t.type === 'transformation'
                      ? t.correct
                      : ''
                return (
                  <tr
                    key={t.id}
                    className={`border-b border-gray-50 dark:border-gray-800 ${
                      ok ? 'bg-green-50/40 dark:bg-green-900/20' : 'bg-red-50/40 dark:bg-red-900/20'
                    }`}
                  >
                    <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                    <td className="py-2.5 pr-3">
                      <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-snug line-clamp-2">
                        {getExerciseContext(t)}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                          ok ? 'text-green-700' : ans ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {ans || '(tanlanmadi)'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                        {correctAnswer}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
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

// ── Questions view: test questions + submit button ────────────────────────
function TestQuestionsView({
  sectionTests,
  testAnswers,
  testSubmitted,
  testResults,
  shuffledTestOptionsMap,
  onChangeAnswer,
  onSubmit,
}: {
  sectionTests: DailyExercise[]
  testAnswers: Record<number, string>
  testSubmitted: boolean
  testResults: Record<number, boolean>
  shuffledTestOptionsMap: Map<number, string[]>
  onChangeAnswer: (id: number, value: string) => void
  onSubmit: () => void
}) {
  return (
    <>
      <div className="space-y-4">
        {sectionTests.map((t, i) => {
          const selected = testAnswers[t.id] || ''
          const isCorrect = testResults[t.id]
          const correctOpt =
            t.type === 'multiple-choice' || t.type === 'error-correction' || t.type === 'transformation'
              ? t.correct
              : ''
          return (
            <div
              key={t.id}
              className={`relative rounded-2xl border p-4 transition-colors ${
                testSubmitted
                  ? isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                  : ''
              }`}
            >
              <div
                className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  testSubmitted
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-yellow-600 text-white'
                }`}
              >
                {i + 1}
              </div>
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">
                🧪 Test savoli
              </p>
              {t.instruction && (
                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mb-2 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  {t.instruction}
                </p>
              )}
              <p className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">
                {t.type === 'fill-blank' ? t.question.replace(/_{3,}/g, '___') : getExerciseContext(t)}
              </p>
              {t.type === 'multiple-choice' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(shuffledTestOptionsMap.get(t.id) ?? t.options).map((opt, oi) => {
                    const sel = selected === opt
                    let cls =
                      'border border-gray-200 bg-white text-gray-700 dark:text-gray-300 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                    if (testSubmitted) {
                      if (opt === correctOpt)
                        cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
                      else if (sel) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                      else cls = 'border-gray-100 bg-gray-50 text-gray-400'
                    } else if (sel) {
                      cls =
                        'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-semibold'
                    }
                    return (
                      <button
                        key={opt}
                        disabled={testSubmitted}
                        onClick={() => onChangeAnswer(t.id, opt)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {['A', 'B', 'C', 'D'][oi]}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={selected}
                    onChange={(e) => onChangeAnswer(t.id, e.target.value)}
                    disabled={testSubmitted}
                    placeholder="Javobingizni yozing..."
                    className={`w-full px-3 py-2.5 rounded-xl text-sm border transition-all outline-none ${
                      testSubmitted
                        ? isCorrect
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 hover:border-yellow-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={onSubmit}
        disabled={Object.keys(testAnswers).length < sectionTests.length}
        className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${
          Object.keys(testAnswers).length < sectionTests.length ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <CheckCircle size={18} /> Testni tekshirish (+{sectionTests.length * 10} XP)
      </button>
    </>
  )
}
