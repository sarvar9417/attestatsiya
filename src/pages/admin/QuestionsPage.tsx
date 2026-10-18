import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  listAdminQuestions,
  transitionAdminQuestionStatus,
  stageAdminPedagogyRevision,
} from '../../features/admin/adminContentApi'
import {
  Archive,
  ClipboardCheck,
  CheckCircle,
  FileQuestion,
  Filter,
  Globe,
  Plus,
  RefreshCw,
  Search,
  Send,
  Undo2,
  X,
} from 'lucide-react'
import QuestionFormModal from '../../components/admin/QuestionFormModal'
import PedguliEditorialModal from '../../components/admin/PedguliEditorialModal'

type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

interface QuestionRow {
  id: string
  stem_md: string
  format: string
  cognitive: string
  difficulty: number
  status: string
  group_code: string
  construct_id: string | null
  subject_id: string | null
  created_at: string
  source_reference: string | null
  length_bias_flag?: boolean
  revision_question_id?: string | null
}

const STATUS_FLOW: Record<
  ContentStatus,
  {
    to: ContentStatus[]
    label: string
    icon: React.ElementType
    color: string
  }
> = {
  draft: {
    to: ['review'],
    label: 'Tekshiruvga yuborish',
    icon: Send,
    color:
      'text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40',
  },
  review: {
    to: ['published', 'draft'],
    label: 'Tasdiqlash / Qaytarish',
    icon: CheckCircle,
    color:
      'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40',
  },
  published: {
    to: ['archived'],
    label: 'Arxivlash',
    icon: Archive,
    color:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  },
  archived: {
    to: ['draft'],
    label: 'Qayta ochish',
    icon: Undo2,
    color:
      'text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40',
  },
}

const STATUS_META: Record<ContentStatus, { label: string; color: string }> = {
  draft: {
    label: 'Qoralama',
    color:
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
  review: {
    label: 'Tekshiruvda',
    color:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  },
  published: {
    label: "E'lon qilingan",
    color:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  archived: {
    label: 'Arxivlangan',
    color:
      'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300',
  },
}

const FORMAT_LABEL: Record<string, string> = {
  Y1: 'Y1 · Bitta javob',
  Y2: 'Y2 · Moslashtirish',
  Y3: 'Y3 · Ketma-ketlik',
}

const COGNITIVE_LABEL: Record<string, string> = {
  bilish: 'Bilish',
  qollash: "Qo'llash",
  mulohaza: 'Mulohaza',
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filterGroup, setFilterGroup] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [editorialQuestion, setEditorialQuestion] = useState<QuestionRow | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => { setSearchTerm(search.trim()); setPage(1) }, 350)
    return () => window.clearTimeout(timeout)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const data = await listAdminQuestions(
        filterStatus ? (filterStatus as ContentStatus) : undefined,
        filterSource === 'pedguli' || filterSource === 'pedagogy_pdf' ? filterSource : undefined,
        page,
        filterGroup ? (filterGroup as 'KS' | 'PM.GEN' | 'PM.MET') : undefined,
        searchTerm || undefined,
      )
      // Keep adapter compatibility for local/old component fixtures.
      const items = Array.isArray(data) ? data : data.items
      setQuestions(items)
      setTotal(Array.isArray(data) ? items.length : data.total)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Savollarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterSource, filterGroup, page, searchTerm])

  useEffect(() => {
    void load()
  }, [load])

  async function stageRevision(q: QuestionRow) {
    setActionError(null)
    try {
      await stageAdminPedagogyRevision(q.id)
      await load()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Yangi tahrir yaratilmadi')
    }
  }

  async function transitionStatus(q: QuestionRow, nextStatus: ContentStatus) {
    setActionError(null)

    try {
      await transitionAdminQuestionStatus(q.id, nextStatus)
      await load()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Savol holati yangilanmadi')
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('uz')
    if (!query) return questions

    return questions.filter(question =>
      question.stem_md.toLocaleLowerCase('uz').includes(query),
    )
  }, [questions, search])

  const statusSummary = useMemo(() => {
    return {
      published: questions.filter(question => question.status === 'published').length,
      review: questions.filter(question => question.status === 'review').length,
      draft: questions.filter(question => question.status === 'draft').length,
    }
  }, [questions])

  const editingQuestion = editingId
    ? questions.find(question => question.id === editingId)
    : undefined

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            Savollar banki
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Savollar
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Savol matni, turi, kognitiv darajasi va nashr statusini boshqaring.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
            />
            Yangilash
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={16} aria-hidden="true" />
            Yangi savol
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <QuestionMetric label="Yuklangan" value={questions.length} tone="indigo" />
        <QuestionMetric label="Published" value={statusSummary.published} tone="emerald" />
        <QuestionMetric label="Review" value={statusSummary.review} tone="amber" />
        <QuestionMetric label="Qoralama" value={statusSummary.draft} tone="gray" />
      </section>

      {(loadError || actionError) && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{loadError ?? actionError}</span>
          <button
            type="button"
            onClick={() => void load()}
            className="font-semibold underline underline-offset-2"
          >
            Qayta yuklash
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              className="input min-h-11 w-full pl-10 pr-10"
              placeholder="Savol matnidan qidirish..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              aria-label="Savol matnidan qidirish"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Qidiruvni tozalash"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <select
            className="input min-h-11 w-full lg:w-56"
            value={filterSource}
            onChange={event => { setFilterSource(event.target.value); setPage(1) }}
            aria-label="Savol manbasi filtri"
          >
            <option value="">Barcha manbalar</option>
            <option value="pedguli">Pedmahorat — original mashqlar</option>
            <option value="pedagogy_pdf">PDFdan yaratilgan savollar</option>
          </select>
          <select className="input min-h-11 w-full lg:w-44" value={filterGroup}
            aria-label="Pedagogika guruhi" onChange={event => { setFilterGroup(event.target.value); setPage(1) }}>
            <option value="">Barcha guruhlar</option>
            <option value="KS">Kasb standarti</option>
            <option value="PM.GEN">Umumiy pedagogika</option>
            <option value="PM.MET">Informatika metodikasi</option>
          </select>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" aria-hidden="true" />
            <select
              className="input min-h-11 w-full lg:w-48"
              value={filterStatus}
              onChange={event => { setFilterStatus(event.target.value); setPage(1) }}
              aria-label="Status filtri"
            >
              <option value="">Barcha holatlar</option>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Bazada filtr bo‘yicha {total} ta savol. {page}-sahifa, sahifada {questions.length} ta.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-300" aria-label="Savollar sahifalari">
        <span>Jami: {total} · {page} / {Math.max(1, Math.ceil(total / 25))}-sahifa</span>
        <div className="flex gap-2">
          <button type="button" disabled={loading || page <= 1}
            onClick={() => setPage(previous => Math.max(1, previous - 1))}
            className="btn-secondary min-h-10 disabled:opacity-50">Oldingi</button>
          <button type="button" disabled={loading || page * 25 >= total}
            onClick={() => setPage(previous => previous + 1)}
            className="btn-secondary min-h-10 disabled:opacity-50">Keyingi</button>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
            Savollar ro‘yxati
          </h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            Yuklanmoqda...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileQuestion
              size={32}
              className="mx-auto text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
            <h3 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
              Savol topilmadi
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Qidiruv yoki status filtrini o‘zgartirib ko‘ring.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(question => {
              const status = question.status as ContentStatus
              const flow = STATUS_FLOW[status]
              const meta =
                STATUS_META[status] || {
                  label: question.status,
                  color:
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                }

              return (
                <article
                  key={question.id}
                  className="px-4 py-4 transition hover:bg-gray-50/70 dark:hover:bg-gray-800/30 sm:px-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                        {question.stem_md}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                          {FORMAT_LABEL[question.format] ?? question.format}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {COGNITIVE_LABEL[question.cognitive] ??
                            question.cognitive}
                        </span>
                        <span className="text-xs text-gray-400">
                          Qiyinlik: {question.difficulty}/5
                        </span>
                        {question.group_code && (
                          <span className="font-mono text-xs text-gray-400">
                            {question.group_code}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {flow?.to.filter(nextStatus => !(
                        nextStatus === 'draft' && status === 'archived' &&
                        ['KS', 'PM.GEN', 'PM.MET'].includes(question.group_code)
                      )).map(nextStatus => (
                        <button
                          key={nextStatus}
                          type="button"
                          onClick={() =>
                            void transitionStatus(question, nextStatus)
                          }
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${flow.color}`}
                          title={`${flow.label}: ${nextStatus}`}
                        >
                          {nextStatus === 'review' ? (
                            <Send size={14} aria-hidden="true" />
                          ) : nextStatus === 'published' ? (
                            <Globe size={14} aria-hidden="true" />
                          ) : nextStatus === 'archived' ? (
                            <Archive size={14} aria-hidden="true" />
                          ) : nextStatus === 'draft' ? (
                            <Undo2 size={14} aria-hidden="true" />
                          ) : null}
                          <span className="hidden sm:inline">
                            {STATUS_META[nextStatus]?.label ?? nextStatus}
                          </span>
                        </button>
                      ))}

                      {status === 'review' && (['KS', 'PM.GEN', 'PM.MET'].includes(question.group_code) ||
                        question.source_reference?.startsWith('authored:pedguli-') ||
                        question.source_reference?.startsWith('authored:pedagogy-pdf-corpus:')) && (
                        <button
                          type="button"
                          onClick={() => setEditorialQuestion(question)}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-amber-300 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300"
                          title="Javob, manba va mualliflik tekshiruvini qayd etish"
                        >
                          <ClipboardCheck size={14} aria-hidden="true" />
                          Tahririy tekshiruv
                        </button>
                      )}
                      {question.length_bias_flag && status === 'published' && (
                        question.revision_question_id ? (
                          <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                            Tahrir navbatga olingan
                          </span>
                        ) : (
                          <button type="button" onClick={() => void stageRevision(question)}
                            className="inline-flex min-h-9 items-center rounded-lg border border-amber-300 px-3 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:text-amber-300">
                            Muvozanatli tahrir yaratish
                          </button>
                        )
                      )}
                      {(status !== 'published' && !(status === 'archived' &&
                        ['KS','PM.GEN','PM.MET'].includes(question.group_code))) && <button
                        type="button"
                        onClick={() => setEditingId(question.id)}
                        className="inline-flex min-h-9 items-center rounded-lg border border-indigo-200 px-3 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                      >
                        Tahrirlash
                      </button>}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {editorialQuestion && (
        <PedguliEditorialModal
          question={editorialQuestion}
          onClose={() => setEditorialQuestion(null)}
          onSaved={() => { void load() }}
        />
      )}

      {showForm && (
        <QuestionFormModal
          onClose={() => {
            setShowForm(false)
            setEditingId(null)
          }}
          onSaved={() => {
            setShowForm(false)
            setEditingId(null)
            void load()
          }}
        />
      )}

      {editingQuestion && (
        <QuestionFormModal
          question={{
            id: editingQuestion.id,
            stem_md: editingQuestion.stem_md,
            format: editingQuestion.format as 'Y1' | 'Y2' | 'Y3',
            cognitive: editingQuestion.cognitive as
              | 'bilish'
              | 'qollash'
              | 'mulohaza',
            difficulty: editingQuestion.difficulty,
            status: editingQuestion.status as ContentStatus,
            construct_id: editingQuestion.construct_id,
            subject_id: editingQuestion.subject_id,
            group_code: editingQuestion.group_code,
          }}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null)
            void load()
          }}
        />
      )}
    </div>
  )
}

type MetricTone = 'indigo' | 'emerald' | 'amber' | 'gray'

const METRIC_TONE: Record<MetricTone, string> = {
  indigo: 'text-indigo-600 dark:text-indigo-300',
  emerald: 'text-emerald-600 dark:text-emerald-300',
  amber: 'text-amber-600 dark:text-amber-300',
  gray: 'text-gray-700 dark:text-gray-200',
}

function QuestionMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: MetricTone
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${METRIC_TONE[tone]}`}>
        {value}
      </p>
    </div>
  )
}
