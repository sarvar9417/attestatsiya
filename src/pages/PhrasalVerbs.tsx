import { useState, useMemo } from 'react'
import { Search, X, BookOpen, Filter, ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n'
import { PHRASAL_VERBS, type PhrasalVerb, type PhrasalVerbLevel } from '../data/phrasalVerbs'

const VERBS: Array<'get' | 'take' | 'put' | 'come' | 'look' | 'go'
  | 'bring' | 'break' | 'call' | 'carry' | 'catch' | 'check'
  | 'give' | 'hold' | 'keep' | 'make' | 'pass' | 'pick'
  | 'run' | 'set' | 'show' | 'turn' | 'use' | 'work'> = [
  'get', 'take', 'put', 'come', 'look', 'go',
  'bring', 'break', 'call', 'carry', 'catch', 'check',
  'give', 'hold', 'keep', 'make', 'pass', 'pick',
  'run', 'set', 'show', 'turn', 'use', 'work',
]
const LEVELS: PhrasalVerbLevel[] = ['B1+', 'B2']

export default function PhrasalVerbs() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [verbFilter, setVerbFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [selected, setSelected] = useState<PhrasalVerb | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PHRASAL_VERBS.filter((pv) => {
      if (verbFilter !== 'all' && pv.verb !== verbFilter) return false
      if (levelFilter !== 'all' && pv.level !== levelFilter) return false
      if (!q) return true
      return (
        pv.phrasalVerb.toLowerCase().includes(q) ||
        pv.meaning.toLowerCase().includes(q) ||
        pv.translation.toLowerCase().includes(q) ||
        pv.examples.some((ex) => ex.toLowerCase().includes(q))
      )
    })
  }, [query, verbFilter, levelFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, PhrasalVerb[]>()
    for (const pv of filtered) {
      const key = pv.verb
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(pv)
    }
    return map
  }, [filtered])

  if (selected) {
    return <PhrasalVerbDetail verb={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {t('phrasalVerbs.title')}
        </h1>
        <p className="text-sm text-gray-500">
          {t('phrasalVerbs.subtitle', { count: String(PHRASAL_VERBS.length) })}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('phrasalVerbs.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={t('common.filterClear')}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter size={16} className="text-gray-400" />
        <FilterChip
          active={verbFilter === 'all'}
          onClick={() => setVerbFilter('all')}
          label={t('phrasalVerbs.filterAll')}
        />
        {VERBS.map((v) => (
          <FilterChip
            key={v}
            active={verbFilter === v}
            onClick={() => setVerbFilter(v)}
            label={v}
          />
        ))}
        <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
        {LEVELS.map((l) => (
          <FilterChip
            key={l}
            active={levelFilter === l}
            onClick={() => setLevelFilter(levelFilter === l ? 'all' : l)}
            label={l}
          />
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">{t('phrasalVerbs.noResults')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('phrasalVerbs.tryDifferentQuery')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([verb, items]) => (
            <section key={verb}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 capitalize">
                {verb} <span className="text-sm font-normal text-gray-400">({items.length})</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((pv) => (
                  <PhrasalVerbCard key={pv.id} verb={pv} onClick={() => setSelected(pv)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

function PhrasalVerbCard({ verb, onClick }: { verb: PhrasalVerb; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card !p-4 text-left hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700
        transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
          {verb.phrasalVerb}
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
          verb.level === 'B2'
            ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
            : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        }`}>
          {verb.level}
        </span>
      </div>
      <p className="text-xs text-gray-500 italic mb-1.5">{verb.translation}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {verb.meaning}
      </p>
    </button>
  )
}

function PhrasalVerbDetail({ verb, onBack }: { verb: PhrasalVerb; onBack: () => void }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-4
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
      >
        <        ArrowLeft size={16} />
        {t('phrasalVerbs.detailBack')}
      </button>

      <article className="card !p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {verb.phrasalVerb}
          </h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            verb.level === 'B2'
              ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
              : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          }`}>
            {verb.level}
          </span>
        </div>

        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
          {verb.translation}
        </p>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            {t('phrasalVerbs.meaning')}
          </h2>
          <p className="text-base text-gray-800 dark:text-gray-200">
            {verb.meaning}
          </p>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t('phrasalVerbs.examples')}
          </h2>
          <ul className="space-y-2">
            {verb.examples.map((ex, i) => (
              <li
                key={i}
                className="pl-3 border-l-2 border-primary-300 dark:border-primary-700
                  text-sm text-gray-700 dark:text-gray-300 italic"
              >
                "{ex}"
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Category
          </h2>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg
            bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {verb.category}
          </span>
        </section>

        {verb.collocations.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Collocations
            </h2>
            <div className="flex flex-wrap gap-2">
              {verb.collocations.map((c, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg
                    bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
