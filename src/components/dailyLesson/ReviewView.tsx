import { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import type { ReviewLesson, DailyExercise } from '../../data/dailyLessons'
import { useStore } from '../../store/useStore'
import { checkAnswer, getExerciseContext, getCorrectText } from './helpers'
import type { DailyExerciseCheckItem } from '../../lib/claude'
import { checkDailyExerciseAnswers } from '../../lib/claude'
import { monitoring } from '../../lib/monitoring'
import {
  pushLessonProgress, pushTestProgress, getLessonProgress,
  saveExerciseAnswersToDB, clearExerciseAnswersFromDB,
} from '../../services/lessonService'
import type { Answers, Tab } from './ReviewHelpers'
import { LEVEL_COLOR, REVIEW_RULES_LS_PREFIX } from './ReviewHelpers'
import ReviewKeyRules from './ReviewKeyRules'
import ReviewMasteryMeter from './ReviewMasteryMeter'
import ReviewExercisesTab from './ReviewExercisesTab'
import ReviewTestsTab from './ReviewTestsTab'
import ReviewWrongView from './ReviewWrongView'

export default function ReviewView({ lesson, onBack }: { lesson: ReviewLesson; onBack: () => void }) {
  const { addXP, setLessonProgress } = useStore()

  const [tab, setTab] = useState<Tab>('exercises')
  const [currentSection, setCurrentSection] = useState(0)
  const [testSection, setTestSection] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>({})
  const [aiResults, setAiResults] = useState<Record<number, boolean>>({})
  const [isAiChecking, setIsAiChecking] = useState(false)
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [completedTestSections, setCompletedTestSections] = useState<Record<number, number>>({})
  const [prevScore, setPrevScore] = useState<number | null>(null)

  // ── Key Rules: individual accordion + Tushundim tracking ──
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({})
  const [understoodRules, setUnderstoodRules] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(REVIEW_RULES_LS_PREFIX + lesson.id) ?? '{}') }
    catch { return {} }
  })

  // ── Smart Review: faqat xato mashqlarni qayta ko'rsatish ──
  const [smartReviewMode, setSmartReviewMode] = useState(false)
  const [wrongExerciseIds, setWrongExerciseIds] = useState<number[]>([])
  const [lastCheckedCount, setLastCheckedCount] = useState(0)

  // ── Smart Review: cross-section consolidation ──
  const consolidatedWrongIdsRef = useRef<Set<number>>(new Set())
  const [showWrongReview, setShowWrongReview] = useState(false)

  const section = lesson.exerciseSections[currentSection]
  const sectionExercises = lesson.exercises.filter(ex => section?.ids.includes(ex.id))
  const displayExercises = smartReviewMode
    ? sectionExercises.filter(ex => wrongExerciseIds.includes(ex.id))
    : sectionExercises
  const isLastSection = currentSection === lesson.exerciseSections.length - 1

  const shuffledTestOptionsMap = useMemo(() => {
    const map = new Map<number, string[]>()
    const sec = lesson.testSections[testSection]
    if (!sec) return map
    const tests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
    for (const t of tests) {
      const opts = [...t.options]
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]]
      }
      map.set(t.id, opts)
    }
    return map
  }, [lesson.tests, lesson.testSections, testSection])

  useEffect(() => {
    getLessonProgress(lesson.id).then(p => { if (p !== null) setPrevScore(p) })
  }, [lesson.id])

  // ── Persist understood rules ──
  useEffect(() => {
    try { localStorage.setItem(`review-rules-${lesson.id}`, JSON.stringify(understoodRules)) }
    catch { /* ignore */ }
  }, [understoodRules, lesson.id])

  const exerciseDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const testDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => {
    if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
    if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
  }, [])

  const toggleRuleExpand = (topic: string) => {
    setExpandedRules(prev => ({ ...prev, [topic]: !prev[topic] }))
  }

  const toggleRuleUnderstood = (topic: string) => {
    setUnderstoodRules(prev => ({ ...prev, [topic]: !prev[topic] }))
  }

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers(prev => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleJumpToSection = (idx: number) => {
    if (idx === currentSection) return
    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}); setSmartReviewMode(false)
    try {
      const saved = localStorage.getItem(`review-ex-${lesson.id}-${idx}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.answers) setAnswers(data.answers)
        if (data.submitted != null) setSubmitted(data.submitted)
        if (data.score != null) setScore(data.score)
      }
    } catch { /* ignore */ }
    setCurrentSection(idx)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleJumpToTestSection = (idx: number) => {
    if (idx === testSection) return
    setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({})
    try {
      const saved = localStorage.getItem(`review-test-${lesson.id}-${idx}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.testAnswers) setTestAnswers(data.testAnswers)
        if (data.testSubmitted != null) setTestSubmitted(data.testSubmitted)
        if (data.testScore != null) setTestScore(data.testScore)
        if (data.testResults) setTestResults(data.testResults)
      }
    } catch { /* ignore */ }
    setTestSection(idx)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleSubmitSection = async () => {
    setIsAiChecking(true)
    let correct = 0
    const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
    const wrongItems: DailyExerciseCheckItem[] = []

    // Smart Review: faqat xato mashqlarni tekshirish
    const exercisesToCheck = smartReviewMode ? displayExercises : sectionExercises

    for (const ex of exercisesToCheck) {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      else {
        const context = getExerciseContext(ex)
        const correctStr = getCorrectText(ex)
        let userAnsStr = ''
        if (ex.type === 'fill-blank' || ex.type === 'passage') { userAnsStr = userAns.join(' / ') }
        else if (ex.type === 'fill-table') { userAnsStr = '' }
        else { userAnsStr = userAns[0] ?? '' }
        wrongItems.push({ id: ex.id, context, correct: correctStr, userAnswer: userAnsStr, type: ex.type })
      }
      answerPayloads.push({ exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok })
    }

    const newAiResults: Record<number, boolean> = {}
    if (wrongItems.length > 0) {
      try {
        const aiResultsList = await checkDailyExerciseAnswers(wrongItems)
        for (let i = 0; i < wrongItems.length; i++) {
          if (aiResultsList[i]) {
            const exId = wrongItems[i].id
            newAiResults[exId] = true
            correct++
            const payload = answerPayloads.find(p => p.exerciseId === exId)
            if (payload) payload.isCorrect = true
          }
        }
      } catch {
        monitoring.captureMessage('AI check failed in ReviewView', 'warn')
      }
    }

    setAiResults(newAiResults)
    setScore(correct)
    setSubmitted(true)
    setLastCheckedCount(exercisesToCheck.length)

    // Smart Review: skorni jamlash (xatolar tuzatilganini hisobga olish)
    const effectiveScore = smartReviewMode
      ? (completedSections[currentSection] ?? 0) + correct
      : correct

    const updatedSections = { ...completedSections, [currentSection]: effectiveScore }
    setCompletedSections(updatedSections)
    addXP(correct * 10)
    saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', answerPayloads)

    // Smart Review: xato mashqlarni eslab qolish
    if (!smartReviewMode) {
      const wrongIds = answerPayloads
        .filter(p => !p.isCorrect)
        .map(p => p.exerciseId)
      setWrongExerciseIds(wrongIds)
      // Accumulate wrong IDs across ALL sections for consolidated review
      for (const id of wrongIds) {
        consolidatedWrongIdsRef.current.add(id)
      }
    } else {
      // Smart Review tugadi — normal rejimga qaytish
      setSmartReviewMode(false)
      setWrongExerciseIds([])
    }

    try {
      localStorage.setItem(`review-ex-${lesson.id}-${currentSection}`, JSON.stringify({ answers, submitted: true, score: correct }))
    } catch { /* ignore */ }

    const exerciseCorrect = Object.values(updatedSections).reduce((a, b) => a + b, 0)
    const testStarted = lesson.tests.length > 0 && Object.keys(completedTestSections).length > 0
    const testCorrect = testStarted
      ? Object.values(completedTestSections).reduce((a, b) => a + b, 0)
      : 0
    const testTotal = testStarted ? lesson.tests.length : 0
    const combinedCorrect = exerciseCorrect + testCorrect
    const combinedMax = lesson.exercises.length + testTotal
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)
    pushLessonProgress(lesson.id, exerciseCorrect, lesson.exercises.length).catch(() => {
      monitoring.captureMessage('pushLessonProgress (review) failed', 'warn')
    })
    setIsAiChecking(false)
  }

  const handleNextSection = () => {
    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({})
    setCurrentSection(prev => prev + 1)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleSubmitTest = () => {
    const sec = lesson.testSections[testSection]
    if (!sec) return
    const sectionTests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
    let correct = 0
    const results: Record<number, boolean> = {}
    const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
    for (const t of sectionTests) {
      const ans = testAnswers[t.id] || ''
      const ok = ans === t.correct
      results[t.id] = ok
      if (ok) correct++
      answerPayloads.push({ exerciseId: t.id, exerciseType: t.type, answer: [ans], isCorrect: ok })
    }
    setTestScore(correct); setTestResults(results); setTestSubmitted(true)
    const newCompleted = { ...completedTestSections, [testSection]: correct }
    setCompletedTestSections(newCompleted)
    addXP(correct * 10)
    saveExerciseAnswersToDB(lesson.id, testSection, 'test', answerPayloads)

    try {
      localStorage.setItem(`review-test-${lesson.id}-${testSection}`, JSON.stringify({ testAnswers, testSubmitted: true, testScore: correct, testResults: results }))
    } catch { /* ignore */ }

    pushTestProgress(lesson.id, sec.title, correct, sectionTests.length).catch(() => {
      monitoring.captureMessage('pushTestProgress (review) failed', 'warn')
    })
    const testCorrectAll = Object.values(newCompleted).reduce((a, b) => a + b, 0)
    const exerciseCorrectAll = Object.values(completedSections).reduce((a, b) => a + b, 0)
    const combinedCorrect = testCorrectAll + exerciseCorrectAll
    const combinedMax = lesson.exercises.length + lesson.tests.length
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)
  }

  // ── Wrong Review View ──
  if (showWrongReview) {
    return (
      <ReviewWrongView
        wrongExerciseIds={[...consolidatedWrongIdsRef.current]}
        exercises={lesson.exercises}
        onBack={() => setShowWrongReview(false)}
      />
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Boshqa dars
        </button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <span className={`badge text-white text-xs font-bold ${LEVEL_COLOR[lesson.level] ?? 'bg-gray-600'}`}>{lesson.level}</span>
        {prevScore !== null && (
          <span className={`badge text-xs font-bold ${prevScore >= 80 ? 'bg-green-100 text-green-700' : prevScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {prevScore}% ✅
          </span>
        )}
      </div>

      {/* ── Title + topics ── */}
      <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={18} className="text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Takrorlash darsi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {lesson.coversTopics.map(topic => (
            <span key={topic} className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">{topic}</span>
          ))}
        </div>
      </div>

      {/* ── Key Rules ── */}
      {lesson.keyRules && lesson.keyRules.length > 0 && (
        <ReviewKeyRules
          keyRules={lesson.keyRules}
          expandedRules={expandedRules}
          understoodRules={understoodRules}
          onToggleExpand={toggleRuleExpand}
          onToggleUnderstood={toggleRuleUnderstood}
        />
      )}

      {/* ── Mastery Meter ── */}
      <ReviewMasteryMeter
        completedSections={completedSections}
        completedTestSections={completedTestSections}
        exerciseSections={lesson.exerciseSections}
        totalExercises={lesson.exercises.length}
        totalTests={lesson.tests.length}
      />

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-700 pb-0 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        {([
          { id: 'exercises' as const, label: '✍️ Mashqlar', desc: `${lesson.exercises.length} ta` },
          { id: 'tests' as const,     label: '🧪 Testlar',  desc: `${lesson.tests.length} ta` },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              tab === t.id ? 'border-amber-500 text-amber-700 dark:text-amber-400' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}>
            {t.label}
            <span className="ml-1 text-xs text-gray-400">({t.desc})</span>
          </button>
        ))}
      </div>

      {/* ── EXERCISES TAB ── */}
      {tab === 'exercises' && (
        <ReviewExercisesTab
          lesson={lesson}
          sectionExercises={sectionExercises}
          displayExercises={displayExercises}
          currentSection={currentSection}
          section={section}
          submitted={submitted}
          score={score}
          lastCheckedCount={lastCheckedCount}
          aiResults={aiResults}
          answers={answers}
          wrongExerciseIds={wrongExerciseIds}
          smartReviewMode={smartReviewMode}
          completedSections={completedSections}
          isLastSection={isLastSection}
          totalSections={lesson.exerciseSections.length}
          onJumpToSection={handleJumpToSection}
          onChangeAnswer={handleChangeAnswer}
          onSubmit={handleSubmitSection}
          onClear={() => {
            if (exerciseDBSaveTimerRef.current) { clearTimeout(exerciseDBSaveTimerRef.current); exerciseDBSaveTimerRef.current = undefined }
            setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}); setSmartReviewMode(false); setWrongExerciseIds([])
            try { localStorage.removeItem(`review-ex-${lesson.id}-${currentSection}`) } catch { /* ignore */ }
            clearExerciseAnswersFromDB(lesson.id, currentSection, 'exercise')
          }}
          onStartSmartReview={() => { setSmartReviewMode(true); setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}) }}
          onNextSection={handleNextSection}
          onShowWrongReview={setShowWrongReview}
          consolidatedWrongCount={consolidatedWrongIdsRef.current.size}
          isAiChecking={isAiChecking}
        />
      )}

      {/* ── TESTS TAB ── */}
      {tab === 'tests' && (
        <ReviewTestsTab
          lesson={lesson}
          testSection={testSection}
          testAnswers={testAnswers}
          testSubmitted={testSubmitted}
          testScore={testScore}
          testResults={testResults}
          completedTestSections={completedTestSections}
          shuffledTestOptionsMap={shuffledTestOptionsMap}
          onJumpToTestSection={handleJumpToTestSection}
          onSetTestAnswers={setTestAnswers}
          onSubmit={handleSubmitTest}
          onClear={() => {
            if (testDBSaveTimerRef.current) { clearTimeout(testDBSaveTimerRef.current); testDBSaveTimerRef.current = undefined }
            setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({})
            try { localStorage.removeItem(`review-test-${lesson.id}-${testSection}`) } catch { /* ignore */ }
            clearExerciseAnswersFromDB(lesson.id, testSection, 'test')
          }}
          onNextTestSection={() => { setTestSection(p => p + 1); setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({}) }}
        />
      )}
    </div>
  )
}
