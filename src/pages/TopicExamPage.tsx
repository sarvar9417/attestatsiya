/**
 * TopicExamPage — Mavzu testlarini professional exam UI da ishlash
 *
 * Bu sahifa ExamDemoPage dizaynini ishlatadi, lekin topicContent dan
 * real savollarni oladi. Foydalanuvchi TopicView dagi "Bilimni tekshirish"
 * tugmasidan bu yerga keladi va test tugagach ModulePage ga qaytadi.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Menu, ArrowLeft } from 'lucide-react'
import { getTopicContent, type TopicContent, type TestQuestion } from '../data/topicContent'
import { MODULES } from '../data/contentTree'
import TestHeader from '../components/exam/TestHeader'
import TestProgress from '../components/exam/TestProgress'
import TestNavigation from '../components/exam/TestNavigation'
import CandidateSummary from '../components/exam/CandidateSummary'
import CountdownTimer from '../components/exam/CountdownTimer'
import QuestionNavigator from '../components/exam/QuestionNavigator'
import QuestionStatusLegend from '../components/exam/QuestionStatusLegend'
import SubmitTestDialog from '../components/exam/SubmitTestDialog'
import ResultScreen from '../components/exam/ResultScreen'
import QuestionCard from '../components/exam/QuestionCard'
import type { ExamQuestion } from '../components/exam/exam-data'

/** Y1/Y2/Y3 savolini ExamQuestion formatiga o'tkazadi */
function convertToExamQuestion(q: TestQuestion, idx: number): ExamQuestion {
  return {
    id: q.id,
    number: idx + 1,
    subject: 'Mavzu testi',
    stem_md: q.text,
    options: q.options.map((opt, oi) => ({
      id: `${q.id}_${String.fromCharCode(97 + oi)}`,
      side: 'a' as const,
      content_md: opt,
    })),
    cognitiveLevel: (q.type === 'Y1' ? 'knowledge' : q.type === 'Y2' ? 'application' : 'reasoning') as 'knowledge' | 'application' | 'reasoning',
    difficulty: 3,
  }
}

const MAX_EXAM_QUESTIONS = 20
const SECONDS_PER_QUESTION = 2 * 60 // 2 daqiqa

/** Fisher-Yates random shuffle */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TopicExamPage() {
  const { moduleId, subtopicId } = useParams()
  const navigate = useNavigate()

  // Load content and questions
  const content: TopicContent | undefined = subtopicId ? getTopicContent(subtopicId) : undefined

  // ── Random tanlash: barcha savollardan 20 ta (yoki hammasi <20 bo'lsa) ──
  const questions: TestQuestion[] = useMemo(() => {
    const all = content?.questions || []
    const shuffled = shuffleArray(all)
    return shuffled.slice(0, Math.min(MAX_EXAM_QUESTIONS, shuffled.length))
  }, [content])

  const examQuestions = useMemo<ExamQuestion[]>(
    () => questions.map((q, i) => convertToExamQuestion(q, i)),
    [questions]
  )
  const TOTAL = examQuestions.length
  const DURATION_SEC = TOTAL * SECONDS_PER_QUESTION

  const mod = moduleId ? MODULES.find(m => m.id === moduleId) : null

  // ── State ──
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showResult, setShowResult] = useState(false)

  // Timer — 2 daqiqa * savollar soni
  const deadlineRef = useRef(Date.now() + DURATION_SEC * 1000)
  const [clockNow, setClockNow] = useState(Date.now())
  const remaining = Math.max(0, Math.ceil((deadlineRef.current - clockNow) / 1000))

  useEffect(() => {
    const id = setInterval(() => setClockNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Derived state ──
  const cur = examQuestions[idx] || null
  const answered = saved.size
  const unanswered = TOTAL - answered

  // ── Handlers ──
  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL) return
    setIdx(i)
  }, [TOTAL])

  const selectAnswer = (optionId: string) => {
    if (!cur) return
    setAnswers((prev) => ({ ...prev, [cur.id]: optionId }))
  }

  const toggleReview = () => {
    if (!cur) return
    setMarkedForReview((prev) => {
      const next = new Set(prev)
      if (next.has(cur.id)) next.delete(cur.id)
      else next.add(cur.id)
      return next
    })
  }

  const handleSubmit = () => {
    setShowSubmitDialog(false)
    setShowResult(true)
  }

  const handleExit = () => {
    navigate(`/learn/${moduleId || ''}`)
  }

  const restart = () => {
    setShowResult(false)
    setIdx(0)
    setAnswers({})
    setSaved(new Set())
    setMarkedForReview(new Set())
    setShowSubmitDialog(false)
    setSidebarOpen(false)
    deadlineRef.current = Date.now() + DURATION_SEC * 1000
  }

  // Calculate mock score from answers
  const correctCount = questions.filter((q) => {
    const ans = answers[q.id]
    if (!ans) return false
    const idx = ans.lastIndexOf('_')
    if (idx === -1) return false
    const optIndex = ans.charCodeAt(idx + 1) - 97
    return optIndex === q.correctIndex
  }).length

  // ═══════════════════════════ NO CONTENT ═════════════════════════
  if (!content || TOTAL === 0) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          {content ? 'Bu mavzuda test savollari mavjud emas' : 'Mavzu topilmadi'}
        </p>
        <button
          onClick={() => navigate(`/learn/${moduleId || ''}`)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Orqaga qaytish
        </button>
      </div>
    )
  }

  // ═══════════════════════════ RESULT ═════════════════════════
  if (showResult) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-background p-4">
        <ResultScreen
          answered={correctCount}
          total={TOTAL}
          onRestart={restart}
        />
        <button
          onClick={handleExit}
          className="mt-3 px-6 py-2.5 rounded-xl text-sm font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={15} />
          Modulga qaytish
        </button>
      </div>
    )
  }

  // ═══════════════════════════ ACTIVE EXAM ════════════════════
  return (
    <div className="h-dvh flex flex-col bg-background">
      <TestHeader onExit={handleExit} onHelp={() => {}} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ═══ MAIN CONTENT (64%) ═════════════════════════ */}
        <main className="flex-[1.78] min-w-0 flex flex-col overflow-y-auto">
          {/* Mobile: back + sidebar toggle */}
          <div className="lg:hidden flex items-center gap-2 px-4 pt-3 pb-2">
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Orqaga"
            >
              <ArrowLeft size={14} />
              {mod?.code || ''}
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Navigatsiya panelini ochish"
            >
              <Menu size={15} />
              Savollar
            </button>
          </div>

          {/* Progress */}
          <div className="px-4 sm:px-6 pt-2 pb-4">
            <div className="max-w-[1500px] mx-auto w-full">
              <TestProgress
                answered={answered}
                total={TOTAL}
                currentNumber={idx + 1}
                markedForReview={markedForReview.size}
                testName={`${mod?.code || ''} — ${content?.title || ''} testi`}
              />
            </div>
          </div>

          {/* Question */}
          {cur && (
            <div className="flex-1 px-4 sm:px-6 pb-4">
              <div className="max-w-[1500px] mx-auto space-y-4">
                <QuestionCard
                  question={cur}
                  selectedAnswer={answers[cur.id]}
                  markedForReview={markedForReview.has(cur.id)}
                  saved={saved.has(cur.id)}
                  disabled={false}
                  onSelectAnswer={selectAnswer}
                  onToggleReview={toggleReview}
                />
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <TestNavigation
            currentIndex={idx}
            total={TOTAL}
            canGoPrev={idx > 0}
            canGoNext={idx < TOTAL - 1}
            onPrev={() => goTo(idx - 1)}
            onNext={() => goTo(idx + 1)}
            onFinish={() => setShowSubmitDialog(true)}
          />
        </main>

        {/* ═══ SIDEBAR (36%) ════════════════════════════════ */}
        <aside className="hidden lg:flex flex-1 shrink-0 flex-col border-l border-border bg-card overflow-hidden max-w-[540px]">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <CandidateSummary />
            <CountdownTimer remainingSeconds={remaining} totalSeconds={DURATION_SEC} />
            <div className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Savollar ({TOTAL})
              </p>
              <QuestionNavigator
                currentIndex={idx}
                answered={saved}
                markedForReview={markedForReview}
                questionIds={examQuestions.map((q) => q.id)}
                onNavigate={goTo}
              />
              <QuestionStatusLegend />
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 right-0 z-50 w-[320px] max-w-[85vw] bg-card border-l border-border shadow-xl lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Navigatsiya</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Panelni yopish"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <CandidateSummary />
                <CountdownTimer remainingSeconds={remaining} totalSeconds={DURATION_SEC} />
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Savollar ({TOTAL})
                  </p>
                  <QuestionNavigator
                    currentIndex={idx}
                    answered={saved}
                    markedForReview={markedForReview}
                    questionIds={examQuestions.map((q) => q.id)}
                    onNavigate={(i) => { goTo(i); setSidebarOpen(false) }}
                  />
                  <QuestionStatusLegend />
                </div>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Submit dialog */}
      <SubmitTestDialog
        open={showSubmitDialog}
        answered={answered}
        unanswered={unanswered}
        markedForReview={markedForReview.size}
        remainingTime={fmtTime(remaining)}
        onCancel={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
      />
    </div>
  )
}
