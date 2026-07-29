interface SectionProgressBarProps {
  sections: { title: string; icon: string }[]
  completedSections: Record<number, number>
  currentSection: number
  onJumpToSection: (idx: number) => void
}

export default function SectionProgressBar({
  sections,
  completedSections,
  currentSection,
  onJumpToSection,
}: SectionProgressBarProps) {
  const completedCount = Object.keys(completedSections).length
  const totalCount = sections.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-2">
      {/* Overall progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 w-10 text-right">{pct}%</span>
      </div>

      {/* Section dots */}
      <div className="flex items-center gap-1.5">
        {sections.map((s, i) => {
          const done = completedSections[i] !== undefined
          const active = i === currentSection
          return (
            <button
              key={s.title}
              aria-label={s.title}
              className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onJumpToSection(i)}
            >
              <div
                className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-primary-500' : 'bg-gray-200'}`}
              />
              <p
                className={`text-xs mt-0.5 text-center font-medium ${active ? 'text-primary-700' : done ? 'text-green-600' : 'text-gray-400'}`}
              >
                {s.icon} <span className="hidden sm:inline">{s.title}</span>
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
