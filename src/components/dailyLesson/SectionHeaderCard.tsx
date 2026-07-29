interface Section {
  title: string
  desc: string
  color: string
  icon: string
  ids: number[]
}

interface SectionHeaderCardProps {
  section: Section | null | undefined
  sectionIndex: number
  totalSections: number
  exerciseCount: number
}

export default function SectionHeaderCard({
  section,
  sectionIndex,
  totalSections,
  exerciseCount,
}: SectionHeaderCardProps) {
  if (!section) return null

  return (
    <div className={`rounded-xl p-4 text-white ${section.color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold opacity-80">
            Bosqich {sectionIndex + 1} / {totalSections}
          </p>
          <p className="font-bold text-lg">
            {section.icon} {section.title}
          </p>
          <p className="text-sm opacity-80">{section.desc}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{exerciseCount}</p>
          <p className="text-xs opacity-80">ta mashq</p>
        </div>
      </div>
    </div>
  )
}
