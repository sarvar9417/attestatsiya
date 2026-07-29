import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  alwaysExpanded = false,
}: {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  alwaysExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  if (alwaysExpanded) {
    return <>{children}</>
  }

  return (
    <div role="region" aria-label={title}>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between py-2 px-1 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? '2000px' : '0px' }}
      >
        {children}
      </div>
    </div>
  )
}
