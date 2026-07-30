import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  encodeAnswer,
  initialAnswer,
  isAnswerComplete,
  stableShuffle,
  type AnswerValue,
  type ExamItem,
  type ExamSession,
  type FinishExamResponse,
} from './contracts'
import {
  type ExamGateway,
  supabaseExamGateway,
} from './examGateway'
import { backendGateway } from './backendGateway'
import Y1Choice from './questions/Y1Choice'
import Y2Match from './questions/Y2Match'
import Y3Order from './questions/Y3Order'

/**
 * Gateway that prefers the backend but falls back to direct Supabase RPCs
 * if the backend is unreachable (network error or 5xx).
 */
function createFallbackGateway(preferred: ExamGateway, fallback: ExamGateway): ExamGateway {
  return {
    async startMockExam() {
      try {
        return await preferred.startMockExam()
      } catch (error) {
        if (isNetworkError(error)) return fallback.startMockExam()
        throw error
      }
    },
    async startModuleExam(moduleId: string) {
      try {
        return await preferred.startModuleExam(moduleId)
      } catch (error) {
        if (isNetworkError(error)) return fallback.startModuleExam(moduleId)
        throw error
      }
    },
    async startTopicExam(lessonId: string) {
      try {
        return await preferred.startTopicExam(lessonId)
      } catch (error) {
        if (isNetworkError(error)) return fallback.startTopicExam(lessonId)
        throw error
      }
    },
    async submitAnswer(input) {
      try {
        return await preferred.submitAnswer(input)
      } catch (error) {
        if (isNetworkError(error)) return fallback.submitAnswer(input)
        throw error
      }
    },
    async finishExam(examId: string) {
      try {
        return await preferred.finishExam(examId)
      } catch (error) {
        if (isNetworkError(error)) return fallback.finishExam(examId)
        throw error
      }
    },
  }
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (error instanceof Error && error.message.includes('Failed to fetch')) return true
  if (error instanceof Error && error.message.includes('NetworkError')) return true
  return false
}

const fallbackGateway = createFallbackGateway(backendGateway, supabaseExamGateway)

type RunnerPhase =
  | 'intro'
  | 'starting'
  | 'active'
  | 'finishing'
  | 'result'
  | 'start-error'

interface ExamRunnerProps {
  gateway?: ExamGateway
  examKind?: 'mock' | 'bolim' | 'mavzu'
  moduleId?: string
  lessonId?: string
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Kutilmagan xato yuz berdi. Qayta urinib ko‘ring.'
}

export default function ExamRunner({
  gateway = fallbackGateway,
  examKind = 'mock',
  moduleId,
  lessonId,
}: ExamRunnerProps) {
  const [phase, setPhase] = useState<RunnerPhase>('intro')
  const [session, setSession] = useState<ExamSession | null>(null)
  const [result, setResult] = useState<FinishExamResponse | null>(null)
  const [drafts, setDrafts] = useState<Record<string, AnswerValue>>({})
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(
    new Set()
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [finishArmed, setFinishArmed] = useState(false)
  const [clockNow, setClockNow] = useState(Date.now())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const questionOpenedAtRef = useRef(Date.now())
  const finishInFlightRef = useRef(false)
  const autoFinishAttemptedRef = useRef(false)

  const currentItem = session?.items[currentIndex]
  const total = session?.items.length ?? 0
  const savedCount = savedQuestionIds.size
  const unansweredCount = Math.max(0, total - savedCount)

  const deadlineMs = useMemo(() => {
    if (!session || session.duration_sec === null) return null
    return Date.parse(session.started_at) + session.duration_sec * 1000
  }, [session])

  const remainingSeconds =
    deadlineMs === null
      ? null
      : Math.max(0, Math.ceil((deadlineMs - clockNow) / 1000))

  useEffect(() => {
    if (phase !== 'active' || deadlineMs === null) return

    setClockNow(Date.now())
    const timer = window.setInterval(() => setClockNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [deadlineMs, phase])

  useEffect(() => {
    questionOpenedAtRef.current = Date.now()
    setMessage(null)
    setFinishArmed(false)
  }, [currentIndex])

  // Close sidebar on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  const resetToIntro = () => {
    setPhase('intro')
    setSession(null)
    setResult(null)
    setDrafts({})
    setSavedQuestionIds(new Set())
    setCurrentIndex(0)
    setSubmittingId(null)
    setMessage(null)
    setStartError(null)
    setFinishArmed(false)
    finishInFlightRef.current = false
    autoFinishAttemptedRef.current = false
    setSidebarOpen(false)
  }

  const startExam = async () => {
    setPhase('starting')
    setStartError(null)
    setMessage(null)

    try {
      let nextSession: ExamSession
      if (examKind === 'bolim') {
        if (!moduleId) {
          throw new Error('Bo‘lim sinovi uchun modul identifikatori topilmadi.')
        }
        nextSession = await gateway.startModuleExam(moduleId)
      } else if (examKind === 'mavzu') {
        if (!lessonId) {
          throw new Error('Mavzu testi uchun dars identifikatori topilmadi.')
        }
        nextSession = await gateway.startTopicExam(lessonId)
      } else {
        nextSession = await gateway.startMockExam()
      }
      const initialDrafts: Record<string, AnswerValue> = {}

      for (const item of nextSession.items) {
        const answer = initialAnswer(nextSession, item)
        if (answer !== undefined) initialDrafts[item.question_id] = answer
      }

      setSession(nextSession)
      setDrafts(initialDrafts)
      setSavedQuestionIds(new Set())
      setCurrentIndex(0)
      setClockNow(Date.now())
      questionOpenedAtRef.current = Date.now()
      finishInFlightRef.current = false
      autoFinishAttemptedRef.current = false
      setPhase('active')
    } catch (error) {
      setStartError(errorMessage(error))
      setPhase('start-error')
    }
  }

  const finishExam = useCallback(async () => {
    if (!session || finishInFlightRef.current) return

    finishInFlightRef.current = true
    setPhase('finishing')
    setMessage(null)

    try {
      const nextResult = await gateway.finishExam(session.exam_id)
      setResult(nextResult)
      setPhase('result')
    } catch (error) {
      setMessage(errorMessage(error))
      setPhase('active')
      finishInFlightRef.current = false
    }
  }, [gateway, session])

  useEffect(() => {
    if (
      phase !== 'active' ||
      remainingSeconds !== 0 ||
      autoFinishAttemptedRef.current
    ) {
      return
    }

    autoFinishAttemptedRef.current = true
    void finishExam()
  }, [finishExam, phase, remainingSeconds])

  const updateDraft = (value: AnswerValue) => {
    if (!currentItem || savedQuestionIds.has(currentItem.question_id)) return

    setDrafts((current) => ({
      ...current,
      [currentItem.question_id]: value,
    }))
    setMessage(null)
  }

  const moveToNextUnsaved = (questionId: string) => {
    if (!session) return

    const nextIndex = session.items.findIndex(
      (item, index) =>
        index > currentIndex &&
        item.question_id !== questionId &&
        !savedQuestionIds.has(item.question_id)
    )

    if (nextIndex >= 0) setCurrentIndex(nextIndex)
  }

  const submitCurrentAnswer = async () => {
    if (!session || !currentItem) return

    const answer = drafts[currentItem.question_id]
    if (!isAnswerComplete(currentItem, answer)) {
      setMessage('Javobni to‘liq belgilang.')
      return
    }

    setSubmittingId(currentItem.question_id)
    setMessage(null)

    try {
      const response = await gateway.submitAnswer({
        examId: session.exam_id,
        examKind: session.kind,
        questionId: currentItem.question_id,
        answer: encodeAnswer(currentItem, answer),
        timeSpentSec: Math.min(
          86_400,
          Math.max(
            0,
            Math.floor((Date.now() - questionOpenedAtRef.current) / 1000)
          )
        ),
      })

      if ('error' in response) {
        if (response.error === 'vaqt_tugadi') {
          setMessage('Sinov vaqti tugadi. Natija hisoblanmoqda.')
          await finishExam()
          return
        }

        setMessage('Bu sinov allaqachon yakunlangan.')
        return
      }

      setSavedQuestionIds((current) => {
        const next = new Set(current)
        next.add(currentItem.question_id)
        return next
      })
      if ('correct' in response) {
        setMessage(
          `${response.correct ? 'To‘g‘ri.' : 'Noto‘g‘ri.'} ${response.explanation_md}`
        )
      } else {
        setMessage('Javob serverda saqlandi.')
        moveToNextUnsaved(currentItem.question_id)
      }
    } catch (error) {
      setMessage(errorMessage(error))
    } finally {
      setSubmittingId(null)
    }
  }

  const renderQuestion = (item: ExamItem) => {
    const value = drafts[item.question_id]
    const disabled =
      savedQuestionIds.has(item.question_id) ||
      submittingId === item.question_id ||
      phase !== 'active'

    if (item.format === 'Y1') {
      return (
        <Y1Choice
          prompt={item.stem_md}
          options={item.options.filter((option) => option.side === 'a')}
          value={typeof value === 'string' ? value : undefined}
          disabled={disabled}
          onChange={updateDraft}
        />
      )
    }

    if (item.format === 'Y2') {
      const left = item.options.filter((option) => option.side === 'a')
      const right = stableShuffle(
        item.options.filter((option) => option.side === 'b'),
        `${session?.exam_id}:${item.question_id}:Y2`
      )

      return (
        <Y2Match
          prompt={item.stem_md}
          left={left}
          right={right}
          value={
            value && typeof value === 'object' && !Array.isArray(value)
              ? value
              : {}
          }
          disabled={disabled}
          onChange={updateDraft}
        />
      )
    }

    return (
      <Y3Order
        prompt={item.stem_md}
        items={item.options}
        value={Array.isArray(value) ? value : []}
        disabled={disabled}
        onChange={updateDraft}
      />
    )
  }

  const examTitle =
    examKind === 'mock'
      ? 'Attestatsiya mock sinovi'
      : examKind === 'bolim'
        ? 'Modul sinovi'
        : 'Mavzu sinovi'

  // ─── Intro / Starting / Error screens ────────────────────
  if (phase === 'intro' || phase === 'starting' || phase === 'start-error') {
    const starting = phase === 'starting'

    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <section className="card max-w-xl w-full p-8">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck
              size={32}
              className="text-primary-600"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {examTitle}
          </h1>
          <p className="mt-3 text-center text-gray-500">
            Savollar serverda tanlanadi, javoblar serverda baholanadi. Javob
            kaliti brauzerga yuborilmaydi.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-gray-600 dark:text-gray-300">
            {examKind === 'mock' && (
              <>
                <li>50 ta savol · 120 daqiqa</li>
                <li>8 bilish · 35 qo‘llash · 7 mulohaza</li>
              </>
            )}
            {examKind === 'bolim' && (
              <>
                <li>15 ta savol · 30 daqiqa</li>
                <li>Modul bo‘yicha bilimni tekshirish</li>
              </>
            )}
            {examKind === 'mavzu' && (
              <>
                <li>Mavzu bo‘yicha tezkor test</li>
                <li>Vaqt cheklovi yo‘q</li>
              </>
            )}
            <li>Har bir to‘g‘ri javob · 2 ball</li>
          </ul>

          {startError && (
            <div
              role="alert"
              className="mt-5 p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{startError}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={starting}
            onClick={() => void startExam()}
            className="btn-primary w-full mt-6 inline-flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {starting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Sinov yaratilmoqda…
              </>
            ) : phase === 'start-error' ? (
              <>
                <RefreshCw size={18} />
                Qayta urinish
              </>
            ) : (
              'Sinovni boshlash'
            )}
          </button>
        </section>
      </main>
    )
  }

  // ─── Result screen ───────────────────────────────────────
  if (phase === 'result' && result) {
    const percentage =
      result.max_score > 0
        ? Math.round((result.total_score / result.max_score) * 100)
        : 0
    const passed = result.passed ?? percentage >= 60

    return (
      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        <section className="card p-8 text-center">
          <div
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-emerald-100' : 'bg-amber-100'
            }`}
          >
            <CheckCircle2
              size={38}
              className={passed ? 'text-emerald-600' : 'text-amber-600'}
              aria-hidden="true"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sinov yakunlandi
          </h1>
          <p className="mt-4 text-5xl font-bold text-primary-600">
            {result.total_score} / {result.max_score}
          </p>
          <p className="mt-2 text-gray-500">{percentage}% natija</p>

          {result.breakdown && result.breakdown.length > 0 && (
            <div className="mt-8 text-left">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                Guruhlar kesimi
              </h2>
              <div className="grid gap-2">
                {result.breakdown.map((item) => (
                  <div
                    key={item.group_code}
                    className="flex justify-between rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                  >
                    <span>{item.group_code}</span>
                    <span className="font-medium">
                      {item.togri} / {item.jami}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={resetToIntro}
            className="btn-primary mt-8"
          >
            Yangi sinov
          </button>
        </section>
      </main>
    )
  }

  // ─── Active exam screen ──────────────────────────────────
  if (!session || !currentItem) return null

  const currentSaved = savedQuestionIds.has(currentItem.question_id)
  const currentComplete = isAnswerComplete(
    currentItem,
    drafts[currentItem.question_id]
  )
  const busy = phase === 'finishing'
  const interactionBusy = busy || submittingId !== null
  const answeredQuestions = session.items.filter(
    (item) => savedQuestionIds.has(item.question_id)
  ).length

  // Move to a specific question
  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
    setSidebarOpen(false)
  }

  return (
    <main className="flex flex-col h-dvh bg-gray-50 dark:bg-gray-950">
      {/* ── Body: Sidebar + Main ─────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── LEFT SIDEBAR (Desktop) ──────────────────────── */}
        <aside className="hidden lg:flex exam-sidebar">
          {/* User info card */}
          <div className="exam-sidebar-section border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-b2-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {examTitle.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{examTitle}</p>
                <p className="text-[11px] text-gray-400">Attestatsiya platformasi</p>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="exam-sidebar-section border-b border-gray-100 dark:border-gray-800">
            <p className="exam-sidebar-section-header">Qolgan vaqt</p>
            {remainingSeconds !== null ? (
              <div className={`exam-timer ${remainingSeconds <= 300 ? 'exam-timer-urgent' : ''}`}>
                <Clock3 size={20} className={remainingSeconds <= 300 ? 'text-red-500' : 'text-primary-500'} />
                <span className={`exam-timer-display ${remainingSeconds <= 300 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {formatDuration(remainingSeconds)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Cheklanmagan</p>
            )}
          </div>

          {/* Progress stats */}
          <div className="exam-sidebar-section border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div className="exam-stat-chip-answered">
                <Check size={12} />
                <span>{answeredQuestions} ta bajarildi</span>
              </div>
              <div className="exam-stat-chip-remaining">
                <span>{unansweredCount} ta qoldi</span>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="exam-progress mt-3">
              <div
                className="exam-progress-fill bg-gradient-to-r from-emerald-500 to-primary-500"
                style={{ width: `${total > 0 ? (answeredQuestions / total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-1.5">
              {currentIndex + 1} / {total} · {Math.round((answeredQuestions / total) * 100)}%
            </p>
          </div>

          {/* Question navigation grid */}
          <div className="exam-sidebar-section flex-1 overflow-y-auto scrollbar-thin">
            <p className="exam-sidebar-section-header">
              Savollar ({total})
            </p>
            <div className="exam-q-grid">
              {session.items.map((item, index) => {
                const saved = savedQuestionIds.has(item.question_id)
                const isCurrent = index === currentIndex

                let btnClass = 'exam-q-btn '
                if (isCurrent) {
                  btnClass += 'exam-q-btn-current'
                } else if (saved) {
                  btnClass += 'exam-q-btn-answered'
                } else {
                  btnClass += 'exam-q-btn-unanswered'
                }

                return (
                  <button
                    key={item.question_id}
                    type="button"
                    disabled={interactionBusy}
                    aria-label={`Savol ${index + 1}${saved ? ', belgilangan' : ''}`}
                    aria-current={isCurrent ? 'true' : undefined}
                    onClick={() => goToQuestion(index)}
                    className={btnClass}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Finish button + user info at bottom */}
          <div className="exam-sidebar-section border-t border-gray-100 dark:border-gray-800 mt-auto">
            {finishArmed ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-3">
                  {unansweredCount > 0
                    ? `${unansweredCount} ta javoblanmagan savol bor. Baribir yakunlaysizmi?`
                    : 'Barcha savollarga javob berildi. Yakunlaysizmi?'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFinishArmed(false)}
                    className="exam-nav-btn-prev flex-1 justify-center"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => void finishExam()}
                    className="exam-nav-btn-save flex-1 justify-center"
                  >
                    Yakunlash
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={interactionBusy}
                onClick={() => {
                  if (unansweredCount > 0) {
                    setFinishArmed(true)
                  } else {
                    void finishExam()
                  }
                }}
                className="exam-finish-btn"
              >
                Sinovni yakunlash
              </button>
            )}
          </div>
        </aside>

        {/* ── Mobile Sidebar Overlay ─────────────────────── */}
        {sidebarOpen && (
          <>
            <div
              className="exam-sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="exam-sidebar-mobile">
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-b2-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {examTitle.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{examTitle}</p>
                    <p className="text-[11px] text-gray-400">{answeredQuestions}/{total} bajarildi</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400"
                  aria-label="Panelni yopish"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile timer */}
              {remainingSeconds !== null && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Qolgan vaqt</p>
                  <div className={`exam-timer ${remainingSeconds <= 300 ? 'exam-timer-urgent' : ''}`}>
                    <Clock3 size={18} className={remainingSeconds <= 300 ? 'text-red-500' : 'text-primary-500'} />
                    <span className={`exam-timer-display text-base ${remainingSeconds <= 300 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatDuration(remainingSeconds)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile question grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Savollar ({total})
                </p>
                <div className="exam-q-grid">
                  {session.items.map((item, index) => {
                    const saved = savedQuestionIds.has(item.question_id)
                    const isCurrent = index === currentIndex

                    let btnClass = 'exam-q-btn '
                    if (isCurrent) {
                      btnClass += 'exam-q-btn-current'
                    } else if (saved) {
                      btnClass += 'exam-q-btn-answered'
                    } else {
                      btnClass += 'exam-q-btn-unanswered'
                    }

                    return (
                      <button
                        key={item.question_id}
                        type="button"
                        disabled={interactionBusy}
                        aria-label={`Savol ${index + 1}${saved ? ', belgilangan' : ''}`}
                        onClick={() => {
                          setCurrentIndex(index)
                          setSidebarOpen(false)
                        }}
                        className={btnClass}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mobile finish button */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={interactionBusy}
                  onClick={() => {
                    if (unansweredCount > 0) {
                      setFinishArmed(true)
                    } else {
                      void finishExam()
                    }
                    setSidebarOpen(false)
                  }}
                  className="exam-finish-btn"
                >
                  Sinovni yakunlash
                </button>
              </div>
            </aside>
          </>
        )}

        {/* ── MAIN CONTENT AREA ───────────────────────────── */}
        <section className="flex-1 min-w-0 flex flex-col overflow-y-auto scrollbar-thin">
          {/* Top header bar */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                aria-label="Savollar panelini ochish"
              >
                <ChevronDown size={18} />
              </button>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">{examTitle}</span>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Savol {currentIndex + 1}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {remainingSeconds !== null && (
                <span className={`inline-flex items-center gap-1.5 font-mono font-bold text-sm px-2.5 py-1.5 rounded-lg ${
                  remainingSeconds <= 300
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  <Clock3 size={15} />
                  {formatDuration(remainingSeconds)}
                </span>
              )}
              <span className="text-xs text-gray-400 hidden sm:inline">
                {answeredQuestions}/{total}
              </span>
            </div>
          </div>

          {/* Question content wrapper */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
            {/* Question meta row */}
            <div className="exam-question-meta">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold font-mono">
                {currentItem.format}
              </span>
              {currentItem.cognitive_level && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                  {{
                    knowledge: 'Bilish',
                    application: 'Qo‘llash',
                    reasoning: 'Mulohaza',
                  }[currentItem.cognitive_level] || currentItem.cognitive_level}
                </span>
              )}
              {currentItem.difficulty && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
                  {'★'.repeat(currentItem.difficulty)}{'☆'.repeat(5 - currentItem.difficulty)}
                </span>
              )}
              <div className="flex-1" />
              {currentSaved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                  <Check size={14} />
                  Saqlangan
                </span>
              )}
            </div>

            {/* Question card */}
            <div className="exam-question-card">
              <div className="exam-question-stem">
                {renderQuestion(currentItem)}
              </div>
            </div>

            {/* Feedback message */}
            <div aria-live="polite" className="min-h-8 mt-4">
              {message && (
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                  message.includes('saqlandi') || message.startsWith('To‘g‘ri.')
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300'
                }`}>
                  {message.includes('saqlandi') || message.startsWith('To‘g‘ri.') ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                  ) : (
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                  )}
                  <span className="text-sm leading-relaxed">{message}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom Navigation ─────────────────────────── */}
          <div className="exam-nav-bar">
            <div className="flex items-center gap-2 max-w-3xl mx-auto w-full">
              {/* Previous button */}
              <button
                type="button"
                disabled={currentIndex === 0 || interactionBusy}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="exam-nav-btn-prev"
              >
                <ChevronLeft size={17} />
                <span className="hidden sm:inline">Oldingi</span>
              </button>

              {/* Save button (center) */}
              <button
                type="button"
                disabled={
                  !currentComplete ||
                  currentSaved ||
                  submittingId === currentItem.question_id ||
                  interactionBusy
                }
                onClick={() => void submitCurrentAnswer()}
                className="exam-nav-btn-save flex-1 justify-center"
              >
                {submittingId === currentItem.question_id ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : currentSaved ? (
                  <Check size={17} />
                ) : (
                  <ShieldCheck size={17} />
                )}
                {submittingId === currentItem.question_id
                  ? 'Saqlanmoqda…'
                  : currentSaved
                    ? 'Saqlangan'
                    : 'Javobni saqlash'}
              </button>

              {/* Next button */}
              <button
                type="button"
                disabled={currentIndex === total - 1 || interactionBusy}
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="exam-nav-btn-next"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Loading Overlay ──────────────────────────────── */}
      {busy && (
        <div
          role="status"
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-8 py-6 shadow-2xl border border-gray-100 dark:border-gray-800 inline-flex items-center gap-4">
            <LoaderCircle size={24} className="animate-spin text-primary-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Natija serverda hisoblanmoqda…</span>
          </div>
        </div>
      )}
    </main>
  )
}
