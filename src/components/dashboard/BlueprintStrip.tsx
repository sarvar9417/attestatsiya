import { BLUEPRINT_GROUPS, EXAM_RULES } from '../../data/blueprint2026'

const SECTION_TONES: Record<string, string> = {
  specialty: 'bg-indigo-500',
  professional_standard: 'bg-blue-500',
  pedagogy: 'bg-emerald-500',
  methodology: 'bg-violet-500',
}

export default function BlueprintStrip() {
  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
      aria-labelledby="blueprint-strip-title"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Attestatsiya 2026
          </p>
          <h2
            id="blueprint-strip-title"
            className="mt-1 text-lg font-semibold text-gray-950 dark:text-white"
          >
            Imtihon blueprinti
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Har bo‘lak kengligi rasmiy savol soniga proporsional. Jami{' '}
            {EXAM_RULES.totalQuestions} savol.
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          120 daqiqa · 100 ball
        </span>
      </div>

      <div
        className="mt-4 flex h-9 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
        role="list"
        aria-label="Blueprint guruhlari"
      >
        {BLUEPRINT_GROUPS.map(group => (
          <div
            key={group.code}
            role="listitem"
            data-testid={`blueprint-segment-${group.code}`}
            data-question-count={group.questionCount}
            title={`${group.code} — ${group.title}: ${group.questionCount} savol`}
            aria-label={`${group.code}: ${group.questionCount} savol`}
            className={`group relative min-w-0 border-r border-white/50 last:border-r-0 dark:border-gray-900/60 ${SECTION_TONES[group.section]}`}
            style={{ flexGrow: group.questionCount, flexBasis: 0 }}
          >
            <span className="absolute inset-0 grid place-items-center overflow-hidden px-1 text-[9px] font-bold text-white/95 sm:text-[10px]">
              {group.questionCount >= 3 ? group.code : group.questionCount}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-gray-500 dark:text-gray-400 sm:grid-cols-4">
        <Legend tone="bg-indigo-500" label="Mutaxassislik — 35" />
        <Legend tone="bg-blue-500" label="Kasb standarti — 5" />
        <Legend tone="bg-emerald-500" label="Pedagogika — 7" />
        <Legend tone="bg-violet-500" label="Metodika — 3" />
      </div>

      <p className="mt-3 text-[11px] leading-5 text-gray-400">
        Nisbat: {BLUEPRINT_GROUPS.map(group => group.questionCount).join(':')}
      </p>
    </section>
  )
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
