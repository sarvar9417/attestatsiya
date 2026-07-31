import { useEffect, useState, useCallback } from 'react'
import {
  History,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  listAttempts,
  getAttemptDetail,
  examKindLabel,
  EXAM_KIND_LABELS,
  type AttemptSummary,
  type AttemptDetail,
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
  if (item.finished_at) return `${item.answered_count} / ${Math.round(item.max_score / 2)}`
  return `${item.answered_count} ta`
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
        from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
        to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
        page,
        page_size: pageSize,
      })
      setItems(result.items)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ro\'yxatni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [kind, lesson, userId, from, to, page, pageSize])

  useEffect(() => {
    load()
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sinov urinishlari</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Har bir foydalanuvchining bajargan testlari va javoblari to'liq saqlanadi.
      </p>

      {/* Filter bar */}
      <div className="card p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <select
          value={kind}
          onChange={e => { setKind(e.target.value); setPage(1) }}
          className="input"
          aria-label="Test turi"
        >
          <option value="">Barcha turlar</option>
          {KINDS.map(k => (
            <option key={k} value={k}>{EXAM_KIND_LABELS[k]}</option>
          ))}
        </select>
        <input
          value={lesson}
          onChange={e => { setLesson(e.target.value); setPage(1) }}
          placeholder="Dars (M01.02 yoki UUID)"
          className="input"
          aria-label="Dars filtri"
        />
        <input
          value={userId}
          onChange={e => { setUserId(e.target.value); setPage(1) }}
          placeholder="Foydalanuvchi UUID"
          className="input"
          aria-label="Foydalanuvchi filtri"
        />
        <input
          type="date"
          value={from}
          onChange={e => { setFrom(e.target.value); setPage(1) }}
          className="input"
          aria-label="Boshlanish sanasi"
        />
        <input
          type="date"
          value={to}
          onChange={e => { setTo(e.target.value); setPage(1) }}
          className="input"
          aria-label="Tugash sanasi"
        />
        <button onClick={() => { setPage(1); load() }} className="btn btn-primary">
          Filterlash
        </button>
      </div>

      {/* Detail panel */}
      {detail && (
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Urinish detali — {detail.display_name ?? detail.email ?? detail.user_id}
            </h2>
            <button
              onClick={() => setDetail(null)}
              className="btn btn-ghost"
              aria-label="Detalni yopish"
            >
              <X size={16} />
            </button>
          </div>
          {detailLoading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
          {detailError && <ErrorDisplay message={detailError} onRetry={() => openDetail(detail.exam_id)} />}
          {!detailLoading && !detailError && (
            <div>
              <div className="flex flex-wrap gap-4 text-sm mb-4 text-gray-700 dark:text-gray-300">
                <span><b>{examKindLabel(detail.kind)}</b></span>
                <span>Dars: {detail.lesson_slug ?? '—'}</span>
                <span>Boshlangan: {formatDate(detail.started_at)}</span>
                <span>Tugagan: {formatDate(detail.finished_at)}</span>
                <span>
                  Ball: <b className={detail.passed ? 'text-green-600' : 'text-red-600'}>
                    {detail.total_score} / {detail.max_score}
                  </b>{' '}
                  {detail.passed ? '✓' : '✗'}
                </span>
              </div>
              <ul className="space-y-3">
                {detail.items.map(item => {
                  const chosenId =
                    (item.user_answer as { option_id?: string } | null)?.option_id ?? null
                  return (
                    <li key={item.item_id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {item.order_idx}. {item.stem_md}
                        </p>
                        {item.is_correct !== null && (
                          item.is_correct ? (
                            <span className="text-green-600 flex items-center gap-1 text-xs shrink-0">
                              <CheckCircle2 size={14} /> To'g'ri
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1 text-xs shrink-0">
                              <XCircle size={14} /> Noto'g'ri
                            </span>
                          )
                        )}
                      </div>
                      <ul className="mt-2 space-y-1">
                        {item.options.map(opt => {
                          const isChosen = opt.id === chosenId
                          const isCorrect = opt.id === item.correct_option_id
                          let cls = 'text-gray-600 dark:text-gray-400'
                          let mark = ''
                          if (isChosen && isCorrect) { cls = 'text-green-700 dark:text-green-400'; mark = ' (tanlangan, to‘g‘ri)' }
                          else if (isChosen) { cls = 'text-red-600 dark:text-red-400'; mark = ' (tanlangan)' }
                          else if (isCorrect) { cls = 'text-green-700 dark:text-green-400'; mark = ' (to‘g‘ri javob)' }
                          return (
                            <li key={opt.id} className={`text-sm ${cls}`}>
                              • {opt.content_md ?? '—'}
                              {mark}
                            </li>
                          )
                        })}
                      </ul>
                      {item.is_correct !== null && item.explanation_md && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Izoh: {item.explanation_md}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">Foydalanuvchi</th>
              <th className="px-4 py-3">Dars</th>
              <th className="px-4 py-3">Tur</th>
              <th className="px-4 py-3">Boshlangan</th>
              <th className="px-4 py-3">Javoblar</th>
              <th className="px-4 py-3">Ball</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">Yuklanmoqda...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={8} className="px-4 py-6"><ErrorDisplay message={error} onRetry={load} /></td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6">
                  <EmptyState
                    icon={History}
                    title="Urinishlar topilmadi"
                    description="Filterlarni o'zgartirib qayta urinib ko'ring."
                  />
                </td>
              </tr>
            )}
            {!loading && !error && items.map(item => (
              <tr key={item.exam_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="text-gray-900 dark:text-gray-100">{item.display_name ?? '—'}</div>
                  <div className="text-xs text-gray-500">{item.email ?? item.user_id}</div>
                </td>
                <td className="px-4 py-3">{item.lesson_slug ?? '—'}</td>
                <td className="px-4 py-3">{examKindLabel(item.kind)}</td>
                <td className="px-4 py-3">{formatDate(item.started_at)}</td>
                <td className="px-4 py-3">{answeredLabel(item)}</td>
                <td className="px-4 py-3">
                  <span className={item.passed ? 'text-green-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                    {item.finished_at ? `${item.total_score} / ${item.max_score}` : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.finished_at ? (
                    item.passed ? (
                      <span className="badge badge-primary">O'tdi</span>
                    ) : (
                      <span className="badge badge-b2">O'tmadi</span>
                    )
                  ) : (
                    <span className="badge badge-b1">Jarayonda</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openDetail(item.exam_id)}
                    className="btn btn-sm btn-primary"
                  >
                    Batafsil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Jami {total} ta urinish — {page} / {totalPages} sahifa
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn btn-sm"
            aria-label="Oldingi sahifa"
          >
            <ChevronLeft size={14} /> Oldingi
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="btn btn-sm"
            aria-label="Keyingi sahifa"
          >
            Keyingi <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
