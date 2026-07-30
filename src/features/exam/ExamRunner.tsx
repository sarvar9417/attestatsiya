import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
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
  supabaseExamGateway,
  type ExamGateway,
} from './examGateway'
import Y1Choice from './questions/Y1Choice'
import Y2Match from './questions/Y2Match'
import Y3Order from './questions/Y3Order'

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
  gateway = supabaseExamGateway,
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
            {examKind === 'mock'
              ? 'Attestatsiya sinov imtihoni'
              : examKind === 'bolim'
                ? 'Modul sinovi'
                : 'Mavzu sinovi'}
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

  if (!session || !currentItem) return null

  const currentSaved = savedQuestionIds.has(currentItem.question_id)
  const currentComplete = isAnswerComplete(
    currentItem,
    drafts[currentItem.question_id]
  )
  const busy = phase === 'finishing'
  const interactionBusy = busy || submittingId !== null

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {examKind === 'mock'
              ? 'Attestatsiya mock sinovi'
              : examKind === 'bolim'
                ? 'Modul sinovi'
                : 'Mavzu sinovi'}
          </p>
          <h1 className="font-semibold text-gray-900 dark:text-white">
            Savol {currentIndex + 1} / {total}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {savedCount}/{total} saqlandi
          </span>
          {remainingSeconds !== null && (
            <span
              className={`inline-flex items-center gap-1.5 font-mono font-semibold ${
                remainingSeconds <= 300 ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              <Clock3 size={17} aria-hidden="true" />
              {formatDuration(remainingSeconds)}
            </span>
          )}
        </div>
      </header>

      <div className="progress-bar mb-5">
        <div
          className="progress-fill bg-primary-500"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="badge bg-gray-100 text-gray-600 text-xs">
              {currentItem.format}
            </span>
            {currentSaved && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                <Check size={16} aria-hidden="true" />
                Serverda saqlandi
              </span>
            )}
          </div>

          {renderQuestion(currentItem)}

          <div aria-live="polite" className="min-h-6 mt-4">
            {message && (
              <p
                className={`text-sm ${
                  message.includes('saqlandi') || message.startsWith('To‘g‘ri.')
                    ? 'text-emerald-600'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentIndex === 0 || interactionBusy}
                onClick={() =>
                  setCurrentIndex((index) => Math.max(0, index - 1))
                }
                className="btn-secondary inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Oldingi
              </button>
              <button
                type="button"
                disabled={currentIndex === total - 1 || interactionBusy}
                onClick={() =>
                  setCurrentIndex((index) => Math.min(total - 1, index + 1))
                }
                className="btn-secondary inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                Keyingi
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              type="button"
              disabled={
                !currentComplete ||
                currentSaved ||
                submittingId === currentItem.question_id ||
                interactionBusy
              }
              onClick={() => void submitCurrentAnswer()}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              {submittingId === currentItem.question_id && (
                <LoaderCircle size={17} className="animate-spin" />
              )}
              {currentSaved ? 'Javob saqlandi' : 'Javobni saqlash'}
            </button>
          </div>
        </section>

        <aside className="card p-4 h-fit lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Savollar
          </h2>
          <div className="grid grid-cols-5 gap-1.5">
            {session.items.map((item, index) => {
              const saved = savedQuestionIds.has(item.question_id)

              return (
                <button
                  key={item.question_id}
                  type="button"
                  disabled={interactionBusy}
                  aria-label={`${index + 1}-savol${saved ? ', saqlangan' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium ${
                    index === currentIndex ? 'ring-2 ring-primary-500' : ''
                  } ${
                    saved
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

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
            className="btn-secondary w-full mt-5 disabled:opacity-50"
          >
            Sinovni yakunlash
          </button>

          {finishArmed && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-sm">
              <p className="text-amber-800 dark:text-amber-200">
                {unansweredCount} ta savol javobsiz. Baribir yakunlaysizmi?
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setFinishArmed(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Davom etish
                </button>
                <button
                  type="button"
                  onClick={() => void finishExam()}
                  className="btn-primary flex-1 text-xs"
                >
                  Yakunlash
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {busy && (
        <div
          role="status"
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
        >
          <div className="card px-6 py-5 inline-flex items-center gap-3">
            <LoaderCircle className="animate-spin text-primary-600" />
            <span>Natija serverda hisoblanmoqda…</span>
          </div>
        </div>
      )}
    </main>
  )
}
