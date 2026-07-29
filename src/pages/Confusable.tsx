// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — O'zbek o'quvchilari uchun chalkash so'zlar o'quv sahifasi
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useMemo, useRef } from 'react'
import { Search, X, BookOpen, ArrowLeft, Lightbulb, CheckCircle2, XCircle, RefreshCw, Brain, Sparkles, Zap } from 'lucide-react'
import { useI18n } from '../i18n'
import { CONFUSABLE_PAIRS, type ConfusablePair } from '../data/confusable-pairs'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { useToastStore } from '../utils/toastStore'
import { delayConfusablePartners, pushWordsToSRS_FSRS, type PushWordInput } from '../services/vocabularyService'

export default function Confusable() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ConfusablePair | null>(null)
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse')
  const [ratingLoading, setRatingLoading] = useState<string | null>(null)
  const [srsPushing, setSrsPushing] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CONFUSABLE_PAIRS.filter((p) => {
      if (!q) return true
      return (
        p.uzTitle.toLowerCase().includes(q) ||
        p.words.some(w => w.toLowerCase().includes(q)) ||
        p.rule.toLowerCase().includes(q) ||
        p.memoryHook.toLowerCase().includes(q) ||
        p.examples.some(ex => ex.correct.toLowerCase().includes(q) || ex.wrong.toLowerCase().includes(q))
      )
    })
  }, [query])

  if (mode === 'quiz') {
    return <ConfusableQuiz onBack={() => setMode('browse')} />
  }

  if (selected) {
    return (
      <ConfusableDetail
        pair={selected}
        onBack={() => setSelected(null)}
        ratingLoading={ratingLoading}
        onRate={async (word) => {
          setRatingLoading(word)
          try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user.id) {
              await delayConfusablePartners(session.user.id, [word])
            }
          } finally {
            setRatingLoading(null)
          }
        }}
        srsPushing={srsPushing}
        onPushSRS={async (word) => {
          setSrsPushing((prev) => new Set(prev).add(word))
          try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user.id) {
              useToastStore.getState().toast('Tizimga kiring', 'error')
              return
            }

            // Birinchi misolni topamiz
            const example = selected.examples.find(ex =>
              ex.correct.toLowerCase().includes(word.toLowerCase())
            )?.correct

            const input: PushWordInput = {
              english: word,
              rating: 'bildim',
              level: 'B1',
              example,
            }
            await pushWordsToSRS_FSRS(session.user.id, [input])
            useToastStore.getState().toast(`"${word}" SRS ga saqlandi ✅`, 'success')
          } catch {
            useToastStore.getState().toast(`"${word}" ni saqlashda xatolik`, 'error')
          } finally {
            setSrsPushing((prev) => {
              const next = new Set(prev)
              next.delete(word)
              return next
            })
          }
        }}
      />
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
              <Brain size={28} className="text-purple-500" />
              {t('confusable.title')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('confusable.subtitle', { count: String(CONFUSABLE_PAIRS.length) })}
            </p>
          </div>
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
              bg-purple-100 text-purple-700 hover:bg-purple-200
              dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50
              transition-colors"
          >
            <Sparkles size={14} />
            {t('confusable.quizButton')}
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
          placeholder={t('confusable.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={t('confusable.clearAria')}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">{t('confusable.noResults')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('confusable.noResultsHint')}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <ConfusableCard key={p.id} pair={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ConfusableCard({ pair, onClick }: { pair: ConfusablePair; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card !p-4 text-left hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700
        transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
          {pair.words.map((w, i) => (
            <span key={w}>
              {i > 0 && <span className="text-gray-400 mx-1 font-normal">vs</span>}
              <span className={`${i === 0 ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {w}
              </span>
            </span>
          ))}
        </h3>
        <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
      <p className="text-xs text-gray-500 mb-1.5">{pair.uzTitle}</p>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Brain size={12} />
        <span>{pair.memoryHook.slice(0, 60)}{pair.memoryHook.length > 60 ? '...' : ''}</span>
      </div>
    </button>
  )
}

// ─── Detail Component ──────────────────────────────────────────────────────

function ConfusableDetail({
  pair, onBack, ratingLoading, onRate, srsPushing, onPushSRS,
}: {
  pair: ConfusablePair
  onBack: () => void
  ratingLoading: string | null
  onRate: (word: string) => Promise<void>
  srsPushing: Set<string>
  onPushSRS: (word: string) => Promise<void>
}) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-4
          focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg px-2 py-1 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('confusable.detailBack')}
      </button>

      <article className="card !p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {pair.words.map((w, i) => (
              <span key={w}>
                {i > 0 && <span className="text-gray-400 mx-2 font-normal">vs</span>}
                <span className={`${i === 0 ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p className="text-sm text-gray-500">{pair.uzTitle}</p>
        </div>

        {/* SRS delay info */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <Zap size={16} className="text-indigo-500 shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            {t('confusable.srsDelayInfo')}
          </p>
        </div>

        {/* Rule */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
            <BookOpen size={12} /> {t('confusable.detailRule')}
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {pair.rule}
          </div>
        </section>

        {/* Memory Hook */}
        <section className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
            <Lightbulb size={12} /> {t('confusable.detailMemory')}
          </h2>
          <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-line leading-relaxed">
            {pair.memoryHook}
          </p>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            {t('confusable.detailExamples', { count: String(pair.examples.length) })}
          </h2>
          <div className="space-y-3">
            {pair.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-green-800 dark:text-green-200 font-medium">{ex.correct}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-600 dark:text-red-400 line-through">{ex.wrong}</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">{ex.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SRS Partner Delay */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Zap size={12} /> {t('confusable.detailDelayTitle')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {pair.words.map((word) => (
              <button
                key={`delay-${word}`}
                onClick={() => onRate(word)}
                disabled={ratingLoading === word}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  ratingLoading === word
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50'
                }`}
              >
                {ratingLoading === word ? (
                  <>{t('confusable.srsSaving')}</>
                ) : (
                  <><Zap size={12} /> {t('confusable.detailDelayAction', { word })}</>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('confusable.detailDelayDesc')}
          </p>
        </div>

        {/* SRS Push to Vocabulary */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <BookOpen size={12} /> {t('confusable.detailSRSTitle')}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {t('confusable.detailSRSDesc')}
          </p>
          <div className="flex flex-wrap gap-2">
            {pair.words.map((word) => {
              const isPushing = srsPushing.has(word)
              return (
                <button
                  key={`srs-${word}`}
                  onClick={() => onPushSRS(word)}
                  disabled={isPushing}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isPushing
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPushing ? (
                    <>{t('confusable.srsSaving')}</>
                  ) : (
                    <><BookOpen size={14} /> {t('confusable.detailSRSAdd', { word })}</>
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('confusable.detailSRSInfo')}
          </p>
        </div>
      </article>
    </div>
  )
}

// ─── Quiz Component ──────────────────────────────────────────────────────

const QUIZ_SIZE = 10

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type QuizQuestion = {
  pairId: string
  type: 'which-correct' | 'fill-blank' | 'which-word'
  question: string
  options: string[]
  correct: string
  explanation: string
  example?: string
}

function generateQuiz(): QuizQuestion[] {
  const pool = shuffleArray(CONFUSABLE_PAIRS).slice(0, QUIZ_SIZE)
  const questions: QuizQuestion[] = []

  for (const pair of pool) {
    // Q1: Berilgan gapda qaysi so'z to'g'ri?
    const ex = pair.examples[Math.floor(Math.random() * pair.examples.length)]
    const words = shuffleArray(pair.words)
    const blanked = ex.correct.replace(new RegExp(`\\b(${pair.words.join('|')})\\b`, 'i'), '______')

    // "Which word is correct in this sentence?" — pick correct word
    questions.push({
      pairId: pair.id,
      type: 'which-word',
      question: `"${blanked}" — qaysi so'z to'g'ri?`,
      options: words,
      correct: pair.words.find(w => ex.correct.toLowerCase().includes(w.toLowerCase())) ?? pair.words[0],
      explanation: `${ex.explanation}. To'g'ri: "${ex.correct}"`,
      example: ex.correct,
    })

    // Q2: Berilgan ikkala variantdan to'g'risini toping
    if (pair.examples.length > 1) {
      const ex2 = pair.examples[(pair.examples.indexOf(ex) + 1) % pair.examples.length]
      const wrongForm = ex2.wrong
      questions.push({
        pairId: pair.id,
        type: 'which-correct',
        question: `Qaysi gap to'g'ri?`,
        options: shuffleArray([ex2.correct, wrongForm]),
        correct: ex2.correct,
        explanation: ex2.explanation,
        example: ex2.correct,
      })
    }
  }

  return shuffleArray(questions).slice(0, QUIZ_SIZE)
}

function ConfusableQuiz({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const [questions, setQuestions] = useState(() => generateQuiz())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const srsDoneRef = useRef(false)

  const current = questions[currentIdx]

  async function handleSelect(answer: string) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answer)
    setShowExplanation(true)
    if (answer === current.correct) {
      setScore((s) => s + 1)
    }

    // SRS kechiktirish: to'g'ri javob berilgan pair'dagi sherik so'zni kechiktiramiz
    if (answer === current.correct && !srsDoneRef.current) {
      srsDoneRef.current = true
      const pair = CONFUSABLE_PAIRS.find(p => p.id === current.pairId)
      if (pair) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user.id) {
            const reviewedWord = pair.words.find(w => current.correct.toLowerCase().includes(w.toLowerCase())) ?? pair.words[0]
            delayConfusablePartners(session.user.id, [reviewedWord]).catch((e) => monitoring.captureMessage('delayConfusablePartners failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
          }
        }).catch((e) => monitoring.captureMessage('getSession in Confusable failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      }
    }
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      srsDoneRef.current = false
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
    srsDoneRef.current = false
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const grade = pct >= 90 ? '🎉' : pct >= 70 ? '💪' : pct >= 50 ? '📚' : '🔄'
    const gradeText = pct >= 90 ? t('confusable.finishedGradeExcellent') : pct >= 70 ? t('confusable.finishedGradeGood') : pct >= 50 ? t('confusable.finishedGradeAverage') : t('confusable.finishedGradePractice')

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="card !p-8 text-center">
          <div className="text-6xl mb-4">{grade}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{gradeText}</h2>
          <p className="text-base text-gray-500 mb-1">
            {t('confusable.finishedScore', { score: String(score), total: String(questions.length) })}
          </p>
          <p className="text-5xl font-black text-purple-600 mb-6">{pct}%</p>

          {/* SRS summary */}
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 mb-6 text-left">
            <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Zap size={12} />
              {t('confusable.srsDelayProgress')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold
                hover:bg-purple-700 transition-colors text-sm"
            >
              <RefreshCw size={16} />
              {t('confusable.finishedRestart')}
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800
                text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              {t('confusable.finishedBack')}
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
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('confusable.detailBack')}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700 dark:text-gray-300">{currentIdx + 1}</span>
          <span className="text-gray-300">/</span>
          <span>{questions.length}</span>
          <span className="w-px h-4 bg-gray-200 mx-1" />
          <span className="text-purple-600 font-semibold">{t('confusable.quizProgressScore', { score: String(score) })}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-6">
        <div
          className="progress-fill bg-gradient-to-r from-purple-500 to-amber-500"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="card !p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <Brain size={12} />
          {current.type === 'which-correct'
            ? t('confusable.quizSelectCorrect')
            : current.type === 'fill-blank'
            ? t('confusable.quizFillBlank')
            : t('confusable.quizSelectWord')}
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 leading-relaxed">
          {current.question}
        </h3>

        <div className="space-y-2.5">
          {current.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt
            const isCorrect = opt === current.correct
            let btnClass =
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all '
            if (selectedAnswer === null) {
              btnClass += 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
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
          <div className="mt-5 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
              <Lightbulb size={12} /> {t('confusable.quizExplanation')}
            </p>
            <p className="text-sm text-indigo-800 dark:text-indigo-200">
              {current.explanation}
            </p>
            {current.example && (
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1.5 font-semibold">
                ✓ {current.example}
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              {currentIdx < questions.length - 1 ? t('confusable.quizNext') : t('confusable.quizResult')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
