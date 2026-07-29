import { useState, useMemo, useEffect } from 'react'
import { Shuffle, CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../../data/dailyLessons'
import ExerciseCard from './ExerciseCard'
import { useI18n } from '../../i18n'
import { LESSON_INDEX } from '../../data/daily/lessonsIndex'

const lessonModuleMap: Record<string, () => Promise<{ default: DailyLesson }>> = {
  'greetings-names':  () => import('../../data/daily/a0Part1').then(m => ({ default: m.greetingsAndNames })),
  'numbers-alphabet': () => import('../../data/daily/a0Part1').then(m => ({ default: m.numbersAndAlphabet })),
  'family-me':        () => import('../../data/daily/a0Part1').then(m => ({ default: m.familyAndMe })),
  'a1-part1':         () => import('../../data/daily/a1Part1').then(m => ({ default: m.alphabetAndGreetings })),
  'a1-part2':         () => import('../../data/daily/a1Part2').then(m => ({ default: m.demonstratives })),
  'a1-articles':      () => import('../../data/daily/a1Articles').then(m => ({ default: m.articles })),
  'a1-greetings':     () => import('../../data/daily/a1Greetings').then(m => ({ default: m.greetingsAndIntroductions })),
  'a2-part1':         () => import('../../data/daily/a2Part1').then(m => ({ default: m.modalVerbs })),
  'a2-part2':         () => import('../../data/daily/a2Part2').then(m => ({ default: m.adjectiveAdverb })),
  'a2-part3':         () => import('../../data/daily/a2Part3').then(m => ({ default: m.verbPatterns })),
  'a2-part4':         () => import('../../data/daily/a2Part4').then(m => ({ default: m.presentContinuousFuture })),
  'b1-part1':         () => import('../../data/daily/b1Part1').then(m => ({ default: m.futureFormsReview })),
  'b1-plus-part1':    () => import('../../data/daily/b1plusPart1').then(m => ({ default: m.narrativeTensesB1plus })),
  'b1-plus-part2':    () => import('../../data/daily/b1plusPart2').then(m => ({ default: m.linkingWordsAdvanced })),
  'b1-extra':         () => import('../../data/daily/b1Extra').then(m => ({ default: m.relativeClausesB1 })),
  'b1-pragmatics':    () => import('../../data/daily/b1Pragmatics').then(m => ({ default: m.pragmaticsFormalInformal })),
  'b2-part1':         () => import('../../data/daily/b2Part1').then(m => ({ default: m.unrealPastB2 })),
  'b2-part2':         () => import('../../data/daily/b2Part2').then(m => ({ default: m.complexSentencesB2 })),
  'b2-part3':         () => import('../../data/daily/b2Part3').then(m => ({ default: m.argumentStructureB2 })),
  'b2-british-american': () => import('../../data/daily/b2BritishAmerican').then(m => ({ default: m.britishAmericanDifferencesB2 })),
  'b2-modals-pragmatics': () => import('../../data/daily/b2ModalsPragmatics').then(m => ({ default: m.modalsPragmaticsB2 })),
}

interface Props {
  level: string
  addXP: (amount: number) => void
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CrossLessonMixedReview({ level, addXP }: Props) {
  const { t } = useI18n()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [lessons, setLessons] = useState<DailyLesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const metaList = LESSON_INDEX.filter(l => l.level === level && !l.isReview)
      const loaded: DailyLesson[] = []
      for (const meta of metaList) {
        const loader = lessonModuleMap[meta.id]
        if (loader) {
          try {
            const mod = await loader()
            loaded.push(mod.default)
          } catch { /* skip */ }
        }
      }
      if (!cancelled) {
        setLessons(loaded)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [level])

  const mixedExercises = useMemo(() => {
    const all: DailyExercise[] = []
    for (const lesson of lessons) {
      for (const section of lesson.exerciseSections ?? []) {
        const sectionEx = (lesson.exercises ?? []).filter(e => section.ids.includes(e.id))
        all.push(...sectionEx)
      }
      for (const section of lesson.testSections ?? []) {
        const sectionTests = (lesson.tests ?? []).filter(t => section.ids.includes(t.id))
        all.push(...sectionTests.slice(0, 2))
      }
    }
    const deduped = all.filter((e, i, arr) => arr.findIndex(x => x.id === e.id) === i)
    return fisherYatesShuffle(deduped).slice(0, 20)
  }, [lessons])

  const totalExercises = mixedExercises.length
  const currentExercise = mixedExercises[currentIndex]
  const progress = totalExercises > 0 ? Math.round((currentIndex / totalExercises) * 100) : 0

  const handleAnswer = (exerciseId: number, blankIdx: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] ?? []), ...Array(Math.max(0, blankIdx + 1 - (prev[exerciseId]?.length ?? 0))).fill('')].map(
        (v, i) => (i === blankIdx ? value : v)
      ),
    }))
  }

  const handleSubmit = () => {
    if (!currentExercise) return
    let isCorrect = false
    if (currentExercise.type === 'fill-blank' && currentExercise.blanks) {
      const userAnswer = (answers[currentExercise.id] ?? [])[0]?.toLowerCase().trim()
      const correctAnswer = currentExercise.blanks[0]?.toLowerCase().trim()
      isCorrect = userAnswer === correctAnswer
    }
    if (currentExercise.type === 'multiple-choice' && 'correct' in currentExercise) {
      const userAnswer = (answers[currentExercise.id] ?? [])[0]
      isCorrect = userAnswer === (currentExercise as { correct?: string }).correct
    }
    setScore(prev => prev + (isCorrect ? 1 : 0))
    setSubmitted(true)
    if (isCorrect) addXP(10)
  }

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex(prev => prev + 1)
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

  if (loading) {
    return (
      <div className="card text-center py-8 space-y-3">
        <Loader2 size={24} className="animate-spin mx-auto text-primary-600" />
        <p className="text-sm text-gray-500">{t('mixedReview.loading') ?? 'Darslar yuklanmoqda...'}</p>
      </div>
    )
  }

  if (totalExercises === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-sm text-gray-400">{t('mixedReview.noExercises') ?? "Bu darajada hali mashqlar yo'q"}</p>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="card bg-gradient-to-br from-violet-50 to-primary-50 dark:from-violet-900/20 dark:to-primary-900/20 border border-violet-200 dark:border-violet-800 text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center mx-auto">
          <Shuffle size={28} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {t('crossReview.title') ?? 'Aralash takrorlash'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('crossReview.description', { level }) ?? `${level} darajasidagi barcha darslardan aralash savollar`}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>📚 {lessons.length} dars</span>
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
          <p className="text-sm text-gray-500 mt-1">{score}/{totalExercises} to'g'ri ({pct}%)</p>
        </div>
        <button onClick={handleStart} className="btn-primary px-6 py-2.5 flex items-center gap-2 mx-auto">
          <Shuffle size={16} /> {t('mixedReview.retry') ?? 'Qaytadan'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{currentIndex + 1}/{totalExercises}</span>
          <span className="font-bold text-violet-600">{score} to'g'ri</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

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
