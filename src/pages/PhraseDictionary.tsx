import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, BookOpen, ChevronDown, ChevronUp, CheckCircle, Clock, X, MessageCircle, Volume2, Loader2 } from 'lucide-react'
import { useI18n } from '../i18n'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { getCategoryStyle } from '../utils/phraseConfig'
import { speak } from '../lib/tts'

interface PhraseRow {
  id: number
  english: string
  uzbek: string
  level: string
  category: string
}

interface PhraseProgress {
  phrase_id: number
  box: number
  is_learned: boolean
  correct_count: number
  wrong_count: number
  last_rating: string | null
}

interface PhraseDictEntry {
  phrase: PhraseRow
  progress: PhraseProgress | null
}

const LEVEL_BADGES: Record<string, string> = {
  A1: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  A2: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
  B1: 'bg-b1-100 dark:bg-b1-900/40 text-b1-700 dark:text-b1-300',
  B2: 'bg-b2-100 dark:bg-b2-900/40 text-b2-700 dark:text-b2-300',
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']

function catBadge(cat: string) {
  const s = getCategoryStyle(cat)
  return `${s.bg} ${s.text}`
}
function catLabel(cat: string) {
  return getCategoryStyle(cat).label
}

const PAGE_SIZE = 20

interface Meta {
  levels: Record<string, number>
  categories: Record<string, number>
  totalLearned: number
  totalStudied: number
}

// ─── Asosiy komponent ──────────────────────────────────────────────────────
export default function PhraseDictionary() {
  const { t } = useI18n()
  const [query, setQuery]               = useState('')
  const [debouncedQuery, setDebounced]  = useState('')
  const [levelFilter, setLevelFilter]   = useState('')
  const [categoryFilter, setCatFilter]  = useState('')
  const [page, setPage]                 = useState(1)

  const [entries, setEntries]           = useState<PhraseDictEntry[]>([])
  const [totalCount, setTotalCount]     = useState(0)
  const [loading, setLoading]           = useState(false)
  const [meta, setMeta]                 = useState<Meta>({ levels: {}, categories: {}, totalLearned: 0, totalStudied: 0 })

  const inputRef = useRef<HTMLInputElement>(null)
  const uidRef   = useRef<string | null>(null)

  // ── debounce search input (300ms) ────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  // ── Meta: level/category counts — bir marta yuklanadi ───────────────────
  useEffect(() => {
    async function loadMeta() {
      const { data: { session } } = await supabase.auth.getSession()
      uidRef.current = session?.user?.id ?? null

      // Level counts (RPC)
      const { data: lvlRows } = await supabase.rpc('get_phrase_counts_by_level')
      const levels: Record<string, number> = {}
      for (const r of lvlRows ?? []) levels[r.level] = Number(r.total)

      // Category counts (faqat category ustuni — kichik payload)
      const { data: catRows } = await supabase.from('phrases').select('category').limit(2000)
      const categories: Record<string, number> = {}
      for (const r of catRows ?? []) categories[r.category] = (categories[r.category] || 0) + 1

      // Progress stats
      let totalStudied = 0, totalLearned = 0
      const uid = uidRef.current
      if (uid) {
        const [s, l] = await Promise.all([
          supabase.from('phrase_progress').select('id', { count: 'exact', head: true }).eq('user_id', uid),
          supabase.from('phrase_progress').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('is_learned', true),
        ])
        totalStudied = s.count ?? 0
        totalLearned = l.count ?? 0
      }

      setMeta({ levels, categories, totalLearned, totalStudied })
    }
    loadMeta()
  }, [])

  // ── Filter/qidiruv o'zgarganda page=1 ga qaytarish ──────────────────────
  useEffect(() => { setPage(1) }, [debouncedQuery, levelFilter, categoryFilter])

  // ── Server-side pagination: har page/filter o'zgarganda 20 ta yuklash ───
  const loadPage = useCallback(async (
    pg: number, lvl: string, cat: string, q: string
  ) => {
    setLoading(true)

    let dbq = supabase
      .from('phrases')
      .select('id, english, uzbek, level, category', { count: 'exact' })

    if (q.trim()) {
      const safe = q.trim().replace(/[%_]/g, '\\$&')
      dbq = dbq.or(`english.ilike.%${safe}%,uzbek.ilike.%${safe}%`)
    }
    if (lvl) dbq = dbq.eq('level', lvl)
    if (cat) dbq = dbq.eq('category', cat)

    const from = (pg - 1) * PAGE_SIZE
    dbq = dbq.order('level').order('id').range(from, from + PAGE_SIZE - 1)

    const { data: phrases, count, error } = await dbq
    if (error) { monitoring.captureMessage('PhraseDictionary fetch error: ' + error.message, 'error'); setLoading(false); return }

    setTotalCount(count ?? 0)

    // Progress faqat shu 20 ta uchun
    const ids = (phrases ?? []).map(p => p.id)
    const progressMap = new Map<number, PhraseProgress>()
    const uid = uidRef.current
    if (uid && ids.length > 0) {
      const { data: prog } = await supabase
        .from('phrase_progress')
        .select('phrase_id, box, is_learned, correct_count, wrong_count, last_rating')
        .eq('user_id', uid)
        .in('phrase_id', ids)
      for (const p of prog ?? []) progressMap.set(p.phrase_id, p)
    }

    setEntries((phrases ?? []).map(p => ({ phrase: p, progress: progressMap.get(p.id) ?? null })))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPage(page, levelFilter, categoryFilter, debouncedQuery)
  }, [page, levelFilter, categoryFilter, debouncedQuery, loadPage])

  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const totalAll    = Object.values(meta.levels).reduce((a, b) => a + b, 0)
  const categories  = Object.keys(meta.categories).sort()

  function handlePageChange(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { monitoring.captureMessage('PhraseDictionary scrollTo failed (jsdom): ' + (e instanceof Error ? e.message : String(e)), 'warn') }
  }

  // ── grouped by level (faqat joriy 20 ta gap ichidan) ────────────────────
  const grouped = (() => {
    const g: Record<string, PhraseDictEntry[]> = {}
    for (const e of entries) {
      if (!g[e.phrase.level]) g[e.phrase.level] = []
      g[e.phrase.level].push(e)
    }
    return LEVEL_ORDER.filter(l => g[l]).map(l => ({ level: l, entries: g[l] }))
  })()

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-b1-100 dark:bg-b1-900/40 rounded-xl flex items-center justify-center">
          <MessageCircle size={20} className="text-b1-600 dark:text-b1-400" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('phraseDict.title')}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('phraseDict.subtitle')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 dark:text-gray-500">
        <span>{t('phraseDict.totalLabel', { count: totalAll })}</span>
        {meta.totalStudied > 0 && (
          <>
            <span>{t('phraseDict.learnedLabel', { count: meta.totalLearned })}</span>
            <span>{t('phraseDict.startedLabel', { count: meta.totalStudied })}</span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('phraseDict.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-b1-400 focus:ring-2 focus:ring-b1-100 dark:focus:ring-b1-900/40 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide flex-wrap">
        {[{ key: '', label: t('phraseDict.filterAll', { count: totalAll }) }, ...LEVEL_ORDER.map(l => ({ key: l, label: `${l} (${meta.levels[l] ?? 0})` }))].map(({ key, label }) => (
          <button key={key} onClick={() => setLevelFilter(key === levelFilter ? '' : key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              levelFilter === key
                ? key ? `${LEVEL_BADGES[key]} ring-2 ring-offset-1 dark:ring-offset-gray-900` : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide flex-wrap">
          <button onClick={() => setCatFilter('')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              !categoryFilter ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {t('phraseDict.filterAll')}
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat === categoryFilter ? '' : cat)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat ? `${catBadge(cat)} ring-2 ring-offset-1 dark:ring-offset-gray-900`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {catLabel(cat)} ({meta.categories[cat] ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 size={24} className="animate-spin text-b1-500" />
        </div>
      )}

      {/* Empty state */}
      {!loading && totalCount === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <BookOpen size={40} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {debouncedQuery ? t('phraseDict.emptyNoResults', { query: debouncedQuery }) : t('phraseDict.emptyTitle')}
          </p>
          {(debouncedQuery || levelFilter || categoryFilter) && (
            <button onClick={() => { setQuery(''); setLevelFilter(''); setCatFilter('') }}
              className="mt-2 text-xs text-b1-500 font-semibold hover:underline">
              {t('phraseDict.filterClear')}
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {!loading && totalCount > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('phraseDict.countResult', { start: (page - 1) * PAGE_SIZE + 1, end: Math.min(page * PAGE_SIZE, totalCount), total: totalCount })}
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600">{t('phraseDict.pageLabel', { page, total: totalPages })}</p>
          </div>

          <div className="space-y-3">
            {grouped.map(g => <LevelGroup key={g.level} level={g.level} entries={g.entries} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                ←
              </button>
              {renderPageNumbers(page, totalPages).map((p, i) =>
                typeof p === 'string' ? (
                  <span key={`e-${i}`} className="px-1.5 text-xs text-gray-300 dark:text-gray-600">...</span>
                ) : (
                  <button key={p} onClick={() => handlePageChange(p)}
                    className={`min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      p === page ? 'bg-b1-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function renderPageNumbers(page: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    const start = Math.max(2, page - 1)
    const end   = Math.min(totalPages - 1, page + 1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }
  return pages
}

// ─── LevelGroup ────────────────────────────────────────────────────────────
function LevelGroup({ level, entries }: { level: string; entries: PhraseDictEntry[] }) {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  if (!entries.length) return null
  const learned = entries.filter(e => e.progress?.is_learned).length

  return (
    <div>
      <button onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full mb-2">
        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-bold ${LEVEL_BADGES[level]}`}>
          {level}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{t('phraseDict.countResult', { start: 1, end: entries.length, total: entries.length })}</span>
        {learned > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            ({learned} {t('phraseDict.yodlangan')})
          </span>
        )}
        <div className="flex-1 border-t border-gray-100 dark:border-gray-700" />
        {collapsed
          ? <ChevronDown size={14} className="text-gray-300 dark:text-gray-600" />
          : <ChevronUp size={14} className="text-gray-300 dark:text-gray-600" />}
      </button>
      {!collapsed && (
        <div className="space-y-0.5">
          {entries.map(e => <PhraseCard key={e.phrase.id} entry={e} />)}
        </div>
      )}
    </div>
  )
}

// ─── PhraseCard ────────────────────────────────────────────────────────────
function PhraseCard({ entry }: { entry: PhraseDictEntry }) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const { phrase, progress } = entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boxTranslation = progress ? t(`phraseDict.box${progress.box}` as any) ?? t('phraseDict.box6') : ''

  function speakPhrase(e: React.MouseEvent) {
    e.stopPropagation()
    speak(phrase.english, { rate: 0.9 }).catch(() => {})
  }

  return (
    <div
      className={`card transition-all duration-200 cursor-pointer ${expanded ? 'ring-2 ring-b1-200 dark:ring-b1-700' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-base line-clamp-2">{phrase.english}</span>
            <span className={`badge text-xs ${LEVEL_BADGES[phrase.level]}`}>{phrase.level}</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${catBadge(phrase.category)}`}>
              {catLabel(phrase.category)}
            </span>
            {progress && (
              <span className={`badge text-xs ${
                progress.is_learned
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : progress.box >= 3
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {progress.is_learned ? t('phraseDict.yodlangan') : `${t('phraseDict.box')} ${progress.box}`}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{phrase.uzbek}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={speakPhrase}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-b1-600 dark:hover:text-b1-400 transition-colors"
            title={t('phraseDict.speakTitle')}>
            <Volume2 size={16} />
          </button>
          {progress?.is_learned && <CheckCircle size={16} className="text-green-500" />}
          {expanded
            ? <ChevronUp size={16} className="text-gray-300 dark:text-gray-600" />
            : <ChevronDown size={16} className="text-gray-300 dark:text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {progress ? (
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {t('phraseDict.box')} {progress.box}/6 · {boxTranslation}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={12} className={progress.is_learned ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} />
                {progress.is_learned ? t('phraseDict.yodlangan') : t('phraseDict.learning')}
              </span>
              {(progress.correct_count > 0 || progress.wrong_count > 0) && (
                <span className="text-green-600 dark:text-green-400">
                  +{progress.correct_count} / -{progress.wrong_count}
                </span>
              )}
              {progress.last_rating != null && (
                <span className="text-gray-400 dark:text-gray-500">{t('phraseDict.lastRating', { rating: progress.last_rating })}</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500">{t('phraseDict.notStudied')}</p>
          )}
        </div>
      )}
    </div>
  )
}
