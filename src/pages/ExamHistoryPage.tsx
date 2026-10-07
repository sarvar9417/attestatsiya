import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RefreshCw,
  Trophy,
} from 'lucide-react'
import { backendGateway } from '../features/exam/backendGateway'
import type {
  ExamHistoryItem,
  ExamHistoryResponse,
} from '../features/exam/contracts'

const PAGE_SIZE = 20

const KIND_LABELS: Record<ExamHistoryItem['kind'], string> = {
  diagnostika: 'Diagnostika',
  mashq: 'Mashq',
  mavzu: 'Mavzu testi',
  bolim: 'Bo‘lim testi',
  mock: 'Mock test',
  takrorlash: 'Takrorlash',
  zaif: 'Zaif mavzular',
}

function formatFinishedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sana noma’lum'

  return new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function scorePercent(item: ExamHistoryItem): number {
  if (item.max_score <= 0) return 0
  return Math.round((item.total_score / item.max_score) * 100)
}

function HistoryCard({ item }: { item: ExamHistoryItem }) {
  const percent = scorePercent(item)
  const title =
    item.lesson_title_uz?.trim() ||
    item.lesson_slug?.trim() ||
    KIND_LABELS[item.kind]

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {KIND_LABELS[item.kind]}
            </span>
            <span
              className={[
                'rounded-lg px-2.5 py-1 text-[11px] font-semibold',
                item.passed === true
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : item.passed === false
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300',
              ].join(' ')}
            >
              {item.passed === true
                ? 'O‘tdi'
                : item.passed === false
                  ? 'O‘tmadi'
                  : 'Baholanmagan'}
            </span>
          </div>

          <h2 className="mt-3 truncate text-base font-semibold text-gray-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <Clock3 size={13} aria-hidden="true" />
            {formatFinishedAt(item.finished_at)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold text-gray-950 dark:text-white">
            {percent}%
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">
            {item.total_score}/{item.max_score} ball
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-[width] duration-500"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          aria-label={`Natija: ${percent}%`}
        />
      </div>
    </article>
  )
}

export default function ExamHistoryPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ExamHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (targetPage: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await backendGateway.getHistory(targetPage, PAGE_SIZE)
      setData(result)
    } catch {
      setError('Natijalar tarixini yuklab bo‘lmadi. Qayta urinib ko‘ring.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(page)
  }, [load, page])

  const summary = useMemo(() => {
    const items = data?.items ?? []
    if (items.length === 0) {
      return { average: 0, passed: 0 }
    }

    return {
      average: Math.round(
        items.reduce((sum, item) => sum + scorePercent(item), 0) / items.length
      ),
      passed: items.filter(item => item.passed === true).length,
    }
  }, [data])

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.page_size))
    : 1
  const canGoNext = Boolean(data && page < totalPages)

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Shaxsiy natijalar
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Natijalar tarixi
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Faqat sizga tegishli yakunlangan sinovlar serverdan olinadi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load(page)}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
            aria-hidden="true"
          />
          Yangilash
        </button>
      </header>

      {!loading && !error && data && data.items.length > 0 && (
        <section
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          aria-label="Natija ko‘rsatkichlari"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
              <BarChart3 size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">Jami urinish</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {data.total}
            </p>
            <p className="mt-1 text-xs text-gray-400">yakunlangan sinov</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
              <Trophy size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">O‘tgan</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {summary.passed}
            </p>
            <p className="mt-1 text-xs text-gray-400">shu sahifada</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:col-span-1">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-300">
              <BarChart3 size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">O‘rtacha natija</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {summary.average}%
            </p>
            <p className="mt-1 text-xs text-gray-400">shu sahifada</p>
          </div>
        </section>
      )}

      {loading && (
        <section
          aria-label="Natijalar tarixi yuklanmoqda"
          className="grid gap-3 md:grid-cols-2"
        >
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </section>
      )}

      {!loading && error && (
        <section
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/40 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-amber-900 dark:text-amber-100">
                Ma’lumot olinmadi
              </h2>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void load(page)}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Qayta urinish
              </button>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && data && data.items.length === 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
            <BookOpen size={24} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-950 dark:text-white">
            Hali yakunlangan sinov yo‘q
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
            Biror mavzu yoki bo‘lim testini yakunlaganingizdan keyin natijalar shu yerda ko‘rinadi.
          </p>
          <Link
            to="/exam"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Sinovga o‘tish
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <section className="grid gap-3 md:grid-cols-2" aria-label="Yakunlangan sinovlar">
          {data.items.map(item => (
            <HistoryCard key={item.exam_id} item={item} />
          ))}
        </section>
      )}

      {!loading && !error && data && data.total > data.page_size && (
        <nav
          className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          aria-label="Natijalar sahifalari"
        >
          <button
            type="button"
            onClick={() => setPage(value => Math.max(1, value - 1))}
            disabled={page <= 1}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Oldingi
          </button>
          <span className="text-xs font-semibold text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(value => value + 1)}
            disabled={!canGoNext}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Keyingi
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}
