import { useMemo } from 'react'
import type { PersonalWord } from '../../types/personalVocabulary'
import { getTodayTashkent } from '../../utils/tashkentDate'
import {
  Clock, AlertTriangle, Sparkles, Trophy, List,
} from 'lucide-react'

export type SmartFilter = 'all' | 'due' | 'struggling' | 'new' | 'mastered'

interface VocabSmartFiltersProps {
  words: PersonalWord[]
  activeFilter: SmartFilter
  onFilterChange: (filter: SmartFilter) => void
}

const FILTERS: { value: SmartFilter; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
  { value: 'all', label: 'Barcha', icon: <List size={14} />, color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700', activeColor: 'bg-primary-500 text-white shadow-sm' },
  { value: 'due', label: 'Takrorlash', icon: <Clock size={14} />, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40', activeColor: 'bg-orange-500 text-white shadow-sm' },
  { value: 'struggling', label: 'Qiynalgan', icon: <AlertTriangle size={14} />, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40', activeColor: 'bg-red-500 text-white shadow-sm' },
  { value: 'new', label: 'Yangi', icon: <Sparkles size={14} />, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40', activeColor: 'bg-blue-500 text-white shadow-sm' },
  { value: 'mastered', label: "O'zlashtirilgan", icon: <Trophy size={14} />, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40', activeColor: 'bg-green-500 text-white shadow-sm' },
]

export default function VocabSmartFilters({ words, activeFilter, onFilterChange }: VocabSmartFiltersProps) {
  const counts = useMemo(() => {
    const today = getTodayTashkent()
    return {
      all: words.length,
      due: words.filter(w => !w.is_learned && w.next_review <= today).length,
      struggling: words.filter(w => !w.is_learned && w.wrong_count > w.correct_count && (w.correct_count + w.wrong_count) >= 2).length,
      new: words.filter(w => w.box <= 1 && !w.is_learned).length,
      mastered: words.filter(w => w.box >= 6 && w.is_learned).length,
    }
  }, [words])

  if (words.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map(f => {
        const count = counts[f.value] ?? 0
        const isActive = activeFilter === f.value

        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive ? f.activeColor : f.color
            }`}
          >
            {f.icon}
            <span>{f.label}</span>
            {count > 0 && (
              <span className={`text-[10px] font-mono ${
                isActive ? 'text-white/80' : 'opacity-60'
              }`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
