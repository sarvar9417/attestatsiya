import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Target,
} from 'lucide-react'
import { progressGateway } from '../features/progress/progressGateway'
import type { DueReviewItem } from '../features/exam/contracts'

function formatDueAt(value: string | null): string {
  if (!value) return 'Takrorlashga tayyor'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Takrorlashga tayyor'

  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function clampAccuracy(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function ReviewCard({ item }: { item: DueReviewItem }) {
  const accuracy = clampAccuracy(item.accuracy)
  const needsWork = accuracy < 70

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {item.group_code}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                needsWork
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
              }`}
            >
              {needsWork ? 'Mustahkamlash kerak' : 'Takrorlash'}
            </span>
          </div>

          <h2 className="mt-3 text-base font-semibold leading-6 text-gray-950 dark:text-white">
            {item.title_uz}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            {formatDueAt(item.due_at)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-2xl font-bold ${
              needsWork
                ? 'text-amber-600 dark:text-amber-300'
                : 'text-emerald-600 dark:text-emerald-300'
            }`}
          >
            {accuracy}%
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            aniqlik
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            needsWork ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${accuracy}%` }}
          aria-label={`Aniqlik: ${accuracy}%`}
        />
      </div>
    </article>
  )
}

export default function ReviewPage() {
  const [items, setItems] = useState<DueReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await progressGateway.getDueReviews()
      setItems(data)
    } catch {
      setError('Takrorlash ro‘yxatini yuklab bo‘lmadi. Qayta urinib ko‘ring.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const summary = useMemo(() => {
    if (items.length === 0) {
      return { average: null, weak: 0 }
    }

    const average = Math.round(
      items.reduce((sum, item) => sum + clampAccuracy(item.accuracy), 0) /
        items.length
    )
    const weak = items.filter(item => clampAccuracy(item.accuracy) < 70).length
    return { average, weak }
  }, [items])

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Interval takrorlash
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Xatolarni qayta ishlash
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Server natijalari bo‘yicha takrorlash vaqti kelgan konstruktlar.
            Aniqligi past mavzularni avval mustahkamlang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
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

      {!loading && !error && items.length > 0 && (
        <section
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          aria-label="Takrorlash ko‘rsatkichlari"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
              <RotateCcw size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">Navbatda</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {items.length}
            </p>
            <p className="mt-1 text-xs text-gray-400">konstrukt</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
              <Target size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">Ustuvor</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {summary.weak}
            </p>
            <p className="mt-1 text-xs text-gray-400">70% dan past</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:col-span-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span className="text-xs font-semibold">O‘rtacha aniqlik</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
              {summary.average ?? 0}%
            </p>
            <p className="mt-1 text-xs text-gray-400">shu ro‘yxat bo‘yicha</p>
          </div>
        </section>
      )}

      {loading && (
        <section
          aria-label="Takrorlash ro‘yxati yuklanmoqda"
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
                onClick={() => void load()}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Qayta urinish
              </button>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && items.length === 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 size={24} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-950 dark:text-white">
            Hozircha takrorlash kerak emas
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
            Serverda muddati kelgan konstrukt topilmadi. O‘rganishni davom ettirsangiz,
            keyingi takrorlashlar shu yerda paydo bo‘ladi.
          </p>
          <Link
            to="/learn"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <BookOpen size={16} aria-hidden="true" />
            O‘rganishga o‘tish
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="grid gap-3 md:grid-cols-2" aria-label="Takrorlash mavzulari">
          {[...items]
            .sort((a, b) => clampAccuracy(a.accuracy) - clampAccuracy(b.accuracy))
            .map(item => (
              <ReviewCard key={item.construct_id} item={item} />
            ))}
        </section>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
              Yangi savollar bilan qayta tekshiring
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Takrorlash sinovi serverdagi muddati kelgan konstruktlardan yangi session yaratadi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/exam/takrorlash"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Qayta tekshirishni boshlash
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              to="/learn"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
            >
              Mavzularni mustahkamlash
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
