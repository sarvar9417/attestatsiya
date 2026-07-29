import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, BookOpen, Volume2, ChevronDown, ChevronUp, CheckCircle, Clock, X, BookText, Plus, Trash2, Loader2 } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { DictionarySkeleton } from '../components/ui/PageSkeleton'
import { useI18n } from '../i18n'
import Breadcrumb from '../components/ui/Breadcrumb'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { searchDictionary, fetchWordList, addUserWord, deleteUserWord, type DictWord } from '../services/dictionaryService'
import { speak } from '../lib/tts'

const LEVEL_BADGES: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-b1-100 text-b1-700',
  B2: 'bg-b2-100 text-b2-700',
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']



// ── Add Word Modal ───────────────────────────────────────────────────────────

function AddWordModal({ open, onClose, userId, onAdded }: {
  open: boolean
  onClose: () => void
  userId: string
  onAdded: () => void
}) {
  const { t } = useI18n()
  const [english, setEnglish] = useState('')
  const [uzbek, setUzbek] = useState('')
  const [level, setLevel] = useState('A2')
  const [example, setExample] = useState('')
  const [phonetic, setPhonetic] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const reset = useCallback(() => {
    setEnglish('')
    setUzbek('')
    setLevel('A2')
    setExample('')
    setPhonetic('')
    setError('')
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!english.trim()) { setError(t('dictionary.addModalRequired')); return }
    if (!uzbek.trim()) { setError(t('dictionary.addModalUzbekRequired')); return }

    setSaving(true)
    const res = await addUserWord(userId, { english, uzbek, level, example, phonetic })
    setSaving(false)

    if (res.success) {
      reset()
      onAdded()
      onClose()
    } else {
      setError(res.error ?? t('dictionary.addModalError'))
    }
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('dictionary.addModalTitle')}</h2>
          <button onClick={onClose} aria-label={t('dictionary.addModalCloseAria')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t('dictionary.addModalEnglish')}</label>
            <input
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="hello"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t('dictionary.addModalUzbek')}</label>
            <input
              value={uzbek}
              onChange={(e) => setUzbek(e.target.value)}
              placeholder="salom"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{t('dictionary.addModalLevel')}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              >
                {['A1', 'A2', 'B1', 'B2'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{t('dictionary.addModalPhonetic')}</label>
              <input
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="həˈloʊ"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t('dictionary.addModalExample')}</label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="Hello, how are you?"
              rows={2}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? t('dictionary.addModalSaving') : t('dictionary.addModalSave')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Word Card ─────────────────────────────────────────────────────────────────

function WordCard({ word, userId, onDeleted }: { word: DictWord; userId?: string | null; onDeleted?: () => void }) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const speakWord = useCallback(() => {
    speak(word.english, { rate: 0.9 }).catch(() => {})
  }, [word.english])

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId || !window.confirm(t('dictionary.deleteConfirm', { word: word.english }))) return
    setDeleting(true)
    await deleteUserWord(userId, word.word_id)
    setDeleting(false)
    onDeleted?.()
  }

  if (word.source === 'user' && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{word.english}</span>
          <span className="text-xs text-gray-400 truncate">— {word.uzbek}</span>
          <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded">{t('dictionary.userWordBadge')}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {word.phonetic && (
            <span className="text-xs text-gray-300 font-mono hidden sm:inline">/{word.phonetic}/</span>
          )}                  <span className={`badge text-xs ${LEVEL_BADGES[word.level] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{word.level}</span>
          <ChevronDown size={14} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
        </div>
      </button>
    )
  }

  return (
    <div
      className={`card transition-all duration-200 cursor-pointer ${
        expanded ? 'ring-2 ring-primary-200' : ''
      } ${word.source === 'user' ? 'border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white text-base">{word.english}</span>
            <span className={`badge text-xs ${LEVEL_BADGES[word.level] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              {word.level}
            </span>
            {word.source === 'user' && (
              <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded">{t('dictionary.userWordBadge')}</span>
            )}
            {word.box && (
              <span className={`badge text-xs ${
                word.box >= 5 ? 'bg-green-100 text-green-700' :
                word.box >= 3 ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {{1:t('dictionary.boxNew'),2:t('dictionary.boxLearning'),3:t('dictionary.boxReviewing'),4:t('dictionary.boxAlmost'),5:t('dictionary.boxLearned')}[word.box]}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{word.uzbek}</p>
          {word.phonetic && (
            <p className="text-xs text-gray-400 mt-0.5 font-mono">/{word.phonetic}/</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); speakWord() }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-600 transition-colors"
            title={t('dictionary.speakTitle')}
          >
            <Volume2 size={16} />
          </button>
          {word.is_learned && <CheckCircle size={16} className="text-green-500" />}
          {word.source === 'user' && userId && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
              title={t('dictionary.deleteTitle')}
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
          {expanded ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          {word.example && (
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{t('dictionary.exampleLabel')}</p>
              <p className="text-sm text-gray-700 italic">"{word.example}"</p>
            </div>
          )}
          {word.box !== null && (
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><Clock size={12} /> {t('dictionary.boxLabel', { box: word.box })}</span>
              <span className="flex items-center gap-1">
                <CheckCircle size={12} className={word.is_learned ? 'text-green-500' : 'text-gray-300'} />
                {word.is_learned ? t('dictionary.wordLearned') : t('dictionary.wordStudying')}
              </span>
              {word.correct_count !== null && (
                <span className="text-green-600">+{word.correct_count} / -{word.wrong_count}</span>
              )}
            </div>
          )}
          {word.source === 'user' && (
            <p className="text-xs text-blue-400 font-medium">{t('dictionary.personalWordLabel')}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Level Group ───────────────────────────────────────────────────────────────

function LevelGroup({ level, words, userId, onDeleted }: {
  level: string
  words: DictWord[]
  userId?: string | null
  onDeleted?: () => void
}) {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)

  if (words.length === 0) return null

  const countLearned = words.filter((w) => w.is_learned).length
  const countUser = words.filter((w) => w.source === 'user').length

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full mb-2 group"
      >
        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-bold ${LEVEL_BADGES[level]}`}>
          {level}
        </span>
        <span className="text-xs text-gray-400">{words.length} {t('common.words')}</span>
        {countUser > 0 && (
          <span className="text-xs text-blue-500 font-medium">({t('dictionary.yourWords', { count: countUser })})</span>
        )}
        {countLearned > 0 && (
          <span className="text-xs text-green-600 font-medium">
            ({t('dictionary.wordLearned')} {countLearned})
          </span>
        )}
        <div className="flex-1 border-t border-gray-100 dark:border-gray-700" />
        {collapsed ? <ChevronDown size={14} className="text-gray-300" /> : <ChevronUp size={14} className="text-gray-300" />}
      </button>
      {!collapsed && (
        <div className="space-y-0.5">
          {words.map((w) => (
            <WordCard key={`${w.source}-${w.word_id}`} word={w} userId={userId} onDeleted={onDeleted} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function Dictionary() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DictWord[]>([])
  const [allWords, setAllWords] = useState<DictWord[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [levelFilter, setLevelFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const levelFilterRef = useRef(levelFilter)
  levelFilterRef.current = levelFilter

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const loadAll = useCallback(async (pg: number) => {
    setLoading(true)
    const res = await fetchWordList(userId ?? undefined, levelFilterRef.current || undefined, pg, PAGE_SIZE)
    setAllWords(res.words)
    setTotalCount(res.total)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (userId === null) { setLoading(false); return }
    if (query.trim()) return
    loadAll(page)
  }, [userId, page, query, loadAll, levelFilter])

  const performSearch = useCallback(async (q: string, lvl: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setSearching(true)
    setSearched(true)
    const res = await searchDictionary(q, userId ?? undefined, lvl || undefined)
    setResults(res.words)
    setSearching(false)
  }, [userId])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(query, levelFilter)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, levelFilter, performSearch])

  const groupedByLevel = useMemo(() => {
    const source = query.trim() ? results : allWords
    const filtered = levelFilter ? source.filter((w) => w.level === levelFilter) : source
    const groups: Record<string, DictWord[]> = {}
    for (const w of filtered) {
      if (!groups[w.level]) groups[w.level] = []
      groups[w.level].push(w)
    }
    return LEVEL_ORDER.filter((l) => groups[l]).map((l) => ({ level: l, words: groups[l] }))
  }, [allWords, results, query, levelFilter])

  const displayCount = query.trim() ? results.length : allWords.length
  const countUserWords = allWords.filter((w) => w.source === 'user').length
  const totalPages = query.trim() ? 1 : Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const handleLevelFilter = (lvl: string) => {
    setLevelFilter(lvl === levelFilter ? '' : lvl)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { monitoring.captureMessage('Dictionary scrollTo failed (jsdom): ' + (e instanceof Error ? e.message : String(e)), 'warn') }
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      if (start > 2) pages.push('...')
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      <Breadcrumb items={[
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.dictionary') },
      ]} />
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <BookText size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('dictionary.title')}</h1>
          <p className="text-xs text-gray-500">{t('dictionary.subtitle')}</p>
        </div>
      </div>

      {/* Search bar + Add button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('dictionary.searchPlaceholder')}
            aria-label={t('dictionary.searchAria')}
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl
              outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label={t('dictionary.clearSearchAria')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          aria-label={t('accessibility.dict.addWord')}
          className="flex-shrink-0 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-2xl transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t('dictionary.addButton')}</span>
        </button>
      </div>

      {/* Level filter chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => handleLevelFilter('')}
          aria-label={t('accessibility.dict.filterAll')}
          aria-pressed={!levelFilter}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            !levelFilter
              ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('dictionary.filterAll')}{!query.trim() ? '' : <span className="opacity-60 ml-0.5">({displayCount})</span>}
        </button>
        {['A1', 'A2', 'B1', 'B2'].map((lvl) => {
          const total = query.trim() ? 0 : allWords.filter((w) => w.level === lvl).length
          return (
            <button
              key={lvl}
              onClick={() => handleLevelFilter(lvl)}
              aria-label={t('accessibility.dict.filterLevel', { level: lvl })}
              aria-pressed={levelFilter === lvl}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                levelFilter === lvl
                  ? `${LEVEL_BADGES[lvl]} ring-2 ring-offset-1`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lvl}{total > 0 ? <span className="opacity-60 ml-0.5">({total})</span> : ''}
            </button>
          )
        })}
      </div>

      {/* Loading */}
      {loading && <DictionarySkeleton />}

      {/* Search empty */}
      {!loading && searched && results.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={t('dictionary.noResultsTitle', { query })}
          description={t('dictionary.noResultsDesc')}
          size="sm"
        />
      )}

      {/* Searching indicator */}
      {searching && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent" />
        </div>
      )}

      {/* Results / Word list */}
      {!loading && !searching && displayCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">
              {query.trim()
                ? t('dictionary.resultCount', { count: results.length })
                : (() => {
                    const start = (page - 1) * PAGE_SIZE + 1
                    const end = Math.min(page * PAGE_SIZE, totalCount)
                    return t('dictionary.countWords', { start, end, total: totalCount }) + (countUserWords > 0 ? ` ${t('dictionary.yourWords', { count: countUserWords })}` : '')
                  })()
              }
            </p>
            {!query.trim() && (
              <p className="text-xs text-gray-300">{t('dictionary.pageLabel', { page, total: totalPages })}</p>
            )}
          </div>
          <div className="space-y-3">
            {groupedByLevel.map((g) => (
              <LevelGroup
                key={g.level}
                level={g.level}
                words={g.words}
                userId={userId}
                onDeleted={() => loadAll(page)}
              />
            ))}
          </div>

          {/* Pagination */}
          {!query.trim() && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600
                  disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ←
              </button>
              {renderPageNumbers().map((p, i) =>
                typeof p === 'string' ? (
                  <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-gray-300">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      p === page
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600
                  disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Initial empty state */}
      {!loading && !query.trim() && allWords.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <Search size={40} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">{t('dictionary.emptyTitle')}</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Plus size={16} /> {t('dictionary.emptyAddFirst')}
          </button>
        </div>
      )}

      {/* Add word modal */}
      {userId && (
        <AddWordModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          userId={userId}
          onAdded={() => loadAll(page)}
        />
      )}
    </div>
  )
}
