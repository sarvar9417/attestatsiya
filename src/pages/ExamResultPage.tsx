import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  LoaderCircle,
  RefreshCw,
  X,
} from 'lucide-react'
import { backendGateway } from '../features/exam/backendGateway'
import type {
  ExamResultDetail,
  ExamReviewItem,
} from '../features/exam/contracts'

const KIND_LABELS: Record<ExamResultDetail['kind'], string> = {
  diagnostika: 'Diagnostika',
  mashq: 'Mashq',
  mavzu: 'Mavzu testi',
  bolim: 'Bo‘lim testi',
  mock: 'Mock test',
  takrorlash: 'Takrorlash',
  zaif: 'Zaif mavzular',
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sana noma’lum'

  return new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>()
  const [result, setResult] = useState<ExamResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [review, setReview] = useState<ExamReviewItem[] | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!examId) {
      setError('Natija identifikatori topilmadi.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      setResult(await backendGateway.getResult(examId))
    } catch {
      setError('Natijani yuklab bo‘lmadi. Qayta urinib ko‘ring.')
    } finally {
      setLoading(false)
    }
  }, [examId])

  useEffect(() => {
    void load()
  }, [load])

  const percentage = useMemo(() => {
    if (!result || result.max_score <= 0) return 0
    return Math.round((result.total_score / result.max_score) * 100)
  }, [result])

  const loadReview = async () => {
    if (!examId || reviewLoading) return

    setReviewLoading(true)
    setReviewError(null)
    try {
      setReview(await backendGateway.getReview(examId))
    } catch {
      setReviewError('Savollar tahlilini yuklab bo‘lmadi.')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6">
        <div className="h-24 animate-pulse rounded-2xl bg-white dark:bg-gray-900" />
        <div className="h-48 animate-pulse rounded-2xl bg-white dark:bg-gray-900" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <section role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/40 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-amber-600" aria-hidden="true" />
            <div>
              <h1 className="font-semibold text-amber-900 dark:text-amber-100">Natija ochilmadi</h1>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">{error}</p>
              <button type="button" onClick={() => void load()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white">
                <RefreshCw size={15} aria-hidden="true" /> Qayta urinish
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const title =
    result.lesson_title_uz?.trim() ||
    result.lesson_slug?.trim() ||
    KIND_LABELS[result.kind]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:py-7">
      <header>
        <Link to="/history" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400">
          <ArrowLeft size={15} aria-hidden="true" /> Natijalar tarixiga qaytish
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
          {KIND_LABELS[result.kind]}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">{title}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
          <Clock3 size={14} aria-hidden="true" /> {formatDate(result.finished_at)}
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <p className="text-4xl font-bold tracking-tight text-gray-950 dark:text-white">{result.total_score} / {result.max_score}</p>
            <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300">{percentage}% natija</p>
          </div>
          <div className="min-w-0 flex-1 sm:border-l sm:border-gray-200 sm:pl-6 dark:sm:border-gray-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className={[
                'rounded-lg px-2.5 py-1 text-xs font-semibold',
                result.passed === true
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : result.passed === false
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300',
              ].join(' ')}>
                {result.passed === true ? 'O‘tdi' : result.passed === false ? 'O‘tmadi' : 'Baholanmagan'}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} aria-label={`Natija: ${percentage}%`} />
            </div>
          </div>
        </div>
      </section>

      {result.breakdown && result.breakdown.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Guruhlar kesimi</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.breakdown.map(item => {
              const pct = item.jami > 0 ? Math.round((item.togri / item.jami) * 100) : 0
              return (
                <div key={item.group_code} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex justify-between gap-3">
                    <span className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-300">{item.group_code}</span>
                    <span className="text-sm font-bold text-gray-950 dark:text-white">{item.togri} / {item.jami}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Savollar tahlili</h2>
            <p className="mt-1 text-xs leading-5 text-gray-400">Javob va izohlar faqat yakunlangan sinov uchun serverdan olinadi.</p>
          </div>
          {review === null && (
            <button type="button" onClick={() => void loadReview()} disabled={reviewLoading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300">
              {reviewLoading ? <><LoaderCircle size={16} className="animate-spin" /> Yuklanmoqda…</> : <>Tahlilni ochish <ChevronDown size={16} /></>}
            </button>
          )}
        </div>

        {reviewError && (
          <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-200">
            <span>{reviewError}</span>
            <button type="button" onClick={() => void loadReview()} className="rounded-lg bg-amber-600 px-3 py-2 font-semibold text-white">Qayta urinish</button>
          </div>
        )}

        {review && review.length === 0 && <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-950/50 dark:text-gray-400">Savollar tahlili mavjud emas.</p>}

        {review && review.length > 0 && (
          <div className="mt-5 space-y-3">
            {review.map(item => (
              <article key={item.order_idx} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">Savol {item.order_idx}</span>
                      {item.construct && <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">{item.construct}</span>}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">{item.stem_md}</p>
                  </div>
                  <span className={[
                    'inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold',
                    item.is_correct
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
                  ].join(' ')}>
                    {item.is_correct ? <Check size={13} /> : <X size={13} />}
                    {item.is_correct ? 'To‘g‘ri' : 'Xato'}
                  </span>
                </div>
                {item.explanation_md && <div className="mt-4 rounded-xl bg-indigo-50/70 p-3 text-sm leading-6 text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100"><strong>Izoh: </strong><span className="whitespace-pre-wrap">{item.explanation_md}</span></div>}
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link to="/review" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">Xatolarni qayta ishlash</Link>
        <Link to="/exam" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Yangi sinov</Link>
      </div>
    </div>
  )
}
