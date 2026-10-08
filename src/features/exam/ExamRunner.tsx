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
  type ExamReviewItem,
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
  examKind?: 'mock' | 'bolim' | 'mavzu' | 'mashq' | 'diagnostika' | 'takrorlash' | 'zaif'
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
  const [reviewItems, setReviewItems] = useState<ExamReviewItem[] | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
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
    setReviewItems(null)
    setReviewLoading(false)
    setReviewError(null)
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
      } else if (
        examKind === 'diagnostika' ||
        examKind === 'mashq' ||
        examKind === 'takrorlash' ||
        examKind === 'zaif'
      ) {
        if (!gateway.startFocusedExam) {
          throw new Error('Maxsus sinovni boshlash xizmati mavjud emas.')
        }
        nextSession = await gateway.startFocusedExam(examKind, lessonId)
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

  const loadResultReview = async () => {
    if (!result || reviewLoading) return

    setReviewLoading(true)
    setReviewError(null)

    try {
      const items = await gateway.getReview(result.exam_id)
      setReviewItems(items)
    } catch (error) {
      setReviewError(errorMessage(error))
    } finally {
      setReviewLoading(false)
    }
  }

  const examTitle =
    examKind === 'mock'
      ? 'Attestatsiya mock sinovi'
      : examKind === 'bolim'
        ? 'Modul sinovi'
        : examKind === 'mavzu'
          ? 'Mavzu sinovi'
          : examKind === 'diagnostika'
            ? 'Boshlang‘ich diagnostika'
            : examKind === 'mashq'
              ? 'Moslashtirilgan mashq'
              : examKind === 'takrorlash'
                ? 'Takrorlash sinovi'
                : 'Zaif mavzular sinovi'

  // ─── Intro / Starting / Error screens ────────────────────
  if (phase === 'intro' || phase === 'starting' || phase === 'start-error') {
    const starting = phase === 'starting'
    const questionLabel =
      examKind === 'mock'
        ? '50 savol'
        : examKind === 'bolim'
          ? '15 savol'
          : examKind === 'diagnostika'
            ? '30 savol'
            : examKind === 'mashq'
              ? '10 savol'
              : examKind === 'takrorlash'
                ? '15 savol'
              : examKind === 'zaif'
                ? '10 savol'
                : topicPreview
                ? `${topicPreview.questionCount} savol`
                : 'Mavzu testi'
    const durationLabel =
      examKind === 'mock'
        ? '120 daqiqa'
        : examKind === 'bolim'
          ? '30 daqiqa'
          : examKind === 'diagnostika'
            ? 'Vaqt cheklanmagan'
            : examKind === 'mashq'
              ? 'Vaqt cheklanmagan'
              : examKind === 'takrorlash' || examKind === 'zaif'
                ? 'Server vaqti'
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

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Keyingi qadam
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Xatolarni ko‘rib chiqing yoki natijani tarixga saqlangan holatda kuzating.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/review"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Xatolarni qayta ishlash
              </Link>
              <Link
                to="/history"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
              >
                Natijalar tarixi
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Savollar tahlili
              </h2>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Javob holati va izohlar faqat yakunlangan sinov uchun serverdan olinadi.
              </p>
            </div>

            {reviewItems === null && (
              <button
                type="button"
                onClick={() => void loadResultReview()}
                disabled={reviewLoading}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
              >
                {reviewLoading ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                    Yuklanmoqda…
                  </>
                ) : (
                  <>
                    Tahlilni ochish
                    <ChevronDown size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>

          {reviewError && (
            <div
              role="alert"
              className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{reviewError}</span>
              <button
                type="button"
                onClick={() => void loadResultReview()}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 font-semibold text-white hover:bg-amber-700"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Qayta urinish
              </button>
            </div>
          )}

          {reviewItems && reviewItems.length === 0 && (
            <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-950/50 dark:text-gray-400">
              Ushbu sinov uchun savollar tahlili mavjud emas.
            </p>
          )}

          {reviewItems && reviewItems.length > 0 && (
            <div className="mt-5 space-y-3" aria-label="Yakunlangan sinov savollari tahlili">
              {reviewItems.map((item) => (
                <article
                  key={item.order_idx}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          Savol {item.order_idx}
                        </span>
                        {item.construct && (
                          <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
                            {item.construct}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                        {item.stem_md}
                      </p>
                    </div>

                    <span
                      className={[
                        'inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold',
                        item.is_correct
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
                      ].join(' ')}
                    >
                      {item.is_correct ? (
                        <Check size={13} aria-hidden="true" />
                      ) : (
                        <X size={13} aria-hidden="true" />
                      )}
                      {item.is_correct ? 'To‘g‘ri' : 'Xato'}
                    </span>
                  </div>

                  {item.explanation_md && (
                    <div className="mt-4 rounded-xl bg-indigo-50/70 p-3 text-sm leading-6 text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100">
                      <span className="font-semibold">Izoh: </span>
                      <span className="whitespace-pre-wrap">{item.explanation_md}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

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
  const progressPercent =
    total > 0 ? Math.round((answeredQuestions / total) * 100) : 0
  const candidateName =
    displayName?.trim() || user?.email || 'Foydalanuvchi'
  const candidateId = user?.id
    ? user.id.replace(/-/g, '').slice(0, 8).toUpperCase()
    : null

  const handleCycleTheme = () => {
    cycleTheme()
    setThemePref(getThemePreference())
  }

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

  const goToQuestion = (index: number, closeSidebar = false) => {
    setCurrentIndex(index)
    if (closeSidebar) setSidebarOpen(false)
  }

  const renderQuestionGrid = (closeSidebar = false) => (
    <div className="exam-q-grid">
      {session.items.map((item, index) => {
        const saved = savedQuestionIds.has(item.question_id)
        const flagged = flaggedQuestionIds.has(item.question_id)
        const isCurrent = index === currentIndex

        let btnClass = 'exam-q-btn '
        if (isCurrent) {
          btnClass += 'exam-q-btn-current'
        } else if (flagged) {
          btnClass += 'exam-q-btn-flagged'
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
            aria-label={`Savol ${index + 1}${saved ? ', javob saqlangan' : ''}${flagged ? ', keyin ko‘rish uchun belgilangan' : ''}`}
            aria-current={isCurrent ? 'true' : undefined}
            onClick={() => goToQuestion(index, closeSidebar)}
            className={btnClass}
          >
            <span>{index + 1}</span>
            {flagged && (
              <Bookmark
                size={8}
                fill="currentColor"
                className="exam-q-bookmark"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )

  const legend = (
    <div className="exam-question-legend" aria-label="Savol holatlari">
      <span>
        <i className="bg-emerald-500" aria-hidden="true" />
        Javob berilgan
      </span>
      <span>
        <i className="bg-primary-500" aria-hidden="true" />
        Joriy savol
      </span>
      <span>
        <i className="bg-amber-400" aria-hidden="true" />
        Belgilangan
      </span>
      <span>
        <i className="bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
        Javob berilmagan
      </span>
    </div>
  )

  return (
    <main className="exam-immersive-shell">
      <header className="exam-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-600 text-white shadow-sm">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold text-gray-950 dark:text-white">
              Attestatsiya
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
              Test platformasi
            </p>
          </div>
          <div className="mx-1 hidden h-7 w-px bg-gray-200 dark:bg-gray-700 md:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {examTitle}
            </p>
            <p className="text-[11px] text-gray-400 md:hidden">
              {currentIndex + 1} / {total}-savol
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className={[
              'hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold sm:flex',
              submittingId
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : currentSaved
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300',
            ].join(' ')}
            aria-live="polite"
          >
            {submittingId ? (
              <LoaderCircle size={12} className="animate-spin" aria-hidden="true" />
            ) : currentSaved ? (
              <Check size={12} aria-hidden="true" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" aria-hidden="true" />
            )}
            {submittingId
              ? 'Saqlanmoqda...'
              : currentSaved
                ? 'Saqlandi'
                : 'Saqlanmagan'}
          </div>

          <button
            type="button"
            onClick={handleCycleTheme}
            className="exam-topbar-icon-btn"
            aria-label="Rang mavzusini almashtirish"
            title="Rang mavzusini almashtirish"
          >
            {themePref === 'light' && <Sun size={17} aria-hidden="true" />}
            {themePref === 'dark' && <Moon size={17} aria-hidden="true" />}
            {themePref === 'system' && <Monitor size={17} aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="exam-topbar-icon-btn lg:hidden"
            aria-label="Savollar panelini ochish"
          >
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <section className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-gray-50/70 dark:bg-gray-950">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
            <section className="exam-question-panel" aria-label={`Savol ${currentIndex + 1}`}>
              <div className="exam-question-summary">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                    Informatika
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {currentIndex + 1} / {total}-savol
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <span className="text-gray-700 dark:text-gray-200">
                    {`Javob berilgan: ${answeredQuestions}`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <Bookmark size={12} aria-hidden="true" />
                    {`Belgilangan: ${flaggedCount}`}
                  </span>
                </div>
              </div>

              <div className="exam-question-progress-row">
                <div className="exam-progress flex-1">
                  <div
                    className="exam-progress-fill bg-primary-600"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-gray-400">
                  {progressPercent}%
                </span>
              </div>

              <div className="exam-question-meta">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 font-mono text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {currentItem.format}
                </span>
                {currentItem.cognitive_level && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {{
                      knowledge: 'Bilish',
                      application: 'Qo‘llash',
                      reasoning: 'Mulohaza',
                    }[currentItem.cognitive_level] || currentItem.cognitive_level}
                  </span>
                )}
                {currentItem.difficulty && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    {'★'.repeat(currentItem.difficulty)}
                    {'☆'.repeat(5 - currentItem.difficulty)}
                  </span>
                )}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={toggleCurrentFlag}
                  disabled={interactionBusy}
                  aria-pressed={currentFlagged}
                  aria-label={
                    currentFlagged
                      ? 'Savoldan belgini olib tashlash'
                      : 'Savolni keyin ko‘rish uchun belgilash'
                  }
                  className={[
                    'inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition',
                    currentFlagged
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300',
                  ].join(' ')}
                >
                  <Bookmark
                    size={14}
                    fill={currentFlagged ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">
                    {currentFlagged ? 'Belgilangan' : 'Belgilash'}
                  </span>
                </button>
              </div>

              <div className="exam-question-card">
                <div className="exam-question-stem">
                  {renderQuestion(currentItem)}
                </div>
              </div>

              <div aria-live="polite" className="mt-4 min-h-8">
                {message && (
                  <div
                    className={[
                      'flex items-start gap-3 rounded-xl border p-4',
                      message.includes('saqlandi') || message.startsWith('To‘g‘ri.')
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300',
                    ].join(' ')}
                  >
                    {message.includes('saqlandi') || message.startsWith('To‘g‘ri.') ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-500"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm leading-relaxed">{message}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {finishArmed && (
            <div className="exam-finish-confirm">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sinovni yakunlaysizmi?
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {unansweredCount > 0
                    ? `${unansweredCount} ta savol javobsiz qolgan.`
                    : 'Barcha savollarga javob berilgan.'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setFinishArmed(false)}
                  className="exam-nav-btn-prev"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => void finishExam()}
                  className="exam-finish-confirm-btn"
                >
                  Yakunlash
                </button>
              </div>
            </div>
          )}

          <div className="exam-nav-bar">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[auto_1fr_minmax(190px,1.2fr)_1fr_auto]">
              <button
                type="button"
                disabled={currentIndex === 0 || interactionBusy}
                onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                className="exam-nav-btn-prev"
                aria-label="Oldingi"
              >
                <ChevronLeft size={17} aria-hidden="true" />
                <span className="hidden sm:inline">Oldingi</span>
              </button>

              <span className="hidden text-center text-xs font-semibold tabular-nums text-gray-400 lg:block">
                {currentIndex + 1} / {total}-savol
              </span>

              <button
                type="button"
                disabled={
                  !currentComplete ||
                  currentSaved ||
                  submittingId === currentItem.question_id ||
                  interactionBusy
                }
                onClick={() => void submitCurrentAnswer()}
                className="exam-nav-btn-save justify-center"
              >
                {submittingId === currentItem.question_id ? (
                  <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                ) : currentSaved ? (
                  <Check size={17} aria-hidden="true" />
                ) : (
                  <ShieldCheck size={17} aria-hidden="true" />
                )}
                {submittingId === currentItem.question_id
                  ? 'Saqlanmoqda…'
                  : currentSaved
                    ? 'Saqlangan'
                    : 'Javobni saqlash'}
              </button>

              <button
                type="button"
                disabled={currentIndex === total - 1 || interactionBusy}
                onClick={() =>
                  setCurrentIndex((value) => Math.min(total - 1, value + 1))
                }
                className="exam-nav-btn-next"
                aria-label="Keyingi"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <ChevronRight size={17} aria-hidden="true" />
              </button>

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
                aria-label="Sinovni yakunlash"
                className="exam-finish-btn col-span-3 w-full lg:col-auto lg:w-auto"
              >
                <Flag size={15} aria-hidden="true" />
                Testni yakunlash
              </button>
            </div>
          </div>
        </section>

        <aside className="exam-sidebar hidden lg:flex">
          <section className="exam-sidebar-card">
            <p className="exam-sidebar-section-header">Nomzod ma’lumotlari</p>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {initials(candidateName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {candidateName}
                </p>
                {candidateId && (
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    ID: {candidateId}
                  </p>
                )}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
              <dt className="text-gray-400">Fan</dt>
              <dd className="font-medium text-gray-700 dark:text-gray-200">Informatika</dd>
              {user?.email && (
                <>
                  <dt className="text-gray-400">Email</dt>
                  <dd className="truncate font-medium text-gray-700 dark:text-gray-200">
                    {user.email}
                  </dd>
                </>
              )}
            </dl>
          </section>

          <section className="exam-sidebar-card">
            <p className="exam-sidebar-section-header">Qolgan vaqt</p>
            {remainingSeconds !== null ? (
              <>
                <div className={`exam-timer ${remainingSeconds <= 300 ? 'exam-timer-urgent' : ''}`}>
                  <Clock3
                    size={20}
                    className={
                      remainingSeconds <= 300
                        ? 'text-red-500'
                        : 'text-primary-500'
                    }
                    aria-hidden="true"
                  />
                  <span
                    className={[
                      'exam-timer-display',
                      remainingSeconds <= 300
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white',
                    ].join(' ')}
                  >
                    {formatDuration(remainingSeconds)}
                  </span>
                </div>
                <p className="mt-2 text-center text-[11px] text-gray-400">
                  jami {session.duration_sec ? formatDuration(session.duration_sec) : '—'}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Cheklanmagan</p>
            )}
          </section>

          <section className="exam-sidebar-card flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3">
              <p className="exam-sidebar-section-header !mb-0">
                Savollar navigatsiyasi
              </p>
              <span className="text-[11px] font-semibold text-gray-400">
                {answeredQuestions}/{total}
              </span>
            </div>
            <div className="mt-3 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
              {renderQuestionGrid()}
            </div>
            {legend}
          </section>
        </aside>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="exam-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="exam-sidebar-mobile" aria-label="Savollar paneli">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 dark:border-gray-800">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {initials(candidateName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {candidateName}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {answeredQuestions}/{total} javob berilgan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="exam-topbar-icon-btn"
                aria-label="Panelni yopish"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {remainingSeconds !== null && (
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <p className="exam-sidebar-section-header">Qolgan vaqt</p>
                <div className={`exam-timer ${remainingSeconds <= 300 ? 'exam-timer-urgent' : ''}`}>
                  <Clock3
                    size={18}
                    className={
                      remainingSeconds <= 300
                        ? 'text-red-500'
                        : 'text-primary-500'
                    }
                    aria-hidden="true"
                  />
                  <span className="exam-timer-display text-base text-gray-900 dark:text-white">
                    {formatDuration(remainingSeconds)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              <p className="exam-sidebar-section-header">Savollar navigatsiyasi</p>
              {renderQuestionGrid(true)}
              {legend}
            </div>
          </aside>
        </>
      )}

      {busy && (
        <div
          role="status"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <LoaderCircle
              size={24}
              className="animate-spin text-primary-600"
              aria-hidden="true"
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              Natija serverda hisoblanmoqda…
            </span>
          </div>
        </div>
      )}
    </main>
  )
}
