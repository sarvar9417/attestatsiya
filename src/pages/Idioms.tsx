import { useState, useMemo } from 'react'
import { Search, X, BookOpen, Filter, ArrowLeft, Lightbulb, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { useI18n } from '../i18n'
import { IDIOMS, type Idiom, type IdiomLevel } from '../data/idioms'

const CATEGORIES = [
  'time', 'work', 'food', 'animals', 'body',
  'money', 'color', 'weather', 'communication', 'action',
] as const
const LEVELS: IdiomLevel[] = ['B1+', 'B2']

const CATEGORY_EMOJI: Record<string, string> = {
  time: '⏰',
  work: '💼',
  food: '🍔',
  animals: '🐱',
  body: '🫀',
  money: '💰',
  color: '🎨',
  weather: '🌦️',
  communication: '💬',
  action: '⚡',
}

export default function Idioms() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Idiom | null>(null)
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return IDIOMS.filter((i) => {
      if (categoryFilter !== 'all' && i.category !== categoryFilter) return false
      if (levelFilter !== 'all' && i.level !== levelFilter) return false
      if (!q) return true
      return (
        i.idiom.toLowerCase().includes(q) ||
        i.actualMeaning.toLowerCase().includes(q) ||
        i.translation.toLowerCase().includes(q) ||
        i.examples.some((ex) => ex.toLowerCase().includes(q))
      )
    })
  }, [query, categoryFilter, levelFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Idiom[]>()
    for (const i of filtered) {
      const key = i.category
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(i)
    }
    return map
  }, [filtered])

  if (mode === 'quiz') {
    return <IdiomQuiz onBack={() => setMode('browse')} />
  }

  if (selected) {
    return <IdiomDetail idiom={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {t('idioms.title')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('idioms.subtitle', { count: String(IDIOMS.length) })}
            </p>
          </div>
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
              bg-primary-100 text-primary-700 hover:bg-primary-200
              dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50
              transition-colors"
          >
            {t('idioms.quizButton')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('idioms.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={t('idioms.clearAria')}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter size={16} className="text-gray-400" />
        <FilterChip
          active={categoryFilter === 'all'}
          onClick={() => setCategoryFilter('all')}
          label={t('idioms.filterAll')}
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={categoryFilter === c}
            onClick={() => setCategoryFilter(c)}
            label={`${CATEGORY_EMOJI[c] ?? ''} ${c}`}
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
          <p className="text-sm text-gray-500">{t('idioms.noResults')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('idioms.noResultsHint')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 capitalize">
                {CATEGORY_EMOJI[cat] ?? ''} {cat} <span className="text-sm font-normal text-gray-400">({items.length})</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((i) => (
                  <IdiomCard key={i.id} idiom={i} onClick={() => setSelected(i)} />
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
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

function IdiomCard({ idiom, onClick }: { idiom: Idiom; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card !p-4 text-left hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700
        transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
          {idiom.idiom}
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
          idiom.level === 'B2'
            ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
            : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        }`}>
          {idiom.level}
        </span>
      </div>
      <p className="text-xs text-gray-500 italic mb-1.5">{idiom.translation}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {idiom.actualMeaning}
      </p>
    </button>
  )
}

// ─── Quiz Component ────────────────────────────────────────────────────────

const QUIZ_SIZE = 10

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function IdiomQuiz({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const [questions, setQuestions] = useState(() => generateQuiz())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIdx]

  function handleSelect(answer: string) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answer)
    setShowExplanation(true)
    if (answer === current.correct) setScore((s) => s + 1)
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    setQuestions(generateQuiz())
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="card !p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('idioms.finishedTitle')}</h2>
          <p className="text-gray-500 mb-1">
            {t('idioms.finishedScore', { score: String(score), total: String(questions.length) })}
          </p>
          <p className="text-4xl font-black text-primary-600 mb-6">{pct}%</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold
                hover:bg-primary-700 transition-colors text-sm"
            >
              <RefreshCw size={16} />
              {t('idioms.finishedRestart')}
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800
                text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              {t('idioms.finishedBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('idioms.detailBack')}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700 dark:text-gray-300">{currentIdx + 1}</span>
          <span className="text-gray-300">/</span>
          <span>{questions.length}</span>
          <span className="w-px h-4 bg-gray-200 mx-1" />
          <span className="text-primary-600 font-semibold">{t('idioms.quizProgressScore', { score: String(score) })}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-6">
        <div
          className="progress-fill bg-primary-500"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="card !p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">              {current.type === 'idiom-to-meaning' ? t('idioms.quizFindMeaning') : t('idioms.quizFindIdiom')}
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
          {current.question}
        </h3>

        <div className="space-y-2.5">
          {current.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt
            const isCorrect = opt === current.correct
            let btnClass =
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all '
            if (selectedAnswer === null) {
              btnClass += 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            } else if (isCorrect) {
              btnClass += 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            } else if (isSelected && !isCorrect) {
              btnClass += 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            } else {
              btnClass += 'border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-60'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={selectedAnswer !== null}
                className={btnClass}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                  {selectedAnswer !== null && isCorrect && <CheckCircle2 size={16} className="ml-auto text-green-500 flex-shrink-0" />}
                  {selectedAnswer !== null && isSelected && !isCorrect && <XCircle size={16} className="ml-auto text-red-400 flex-shrink-0" />}
                </span>
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
              {t('idioms.quizExplanation')}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {current.explanation}
            </p>
            {current.type === 'meaning-to-idiom' && current.idiomPhrase && (
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1.5 font-semibold">
                "{current.idiomPhrase}"
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              {currentIdx < questions.length - 1 ? t('idioms.quizNext') : t('idioms.quizResult')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function generateQuiz() {
  const pool = shuffleArray(IDIOMS).slice(0, QUIZ_SIZE)
  return pool.map((idiom) => {
    // Half the questions: idiom → find meaning, other half: meaning → find idiom
    const type = Math.random() < 0.5 ? 'idiom-to-meaning' : 'meaning-to-idiom'

    // Get 3 random distractors from other idioms
    const others = IDIOMS.filter((i) => i.id !== idiom.id)
    const distractors = shuffleArray(others).slice(0, 3).map((i) =>
      type === 'idiom-to-meaning' ? i.actualMeaning : i.idiom
    )

    const correct = type === 'idiom-to-meaning' ? idiom.actualMeaning : idiom.idiom
    const options = shuffleArray([correct, ...distractors])

    return {
      type,
      question: type === 'idiom-to-meaning'
        ? `"${idiom.idiom}" — bu idiom nimani anglatadi?`
        : `Qaysi idiom "${idiom.actualMeaning}" ma'nosini bildiradi?`,
      options,
      correct,
      explanation: `${idiom.idiom}: ${idiom.translation}. Misol: "${idiom.examples[0]}".`,
      idiomPhrase: type === 'meaning-to-idiom' ? idiom.idiom : undefined,
    }
  })
}

function IdiomDetail({ idiom, onBack }: { idiom: Idiom; onClick?: () => void; onBack: () => void }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-4
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
      >
        <ArrowLeft size={16} />
        {t('idioms.detailBack')}
      </button>

      <article className="card !p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {idiom.idiom}
          </h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            idiom.level === 'B2'
              ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
              : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          }`}>
            {idiom.level}
          </span>
        </div>

        <p className="text-base text-gray-700 dark:text-gray-300 mb-5">
          {idiom.translation}
        </p>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            {t('idioms.detailMeaning')}
          </h2>
          <p className="text-base text-gray-800 dark:text-gray-200">
            {idiom.actualMeaning}
          </p>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            {t('idioms.detailLiteral')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            {idiom.literalMeaning}
          </p>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t('idioms.detailExamples')}
          </h2>
          <ul className="space-y-2">
            {idiom.examples.map((ex, i) => (
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 inline-flex items-center gap-1.5">
            <Lightbulb size={12} /> {t('idioms.detailOrigin')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {idiom.origin}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t('idioms.detailCategory')}
          </h2>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg
            bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 capitalize">
            {CATEGORY_EMOJI[idiom.category] ?? ''} {idiom.category}
          </span>
        </section>
      </article>
    </div>
  )
}
