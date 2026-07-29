import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Sparkles, Target } from 'lucide-react'
import type { ReviewLesson, DailyExercise } from '../../data/dailyLessons'
import { checkAnswer, getExerciseContext, getCorrectText } from './helpers'
import ExerciseCard from './ExerciseCard'
import type { Answers } from './ReviewHelpers'

interface Props {
  lesson: ReviewLesson
  sectionExercises: DailyExercise[]
  displayExercises: DailyExercise[]
  currentSection: number
  section: { title: string; desc: string; color: string; icon: string; ids: number[] } | undefined
  submitted: boolean
  score: number
  lastCheckedCount: number
  aiResults: Record<number, boolean>
  answers: Answers
  wrongExerciseIds: number[]
  smartReviewMode: boolean
  completedSections: Record<number, number>
  isLastSection: boolean
  totalSections: number
  onJumpToSection: (idx: number) => void
  onChangeAnswer: (exId: number, blankIdx: number, val: string) => void
  onSubmit: () => void
  onClear: () => void
  onStartSmartReview: () => void
  onNextSection: () => void
  onShowWrongReview: (show: boolean) => void
  consolidatedWrongCount: number
  isAiChecking: boolean
}

export default function ReviewExercisesTab({
  lesson, sectionExercises, displayExercises, currentSection, section,
  submitted, score, lastCheckedCount, aiResults, answers,
  wrongExerciseIds, smartReviewMode, completedSections,
  isLastSection, totalSections,
  onJumpToSection, onChangeAnswer, onSubmit, onClear,
  onStartSmartReview, onNextSection, onShowWrongReview,
  consolidatedWrongCount, isAiChecking,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Section nav */}
      <div className="flex items-center gap-1.5">
        {lesson.exerciseSections.map((s, i) => {
          const done = completedSections[i] !== undefined
          const active = i === currentSection
          return (
            <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onJumpToSection(i)}>
              <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <p className={`text-xs mt-0.5 text-center font-medium ${active ? 'text-amber-700 dark:text-amber-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {s.icon} <span className="hidden sm:inline">{s.title}</span>
              </p>
            </button>
          )
        })}
      </div>

      {/* Section header */}
      {section && (
        <div className={`rounded-xl p-4 text-white ${section.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold opacity-80">Bo'lim {currentSection + 1} / {totalSections}</p>
              <p className="font-bold text-lg">{section.icon} {section.title}</p>
              <p className="text-sm opacity-80">{section.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{sectionExercises.length}</p>
              <p className="text-xs opacity-80">ta mashq</p>
            </div>
          </div>
        </div>
      )}

      {submitted ? (
        <>
          <div className={`card border text-center py-5 ${score >= lastCheckedCount * 0.8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : score >= lastCheckedCount * 0.5 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
            <p className={`text-3xl font-bold font-mono ${score >= lastCheckedCount * 0.8 ? 'text-green-600 dark:text-green-400' : score >= lastCheckedCount * 0.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'} mb-1`}>
              {score}<span className="text-lg text-gray-400 dark:text-gray-500">/{lastCheckedCount}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {score === sectionExercises.length && lastCheckedCount === sectionExercises.length ? '🎯 Mukammal! Hammasi to\'g\'ri!' : score >= lastCheckedCount * 0.8 ? '👍 Zo\'r! Davom eting!' : score >= lastCheckedCount * 0.5 ? '📚 Yaxshi, qayta o\'qib chiqing' : '💪 Mavzuni takrorlang va urinib ko\'ring'}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold"><Trophy size={14} /> +{score * 10} XP</span>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14} /> {score}</span>
              <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><XCircle size={14} /> {lastCheckedCount - score}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={onClear} className="btn-secondary flex-1 text-sm py-2">
                <RotateCcw size={14} /> Tozlash
              </button>
              {wrongExerciseIds.length > 0 && !smartReviewMode && (
                <button onClick={onStartSmartReview}
                  className="btn-ghost flex-1 text-sm py-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-1">
                  <Sparkles size={14} /> Xatolar ({wrongExerciseIds.length})
                </button>
              )}
              {!isLastSection && (
                <button onClick={onNextSection} className="btn-primary flex-1 text-sm py-2 bg-amber-600 hover:bg-amber-700 border-amber-600">
                  Keyingi bo'lim <ChevronRight size={14} />
                </button>
              )}
              {isLastSection && Object.keys(completedSections).length === totalSections && consolidatedWrongCount > 0 && (
                <button onClick={() => onShowWrongReview(true)}
                  className="btn-ghost flex-1 text-sm py-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-1">
                  <Target size={14} /> Barcha xatolar ({consolidatedWrongCount})
                </button>
              )}
            </div>
          </div>

          {/* Detailed results */}
          <div className="card border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
              </p>
              {wrongExerciseIds.length > 0 && (
                <button onClick={onStartSmartReview}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                  <Sparkles size={12} /> Faqat xatolarni ko'rsat
                </button>
              )}
            </div>
            <div className="space-y-3">
              {sectionExercises.map((ex, i) => {
                const userAnsArr = answers[ex.id] ?? []
                const ok = aiResults[ex.id] ?? checkAnswer(ex, userAnsArr)
                const correctStr = getCorrectText(ex)
                let userAnsStr: string
                if (ex.type === 'fill-blank' || ex.type === 'passage') { userAnsStr = userAnsArr.join(' / ') || "(bo'sh)" }
                else if (ex.type === 'fill-table') { userAnsStr = '(jadval)' }
                else { userAnsStr = userAnsArr[0] || "(bo'sh)" }
                return (
                  <div key={ex.id} className={`rounded-xl border p-3 ${ok ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                    <div className="flex items-start gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${ok ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-snug">{getExerciseContext(ex)}</p>
                        {!ok && (
                          <div className="mt-1.5 space-y-0.5">
                            <p className="text-xs"><span className="text-red-600 font-semibold">Sizniki:</span> <span className="font-mono">{userAnsStr}</span></p>
                            <p className="text-xs"><span className="text-green-600 font-semibold">To'g'ri:</span> <span className="font-mono">{correctStr}</span></p>
                            {'explanation' in ex && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{ex.explanation}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {(smartReviewMode ? displayExercises : sectionExercises).map((ex, i) => (
              <ExerciseCard key={ex.id} ex={ex} num={i + 1} total={sectionExercises.length} answers={answers[ex.id] ?? []}
                onChange={(blankIdx, val) => onChangeAnswer(ex.id, blankIdx, val)} submitted={false} />
            ))}
          </div>
          <button onClick={onSubmit} disabled={isAiChecking}
            className={`btn-primary w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 border-amber-600 ${isAiChecking ? 'opacity-70 cursor-wait' : ''}`}>
            {isAiChecking ? <><Sparkles size={18} className="animate-pulse" /> AI tekshirilmoqda...</> : <><CheckCircle size={18} /> Tekshirish (+{(smartReviewMode ? displayExercises.length : sectionExercises.length) * 10} XP)</>}
          </button>
        </>
      )}

      {Object.keys(completedSections).length > 0 && (
        <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-center">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Umumiy: {Object.values(completedSections).reduce((a, b) => a + b, 0)} / {lesson.exercises.length} to'g'ri
            {' · '}
            {Object.keys(completedSections).length} / {lesson.exerciseSections.length} bo'lim
          </p>
        </div>
      )}
    </div>
  )
}
