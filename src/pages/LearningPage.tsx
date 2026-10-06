import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  FileQuestion,
  GraduationCap,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  X,
} from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import type { CatalogModule } from '../features/content/catalog'
import { useProgressStore } from '../store/progressStore'

type SectionKey =
  | 'specialty'
  | 'professional_standard'
  | 'pedagogy'
  | 'methodology'

const SECTION_ORDER: SectionKey[] = [
  'specialty',
  'professional_standard',
  'pedagogy',
  'methodology',
]

const SECTION_META: Record<
  SectionKey,
  { label: string; description: string; icon: typeof BookOpen }
> = {
  specialty: {
    label: 'Informatika mutaxassisligi',
    description: 'Asosiy informatika va hisoblash yo‘nalishlari',
    icon: Code2,
  },
  professional_standard: {
    label: 'Kasb standarti',
    description: 'O‘qituvchining kasbiy kompetensiyalari',
    icon: ShieldCheck,
  },
  pedagogy: {
    label: 'Umumiy pedagogika',
    description: 'Pedagogik nazariya va amaliyot',
    icon: UsersRound,
  },
  methodology: {
    label: 'Informatika o‘qitish metodikasi',
    description: 'Fanni o‘qitish usullari va yondashuvlari',
    icon: GraduationCap,
  },
}

function moduleProgressPercent(completed: number, total: number) {
  if (total <= 0) return 0
  return Math.round((Math.min(completed, total) / total) * 100)
}

export default function LearningPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { modules } = useCatalog()
  const { getModuleProgress } = useProgressStore()

  const filteredModules = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('uz')
    if (!query) return modules

    return modules.filter(module => {
      return (
        module.title.toLocaleLowerCase('uz').includes(query) ||
        module.description.toLocaleLowerCase('uz').includes(query) ||
        module.code.toLocaleLowerCase('uz').includes(query) ||
        module.subtopics.some(topic =>
          topic.title.toLocaleLowerCase('uz').includes(query),
        )
      )
    })
  }, [modules, search])

  const stats = useMemo(() => {
    let completedTopics = 0
    let totalTopics = 0
    let startedModules = 0

    for (const module of modules) {
      const progress = getModuleProgress(module.id)
      completedTopics += Math.min(
        progress.completedTopics.length,
        module.subtopics.length,
      )
      totalTopics += module.subtopics.length
      if (progress.completedTopics.length > 0) startedModules += 1
    }

    return {
      completedTopics,
      totalTopics,
      startedModules,
      percent:
        totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0,
    }
  }, [getModuleProgress, modules])

  const grouped = useMemo(() => {
    return SECTION_ORDER.map(section => ({
      section,
      modules: filteredModules.filter(module => module.section === section),
    })).filter(group => group.modules.length > 0)
  }, [filteredModules])

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            O‘rganish
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Modullarni ketma-ket o‘rganing, mavzularni yakunlang va natijani kuzating.
          </p>
        </div>

        <div className="relative w-full sm:w-[310px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Modul yoki mavzu qidirish..."
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-indigo-700 dark:focus:ring-indigo-950/40"
            aria-label="Modul yoki mavzu qidirish"
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
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="O‘rganish statistikasi">
        <LearningStat
          value={`${stats.completedTopics} / ${stats.totalTopics}`}
          label="Tugallangan mavzu"
          icon={<CheckCircle2 size={18} />}
          tone="indigo"
        />
        <LearningStat
          value={`${stats.percent}%`}
          label="Umumiy progress"
          icon={<Target size={18} />}
          tone="emerald"
        />
        <LearningStat
          value={`${stats.startedModules} / ${modules.length}`}
          label="Boshlangan modullar"
          icon={<BookOpen size={18} />}
          tone="violet"
        />
      </section>

      {search && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300">
          “{search}” bo‘yicha {filteredModules.length} ta modul topildi.
        </div>
      )}

      <div className="space-y-7">
        {grouped.map(group => {
          const meta = SECTION_META[group.section]
          const SectionIcon = meta.icon

          return (
            <section key={group.section}>
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <SectionIcon size={17} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                    {meta.label}
                  </h2>
                  <p className="text-xs text-gray-400">{meta.description}</p>
                </div>
                <span className="ml-auto shrink-0 text-xs text-gray-400">
                  {group.modules.length} modul
                </span>
              </div>

              <div className="space-y-3">
                {group.modules.map(module => {
                  const progress = getModuleProgress(module.id)
                  const completed = Math.min(
                    progress.completedTopics.length,
                    module.subtopics.length,
                  )
                  const total = module.subtopics.length
                  const percent = moduleProgressPercent(completed, total)
                  const complete = total > 0 && completed >= total

                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => navigate(`/learn/${module.id}`)}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800 sm:px-5"
                    >
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                          complete
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {complete ? (
                          <CheckCircle2 size={20} aria-hidden="true" />
                        ) : (
                          <BookOpen size={19} aria-hidden="true" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {module.code}
                          </span>
                          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {module.title}
                          </h3>
                          {complete && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Tugallangan
                            </span>
                          )}
                        </div>

                        <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                          {module.description}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-full ${
                                complete ? 'bg-emerald-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {percent}%
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
                          <span>{completed} / {total} mavzu</span>
                          <span className="inline-flex items-center gap-1">
                            <FileQuestion size={11} aria-hidden="true" />
                            {module.examQuestionCount} savol
                          </span>
                        </div>
                      </div>

                      <div className="hidden shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-indigo-700 sm:flex">
                        {completed > 0 && !complete ? 'Davom ettirish' : complete ? 'Ko‘rish' : 'O‘rganish'}
                        <ArrowRight size={14} aria-hidden="true" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <BookOpen size={32} className="mx-auto text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <h2 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
            Natija topilmadi
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Boshqa modul nomi, mavzu yoki kod bilan qidiring.
          </p>
        </div>
      )}
    </div>
  )
}

type Tone = 'indigo' | 'emerald' | 'violet'

const TONE_CLASSES: Record<Tone, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
}

function LearningStat({
  value,
  label,
  icon,
  tone,
}: {
  value: string
  label: string
  icon: React.ReactNode
  tone: Tone
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-400">{label}</p>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${TONE_CLASSES[tone]}`}>
          {icon}
        </span>
      </div>
    </div>
  )
}
