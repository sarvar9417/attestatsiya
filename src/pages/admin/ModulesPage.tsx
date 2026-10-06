import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  GripVertical,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'

interface LessonRow {
  id: string
  module_id: string
  title_uz: string
  est_minutes: number
  order_idx: number
  slug: string
  status: string
}

interface ModuleRow {
  id: string
  code: string | null
  title_uz: string
  summary_uz: string | null
  order_idx: number
  slug: string
  status: string
  lessons: LessonRow[]
}

interface SubjectRow {
  id: string
  code: string
  name_uz: string
}

const STATUS_META: Record<string, { label: string; dot: string; badge: string }> = {
  published: {
    label: "E'lon qilingan",
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  draft: {
    label: 'Qoralama',
    dot: 'bg-amber-500',
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  },
  review: {
    label: 'Tekshiruvda',
    dot: 'bg-blue-500',
    badge:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  },
  archived: {
    label: 'Arxivlangan',
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleRow[]>([])
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '',
    title_uz: '',
    summary_uz: '',
    subject_id: '',
  })
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setLoadError(null)
    setSaveError(null)

    const [modulesResult, lessonsResult, subjectsResult] = await Promise.all([
      supabase.from('modules').select('*').order('order_idx'),
      supabase.from('lessons').select('*').order('order_idx'),
      supabase.from('subjects').select('*').order('code'),
    ])

    const firstError =
      modulesResult.error ?? lessonsResult.error ?? subjectsResult.error ?? null

    if (firstError) {
      setLoadError(firstError.message)
      setLoading(false)
      return
    }

    const modulesData = modulesResult.data
    const lessonsData = lessonsResult.data
    const subjectsData = subjectsResult.data

    if (modulesData) {
      const lessonsByModule = new Map<string, LessonRow[]>()

      for (const lesson of lessonsData || []) {
        const arr = lessonsByModule.get(lesson.module_id) || []
        arr.push(lesson)
        lessonsByModule.set(lesson.module_id, arr)
      }

      setModules(
        modulesData.map(mod => ({
          ...mod,
          lessons: lessonsByModule.get(mod.id) || [],
        })),
      )
    }

    if (subjectsData) setSubjects(subjectsData)
    setLoading(false)
  }

  const summary = useMemo(() => {
    const lessonCount = modules.reduce((sum, module) => sum + module.lessons.length, 0)
    const publishedCount = modules.filter(module => module.status === 'published').length
    const draftCount = modules.filter(module => module.status === 'draft').length

    return { lessonCount, publishedCount, draftCount }
  }, [modules])

  function slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
  }

  async function createModule() {
    setSaveError(null)

    if (!form.title_uz.trim()) {
      setSaveError('Modul nomini kiriting')
      return
    }

    if (!form.subject_id) {
      setSaveError('Fanni tanlang')
      return
    }

    const slug = slugify(form.code || form.title_uz)
    const { error } = await supabase.from('modules').insert({
      code: form.code.trim() || null,
      title_uz: form.title_uz.trim(),
      summary_uz: form.summary_uz.trim() || null,
      slug,
      subject_id: form.subject_id,
      order_idx: modules.length + 1,
      status: 'draft',
    })

    if (error) {
      setSaveError(error.message)
      return
    }

    setShowForm(false)
    setForm({ code: '', title_uz: '', summary_uz: '', subject_id: '' })
    await load()
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            Kontent
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Modullar
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            O‘quv modullari, darslar va ularning nashr holatini boshqaring.
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
            Yangi modul
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Modullar" value={modules.length} icon={<BookOpen size={18} />} />
        <SummaryCard label="Darslar" value={summary.lessonCount} icon={<FileText size={18} />} />
        <SummaryCard
          label="Published"
          value={summary.publishedCount}
          icon={<ChevronRight size={18} />}
        />
        <SummaryCard
          label="Qoralama"
          value={summary.draftCount}
          icon={<Clock3 size={18} />}
        />
      </section>

      {loadError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void load()}
            className="font-semibold underline underline-offset-2"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
        >
          {saveError}
        </div>
      )}

      {showForm && (
        <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Yangi modul
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Modul draft holatida yaratiladi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Formani yopish"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Kod (M01, M02...)"
              value={form.code}
              onChange={event =>
                setForm(current => ({ ...current, code: event.target.value }))
              }
            />
            <select
              className="input"
              value={form.subject_id}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  subject_id: event.target.value,
                }))
              }
            >
              <option value="">Fan tanlang...</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} — {subject.name_uz}
                </option>
              ))}
            </select>
          </div>

          <input
            className="input mt-3"
            placeholder="Modul nomi"
            value={form.title_uz}
            onChange={event =>
              setForm(current => ({ ...current, title_uz: event.target.value }))
            }
          />

          <textarea
            className="input mt-3"
            placeholder="Qisqacha tavsif"
            value={form.summary_uz}
            onChange={event =>
              setForm(current => ({ ...current, summary_uz: event.target.value }))
            }
            rows={3}
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => void createModule()}
              className="btn-primary"
            >
              Saqlash
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Bekor qilish
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
            Modul inventari
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Modulni ochib ichidagi darslarni ko‘rishingiz mumkin.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            Yuklanmoqda...
          </div>
        ) : modules.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BookOpen
              size={32}
              className="mx-auto text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
            <h3 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
              Hali modul yo‘q
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Birinchi modulni yaratish uchun “Yangi modul” tugmasidan foydalaning.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {modules.map(mod => {
              const meta =
                STATUS_META[mod.status] || {
                  label: mod.status,
                  dot: 'bg-gray-400',
                  badge:
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                }

              return (
                <div key={mod.id}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(mod.id)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/40 sm:px-5"
                  >
                    <GripVertical
                      size={15}
                      className="shrink-0 text-gray-300"
                      aria-hidden="true"
                    />
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {expanded.has(mod.id) ? (
                        <ChevronDown size={15} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={15} aria-hidden="true" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {mod.code && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                            {mod.code}
                          </span>
                        )}
                        <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {mod.title_uz}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      {mod.summary_uz && (
                        <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                          {mod.summary_uz}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                      {mod.lessons.length} dars
                    </span>
                  </button>

                  {expanded.has(mod.id) && (
                    <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30 sm:px-14">
                      {mod.lessons.length === 0 ? (
                        <p className="py-2 text-xs text-gray-400">Hali dars yo‘q</p>
                      ) : (
                        <div className="space-y-1">
                          {mod.lessons.map(lesson => {
                            const lessonMeta =
                              STATUS_META[lesson.status] || {
                                label: lesson.status,
                                dot: 'bg-gray-400',
                                badge:
                                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                              }

                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition hover:bg-white dark:hover:bg-gray-900"
                              >
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${lessonMeta.dot}`}
                                />
                                <span className="min-w-0 flex-1 truncate text-gray-600 dark:text-gray-300">
                                  {lesson.title_uz}
                                </span>
                                {lesson.est_minutes > 0 && (
                                  <span className="inline-flex shrink-0 items-center gap-1 text-gray-400">
                                    <Clock3 size={12} aria-hidden="true" />
                                    {lesson.est_minutes} min
                                  </span>
                                )}
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${lessonMeta.badge}`}
                                >
                                  {lessonMeta.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
        {value}
      </p>
    </div>
  )
}
