import { Search, Filter } from 'lucide-react'
import { useI18n } from '../../i18n'

interface FilterBarProps {
  filterText: string
  setFilterText: (v: string) => void
  filterLevel: Set<string>
  setFilterLevel: (v: Set<string>) => void
  filterMastery: 'all' | 'new' | 'learning' | 'learned'
  setFilterMastery: (v: 'all' | 'new' | 'learning' | 'learned') => void
  showFilters: boolean
  setShowFilters: (v: boolean) => void
}

export default function FilterBar(props: FilterBarProps) {
  const { t } = useI18n()
  const {
    filterText, setFilterText,
    filterLevel, setFilterLevel,
    filterMastery, setFilterMastery,
    showFilters, setShowFilters,
  } = props

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder={t('vocabPage.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-b1-500 focus:border-b1-500 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border transition-all ${
            showFilters || filterLevel.size > 0 || filterMastery !== 'all'
              ? 'border-b1-300 bg-b1-50 text-b1-600 dark:bg-b1-900/30 dark:text-b1-400'
              : 'border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Filter size={16} />
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Level filter */}
          {['A1', 'A2', 'B1', 'B2'].map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                const next = new Set(filterLevel)
                if (next.has(lvl)) next.delete(lvl)
                else next.add(lvl)
                setFilterLevel(next)
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                filterLevel.has(lvl)
                  ? `${lvl === 'A1' ? 'bg-gray-200 border-gray-400 text-gray-700' :
                     lvl === 'A2' ? 'bg-primary-100 border-primary-400 text-primary-700' :
                     lvl === 'B1' ? 'bg-b1-100 border-b1-400 text-b1-700' :
                     'bg-b2-100 border-b2-400 text-b2-700'}`
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-xs text-gray-300 dark:text-gray-600">|</span>

          {/* Mastery filter */}
          {([
            { key: 'all' as const, label: t('common.all') },
            { key: 'new' as const, label: t('vocabPage.filterNew') },
            { key: 'learning' as const, label: t('vocabPage.filterLearning') },
            { key: 'learned' as const, label: t('vocabPage.filterLearned') },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterMastery(key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                filterMastery === key
                  ? 'border-b1-400 bg-b1-50 text-b1-700 dark:bg-b1-900/30 dark:text-b1-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
