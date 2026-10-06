import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, Trophy } from 'lucide-react'

export type LessonStage = 'theory' | 'test' | 'result'

const STAGES: Array<{
  key: LessonStage
  label: string
  icon: typeof BookOpen
}> = [
  { key: 'theory', label: 'O‘rganish', icon: BookOpen },
  { key: 'test', label: 'Bilimni tekshirish', icon: ClipboardCheck },
  { key: 'result', label: 'Natija', icon: Trophy },
]

const STAGE_INDEX: Record<LessonStage, number> = {
  theory: 0,
  test: 1,
  result: 2,
}

export default function LessonStageBar({
  phase,
  moduleTitle,
  topicTitle,
  moduleCode,
  topicIndex,
  topicCount,
  onBack,
}: {
  phase: LessonStage
  moduleTitle: string
  topicTitle: string
  moduleCode: string
  topicIndex?: number
  topicCount?: number
  onBack: () => void
}) {
  const currentIndex = STAGE_INDEX[phase]

  return (
    <section className="mb-5 space-y-4" aria-label="Dars holati">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
          aria-label="Mavzular ro‘yxatiga qaytish"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
            <span className="rounded-md bg-indigo-50 px-2 py-1 font-mono font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {moduleCode}
            </span>
            <span className="truncate">{moduleTitle}</span>
            {topicIndex !== undefined && topicCount !== undefined && topicCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {topicIndex + 1} / {topicCount} mavzu
                </span>
              </>
            )}
          </div>
          <h1 className="mt-1.5 truncate text-xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
            {topicTitle}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2" role="list" aria-label="Dars bosqichlari">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon
          const active = index === currentIndex
          const complete = index < currentIndex

          return (
            <div
              key={stage.key}
              role="listitem"
              aria-current={active ? 'step' : undefined}
              className={[
                'flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-center text-xs font-semibold transition',
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                  : complete
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500',
              ].join(' ')}
            >
              {complete ? (
                <CheckCircle2 size={15} aria-hidden="true" />
              ) : (
                <Icon size={15} aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{stage.label}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
