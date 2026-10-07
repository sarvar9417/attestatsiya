import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  History,
  RefreshCw,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BLUEPRINT_GROUPS, EXAM_RULES, type ExamSection } from '../../data/blueprint2026'
import type {
  ExamOption,
  ExamReviewItem,
  FinishExamResponse,
} from './contracts'
import type { ExamGateway } from './examGateway'

interface ExamResultPanelProps {
  result: FinishExamResponse
  examTitle: string
  examKind: 'mock' | 'bolim' | 'mavzu'
  gateway: ExamGateway
  backUrl?: string
  onNewExam: () => void
}

type ReviewState = 'idle' | 'loading' | 'open' | 'error'

const SECTION_TONES: Record<ExamSection, string> = {
  specialty: 'bg-indigo-500',
  professional_standard: 'bg-blue-500',
  pedagogy: 'bg-emerald-500',
  methodology: 'bg-violet-500',
}

function percent(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

function answerOptionText(
  optionId: string | null | undefined,
  options: ExamOption[]
): string | null {
  if (!optionId) return null
  return options.find(option => option.id === optionId)?.content_md ?? null
}

function formatAnswer(
  value: unknown,
  format: ExamReviewItem['format'],
  options: ExamOption[],
  isKey: boolean
): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return ['Javob berilmagan']
  }

  const record = value as Record<string, unknown>

  if (format === 'Y1') {
    const id = isKey ? record.correct_option_id : record.option_id
    const text = typeof id === 'string' ? answerOptionText(id, options) : null
    return [text ?? 'Javob varianti matni mavjud emas']
  }

  if (format === 'Y2') {
    const pairs = record.pairs
    if (!pairs || typeof pairs !== 'object' || Array.isArray(pairs)) {
      return ['Javob berilmagan']
    }

    const lines = Object.entries(pairs as Record<string, unknown>)
      .map(([leftId, rightId]) => {
        if (typeof rightId !== 'string') return null
        const left = answerOptionText(leftId, options)
        const right = answerOptionText(rightId, options)
        if (!left || !right) return null
        return `${left} → ${right}`
      })
      .filter((line): line is string => Boolean(line))

    return lines.length > 0 ? lines : ['Javob juftliklari matni mavjud emas']
  }

  const order = record.order
  if (!Array.isArray(order)) return ['Javob berilmagan']

  const values = order
    .filter((id): id is string => typeof id === 'string')
    .map(id => answerOptionText(id, options))
    .filter((text): text is string => Boolean(text))

  return values.length > 0
    ? [values.join(' → ')]
    : ['Ketma-ketlik matni mavjud emas']
}

function ResultBlueprintStrip({
  breakdown,
}: {
  breakdown: NonNullable<FinishExamResponse['breakdown']>
}) {
  const byGroup = new Map(breakdown.map(item => [item.group_code, item]))

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      aria-labelledby="result-blueprint-title"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Attestatsiya 2026
          </p>
          <h2
            id="result-blueprint-title"
            className="mt-1 text-lg font-semibold text-gray-950 dark:text-white"
          >
            Blueprint bo‘yicha natija
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Kenglik rasmiy savol kvotasini, rang esa shu urinishdagi real holatni ko‘rsatadi.
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {EXAM_RULES.totalQuestions} savol · {EXAM_RULES.maxPoints} ball
        </span>
      </div>

      <div
        className="mt-4 flex h-10 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
        role="list"
        aria-label="Sinov natijasi blueprint guruhlari"
      >
        {BLUEPRINT_GROUPS.map(group => {
          const item = byGroup.get(group.code)
          const accuracy = item ? percent(item.togri, item.jami) : null
          const tone =
            accuracy === null
              ? 'bg-gray-300 dark:bg-gray-700'
              : accuracy === 100
                ? 'bg-emerald-500'
                : accuracy > 0
                  ? 'bg-amber-500'
                  : 'bg-rose-500'

          return (
            <div
              key={group.code}
              role="listitem"
              title={
                item
                  ? `${group.code} — ${group.title}: ${item.togri}/${item.jami}`
                  : `${group.code} — bu urinishda ma’lumot yo‘q`
              }
              aria-label={
                item
                  ? `${group.code}: ${item.togri} ta to‘g‘ri, ${item.jami} ta jami`
                  : `${group.code}: bu urinishda ma’lumot yo‘q`
              }
              className={`relative min-w-0 border-r border-white/60 last:border-r-0 dark:border-gray-900/60 ${tone}`}
              style={{ flexGrow: group.questionCount, flexBasis: 0 }}
            >
              <span className="absolute inset-0 grid place-items-center overflow-hidden px-0.5 text-[8px] font-bold text-white sm:text-[9px]">
                {group.questionCount >= 3 ? group.code : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          100%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" />
          Qisman
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden="true" />
          0%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
          Ma’lumot yo‘q
        </span>
      </div>
    </section>
  )
}

function ReviewItemCard({ item }: { item: ExamReviewItem }) {
  const [expanded, setExpanded] = useState(false)
  const options = item.options ?? []
  const userAnswer = formatAnswer(item.user_answer, item.format, options, false)
  const correctAnswer = formatAnswer(item.key, item.format, options, true)

  return (
    <article
      className={[
        'rounded-2xl border bg-white shadow-sm dark:bg-gray-900',
        item.is_correct
          ? 'border-emerald-200 dark:border-emerald-800/50'
          : 'border-rose-200 dark:border-rose-800/50',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
        aria-expanded={expanded}
      >
        <span
          className={[
            'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl',
            item.is_correct
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300',
          ].join(' ')}
        >
          {item.is_correct ? (
            <CheckCircle2 size={17} aria-hidden="true" />
          ) : (
            <XCircle size={17} aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <strong className="text-sm text-gray-900 dark:text-white">
              {item.order_idx}-savol
            </strong>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
              {item.format}
            </span>
            {item.construct_slug && (
              <span className="font-mono text-[10px] font-semibold text-indigo-500">
                {item.construct_slug}
              </span>
            )}
          </span>
          <span className="mt-2 block whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-200">
            {item.stem_md}
          </span>
          {item.construct && (
            <span className="mt-2 block text-xs text-gray-400">
              {item.construct}
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronUp size={18} className="mt-1 shrink-0 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown size={18} className="mt-1 shrink-0 text-gray-400" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-5 pt-4 dark:border-gray-800 sm:px-5">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                Sizning javobingiz
              </p>
              <div className="mt-2 space-y-1 text-sm leading-6 text-gray-700 dark:text-gray-200">
                {userAnswer.map((line, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/25">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-300">
                To‘g‘ri javob
              </p>
              <div className="mt-2 space-y-1 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                {correctAnswer.map((line, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {item.explanation_md && (
            <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/25">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">
                Tushuntirish
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-indigo-950 dark:text-indigo-100">
                {item.explanation_md}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function ExamResultPanel({
  result,
  examTitle,
  examKind,
  gateway,
  backUrl,
  onNewExam,
}: ExamResultPanelProps) {
  const [reviewState, setReviewState] = useState<ReviewState>('idle')
  const [reviewItems, setReviewItems] = useState<ExamReviewItem[]>([])
  const [reviewError, setReviewError] = useState<string | null>(null)

  const percentage =
    result.max_score > 0
      ? Math.round((result.total_score / result.max_score) * 100)
      : 0

  const status =
    result.passed === true
      ? 'passed'
      : result.passed === false
        ? 'failed'
        : 'unrated'

  const orderedBreakdown = useMemo(
    () =>
      [...(result.breakdown ?? [])].sort(
        (a, b) => percent(a.togri, a.jami) - percent(b.togri, b.jami)
      ),
    [result.breakdown]
  )

  const sectionBreakdown = useMemo(() => {
    if (examKind !== 'mock' || orderedBreakdown.length === 0) return []

    const groupSection = new Map(
      BLUEPRINT_GROUPS.map(group => [group.code, group.section] as const)
    )
    const totals = new Map<ExamSection, { jami: number; togri: number }>()

    for (const item of orderedBreakdown) {
      const section = groupSection.get(item.group_code)
      if (!section) continue
      const current = totals.get(section) ?? { jami: 0, togri: 0 }
      current.jami += item.jami
      current.togri += item.togri
      totals.set(section, current)
    }

    return (Object.keys(EXAM_RULES.sections) as ExamSection[])
      .map(section => ({
        section,
        label: EXAM_RULES.sections[section].label,
        ...totals.get(section),
      }))
      .filter(
        (item): item is {
          section: ExamSection
          label: string
          jami: number
          togri: number
        } => typeof item.jami === 'number'
      )
  }, [examKind, orderedBreakdown])

  const loadReview = async () => {
    setReviewState('loading')
    setReviewError(null)

    try {
      const items = await gateway.getReview(result.exam_id)
      setReviewItems(items)
      setReviewState('open')
    } catch {
      setReviewError('Savollar tahlilini yuklab bo‘lmadi. Qayta urinib ko‘ring.')
      setReviewState('error')
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
          Natijalar
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Sinov yakunlandi
        </h1>
        <p className="mt-1 text-sm text-gray-400">{examTitle}</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className={[
                'grid h-16 w-16 shrink-0 place-items-center rounded-2xl',
                status === 'passed'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : status === 'failed'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
              ].join(' ')}
            >
              {status === 'failed' ? (
                <XCircle size={30} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={30} aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-mono text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
                {result.total_score}
                <span className="text-2xl font-semibold text-gray-400">
                  /{result.max_score}
                </span>
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {percentage}% natija
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={[
                    'h-full rounded-full',
                    status === 'passed'
                      ? 'bg-emerald-500'
                      : status === 'failed'
                        ? 'bg-rose-500'
                        : 'bg-indigo-500',
                  ].join(' ')}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  aria-label={`Natija: ${percentage}%`}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={[
            'rounded-2xl border p-5 shadow-sm sm:p-6',
            status === 'passed'
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
              : status === 'failed'
                ? 'border-rose-200 bg-rose-50 dark:border-rose-800/50 dark:bg-rose-950/20'
                : 'border-indigo-200 bg-indigo-50 dark:border-indigo-800/50 dark:bg-indigo-950/20',
          ].join(' ')}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
            Server qarori
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gray-950 dark:text-white">
            {status === 'passed'
              ? 'Talab bajarildi'
              : status === 'failed'
                ? 'Mustahkamlash kerak'
                : 'Ball qayd etildi'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {status === 'unrated'
              ? 'Bu sinov turi uchun pass/fail qarori serverdan kelmadi. Interfeys ballga qarab o‘zi xulosa chiqarmaydi.'
              : 'Natija va pass/fail holati server tomonidan qaytarildi; brauzer qayta hisoblamaydi.'}
          </p>
        </div>
      </section>

      {examKind === 'mock' && orderedBreakdown.length > 0 && (
        <ResultBlueprintStrip breakdown={orderedBreakdown} />
      )}

      {sectionBreakdown.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
            Bloklar bo‘yicha
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Faqat shu urinishda server qaytargan savollar kesimi.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sectionBreakdown.map(item => (
              <div
                key={item.section}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${SECTION_TONES[item.section]}`}
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {item.label}
                  </p>
                </div>
                <p className="mt-3 font-mono text-xl font-bold text-gray-950 dark:text-white">
                  {item.togri}/{item.jami}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {percent(item.togri, item.jami)}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {orderedBreakdown.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Target size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Eng zaif guruhlar
              </h2>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Konstrukt darajasidagi xulosa finish javobida yo‘q; shu sabab bu yerda faqat real guruh kesimi ko‘rsatiladi.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {orderedBreakdown.slice(0, 3).map(item => (
              <div
                key={item.group_code}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
              >
                <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
                  {item.group_code}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  {item.togri}/{item.jami}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${percent(item.togri, item.jami)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Keyingi harakat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Yakunlangan sinovni tahlil qiling yoki serverdagi takrorlash navbatiga o‘ting.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadReview()}
              disabled={reviewState === 'loading'}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {reviewState === 'loading' ? (
                <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
              Savollarni ko‘rib chiqish
            </button>
            <Link
              to="/review"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Xatolarni qayta ishlash
            </Link>
            <Link
              to="/history"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <History size={15} aria-hidden="true" />
              Natijalar tarixi
            </Link>
          </div>
        </div>
      </section>

      {reviewState === 'error' && (
        <section
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-amber-900 dark:text-amber-100">
                Tahlil olinmadi
              </h2>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                {reviewError}
              </p>
              <button
                type="button"
                onClick={() => void loadReview()}
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Qayta urinish
              </button>
            </div>
          </div>
        </section>
      )}

      {reviewState === 'open' && (
        <section className="space-y-3" aria-labelledby="item-review-title">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
                Finalized review
              </p>
              <h2
                id="item-review-title"
                className="mt-1 text-xl font-semibold text-gray-950 dark:text-white"
              >
                Savollar tahlili
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Javob kaliti va tushuntirish faqat yakunlangan sinov uchun serverdan olindi.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              {reviewItems.filter(item => item.is_correct).length}/{reviewItems.length} to‘g‘ri
            </span>
          </div>

          {reviewItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Ushbu yakunlangan sinov uchun item-level tahlil topilmadi.
            </div>
          ) : (
            reviewItems.map(item => (
              <ReviewItemCard key={item.order_idx} item={item} />
            ))
          )}
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onNewExam}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Yangi sinov
        </button>

        {backUrl && (
          <Link
            to={backUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Modulga qaytish
          </Link>
        )}
      </div>
    </main>
  )
}
