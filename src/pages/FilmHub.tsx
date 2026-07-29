import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Film, ChevronRight, X, BarChart3, BookOpen, Sparkles,
  RefreshCw, CheckCircle, TrendingUp, Clock, Trophy, Star,
} from 'lucide-react'
import { FILMS, searchFilms, type FilmVocabulary } from '../data/filmVocabulary'

const LEVEL_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'A1': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
  'A2': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', bar: 'bg-blue-500' },
  'B1': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
  'B1+': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', bar: 'bg-orange-500' },
  'B2': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', bar: 'bg-rose-500' },
}

function getFilmProgress(id: string): number {
  try {
    const saved = localStorage.getItem(`film_known_${id}`)
    return saved ? JSON.parse(saved).length : 0
  } catch { return 0 }
}

function getLastViewed(id: string): number | null {
  try {
    const val = localStorage.getItem(`film_lastviewed_${id}`)
    return val ? parseInt(val, 10) : null
  } catch { return null }
}

function getTotalKnownWords(): number {
  let total = 0
  for (const film of FILMS) {
    total += getFilmProgress(film.id)
  }
  return total
}

export default function FilmHub() {
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'default' | 'progress' | 'az'>('default')
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)

  // Force re-render when navigating back
  useEffect(() => {
    const onFocus = () => setRefreshKey(k => k + 1)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const films = useMemo(() => {
    let result = query.trim() ? searchFilms(query) : [...FILMS]
    if (levelFilter !== 'all') {
      result = result.filter(f => f.words.some(w => w.level === levelFilter))
    }
    // Sort
    if (sortBy === 'progress') {
      result.sort((a, b) => getFilmProgress(b.id) - getFilmProgress(a.id))
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }
    return result
  }, [query, levelFilter, sortBy, refreshKey])

  const filmProgressData = useMemo(() => {
    return FILMS.map(f => {
      const progress = getFilmProgress(f.id)
      const lastViewed = getLastViewed(f.id)
      return { film: f, progress, total: f.words.length, lastViewed }
    })
  }, [refreshKey])

  const continueFilms = useMemo(() => {
    return filmProgressData
      .filter(f => f.progress > 0 && f.progress < f.total)
      .sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
  }, [filmProgressData])

  const completedFilms = useMemo(() => {
    return filmProgressData.filter(f => f.progress >= f.total)
  }, [filmProgressData])

  const stats = useMemo(() => {
    const total = FILMS.reduce((s, f) => s + f.words.length, 0)
    const levels: Record<string, number> = {}
    FILMS.forEach(f => f.words.forEach(w => { levels[w.level] = (levels[w.level] || 0) + 1 }))
    const allLevels = Array.from(new Set(FILMS.flatMap(f => f.words.map(w => w.level)))).sort()
    return { total, levels, filmCount: FILMS.length, allLevels }
  }, [])

  const totalKnown = getTotalKnownWords()
  const overallPct = stats.total > 0 ? Math.round((totalKnown / stats.total) * 100) : 0

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-5 sm:p-7 text-white animate-fade-in">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 text-6xl rotate-12">🎬</div>
          <div className="absolute bottom-1 left-6 text-4xl -rotate-12">🍿</div>
          <div className="absolute top-8 right-1/3 text-3xl rotate-45">🎥</div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Film size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Film Vocabulary</h1>
              <p className="text-sm text-white/70">Kinolardan inglis tilini o'rganing</p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span className="flex items-center gap-1">
                <Trophy size={12} />
                Umumiy taraqqiyot
              </span>
              <span>{totalKnown}/{stats.total} so'z ({overallPct}%)</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <BookOpen size={14} />
              <span className="text-sm font-semibold">{stats.filmCount} ta film</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <Sparkles size={14} />
              <span className="text-sm font-semibold">{stats.total.toLocaleString()} ta so'z</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <CheckCircle size={14} />
              <span className="text-sm font-semibold">{totalKnown} o'rganilgan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {continueFilms.length > 0 && (
        <div className="mb-5 animate-slide-up" style={{ animationDelay: '30ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-primary-600 dark:text-primary-400" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Davom etish</h2>
            <span className="text-[10px] text-gray-400 font-medium">{continueFilms.length} ta film</span>
          </div>
          <div className="space-y-2">              {continueFilms.map(({ film, progress, total, lastViewed }) => {
              const pct = Math.round((progress / total) * 100)
              return (
                <button
                  key={film.id}
                  onClick={() => navigate(`/films/${film.id}`)}
                  className="w-full card-hover text-left group animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100
                      dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center text-xl shrink-0">
                      {film.posterEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                          {film.title}
                        </h3>
                        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold shrink-0">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">{progress}/{total} so'z</span>
                        {lastViewed && (
                          <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                            <Clock size={8} />
                            {new Date(lastViewed).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Level distribution */}
      <div className="card !p-4 mb-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daraja bo'yicha</span>
        </div>
        <div className="space-y-2">
          {stats.allLevels.map((lv) => {
            const count = stats.levels[lv] || 0
            const pct = Math.round((count / stats.total) * 100)
            const colors = LEVEL_COLORS[lv] || { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-400' }
            return (
              <div key={lv} className="flex items-center gap-2.5">
                <span className={`w-8 text-center text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                  {lv}
                </span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-10 text-right tabular-nums">{count}</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600 w-8 text-right tabular-nums">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-5 space-y-3 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Film nomi yoki janr bo'yicha qidirish..."
            className="input pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setLevelFilter('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${levelFilter === 'all'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
          >
            Barchasi ({stats.total.toLocaleString()})
          </button>
          {stats.allLevels.map((lv) => {
            const colors = LEVEL_COLORS[lv] || { bg: '', text: '', bar: '' }
            return (
              <button
                key={lv}
                onClick={() => setLevelFilter(lv)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${levelFilter === lv
                    ? `${colors.bg} ${colors.text} border-current`
                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
              >
                {lv} ({stats.levels[lv] || 0})
              </button>
            )
          })}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] text-gray-400 font-semibold shrink-0 mr-1">SARALASH:</span>
          {([
            { value: 'default', label: "Standart", icon: RefreshCw },
            { value: 'progress', label: "Progress", icon: TrendingUp },
            { value: 'az', label: "A-Z", icon: Star },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
                ${sortBy === value
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Films grid */}
      {films.length === 0 ? (
        <div className="card text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Film size={28} className="text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Film topilmadi</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Boshqa so'z yoki janr bilan qidirib ko'ring</p>
        </div>
      ) : (
        <>
          {/* Completed films badge */}
          {completedFilms.length > 0 && (
            <div className="flex items-center gap-2 mb-3 px-1">
              <Trophy size={14} className="text-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedFilms.length} ta film to'liq o'rganildi
              </span>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 animate-stagger">
            {films.map((film) => {
              const progress = getFilmProgress(film.id)
              return (
                <FilmCard
                  key={film.id}
                  film={film}
                  progress={progress}
                  onClick={() => {
                    localStorage.setItem(`film_lastviewed_${film.id}`, String(Date.now()))
                    navigate(`/films/${film.id}`)
                  }}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function FilmCard({ film, progress, onClick }: { film: FilmVocabulary; progress: number; onClick: () => void }) {
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    film.words.forEach(w => { counts[w.level] = (counts[w.level] || 0) + 1 })
    return counts
  }, [film.words])

  const dominantLevel = useMemo(() => {
    const entries = Object.entries(levelCounts)
    if (entries.length === 0) return 'A1'
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [levelCounts])

  const pct = Math.round((progress / film.words.length) * 100)
  const isCompleted = progress >= film.words.length
  const isStarted = progress > 0

  return (
    <button
      onClick={onClick}
      className={`card-hover text-left group animate-fade-in ${isCompleted ? 'border-emerald-200 dark:border-emerald-800/40' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100
          dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center text-2xl shrink-0
          group-hover:scale-110 transition-transform duration-200">
          {film.posterEmoji}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
            {film.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {film.titleUz} · {film.year} · {film.genre}
          </p>
          {isStarted && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400">{progress}/{film.words.length}</span>
                <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">{pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
              ${LEVEL_COLORS[dominantLevel]?.bg || 'bg-gray-100'} ${LEVEL_COLORS[dominantLevel]?.text || 'text-gray-600'}`}>
              {film.words.length} so'z
            </span>
            {!isStarted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-400">
                Yangi
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold
                bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                <Trophy size={10} />
                Yakunlangan
              </span>
            )}
            {Object.entries(levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
              <span key={lv} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {lv} {count}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight size={16}
          className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
      </div>
    </button>
  )
}
