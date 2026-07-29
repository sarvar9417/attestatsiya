import type { CulturalNote } from '../../data/dailyLessons'

interface CulturalNoteCardProps {
  note: CulturalNote
}

const CATEGORY_ICONS: Record<string, string> = {
  'culture': '🏛️',
  'etymology': '📜',
  'usage': '💡',
  'fun-fact': '🎯',
}

const CATEGORY_COLORS: Record<string, { border: string; bg: string; badge: string }> = {
  'culture':   { border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-50 dark:bg-amber-900/20', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' },
  'etymology': { border: 'border-purple-200 dark:border-purple-800', bg: 'bg-purple-50 dark:bg-purple-900/20', badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400' },
  'usage':     { border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50 dark:bg-blue-900/20', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' },
  'fun-fact':  { border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-900/20', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' },
}

const defaultCategory: { border: string; bg: string; badge: string } = {
  border: 'border-gray-200 dark:border-gray-700',
  bg: 'bg-gray-50 dark:bg-gray-800',
  badge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

export default function CulturalNoteCard({ note }: CulturalNoteCardProps) {
  const cat = note.category ?? 'usage'
  const colors = CATEGORY_COLORS[cat] ?? defaultCategory
  const icon = note.icon ?? CATEGORY_ICONS[cat] ?? '💡'
  const label = { culture: 'Madaniyat', etymology: 'Etimologiya', usage: 'Qo\'llanish', 'fun-fact': 'Qiziqarli fakt' }[cat] ?? 'Eslatma'

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge}`}>
              {label}
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{note.title}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {note.description}
          </p>
        </div>
      </div>
    </div>
  )
}
