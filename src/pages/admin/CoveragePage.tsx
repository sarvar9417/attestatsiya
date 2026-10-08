import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Link2,
  RefreshCw,
  SearchCheck,
} from 'lucide-react'
import {
  COVERAGE_ISSUE_LABELS,
  getContentCoverage,
  type ContentCoverageReport,
  type CoverageIssueCode,
} from '../../features/admin/coverageApi'

const MODULE_CODES = Array.from({ length: 16 }, (_, index) =>
  `M${String(index + 1).padStart(2, '0')}`
)

function formatCount(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default function CoveragePage() {
  const [moduleCode, setModuleCode] = useState('M01')
  const [report, setReport] = useState<ContentCoverageReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setErrorMessage(null)
      try {
        const next = await getContentCoverage(
          moduleCode === 'ALL' ? undefined : moduleCode
        )
        if (active) setReport(next)
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Kontent qamrovi yuklanmadi.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [moduleCode, reloadKey])

  const issueCounts = useMemo(() => {
    if (!report) return [] as Array<[CoverageIssueCode, number]>
    const counts = new Map<CoverageIssueCode, number>()
    for (const row of report.question_issues) {
      for (const issue of row.issues) {
        counts.set(issue, (counts.get(issue) ?? 0) + 1)
      }
    }
    if (report.summary.no_published_construct_count > 0) {
      counts.set(
        'no_published_questions',
        report.summary.no_published_construct_count
      )
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [report])

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <SearchCheck size={13} aria-hidden="true" />
            T-040 · real DB audit
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Kontent qamrovi
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Published savollarni objective, cognitive daraja, format, difficulty
            va joriy manba izlari bo‘yicha tekshiradi. Bu sahifa tayyorlik
            foizini uydirmaydi — faqat bazadagi real holatni ko‘rsatadi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-gray-500" htmlFor="coverage-module">
            Modul
          </label>
          <select
            id="coverage-module"
            value={moduleCode}
            onChange={event => setModuleCode(event.target.value)}
            className="min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none ring-indigo-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="ALL">Barcha modullar</option>
            {MODULE_CODES.map(code => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setReloadKey(value => value + 1)}
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
        </div>
      </header>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Qamrov ko‘rsatkichlari">
        <Metric
          label="Objective"
          value={report?.summary.construct_count}
          loading={loading}
          icon={<SearchCheck size={17} />}
        />
        <Metric
          label="Published savol"
          value={report?.summary.published_count}
          loading={loading}
          icon={<FileCheck2 size={17} />}
        />
        <Metric
          label="Muammoli savol"
          value={report?.summary.issue_question_count}
          loading={loading}
          icon={<AlertTriangle size={17} />}
        />
        <Metric
          label="Savolsiz objective"
          value={report?.summary.no_published_construct_count}
          loading={loading}
          icon={<AlertTriangle size={17} />}
        />
        <Metric
          label="Jami savol"
          value={report?.summary.question_count}
          loading={loading}
          icon={<Link2 size={17} />}
        />
      </section>

      {report && (
        <>
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                  Objective coverage matrix
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format/cognitive/difficulty sonlari faqat published pool bo‘yicha.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 dark:bg-gray-800/60">
                    <tr>
                      <th className="px-4 py-3">Objective</th>
                      <th className="px-4 py-3">Darslar</th>
                      <th className="px-4 py-3">Savollar</th>
                      <th className="px-4 py-3">Y1 / Y2 / Y3</th>
                      <th className="px-4 py-3">Bilish / Qo‘llash / Mulohaza</th>
                      <th className="px-4 py-3">Source / lesson / key</th>
                      <th className="px-4 py-3">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {report.constructs.map(row => {
                      const published = row.status_counts.published
                      const healthy = row.issues.length === 0
                      return (
                        <tr key={row.construct_id} className="align-top">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {row.construct_code}
                            </div>
                            <div className="mt-1 max-w-[240px] text-gray-500">
                              {row.title_uz}
                            </div>
                            <div className="mt-1 text-[10px] text-gray-400">
                              {row.group_code}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500">
                            {row.lesson_slugs.length > 0
                              ? row.lesson_slugs.join(', ')
                              : '—'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {published}
                            </span>
                            <span className="text-gray-400"> / {row.question_count}</span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                            {row.format_counts.Y1} / {row.format_counts.Y2} / {row.format_counts.Y3}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                            {row.cognitive_counts.bilish} / {row.cognitive_counts.qollash} / {row.cognitive_counts.mulohaza}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                            {row.traceability.with_source_reference} / {row.traceability.with_source_lesson} / {row.traceability.with_key}
                            <div className="mt-1 text-[10px] text-gray-400">
                              published: {published}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {healthy ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircle2 size={12} />
                                Trace OK
                              </span>
                            ) : (
                              <div className="flex max-w-[260px] flex-wrap gap-1">
                                {row.issues.map(issue => (
                                  <IssueBadge key={issue} issue={issue} />
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                  Muammo turlari
                </h2>
                <div className="mt-4 space-y-2">
                  {issueCounts.length === 0 ? (
                    <p className="text-sm text-emerald-600">
                      Traceability muammosi topilmadi.
                    </p>
                  ) : (
                    issueCounts.map(([issue, count]) => (
                      <div
                        key={issue}
                        className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/70"
                      >
                        <span className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {COVERAGE_ISSUE_LABELS[issue]}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-gray-900 dark:text-gray-100">
                          {count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 text-xs leading-5 text-gray-600 dark:border-indigo-900/70 dark:bg-indigo-950/25 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">Manba chegarasi:</strong>{' '}
                hozirgi runtime schema savol uchun <code>source_reference</code> va{' '}
                <code>source_lesson_id</code>ni saqlaydi. Normalized source/locator
                registry hali alohida bosqichda quriladi; bu audit mavjud dalildan
                ortiq ma’lumot uydirmaydi.
              </div>
            </aside>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                Savol darajasidagi audit
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Faqat published savollardagi aniqlangan traceability/taxonomy muammolari.
              </p>
            </div>
            {report.question_issues.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-500">
                Muammoli published savol topilmadi.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {report.question_issues.slice(0, 100).map(row => (
                  <div
                    key={row.question_id}
                    className="grid gap-3 px-5 py-4 lg:grid-cols-[160px_minmax(0,1fr)_minmax(280px,auto)]"
                  >
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {row.construct_code}
                      </div>
                      <div className="mt-1 text-[10px] text-gray-400">
                        {row.source_lesson_slug ?? 'source lesson yo‘q'}
                      </div>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">
                      {row.stem_preview}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {row.issues.map(issue => (
                        <IssueBadge key={issue} issue={issue} />
                      ))}
                    </div>
                  </div>
                ))}
                {report.question_issues.length > 100 && (
                  <div className="px-5 py-3 text-center text-xs text-gray-400">
                    Birinchi 100 ta ko‘rsatildi. Jami: {report.question_issues.length}.
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  loading,
  icon,
}: {
  label: string
  value: number | undefined
  loading: boolean
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-gray-500">{label}</span>
        <span className="text-indigo-500">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
        {loading || value === undefined ? '—' : formatCount(value)}
      </p>
    </div>
  )
}

function IssueBadge({ issue }: { issue: CoverageIssueCode }) {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/35 dark:text-amber-300">
      {COVERAGE_ISSUE_LABELS[issue]}
    </span>
  )
}
