import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  LoaderCircle,
  Monitor,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
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
  type TopicTestPreview,
} from './examGateway'
import { backendGateway } from './backendGateway'
import Y1Choice from './questions/Y1Choice'
import Y2Match from './questions/Y2Match'
import Y3Order from './questions/Y3Order'
import { useAuth } from '../../hooks/useAuth'
import { cycleTheme, getThemePreference } from '../../utils/theme'

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
  /** Yakuniy natija ekranidagi "Orqaga" havolasi (masalan, /learn/M01). */
  backUrl?: string
  /** Sinov muvaffaqiyatli yakunlanganda chaqiriladi (progress yozish uchun). */
  onFinished?: (result: FinishExamResponse) => void
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

function initials(value: string | null | undefined): string {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return 'U'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function ExamRunner({
  gateway = backendGateway,
  examKind = 'mock',
  moduleId,
  lessonId,
  backUrl,
  onFinished,
}: ExamRunnerProps) {
  const { displayName, user } = useAuth()
  const [themePref, setThemePref] = useState(getThemePreference())
  const [phase, setPhase] = useState<RunnerPhase>('intro')
  const [session, setSession] = useState<ExamSession | null>(null)
  const [result, setResult] = useState<FinishExamResponse | null>(null)
  const [drafts, setDrafts] = useState<Record<string, AnswerValue>>({})
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(
    new Set()
  )
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(
    new Set()
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [finishArmed, setFinishArmed] = useState(false)
  const [clockNow, setClockNow] = useState(Date.now())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [topicPreview, setTopicPreview] = useState<TopicTestPreview | null>(null)
  const questionOpenedAtRef = useRef(Date.now())
  const finishInFlightRef = useRef(false)
  const autoFinishAttemptedRef = useRef(false)

  useEffect(() => {
    if (examKind !== 'mavzu' || !lessonId || phase !== 'intro') return
    if (gateway.previewTopicTest) {
      void gateway
        .previewTopicTest(lessonId)
        .then(setTopicPreview)
        .catch(() => setTopicPreview(null))
    }
  }, [gateway, examKind, lessonId, phase])

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
    setFlaggedQuestionIds(new Set())
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
      setFlaggedQuestionIds(new Set())
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
      onFinished?.(nextResult)
    } catch (error) {
      setMessage(errorMessage(error))
      setPhase('active')
      finishInFlightRef.current = false
    }
  }, [gateway, session, onFinished])

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
    const questionLabel =
      examKind === 'mock'
        ? '50 savol'
        : examKind === 'bolim'
          ? '15 savol'
          : topicPreview
            ? `${topicPreview.questionCount} savol`
            : 'Mavzu testi'
    const durationLabel =
      examKind === 'mock'
        ? '120 daqiqa'
        : examKind === 'bolim'
          ? '30 daqiqa'
          : topicPreview
            ? `${topicPreview.durationSec / 60} daqiqa`
            : '2 daqiqa / savol'

    return (
      <main className="mx-auto flex min-h-[72vh] w-full max-w-5xl items-center px-4 py-8 sm:px-6">
        <section className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Attestatsiya 2026
                </span>
                <span className="text-xs text-gray-400">Server-authoritative assessment</span>
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                  <ShieldCheck size={23} aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                    {examTitle}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Savollar serverda tanlanadi va javoblar serverda baholanadi.
                    Javob kaliti sinov tugashidan oldin brauzerga yuborilmaydi.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xl font-bold text-gray-950 dark:text-white">{questionLabel}</p>
                  <p className="mt-1 text-xs text-gray-400">Hajmi</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-xl font-bold text-gray-950 dark:text-white">{durationLabel}</p>
                  <p className="mt-1 text-xs text-gray-400">Vaqt</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 sm:col-span-1">
                  <p className="text-xl font-bold text-gray-950 dark:text-white">2 ball</p>
                  <p className="mt-1 text-xs text-gray-400">To‘g‘ri javob</p>
                </div>
              </div>

              {examKind === 'mock' && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    8 bilish
                  </span>
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    35 qo‘llash
                  </span>
                  <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                    7 mulohaza
                  </span>
                </div>
              )}

              {startError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <span>{startError}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={starting}
                onClick={() => void startExam()}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60 sm:w-auto"
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
                  <>
                    Sinovni boshlash
                    <ChevronRight size={17} />
                  </>
                )}
              </button>
            </div>

            <aside className="border-t border-gray-200 bg-gray-50/80 p-6 dark:border-gray-800 dark:bg-gray-950/40 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Sinov qoidalari
              </p>
              <div className="mt-5 space-y-4">
                {[
                  'Vaqt serverdagi boshlanish vaqti asosida hisoblanadi.',
                  'Javob saqlangandan keyin birinchi urinish authoritative hisoblanadi.',
                  'Sinov tugagach natija va guruhlar kesimi serverdan olinadi.',
                ].map((rule, index) => (
                  <div key={rule} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
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
      <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Natijalar
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Sinov yakunlandi
          </h1>
          <p className="mt-1 text-sm text-gray-400">{examTitle}</p>
        </header>

        <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-4">
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl ${
                passed
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              <CheckCircle2 size={30} aria-hidden="true" />
            </div>
            <div>
              <p className={`text-3xl font-bold tracking-tight ${
                passed
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : 'text-amber-600 dark:text-amber-300'
              }`}>
                {result.total_score} / {result.max_score}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {percentage}% natija
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:border-l lg:border-gray-200 lg:pl-6 dark:lg:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              {passed ? 'Natija talab darajasida' : 'Natijani mustahkamlash kerak'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Natija server tomonidan hisoblandi. Quyidagi kesim keyingi tayyorgarlik
              yo‘nalishini aniqlashga yordam beradi.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full rounded-full ${
                  passed ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </section>

        {result.breakdown && result.breakdown.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Guruhlar kesimi
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                To‘g‘ri javoblar va jami savollar server natijasi bo‘yicha.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.breakdown.map((item) => {
                const itemPercent =
                  item.jami > 0 ? Math.round((item.togri / item.jami) * 100) : 0
                return (
                  <div
                    key={item.group_code}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {item.group_code}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.togri} / {item.jami}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${itemPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={resetToIntro}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Yangi sinov
          </button>

          {backUrl && (
            <Link
              to={backUrl}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Modulga qaytish
            </Link>
          )}
        </div>
      </main>
    )
  }

  // ─── Active exam screen ──────────────────────────────────
  if (!session || !currentItem) return null

  const currentSaved = savedQuestionIds.has(currentItem.question_id)
  const currentFlagged = flaggedQuestionIds.has(currentItem.question_id)
  const flaggedCount = flaggedQuestionIds.size
  const currentComplete = isAnswerComplete(
    currentItem,
    drafts[currentItem.question_id]
  )
  const busy = phase === 'finishing'
  const interactionBusy = busy || submittingId !== null
  const answeredQuestions = session.items.filter(
    (item) => savedQuestionIds.has(item.question_id)
  ).length

  const toggleCurrentFlag = () => {
    setFlaggedQuestionIds((current) => {
      const next = new Set(current)
      if (next.has(currentItem.question_id)) {
        next.delete(currentItem.question_id)
      } else {
        next.add(currentItem.question_id)
      }
      return next
    })
  }

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
            {flaggedCount > 0 && (
              <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <Flag size={12} aria-hidden="true" />
                Belgilangan: {flaggedCount}
              </p>
            )}
          </div>

          {/* Question navigation grid */}
          <div className="exam-sidebar-section flex-1 overflow-y-auto scrollbar-thin">
            <p className="exam-sidebar-section-header">
              Savollar ({total})
            </p>
            <div className="exam-q-grid">
              {session.items.map((item, index) => {
                const saved = savedQuestionIds.has(item.question_id)
                const flagged = flaggedQuestionIds.has(item.question_id)
                const isCurrent = index === currentIndex

                let btnClass = 'exam-q-btn '
                if (isCurrent) {
                  btnClass += 'exam-q-btn-current'
                } else if (saved) {
                  btnClass += 'exam-q-btn-answered'
                } else {
                  btnClass += 'exam-q-btn-unanswered'
                }
                if (flagged) {
                  btnClass += ' ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-gray-900'
                }

                return (
                  <button
                    key={item.question_id}
                    type="button"
                    disabled={interactionBusy}
                    aria-label={`Savol ${index + 1}${saved ? ', javob saqlangan' : ''}${flagged ? ', keyin ko‘rish uchun belgilangan' : ''}`}
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
                    {flaggedCount > 0 && (
                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Belgilangan: {flaggedCount}
                      </p>
                    )}
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
                    const flagged = flaggedQuestionIds.has(item.question_id)
                    const isCurrent = index === currentIndex

                    let btnClass = 'exam-q-btn '
                    if (isCurrent) {
                      btnClass += 'exam-q-btn-current'
                    } else if (saved) {
                      btnClass += 'exam-q-btn-answered'
                    } else {
                      btnClass += 'exam-q-btn-unanswered'
                    }
                    if (flagged) {
                      btnClass += ' ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-gray-900'
                    }

                    return (
                      <button
                        key={item.question_id}
                        type="button"
                        disabled={interactionBusy}
                        aria-label={`Savol ${index + 1}${saved ? ', javob saqlangan' : ''}${flagged ? ', keyin ko‘rish uchun belgilangan' : ''}`}
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
          <div className="h-1 shrink-0 bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-indigo-500 transition-[width] duration-300"
              style={{ width: `${total > 0 ? (answeredQuestions / total) * 100 : 0}%` }}
              aria-label={`Sinov progressi: ${answeredQuestions} / ${total}`}
            />
          </div>

          {/* Question content wrapper */}
          <div className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6 lg:p-8">
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
              <button
                type="button"
                onClick={toggleCurrentFlag}
                disabled={interactionBusy}
                aria-pressed={currentFlagged}
                aria-label={currentFlagged ? 'Savoldan belgini olib tashlash' : 'Savolni keyin ko‘rish uchun belgilash'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  currentFlagged
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300'
                }`}
              >
                <Flag size={14} fill={currentFlagged ? 'currentColor' : 'none'} />
                {currentFlagged ? 'Belgilangan' : 'Keyin ko‘rish'}
              </button>
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
            <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
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
