/**
 * ExamDemoPage – professional test-taking interface
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  TestHeader (full width, compact)                   │
 *   ├──────────────────────────────┬──────────────────────┤
 *   │                              │                      │
 *   │  MAIN CONTENT (70%)         │  SIDEBAR (30%)       │
 *   │                              │                      │
 *   │  TestProgress                │  CandidateSummary    │
 *   │  QuestionCard                │  CountdownTimer      │
 *   │  SubmitTestDialog (modal)    │  QuestionNavigator   │
 *   │                              │  QuestionStatusLegend│
 *   │                              │                      │
 *   ├──────────────────────────────┴──────────────────────┤
 *   │  TestNavigation (sticky bottom)                    │
 *   └─────────────────────────────────────────────────────┘
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Menu } from 'lucide-react'
import { MOCK_QUESTIONS, type ExamQuestion } from '../components/exam/exam-data'
import TestHeader from '../components/exam/TestHeader'
import TestProgress from '../components/exam/TestProgress'
import QuestionCard from '../components/exam/QuestionCard'
import TestNavigation from '../components/exam/TestNavigation'
import CandidateSummary from '../components/exam/CandidateSummary'
import CountdownTimer from '../components/exam/CountdownTimer'
import QuestionNavigator from '../components/exam/QuestionNavigator'
import QuestionStatusLegend from '../components/exam/QuestionStatusLegend'
import SubmitTestDialog from '../components/exam/SubmitTestDialog'
import ResultScreen from '../components/exam/ResultScreen'

const TOTAL = MOCK_QUESTIONS.length
const TOTAL_TIME_SEC = 150 * 60 // 2 hours 30 minutes = 9000 sec

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Initial state helpers ────────────────────────────────────────────
const INITIAL_ANSWERS: Record<string, string> = {}
const INITIAL_SAVED = new Set<string>()
const INITIAL_MARKED = new Set<string>()
for (let i = 0; i < 28; i++) {
  const q = MOCK_QUESTIONS[i]
  INITIAL_ANSWERS[q.id] = q.options[i % 4].id
  INITIAL_SAVED.add(q.id)
}
// Mark questions 7, 15, 32 (0-indexed: 6, 14, 31)
INITIAL_MARKED.add(MOCK_QUESTIONS[6].id)
INITIAL_MARKED.add(MOCK_QUESTIONS[14].id)
INITIAL_MARKED.add(MOCK_QUESTIONS[31].id)
// Also mark the current question 12
INITIAL_MARKED.add(MOCK_QUESTIONS[11].id)
// Question 12 answer B (index 1)
INITIAL_ANSWERS[MOCK_QUESTIONS[11].id] = MOCK_QUESTIONS[11].options[1].id
INITIAL_SAVED.add(MOCK_QUESTIONS[11].id)

const INITIAL_REMAINING_SEC = 84 * 60 + 36 // 01:24:36 remaining

export default function ExamDemoPage() {
  // ── State ──────────────────────────────────────────────────────────
  const [idx, setIdx] = useState(11) // 12-savol
  const [answers, setAnswers] = useState<Record<string, string>>(INITIAL_ANSWERS)
  const [saved, setSaved] = useState<Set<string>>(INITIAL_SAVED)
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(INITIAL_MARKED)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showResult, setShowResult] = useState(false)

  // Timer — start 01:24:36 remaining out of 02:30:00
  const deadlineRef = useRef(Date.now() + INITIAL_REMAINING_SEC * 1000)
  const [clockNow, setClockNow] = useState(Date.now())
  const remaining = Math.max(0, Math.ceil((deadlineRef.current - clockNow) / 1000))

  useEffect(() => {
    const id = setInterval(() => setClockNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Derived state ─────────────────────────────────────────────────
  const cur: ExamQuestion = MOCK_QUESTIONS[idx]
  const answered = saved.size
  const unanswered = TOTAL - answered
  const curSaved = saved.has(cur.id)
  const curAnswer = answers[cur.id]
  const curMarked = markedForReview.has(cur.id)

  // ── Handlers ───────────────────────────────────────────────────────
  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL) return
    setIdx(i)
  }, [])

  const selectAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [cur.id]: optionId }))
  }

  const toggleReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev)
      if (next.has(cur.id)) {
        next.delete(cur.id)
      } else {
        next.add(cur.id)
      }
      return next
    })
  }

  const handleSubmit = () => {
    // Save current answer
    if (curAnswer && !curSaved) {
      setSaved((prev) => {
        const next = new Set(prev)
        next.add(cur.id)
        return next
      })
    }
    setShowSubmitDialog(false)
    setShowResult(true)
  }

  const handleExit = () => {
    // In real app: navigate to dashboard
    setShowResult(true) // shortcut
  }

  const handleHelp = () => {
    // In real app: show help modal
  }

  const restart = () => {
    setShowResult(false)
    setIdx(11)
    setAnswers(INITIAL_ANSWERS)
    setSaved(INITIAL_SAVED)
    setMarkedForReview(INITIAL_MARKED)
    setShowSubmitDialog(false)
    setSidebarOpen(false)
    deadlineRef.current = Date.now() + INITIAL_REMAINING_SEC * 1000
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showResult || showSubmitDialog) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goTo(idx - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          goTo(idx + 1)
          break
        case 'a':
        case 'A':
          if (cur.options[0]) selectAnswer(cur.options[0].id)
          break
        case 'b':
        case 'B':
          if (cur.options[1]) selectAnswer(cur.options[1].id)
          break
        case 'c':
        case 'C':
          if (cur.options[2]) selectAnswer(cur.options[2].id)
          break
        case 'd':
        case 'D':
          if (cur.options[3]) selectAnswer(cur.options[3].id)
          break
        case 'r':
        case 'R':
          toggleReview()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, showResult, showSubmitDialog, cur, goTo])

  // ═══════════════════════ RESULT ═════════════════════════
  if (showResult) {
    return <ResultScreen answered={answered} total={TOTAL} onRestart={restart} />
  }

  // ═══════════════════════ ACTIVE EXAM ════════════════════
  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* ─── HEADER ─────────────────────────────────────── */}
      <TestHeader onExit={handleExit} onHelp={handleHelp} />

      {/* ─── BODY ───────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ═══ MAIN CONTENT (64%) ═════════════════════════ */}
        <main className="flex-[1.78] min-w-0 flex flex-col overflow-y-auto">
          {/* Mobile: sidebar toggle */}
          <div className="lg:hidden flex items-center gap-2 px-4 pt-3 pb-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                         text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                testName="Attestatsiya testi — Informatika"
              />
            </div>
          </div>

          {/* Question */}
          <div className="flex-1 px-4 sm:px-6 pb-4">
            <div className="max-w-[1500px] mx-auto space-y-4">
              <QuestionCard
                question={cur}
                selectedAnswer={curAnswer}
                markedForReview={curMarked}
                saved={curSaved}
                disabled={false}
                onSelectAnswer={selectAnswer}
                onToggleReview={toggleReview}
              />
            </div>
          </div>

          {/* ─── BOTTOM NAV ────────────────────────────────── */}
          <TestNavigation
            currentIndex={idx}
            total={TOTAL}
            canGoPrev={idx > 0}
            canGoNext={idx < TOTAL - 1}
            onPrev={() => goTo(idx - 1)}
            onNext={() => goTo(idx + 1)}
            onFinish={() => {
              // Save current answer first
              if (curAnswer && !curSaved) {
                setSaved((prev) => {
                  const next = new Set(prev)
                  next.add(cur.id)
                  return next
                })
              }
              setShowSubmitDialog(true)
            }}
          />
        </main>

        {/* ═══ SIDEBAR (36%) ════════════════════════════════ */}
        {/* Desktop: persistent */}
        <aside className="hidden lg:flex flex-1 shrink-0 flex-col border-l border-border bg-card overflow-hidden max-w-[540px]">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <CandidateSummary />
            <CountdownTimer remainingSeconds={remaining} totalSeconds={TOTAL_TIME_SEC} />
            <div className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Savollar ({TOTAL})
              </p>
              <QuestionNavigator
                currentIndex={idx}
                answered={saved}
                markedForReview={markedForReview}
                questionIds={MOCK_QUESTIONS.map((q) => q.id)}
                onNavigate={goTo}
              />
              <QuestionStatusLegend />
            </div>
          </div>
        </aside>

        {/* Mobile/tablet: drawer */}
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
                <CountdownTimer remainingSeconds={remaining} totalSeconds={TOTAL_TIME_SEC} />
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Savollar ({TOTAL})
                  </p>
                  <QuestionNavigator
                    currentIndex={idx}
                    answered={saved}
                    markedForReview={markedForReview}
                    questionIds={MOCK_QUESTIONS.map((q) => q.id)}
                    onNavigate={(i) => {
                      goTo(i)
                      setSidebarOpen(false)
                    }}
                  />
                  <QuestionStatusLegend />
                </div>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* ─── SUBMIT DIALOG ──────────────────────────────────── */}
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
