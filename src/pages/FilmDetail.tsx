import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { monitoring } from '../lib/monitoring'
import {
  ArrowLeft, Search, BookOpen, Shuffle, CheckCircle,
  XCircle, Volume2, ChevronLeft, ChevronRight, RotateCcw,
  X, Target, Film, Volume,
  Eye, EyeOff, Zap, TrendingUp, Clock, BarChart3,
} from 'lucide-react'
import { getFilmById, type FilmWord } from '../data/filmVocabulary'
import { speak as ttsSpeak } from '../lib/tts'
import { useSwipe } from '../hooks/useSwipe'

const PAGE_SIZE = 20

const LEVEL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'A1': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'A2': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  'B1': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  'B1+': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  'B2': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
}

function speak(text: string) {
  ttsSpeak(text, { rate: 0.9, lang: 'en-US' })
}

type PracticeMode = 'list' | 'flashcard' | 'quiz'
type QuizDirection = 'en-uz' | 'uz-en'

export default function FilmDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const film = getFilmById(id ?? '')

  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('list')
  const [page, setPage] = useState(1)
  const [knownFilter, setKnownFilter] = useState<'all' | 'known' | 'unknown'>('all')
  const [sortOrder, setSortOrder] = useState<'default' | 'alpha' | 'level'>('default')
  const [knownWords, setKnownWords] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`film_known_${id}`)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { 
      monitoring.captureMessage('FilmDetail: failed to load known words', 'warn')
      return new Set() 
    }
  })

  useEffect(() => {
    localStorage.setItem(`film_known_${id}`, JSON.stringify([...knownWords]))
  }, [knownWords, id])

  const toggleKnown = useCallback((word: string) => {
    setKnownWords(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }, [])

  // Save last viewed timestamp for FilmHub
  useEffect(() => {
    if (id) {
      localStorage.setItem(`film_lastviewed_${id}`, String(Date.now()))
    }
  }, [id])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = (film?.words ?? []).filter((w) => {
      if (levelFilter !== 'all' && w.level !== levelFilter) return false
      if (knownFilter === 'known' && !knownWords.has(w.word)) return false
      if (knownFilter === 'unknown' && knownWords.has(w.word)) return false
      if (!q) return true
      return (
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.example.toLowerCase().includes(q)
      )
    })
    // Sort
    if (sortOrder === 'alpha') {
      result = [...result].sort((a, b) => a.word.localeCompare(b.word))
    } else if (sortOrder === 'level') {
      result = [...result].sort((a, b) => a.level.localeCompare(b.level))
    }
    return result
  }, [film?.words, query, levelFilter, knownFilter, sortOrder, knownWords])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const levels = useMemo(() => {
    return Array.from(new Set((film?.words ?? []).map(w => w.level))).sort()
  }, [film?.words])

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ;(film?.words ?? []).forEach(w => { counts[w.level] = (counts[w.level] || 0) + 1 })
    return counts
  }, [film?.words])

  const knownCount = knownWords.size

  if (!film) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Film size={28} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Film topilmadi</p>
        <button onClick={() => navigate('/films')}
          className="btn-primary text-sm">
          Filmlar ro'yxatiga qaytish
        </button>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-5 sm:p-6 text-white animate-fade-in">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-2 -right-2 text-7xl rotate-12">{film.posterEmoji}</div>
          <div className="absolute bottom-0 left-4 text-5xl -rotate-6">📚</div>
        </div>
        <div className="relative z-10">
          <button onClick={() => navigate('/films')}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-3 transition-colors">
            <ArrowLeft size={16} />
            Filmlar
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
              {film.posterEmoji}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">{film.title}</h1>
              <p className="text-xs text-white/60 mt-0.5">
                {film.titleUz} · {film.year} · {film.genre}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">{film.descriptionUz}</p>

          {/* Stats row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <BookOpen size={12} /> {film.words.length} so'z
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <CheckCircle size={12} /> {knownCount} o'rganilgan
            </span>
            {Object.entries(levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
              <span key={lv} className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold
                ${LEVEL_COLORS[lv]?.bg || 'bg-gray-100'} ${LEVEL_COLORS[lv]?.text || 'text-gray-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_COLORS[lv]?.dot || 'bg-gray-400'}`} />
                {lv}: {count}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          {knownCount > 0 && (
            <div className="mt-3">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((knownCount / film.words.length) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-slide-up" style={{ animationDelay: '60ms' }}>
        {([
          { id: 'list' as PracticeMode, label: "So'zlar", icon: BookOpen, count: film.words.length },
          { id: 'flashcard' as PracticeMode, label: 'Flashcard', icon: Shuffle, count: null },
          { id: 'quiz' as PracticeMode, label: 'Test', icon: Target, count: null },
        ]).map(({ id: mode, label, icon: Icon, count }) => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200
              ${practiceMode === mode
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            {count !== null && (
              <span className="text-[10px] opacity-60">({count})</span>
            )}
          </button>
        ))}
      </div>

      {/* List Mode */}
      {practiceMode === 'list' && (
        <div className="animate-fade-in">
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="So'z qidirish..."
              className="input pl-10 pr-10"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => { setLevelFilter('all'); setPage(1) }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${levelFilter === 'all'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
            >
              Barchasi ({film.words.length})
            </button>
            {levels.map((lv) => {
              const colors = LEVEL_COLORS[lv] || { bg: '', text: '', dot: '' }
              return (
                <button
                  key={lv}
                  onClick={() => { setLevelFilter(lv); setPage(1) }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${levelFilter === lv
                      ? `${colors.bg} ${colors.text} border-current`
                      : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                >
                  {lv} ({film.words.filter(w => w.level === lv).length})
                </button>
              )
            })}
          </div>

          {/* Known/Unknown filter + Sort */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
            {([
              { value: 'all' as const, label: "Barchasi" },
              { value: 'known' as const, label: "Bilaman", icon: CheckCircle },
              { value: 'unknown' as const, label: "Bilmiman", icon: XCircle },
            ]).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => { setKnownFilter(value); setPage(1) }}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
                  ${knownFilter === value
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {Icon && <Icon size={11} />}
                {label}
              </button>
            ))}
            <span className="text-[10px] text-gray-300 mx-1">|</span>
            {([
              { value: 'default' as const, label: "Standart" },
              { value: 'alpha' as const, label: "A-Z" },
              { value: 'level' as const, label: "Level" },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setSortOrder(value); setPage(1) }}
                className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-medium transition-all
                  ${sortOrder === value
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-400'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <WordList
            words={paginated}
            totalCount={filtered.length}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            knownWords={knownWords}
            onToggleKnown={toggleKnown}
          />
        </div>
      )}

      {practiceMode === 'flashcard' && (
        <FlashcardMode
          words={film.words}
          onToggleKnown={toggleKnown}
          knownWords={knownWords}
        />
      )}

      {practiceMode === 'quiz' && (
        <QuizMode words={film.words} filmId={film.id} />
      )}
    </div>
  )
}

/* ─── Word List ────────────────────────────────────────────────────────────── */

function WordList({
  words, totalCount, page, totalPages, onPageChange, knownWords, onToggleKnown,
}: {
  words: FilmWord[]
  totalCount: number
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  knownWords: Set<string>
  onToggleKnown: (word: string) => void
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [batchMode, setBatchMode] = useState(false)

  const toggleSelect = (word: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const markSelectedAsKnown = () => {
    selected.forEach(w => onToggleKnown(w))
    setSelected(new Set())
    setBatchMode(false)
  }

  if (words.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">So'z topilmadi</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Boshqa so'z bilan qidirib ko'ring</p>
      </div>
    )
  }

  return (
    <>
      {/* Batch mode toggle */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => { setBatchMode(!batchMode); setSelected(new Set()) }}
          className={`text-xs font-semibold flex items-center gap-1 transition-colors
            ${batchMode ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <CheckCircle size={12} />
          {batchMode ? 'Bekor qilish' : "Bir nechtasini belgilash"}
        </button>
        {batchMode && selected.size > 0 && (
          <button
            onClick={markSelectedAsKnown}
            className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            <Eye size={12} />
            {selected.size} ta so'zni o'rganilgan deb belgilash
          </button>
        )}
      </div>

      <div className="space-y-1.5 animate-stagger">
        {words.map((word, idx) => {
          const isKnown = knownWords.has(word.word)
          const isSelected = selected.has(word.word)
          const colors = LEVEL_COLORS[word.level] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
          return (
            <div
              key={`${word.word}-${page}-${idx}`}
              className={`rounded-xl border overflow-hidden transition-all duration-200
                ${isKnown
                  ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                }
                ${isSelected ? 'ring-2 ring-primary-400 dark:ring-primary-600' : ''}`}
            >
              <div className="flex items-center gap-2 p-3">
                {batchMode && (
                  <button
                    onClick={() => toggleSelect(word.word)}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                      ${isSelected
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                      }`}
                  >
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                )}
                <button
                  onClick={() => batchMode ? toggleSelect(word.word) : setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isKnown ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {word.word}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                      {word.level}
                    </span>
                    {isKnown && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                  </div>
                  <p className={`text-sm mt-0.5 ${isKnown ? 'text-emerald-600/70 dark:text-emerald-400/60' : 'text-primary-600 dark:text-primary-400'}`}>
                    {word.translation}
                  </p>
                </button>
                {!batchMode && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleKnown(word.word) }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200
                        ${isKnown
                          ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                          : 'text-gray-300 dark:text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        }`}
                      title={isKnown ? "O'rganilmagan deb belgilash" : "O'rganilgan deb belgilash"}
                    >
                      {isKnown ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(word.word) }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600
                        hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shrink-0"
                      title="Eshitish"
                    >
                      <Volume2 size={15} />
                    </button>
                  </>
                )}
              </div>

              {expandedIdx === idx && !batchMode && (
                <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                  <div className="mt-2.5 space-y-2">
                    <p className="text-xs text-gray-400 font-mono">{word.phonetic}</p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Misol</p>
                        <button
                          onClick={() => speak(word.example)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Volume size={10} />
                          Eshitish
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{word.example}"
                      </p>
                      {word.exampleUz && (
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-1.5 leading-relaxed">
                          "{word.exampleUz}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 tabular-nums">
            {totalCount} ta so'z · {page}/{totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200
                    ${page === pageNum
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Flashcard Mode (with 3D flip + swipe) ──────────────────────────────────── */

function FlashcardMode({
  words,
  onToggleKnown,
  knownWords,
}: {
  words: FilmWord[]
  onToggleKnown: (word: string) => void
  knownWords: Set<string>
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState<FilmWord[]>(() => shuffleArray([...words]))
  const [sessionKnown, setSessionKnown] = useState<Set<number>>(new Set())
  const [sessionUnknown, setSessionUnknown] = useState<Set<number>>(new Set())
  const [sessionStart] = useState(Date.now())
  const [showStats, setShowStats] = useState(false)

  const current = shuffled[currentIdx]
  const progress = shuffled.length > 0 ? ((currentIdx + 1) / shuffled.length) * 100 : 0

  // Auto-speak when card shows (front)
  useEffect(() => {
    if (current && !flipped) {
      speak(current.word)
    }
  }, [currentIdx, flipped])

  // Swipe gesture
  const [bind, { offsetX, isDragging }] = useSwipe({
    onSwipeLeft: () => { markUnknown(); return true },
    onSwipeRight: () => { markKnown(); return true },
    onTap: () => {
      if (!flipped) speak(current.word)
      else speak(current.example)
      setFlipped(f => !f)
    },
  })

  const next = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const n = (i + 1) % shuffled.length
      return n
    })
  }, [shuffled.length])

  const prev = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const p = (i - 1 + shuffled.length) % shuffled.length
      return p
    })
  }, [shuffled.length])

  const reshuffle = useCallback(() => {
    setShuffled(shuffleArray([...words]))
    setCurrentIdx(0)
    setFlipped(false)
    setSessionKnown(new Set())
    setSessionUnknown(new Set())
    setShowStats(false)
  }, [words])

  const markKnown = useCallback(() => {
    if (shuffled[currentIdx]) {
      setSessionKnown(prev => new Set(prev).add(currentIdx))
      if (!knownWords.has(shuffled[currentIdx].word)) {
        onToggleKnown(shuffled[currentIdx].word)
      }
      next()
    }
  }, [currentIdx, next, shuffled, onToggleKnown, knownWords])

  const markUnknown = useCallback(() => {
    if (shuffled[currentIdx]) {
      setSessionUnknown(prev => new Set(prev).add(currentIdx))
      if (knownWords.has(shuffled[currentIdx].word)) {
        onToggleKnown(shuffled[currentIdx].word)
      }
      next()
    }
  }, [currentIdx, next, shuffled, onToggleKnown, knownWords])

  const goToMistakes = useCallback(() => {
    const wrongWords = [...sessionUnknown].map(i => shuffled[i])
    if (wrongWords.length === 0) return
    setShuffled(shuffleArray(wrongWords))
    setCurrentIdx(0)
    setFlipped(false)
    setSessionKnown(new Set())
    setSessionUnknown(new Set())
  }, [sessionUnknown, shuffled])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
      else if (e.key === '1') markUnknown()
      else if (e.key === '2') markKnown()
      else if (e.key === 's') setShowStats(s => !s)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, markKnown, markUnknown])

  if (shuffled.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <Shuffle size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">So'zlar topilmadi</p>
      </div>
    )
  }

  const colors = LEVEL_COLORS[current.level] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  const isCurrentKnown = knownWords.has(current.word)
  const sessionTime = Math.floor((Date.now() - sessionStart) / 1000)
  const sessionMinutes = Math.floor(sessionTime / 60)
  const sessionSeconds = sessionTime % 60

  // Swipe visual feedback
  const swipeRotation = offsetX * 0.05
  const swipeOverlayOpacity = Math.min(Math.abs(offsetX) / 200, 0.3)
  const swipeColor = offsetX > 0 ? 'rgba(34,197,94,' : 'rgba(239,68,68,'

  return (
    <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
      {/* Progress bar + Stats */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {currentIdx + 1} / {shuffled.length}
          </span>
          <div className="flex items-center gap-2">
            {sessionKnown.size > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500">
                <CheckCircle size={10} /> {sessionKnown.size}
              </span>
            )}
            {sessionUnknown.size > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-red-500">
                <XCircle size={10} /> {sessionUnknown.size}
              </span>
            )}
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <BarChart3 size={12} />
            </button>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Session Stats */}
      {showStats && (
        <div className="w-full max-w-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {sessionMinutes}:{sessionSeconds.toString().padStart(2, '0')}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={11} />
              {shuffled.length} ta so'z
            </span>
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle size={11} />
              {sessionKnown.size}
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <XCircle size={11} />
              {sessionUnknown.size}
            </span>
          </div>
          {sessionUnknown.size > 0 && (
            <button
              onClick={goToMistakes}
              className="mt-2 w-full py-1.5 rounded-lg text-[11px] font-semibold
                bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <RotateCcw size={11} className="inline mr-1" />
              Xatolarni takrorlash ({sessionUnknown.size})
            </button>
          )}
        </div>
      )}

      {/* Card with 3D flip + Swipe */}
      <div
        className="flashcard-scene w-full max-w-sm select-none"
        {...bind}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className={`flashcard-inner ${flipped ? 'is-flipped' : ''}`}
          style={{
            transform: isDragging
              ? `translateX(${offsetX}px) rotate(${swipeRotation}deg)`
              : undefined,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {/* Front face */}
          <div className="flashcard-face is-front">
            <div className="w-full h-full rounded-2xl border-2 border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center justify-center p-6">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold mb-4 ${colors.bg} ${colors.text}`}>
                {current.level}
              </span>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {current.word}
              </p>
              <p className="text-sm text-gray-400 font-mono">{current.phonetic}</p>
              <p className="text-xs text-primary-500 mt-4 flex items-center gap-1">
                <Zap size={12} />
                Ko'rish uchun bosing yoki Space
              </p>
            </div>
            {/* Swipe overlay */}
            {isDragging && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity"
                style={{
                  background: `${swipeColor}${swipeOverlayOpacity})`,
                }}
              />
            )}
          </div>

          {/* Back face */}
          <div className="flashcard-face is-back">
            <div className="w-full h-full rounded-2xl border-2 border-primary-200 dark:border-primary-800
              bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center justify-center p-6 overflow-y-auto">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold mb-3 ${colors.bg} ${colors.text}`}>
                {current.level}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">
                {current.translation}
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 max-w-full w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic leading-relaxed">
                  "{current.example}"
                </p>
                {current.exampleUz && (
                  <p className="text-sm text-primary-500 dark:text-primary-400 text-center mt-2 leading-relaxed">
                    "{current.exampleUz}"
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 font-mono">{current.phonetic}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Speaker buttons under card */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => speak(current.word)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
            bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
            hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors active:scale-95"
        >
          <Volume2 size={13} />
          So'z
        </button>
        <button
          onClick={() => speak(current.example)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
            bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400
            hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors active:scale-95"
        >
          <Volume size={13} />
          Misol
        </button>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold
          ${isCurrentKnown
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
          {isCurrentKnown ? <Eye size={11} /> : <EyeOff size={11} />}
          {isCurrentKnown ? "Bilaman" : "Bilmiman"}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={prev}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <button onClick={markUnknown}
          className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center
            text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors active:scale-95"
          title="Bilmiman (1)">
          <XCircle size={20} />
        </button>
        <button onClick={reshuffle}
          className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center
            text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors active:scale-95">
          <RotateCcw size={18} />
        </button>
        <button onClick={() => goToMistakes()}
          disabled={sessionUnknown.size === 0}
          className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center
            text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
          title="Xatolarni takrorlash">
          <Target size={18} />
        </button>
        <button onClick={markKnown}
          className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center
            text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors active:scale-95"
          title="Bilaman (2)">
          <CheckCircle size={20} />
        </button>
        <button onClick={next}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
        ← → harakat · Space aylantirish · 1 bilmiman · 2 bilaman · S statsiya · Surish bilan ham
      </p>
    </div>
  )
}

/* ─── Quiz Mode (with review mistakes) ──────────────────────────────────────── */

const QUIZ_SIZES = [10, 20, 30] as const

interface QuizAttempt {
  word: string
  correct: boolean
  selected: string
  correctAnswer: string
}

function QuizMode({ words, filmId }: { words: FilmWord[]; filmId: string }) {
  const [direction, setDirection] = useState<QuizDirection>('en-uz')
  const [quizSize, setQuizSize] = useState(10)
  const [quizWords, setQuizWords] = useState<FilmWord[]>(() => shuffleArray([...words]).slice(0, quizSize))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [reviewMode, setReviewMode] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = quizWords[currentIdx]

  const options = useMemo(() => {
    if (!current) return []
    const correct = direction === 'en-uz' ? current.translation : current.word
    const others = words
      .filter((w) => w.word !== current.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => direction === 'en-uz' ? w.translation : w.word)
    return shuffleArray([correct, ...others])
  }, [current, direction, words])

  // Timer per question - track expiry in a ref to avoid side effects in state updater
  const timeoutTriggeredRef = useRef(false)

  useEffect(() => {
    if (answered || finished || reviewMode) return
    setTimeLeft(15)
    timeoutTriggeredRef.current = false
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIdx, answered, finished, reviewMode])

  // Handle timeout separately to keep state updater pure
  useEffect(() => {
    if (timeLeft === 0 && !answered && !finished && !timeoutTriggeredRef.current) {
      timeoutTriggeredRef.current = true
      handleAnswer('__timeout__')
    }
  }, [timeLeft, answered, finished])

  const handleAnswer = (opt: string) => {
    if (answered) return
    if (timerRef.current) clearInterval(timerRef.current)
    setAnswered(true)
    setSelectedOpt(opt)
    const correct = direction === 'en-uz' ? current.translation : current.word
    const isCorrect = opt === correct
    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak(s => s + 1)
      setBestStreak(prev => Math.max(prev, streak + 1))
      speak(current.word)
    } else {
      setStreak(0)
    }
    setAttempts(prev => [...prev, {
      word: current.word,
      correct: isCorrect,
      selected: opt,
      correctAnswer: correct,
    }])
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizWords.length) {
      setFinished(true)
      saveQuizResult(score, quizWords.length, bestStreak)
    } else {
      setCurrentIdx((i) => i + 1)
      setAnswered(false)
      setSelectedOpt(null)
      setTimeLeft(15)
    }
  }

  const saveQuizResult = (finalScore: number, finalTotal: number, finalStreak: number) => {
    try {
      const history = JSON.parse(localStorage.getItem(`film_quiz_history_${filmId}`) || '[]')
      history.push({
        score: finalScore,
        total: finalTotal,
        date: new Date().toISOString(),
        streak: finalStreak,
      })
      if (history.length > 20) history.shift()
      localStorage.setItem(`film_quiz_history_${filmId}`, JSON.stringify(history))
    } catch { 
      monitoring.captureMessage('FilmDetail: failed to save quiz history', 'warn')
    }
  }

  const restart = (size?: number, mistakesOnly?: boolean) => {
    const s = size ?? quizSize
    setQuizSize(s)
    let newWords: FilmWord[]
    if (mistakesOnly) {
      const wrongWords = attempts.filter(a => !a.correct).map(a => words.find(w => w.word === a.word)).filter(Boolean) as FilmWord[]
      if (wrongWords.length === 0) return
      newWords = shuffleArray(wrongWords)
    } else {
      newWords = shuffleArray([...words]).slice(0, s)
    }
    setQuizWords(newWords)
    setCurrentIdx(0)
    setScore(0)
    setAnswered(false)
    setSelectedOpt(null)
    setFinished(false)
    setStreak(0)
    setBestStreak(0)
    setAttempts([])
    setReviewMode(!!mistakesOnly)
    if (newWords[0]) speak(newWords[0].word)
  }

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finished) return
      if (answered) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextQuestion() }
        return
      }
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 }
      const idx = keyMap[e.key]
      if (idx !== undefined && idx < options.length) {
        e.preventDefault()
        handleAnswer(options[idx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  if (quizWords.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <Target size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">So'zlar yetarli emas</p>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / quizWords.length) * 100)
    const wrongCount = quizWords.length - score
    const wrongWords = attempts.filter(a => !a.correct)

    const getEmoji = () => {
      if (pct >= 100) return '🏆'
      if (pct >= 90) return '🎯'
      if (pct >= 70) return '🌟'
      if (pct >= 50) return '📝'
      return '💪'
    }

    const getMessage = () => {
      if (pct >= 100) return 'Mukammal! Barchasini to\'g\'ri topdingiz!'
      if (pct >= 90) return 'Ajoyib natija! Zo\'r!'
      if (pct >= 70) return 'Juda yaxshi! Davom eting!'
      if (pct >= 50) return 'Yaxshi harakat! Yana sinab ko\'ring!'
      if (pct >= 30) return 'O\'rtacha. Ko\'proq mashq qiling!'
      return 'Qaytadan urinib ko\'ring!'
    }

    return (
      <div className="text-center py-8 animate-fade-in">
        {/* Confetti-like celebration for high scores */}
        {pct >= 90 && (
          <div className="relative">
            <div className="text-6xl mb-4 animate-pop-in">{getEmoji()}</div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-star-confetti" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute top-0 left-1/3 text-xl animate-emoji-confetti" style={{ animationDelay: '0.4s' }}>🎉</div>
            <div className="absolute top-2 right-1/3 text-xl animate-emoji-confetti" style={{ animationDelay: '0.6s' }}>🎊</div>
          </div>
        )}
        {pct < 90 && (
          <div className="text-6xl mb-4 animate-pop-in">{getEmoji()}</div>
        )}

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {score} / {quizWords.length}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {getMessage()}
        </p>

        <div className="flex items-center justify-center gap-4 sm:gap-6 my-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 animate-count-up">{score}</p>
            <p className="text-[10px] text-gray-400 font-medium">To'g'ri</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500 dark:text-red-400 animate-count-up" style={{ animationDelay: '0.1s' }}>{wrongCount}</p>
            <p className="text-[10px] text-gray-400 font-medium">Noto'g'ri</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 animate-count-up" style={{ animationDelay: '0.2s' }}>{pct}%</p>
            <p className="text-[10px] text-gray-400 font-medium">Foiz</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 animate-count-up" style={{ animationDelay: '0.3s' }}>{bestStreak}</p>
            <p className="text-[10px] text-gray-400 font-medium">Streak</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => restart()}
              className="btn-primary text-sm">
              Qaytadan
            </button>
            <button onClick={() => restart(quizSize, true)}
              disabled={wrongWords.length === 0}
              className={`text-sm px-5 py-2.5 rounded-xl font-semibold transition-all
                ${wrongWords.length > 0
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}>
              <RotateCcw size={14} className="inline mr-1" />
              Xatolarni takrorlash ({wrongWords.length})
            </button>
          </div>

          {/* Wrong words list */}
          {wrongWords.length > 0 && (
            <div className="w-full max-w-sm mt-3 animate-fade-in">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-left">Xatolar:</p>
              <div className="space-y-1">
                {wrongWords.map((a, i) => {
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-left">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-24 truncate">{a.word}</span>
                      <span className="text-[10px] text-red-500 line-through truncate">{a.selected === '__timeout__' ? '(vaqt tugadi)' : a.selected}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">→ {a.correctAnswer}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quiz history */}
          <div className="w-full max-w-sm mt-2">
            <QuizHistory filmId={filmId} />
          </div>
        </div>
      </div>
    )
  }

  const questionText = direction === 'en-uz' ? current.word : current.translation
  const correctAnswer = direction === 'en-uz' ? current.translation : current.word

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      {/* Direction toggle + Streak + Timer */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => { setDirection('en-uz'); if (!reviewMode) restart() }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
              ${direction === 'en-uz'
                ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            EN → UZ
          </button>
          <button
            onClick={() => { setDirection('uz-en'); if (!reviewMode) restart() }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
              ${direction === 'uz-en'
                ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            UZ → EN
          </button>
        </div>
        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 animate-combo-pop">
            <Zap size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
          </div>
        )}
        {timeLeft !== null && !answered && (
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs
            ${timeLeft <= 5
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
            <Clock size={12} />
            {timeLeft}
          </div>
        )}
      </div>

      {/* Review mode indicator */}
      {reviewMode && (
        <div className="mb-3 p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-center">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            <RotateCcw size={12} className="inline mr-1" />
            Xatolar ustida ishlash
          </p>
        </div>
      )}

      {/* Quiz size selector */}
      {!reviewMode && (
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          <span className="text-[10px] text-gray-400 font-semibold shrink-0 mr-1">SAVOL:</span>
          {QUIZ_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => restart(size)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
                ${quizSize === size
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {size}
            </button>
          ))}
          <button
            onClick={() => restart(words.length)}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
              ${quizSize === words.length
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Barchasi
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 tabular-nums">
          {currentIdx + 1} / {quizWords.length}
        </span>
        <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold tabular-nums">
          {score} ball
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quizWords.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mb-2 font-medium">
          {direction === 'en-uz' ? 'Tarjimasini toping' : 'Inglizchasini toping'}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {questionText}
        </p>
        {!answered && (
          <p className="text-[10px] text-gray-400 mt-2">1-4 tugmalar bilan javob bering</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, i) => {
          const isCorrect = opt === correctAnswer
          const isSelected = opt === selectedOpt

          let bgClass = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          if (answered) {
            if (isCorrect) bgClass = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 animate-correct-flash'
            else if (isSelected && !isCorrect) bgClass = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 animate-wrong-shake'
            else bgClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-40'
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`p-3.5 rounded-xl border text-left font-medium transition-all duration-200 ${bgClass}
                ${!answered ? 'active:scale-[0.98]' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                  ${answered && isCorrect ? 'bg-emerald-500 text-white' :
                    answered && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  {i + 1}
                </span>
                {answered && isCorrect && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                <span className="text-gray-900 dark:text-gray-100">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Correct answer hint when wrong */}
      {answered && selectedOpt !== correctAnswer && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            <span className="font-semibold">To'g'ri javob:</span> {correctAnswer}
          </p>
          {direction === 'en-uz' && (
            <button
              onClick={() => speak(current.word)}
              className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <Volume2 size={10} />
              So'zni eshitish
            </button>
          )}
        </div>
      )}

      {/* Next */}
      {answered && (
        <button onClick={nextQuestion}
          className="w-full mt-4 py-3 rounded-xl btn-primary animate-slide-up">
          {currentIdx + 1 >= quizWords.length ? "Natijani ko'rish" : 'Keyingisi'}
        </button>
      )}
    </div>
  )
}

/* ─── Quiz History ─────────────────────────────────────────────────────────── */

function QuizHistory({ filmId }: { filmId: string }) {
  const [history, setHistory] = useState<{ score: number; total: number; date: string; streak: number }[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`film_quiz_history_${filmId}`)
      if (saved) setHistory(JSON.parse(saved).slice(-10).reverse())
    } catch { 
      monitoring.captureMessage('FilmDetail: failed to load quiz history', 'warn')
    }
  }, [filmId])

  if (history.length === 0) return null

  return (
    <div className="text-left animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart3 size={12} className="text-gray-400" />
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Test tarixi
        </span>
      </div>
      <div className="space-y-1">
        {history.map((h, i) => {
          const pct = Math.round((h.score / h.total) * 100)
          const date = new Date(h.date)
          return (
            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
              <span className="w-16 text-gray-400">
                {date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-medium">{h.score}/{h.total}</span>
              {h.streak > 1 && (
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Zap size={8} />{h.streak}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Utils ───────────────────────────────────────────────────────────────── */

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
