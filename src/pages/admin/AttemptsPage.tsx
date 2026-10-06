import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  RefreshCw,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react'
import {
  EXAM_KIND_LABELS,
  examKindLabel,
  getAttemptDetail,
  listAttempts,
  type AttemptDetail,
  type AttemptSummary,
  type ExamKind,
} from '../../features/admin/attemptsApi'
import EmptyState from '../../components/ui/EmptyState'
import ErrorDisplay from '../../components/ui/ErrorDisplay'

const KINDS = Object.keys(EXAM_KIND_LABELS) as ExamKind[]

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('uz-Latn-UZ', {
    timeZone: 'Asia/Tashkent',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function answeredLabel(item: AttemptSummary): string {
  if (item.finished_at) {
    return item.answered_count + ' / ' + Math.round(item.max_score / 2)
  }
  return item.answered_count + ' ta'
}

export default function AttemptsPage() {
  const [items, setItems] = useState<AttemptSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [kind, setKind] = useState('')
  const [lesson, setLesson] = useState('')
  const [userId, setUserId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [detail, setDetail] = useState<AttemptDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listAttempts({
        kind: kind || undefined,
        lesson_id: lesson.trim() || undefined,
        user_id: userId.trim() || undefined,
        from: from ? new Date(from + 'T00:00:00').toISOString() : undefined,
        to: to ? new Date(to + 'T23:59:59').toISOString() : undefined,
        page,
        page_size: pageSize,
      })
      setItems(result.items)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }, [kind, lesson, userId, from, to, page, pageSize])

  useEffect(() => {
    void load()
  }, [load])

  const openDetail = async (examId: string) => {
    setDetailLoading(true)
    setDetailError(null)
    try {
      setDetail(await getAttemptDetail(examId))
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Detalni yuklashda xatolik')
    } finally {
      setDetailLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const activeFilters = useMemo(
    () => [kind, lesson.trim(), userId.trim(), from, to].filter(Boolean).length,
    [kind, lesson, userId, from, to],
  )
  const finishedOnPage = items.filter(item => item.finished_at).length
  const passedOnPage = items.filter(item => item.finished_at && item.passed).length

  const clearFilters = () => {
    setKind('')
    setLesson('')
    setUserId('')
    setFrom('')
    setTo('')
    setPage(1)
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            Monitoring
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Sinov urinishlari
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Foydalanuvchilarning test urinishlari, javoblari va server hisoblagan natijalarini ko‘ring.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          Yangilash
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AttemptMetric label="Jami urinish" value={total} />
        <AttemptMetric label="Bu sahifada" value={items.length} />
        <AttemptMetric label="Yakunlangan" value={finishedOnPage} />
        <AttemptMetric label="O‘tgan" value={passedOnPage} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Filter size={15} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-950 dark:text-white">Filterlar</h2>
              <p className="text-[11px] text-gray-400">
                {activeFilters > 0 ? activeFilters + ' ta faol filter' : 'Barcha urinishlar'}
              </p>
            </div>
          </div>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-300"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Tozalash
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <select
            value={kind}
            onChange={event => {
              setKind(event.target.value)
              setPage(1)
            }}
            className="input"
            aria-label="Test turi"
          >
            <option value="">Barcha turlar</option>
            {KINDS.map(examKind => (
              <option key={examKind} value={examKind}>{EXAM_KIND_LABELS[examKind]}</option>
            ))}
          </select>
          <input
            value={lesson}
            onChange={event => {
              setLesson(event.target.value)
              setPage(1)
            }}
            placeholder="Dars (M01.02 yoki UUID)"
            className="input"
            aria-label="Dars filtri"
          />
          <input
            value={userId}
            onChange={event => {
              setUserId(event.target.value)
              setPage(1)
            }}
            placeholder="Foydalanuvchi UUID"
            className="input"
            aria-label="Foydalanuvchi filtri"
          />
          <input
            type="date"
            value={from}
            onChange={event => {
              setFrom(event.target.value)
              setPage(1)
            }}
            className="input"
            aria-label="Boshlanish sanasi"
          />
          <input
            type="date"
            value={to}
            onChange={event => {
              setTo(event.target.value)
              setPage(1)
            }}
            className="input"
            aria-label="Tugash sanasi"
          />
          <button
            type="button"
            onClick={() => {
              setPage(1)
              void load()
            }}
            className="btn-primary min-h-11"
          >
            Filterlash
          </button>
        </div>
      </section>

      {detail && (
        <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-gray-900">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                Urinish detali
              </span>
              <h2 className="mt-1 text-lg font-semibold text-gray-950 dark:text-white">
                {detail.display_name ?? detail.email ?? detail.user_id}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDetail(null)}
              className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Detalni yopish"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {detailLoading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
          {detailError && (
            <ErrorDisplay message={detailError} onRetry={() => void openDetail(detail.exam_id)} />
          )}

          {!detailLoading && !detailError && (
            <div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <DetailMeta label="Tur" value={examKindLabel(detail.kind)} />
                <DetailMeta label="Dars" value={detail.lesson_slug ?? '—'} />
                <DetailMeta label="Boshlangan" value={formatDate(detail.started_at)} />
                <DetailMeta label="Tugagan" value={formatDate(detail.finished_at)} />
                <DetailMeta
                  label="Ball"
                  value={detail.total_score + ' / ' + detail.max_score}
                  accent={detail.passed ? 'success' : 'danger'}
                />
              </div>

              <ul className="mt-5 space-y-3">
                {detail.items.map(item => {
                  const chosenId =
                    (item.user_answer as { option_id?: string } | null)?.option_id ?? null

                  return (
                    <li key={item.item_id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                          {item.order_idx}. {item.stem_md}
                        </p>
                        {item.is_correct !== null &&
                          (item.is_correct ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                              <CheckCircle2 size={13} aria-hidden="true" />
                              To‘g‘ri
                            </span>
                          ) : (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-300">
                              <XCircle size={13} aria-hidden="true" />
                              Noto‘g‘ri
                            </span>
                          ))}
                      </div>

                      <ul className="mt-3 space-y-1.5">
                        {item.options.map(option => {
                          const isChosen = option.id === chosenId
                          const isCorrect = option.id === item.correct_option_id
                          let optionClass = 'text-gray-600 dark:text-gray-400'
                          let mark = ''

                          if (isChosen && isCorrect) {
                            optionClass = 'text-emerald-700 dark:text-emerald-400'
                            mark = ' (tanlangan, to‘g‘ri)'
                          } else if (isChosen) {
                            optionClass = 'text-red-600 dark:text-red-400'
                            mark = ' (tanlangan)'
                          } else if (isCorrect) {
                            optionClass = 'text-emerald-700 dark:text-emerald-400'
                            mark = ' (to‘g‘ri javob)'
                          }

                          return (
                            <li key={option.id} className={'text-sm ' + optionClass}>
                              • {option.content_md ?? '—'}{mark}
                            </li>
                          )
                        })}
                      </ul>

                      {item.is_correct !== null && item.explanation_md && (
                        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                          Izoh: {item.explanation_md}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-950 dark:text-white">Urinishlar ro‘yxati</h2>
          <p className="mt-1 text-xs text-gray-400">
            Jami {total} ta urinish · {page} / {totalPages} sahifa
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400">
                <th className="px-5 py-3">Foydalanuvchi</th>
                <th className="px-4 py-3">Dars</th>
                <th className="px-4 py-3">Tur</th>
                <th className="px-4 py-3">Boshlangan</th>
                <th className="px-4 py-3">Javoblar</th>
                <th className="px-4 py-3">Ball</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-5 py-8">
                    <ErrorDisplay message={error} onRetry={() => void load()} />
                  </td>
                </tr>
              )}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8">
                    <EmptyState
                      icon={History}
                      title="Urinishlar topilmadi"
                      description="Filterlarni o‘zgartirib qayta urinib ko‘ring."
                    />
                  </td>
                </tr>
              )}
              {!loading && !error && items.map(item => (
                <tr
                  key={item.exam_id}
                  className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.display_name ?? '—'}
                    </div>
                    <div className="mt-0.5 max-w-[210px] truncate text-xs text-gray-400">
                      {item.email ?? item.user_id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.lesson_slug ?? '—'}</td>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{examKindLabel(item.kind)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{formatDate(item.started_at)}</td>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{answeredLabel(item)}</td>
                  <td className="px-4 py-4">
                    <span className={item.passed ? 'font-semibold text-emerald-600 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}>
                      {item.finished_at ? item.total_score + ' / ' + item.max_score : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {item.finished_at ? (
                      item.passed ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">O‘tdi</span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-300">O‘tmadi</span>
                      )
                    ) : (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">Jarayonda</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => void openDetail(item.exam_id)}
                      className="inline-flex min-h-9 items-center rounded-lg border border-indigo-200 px-3 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                    >
                      Batafsil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Jami {total} ta urinish — {page} / {totalPages} sahifa
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage(current => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            aria-label="Oldingi sahifa"
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Oldingi
          </button>
          <button
            type="button"
            onClick={() => setPage(current => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            aria-label="Keyingi sahifa"
          >
            Keyingi
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AttemptMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">{value}</p>
    </div>
  )
}

function DetailMeta({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: 'success' | 'danger'
}) {
  const valueClass =
    accent === 'success'
      ? 'text-emerald-600 dark:text-emerald-300'
      : accent === 'danger'
        ? 'text-red-600 dark:text-red-300'
        : 'text-gray-800 dark:text-gray-100'

  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-800/70">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={'mt-1 text-xs font-semibold ' + valueClass}>{value}</p>
    </div>
  )
}
