import { useState, useMemo } from 'react'
import { Shuffle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../../data/dailyLessons'
import ExerciseCard from './ExerciseCard'
import { useI18n } from '../../i18n'

interface MixedReviewProps {
  lesson: DailyLesson
  addXP: (amount: number) => void
}

/**
 * MixedReview — Interleaved practice component.
 * Takes exercises from all sections of the current lesson,
 * shuffles them randomly, and presents them in a mixed order.
 * This helps with long-term retention by preventing
 * massed practice of the same type.
 */
export default function MixedReview({ lesson, addXP }: MixedReviewProps) {
  const { t } = useI18n()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Collect all exercises from all exercise sections + tests
  const mixedExercises = useMemo(() => {
    const allExercises: DailyExercise[] = []

    // From exerciseSections
    for (const section of lesson.exerciseSections ?? []) {
      const sectionExercises = (lesson.exercises ?? []).filter(
        (e) => section.ids.includes(e.id)
      )
      allExercises.push(...sectionExercises)
    }

    // Add some tests if available
    for (const section of lesson.testSections ?? []) {
      const sectionTests = (lesson.tests ?? []).filter(
        (t) => section.ids.includes(t.id)
      )
      allExercises.push(...sectionTests.slice(0, 3))
    }

    // Shuffle using Fisher-Yates
    const shuffled = [...allExercises]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Limit to 10 exercises for a focused review
    return shuffled.slice(0, Math.min(10, shuffled.length))
  }, [lesson])

  const totalExercises = mixedExercises.length
  const currentExercise = mixedExercises[currentIndex]
  const progress = totalExercises > 0 ? Math.round(((currentIndex) / totalExercises) * 100) : 0

  const handleAnswer = (exerciseId: number, blankIdx: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] ?? []), ...Array(Math.max(0, blankIdx + 1 - (prev[exerciseId]?.length ?? 0))).fill('')].map(
        (v, i) => (i === blankIdx ? value : v)
      ),
    }))
  }

  const handleSubmit = () => {
    if (!currentExercise) return
    // Simple check: for fill-blank, compare first blank
    let isCorrect = false
    if (currentExercise.type === 'fill-blank' && currentExercise.blanks) {
      const userAnswer = (answers[currentExercise.id] ?? [])[0]?.toLowerCase().trim()
      const correctAnswer = currentExercise.blanks[0]?.toLowerCase().trim()
      isCorrect = userAnswer === correctAnswer
    }
    // For multiple-choice
    if (currentExercise.type === 'multiple-choice' && 'correct' in currentExercise) {
      const userAnswer = (answers[currentExercise.id] ?? [])[0]
      isCorrect = userAnswer === (currentExercise as { correct?: string }).correct
    }

    setScore((prev) => prev + (isCorrect ? 1 : 0))
    setSubmitted(true)
    if (isCorrect) addXP(10)
  }

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSubmitted(false)
    }
  }

  const handleStart = () => {
    setStarted(true)
    setCurrentIndex(0)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const isComplete = submitted && currentIndex === totalExercises - 1

  if (!started) {
    return (
      <div className="card bg-gradient-to-br from-violet-50 to-primary-50 dark:from-violet-900/20 dark:to-primary-900/20 border border-violet-200 dark:border-violet-800 text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center mx-auto">
          <Shuffle size={28} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{t('mixedReview.title') ?? 'Aralash takrorlash'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('mixedReview.description') ?? 'Turli bo\'limlardagi savollar aralashtiriladi. Bu uzoq muddatli xotirani yaxshilaydi.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>📝 {totalExercises} ta savol</span>
          <span>⏱ ~{Math.ceil(totalExercises * 0.5)} daqiqa</span>
          <span>⭐ {totalExercises * 10} XP</span>
        </div>
        <button onClick={handleStart} className="btn-primary px-6 py-2.5 flex items-center gap-2 mx-auto">
          <Shuffle size={16} /> {t('mixedReview.start') ?? 'Boshlash'}
        </button>
      </div>
    )
  }

  if (isComplete) {
    const pct = totalExercises > 0 ? Math.round((score / totalExercises) * 100) : 0
    return (
      <div className="card bg-gradient-to-br from-emerald-50 to-primary-50 dark:from-emerald-900/20 dark:to-primary-900/20 border border-emerald-200 dark:border-emerald-800 text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-200">{t('mixedReview.complete') ?? 'Tugadi!'}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {score}/{totalExercises} to'g'ri ({pct}%)
          </p>
        </div>
        <button onClick={handleStart} className="btn-primary px-6 py-2.5 flex items-center gap-2 mx-auto">
          <Shuffle size={16} /> {t('mixedReview.retry') ?? 'Qaytadan'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{currentIndex + 1}/{totalExercises}</span>
          <span className="font-bold text-violet-600">{score} to'g'ri</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current exercise */}
      {currentExercise && (
        <ExerciseCard
          ex={currentExercise}
          num={currentIndex + 1}
          total={totalExercises}
          answers={answers[currentExercise.id] ?? []}
          onChange={(blankIdx, val) => handleAnswer(currentExercise.id, blankIdx, val)}
          submitted={submitted}
        />
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!submitted ? (
          <button onClick={handleSubmit} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
            <CheckCircle size={18} /> Tekshirish (+10 XP)
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
            {currentIndex < totalExercises - 1 ? (
              <><ArrowRight size={18} /> Keyingi</>
            ) : (
              <><Sparkles size={18} /> Natija</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
