import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCatalog } from '../hooks/useCatalog'
import { useProgressStore, type ModuleProgress } from '../store/progressStore'
import type { CatalogModule } from '../features/content/catalog'

type SectionKey =
  | 'specialty'
  | 'professional_standard'
  | 'pedagogy'
  | 'methodology'

interface SectionSummary {
  key: SectionKey
  label: string
  meta: string
  completed: number
  total: number
  percent: number
  accent: string
  badge: string
  icon: typeof BookOpen
}

interface WeakTopic {
  id: string
  title: string
  moduleTitle: string
  score: number
}

const SECTION_ORDER: SectionKey[] = [
  'specialty',
  'professional_standard',
  'pedagogy',
  'methodology',
]

const SECTION_META: Record<
  SectionKey,
  { label: string; badge: string; accent: string; icon: typeof BookOpen }
> = {
  specialty: {
    label: 'Informatika mutaxassisligi',
    badge: '01',
    accent: 'bg-indigo-500',
    icon: BookOpen,
  },
  professional_standard: {
    label: 'Kasb standarti',
    badge: '02',
    accent: 'bg-blue-500',
    icon: ShieldCheck,
  },
  pedagogy: {
    label: 'Umumiy pedagogika',
    badge: '03',
    accent: 'bg-emerald-500',
    icon: UsersRound,
  },
  methodology: {
    label: 'O‘qitish metodikasi',
    badge: '04',
    accent: 'bg-violet-500',
    icon: GraduationCap,
  },
}

function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}

function getCompletedCount(progress: ModuleProgress, module: CatalogModule): number {
  return Math.min(progress.completedTopics.length, module.subtopics.length)
}

function findContinueModule(
  modules: CatalogModule[],
  getModuleProgress: (moduleId: string) => ModuleProgress,
): CatalogModule | null {
  if (modules.length === 0) return null

  return (
    modules.find(module => {
      const progress = getModuleProgress(module.id)
      return getCompletedCount(progress, module) < module.subtopics.length
    }) ?? modules[0]
  )
}

function buildWeakTopics(
  modules: CatalogModule[],
  getModuleProgress: (moduleId: string) => ModuleProgress,
): WeakTopic[] {
  const attempts: WeakTopic[] = []

  for (const module of modules) {
    const progress = getModuleProgress(module.id)
    const titles = new Map(module.subtopics.map(topic => [topic.id, topic.title]))

    for (const [topicId, topicProgress] of Object.entries(progress.topicProgress)) {
      if (topicProgress.totalCount <= 0) continue
      attempts.push({
        id: `${module.id}:${topicId}`,
        title: titles.get(topicId) ?? topicId,
        moduleTitle: module.title,
        score: topicProgress.lastScore,
      })
    }
  }

  return attempts
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { displayName } = useAuth()
  const { modules } = useCatalog()
  const { getModuleProgress } = useProgressStore()

  const model = useMemo(() => {
    let completedTopics = 0
    let totalTopics = 0
    let startedModules = 0
    let completedModules = 0
    let scoreTotal = 0
    let scoreCount = 0

    const sectionSummaries = SECTION_ORDER.map(key => {
      const sectionModules = modules.filter(module => module.section === key)
      let sectionCompleted = 0
      let sectionTotal = 0

      for (const module of sectionModules) {
        const progress = getModuleProgress(module.id)
        const completed = getCompletedCount(progress, module)

        sectionCompleted += completed
        sectionTotal += module.subtopics.length
      }

      const meta = SECTION_META[key]
      return {
        key,
        label: meta.label,
        badge: meta.badge,
        accent: meta.accent,
        icon: meta.icon,
        completed: sectionCompleted,
        total: sectionTotal,
        percent: progressPercent(sectionCompleted, sectionTotal),
        meta: `${sectionModules.length} modul`,
      } satisfies SectionSummary
    })

    for (const module of modules) {
      const progress = getModuleProgress(module.id)
      const completed = getCompletedCount(progress, module)

      completedTopics += completed
      totalTopics += module.subtopics.length

      if (completed > 0) startedModules += 1
      if (module.subtopics.length > 0 && completed >= module.subtopics.length) {
        completedModules += 1
      }

      for (const topicProgress of Object.values(progress.topicProgress)) {
        if (topicProgress.totalCount <= 0) continue
        scoreTotal += topicProgress.lastScore
        scoreCount += 1
      }
    }

    const continueModule = findContinueModule(modules, getModuleProgress)
    const continueProgress = continueModule
      ? getModuleProgress(continueModule.id)
      : null
    const continueCompleted =
      continueModule && continueProgress
        ? getCompletedCount(continueProgress, continueModule)
        : 0
    const continueTotal = continueModule?.subtopics.length ?? 0

    return {
      completedTopics,
      totalTopics,
      overallPercent: progressPercent(completedTopics, totalTopics),
      startedModules,
      completedModules,
      averageScore: scoreCount > 0 ? Math.round(scoreTotal / scoreCount) : null,
      continueModule,
      continueCompleted,
      continueTotal,
      continuePercent: progressPercent(continueCompleted, continueTotal),
      sectionSummaries,
      weakTopics: buildWeakTopics(modules, getModuleProgress),
    }
  }, [getModuleProgress, modules])

  const firstName = displayName?.trim().split(/\s+/)[0]
  const greeting = firstName ? `Xush kelibsiz, ${firstName}!` : 'Xush kelibsiz!'

  const continueLearning = () => {
    if (model.continueModule) {
      navigate(`/learn/${model.continueModule.id}`)
      return
    }
    navigate('/learn')
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Attestatsiyaga tayyorgarlik holatingiz va keyingi qadamingiz.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300 sm:self-auto"
        >
          <Search size={16} aria-hidden="true" />
          Mavzu qidirish
        </button>
      </header>

      <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 px-6 py-6 text-white shadow-lg shadow-indigo-900/10 sm:px-7 lg:flex lg:min-h-[178px] lg:items-center lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 20%, rgba(255,255,255,.28), transparent 26%), radial-gradient(circle at 75% 80%, rgba(255,255,255,.12), transparent 24%)',
          }}
        />

        <div className="relative max-w-2xl">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-indigo-50">
            DAVOM ETTIRISH
          </span>

          <h2 className="mt-3 text-xl font-semibold sm:text-2xl">
            {model.continueModule?.title ?? 'O‘quv rejangiz tayyor'}
          </h2>

          <p className="mt-2 text-sm text-indigo-100">
            {model.continueModule
              ? `${model.continueCompleted} / ${model.continueTotal} mavzu yakunlangan`
              : 'Birinchi moduldan boshlang va natijalarni shu yerda kuzating.'}
          </p>

          <div className="mt-4 h-2 max-w-xl overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500"
              style={{ width: `${model.continuePercent}%` }}
              aria-label={`Modul progressi: ${model.continuePercent}%`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={continueLearning}
          className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 lg:mt-0"
        >
          {model.continueModule ? 'Darsni davom ettirish' : 'O‘rganishni boshlash'}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </section>

      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Tayyorgarlik ko‘rsatkichlari"
      >
        <MetricCard
          label="Mavzular"
          value={`${model.completedTopics} / ${model.totalTopics}`}
          meta={`${Math.max(model.totalTopics - model.completedTopics, 0)} ta mavzu qoldi`}
          icon={<CheckCircle2 size={17} />}
          tone="indigo"
        />
        <MetricCard
          label="Umumiy progress"
          value={`${model.overallPercent}%`}
          meta={`${model.completedModules} ta modul to‘liq`}
          icon={<Target size={17} />}
          tone="blue"
        />
        <MetricCard
          label="Aniqlik"
          value={model.averageScore === null ? '—' : `${model.averageScore}%`}
          meta={
            model.averageScore === null
              ? 'Test natijasi hali yo‘q'
              : 'Mavzu testlari o‘rtachasi'
          }
          icon={<Trophy size={17} />}
          tone="emerald"
        />
        <MetricCard
          label="Boshlangan modul"
          value={`${model.startedModules} / ${modules.length}`}
          meta="Faol o‘quv yo‘nalishlari"
          icon={<BookOpen size={17} />}
          tone="violet"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Bo‘limlar bo‘yicha progress
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tasdiqlangan 2026 taksonomiyasi asosida
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="shrink-0 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
            >
              Barchasi →
            </button>
          </div>

          <div className="space-y-2.5">
            {model.sectionSummaries.map(section => (
              <SectionProgressRow key={section.key} section={section} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  TAYYORLIK
                </span>
                <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                  {model.overallPercent}%
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  umumiy o‘zlashtirish
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles size={22} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${model.overallPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
              Diqqat talab qiladigan mavzular
            </h2>

            {model.weakTopics.length > 0 ? (
              <div className="mt-4 space-y-3">
                {model.weakTopics.map(topic => (
                  <div key={topic.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                        {topic.title}
                      </p>
                      <p className="truncate text-[10px] text-gray-400">
                        {topic.moduleTitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                      {topic.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                Test ishlaganingizdan keyin zaif mavzular shu yerda ko‘rinadi.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
              Bugungi reja
            </h2>
            <div className="mt-4 space-y-3">
              <PlanRow
                index={1}
                title="Keyingi mavzuni o‘rganish"
                meta={model.continueModule?.code ?? 'O‘quv moduli'}
              />
              <PlanRow
                index={2}
                title="Mavzu testini ishlash"
                meta="Natijani mustahkamlash"
              />
              <PlanRow
                index={3}
                title="Mock sinovni tekshirish"
                meta="50 savol · 120 daqiqa"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/exam')}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
            >
              Mock test
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}

type MetricTone = 'indigo' | 'blue' | 'emerald' | 'violet'

const METRIC_TONES: Record<
  MetricTone,
  { icon: string; badge: string; value: string }
> = {
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
    badge: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
    value: 'text-gray-950 dark:text-white',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    value: 'text-gray-950 dark:text-white',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    value: 'text-gray-950 dark:text-white',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
    badge: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
    value: 'text-gray-950 dark:text-white',
  },
}

function MetricCard({
  label,
  value,
  meta,
  icon,
  tone,
}: {
  label: string
  value: string
  meta: string
  icon: React.ReactNode
  tone: MetricTone
}) {
  const colors = METRIC_TONES[tone]

  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${colors.icon}`}>
          {icon}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${colors.value}`}>
        {value}
      </p>
      <p className="mt-1 truncate text-[11px] text-gray-400">{meta}</p>
    </div>
  )
}

function SectionProgressRow({ section }: { section: SectionSummary }) {
  const Icon = section.icon

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3.5 py-3.5 dark:border-gray-800 sm:gap-4 sm:px-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400">{section.badge}</span>
          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
            {section.label}
          </p>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
          {section.completed} / {section.total} mavzu · {section.meta}
        </p>
      </div>

      <div className="w-24 shrink-0 sm:w-36">
        <div className="mb-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">
          {section.percent}%
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full ${section.accent}`}
            style={{ width: `${section.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function PlanRow({
  index,
  title,
  meta,
}: {
  index: number
  title: string
  meta: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
        {index}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </p>
        <p className="truncate text-[11px] text-gray-400">{meta}</p>
      </div>
    </div>
  )
}
