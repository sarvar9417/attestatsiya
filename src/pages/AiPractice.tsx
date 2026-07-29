import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ArrowLeft, Sparkles, RefreshCw, Check, X, Trophy, Wand2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { generatePracticeExercises, type GeneratedExercise } from '../lib/claude'
import { feelAnswer, feelLevelUp } from '../lib/gameFeel'
import { getWeakGrammarLabels } from '../services/aiInsightsService'

type View = 'setup' | 'loading' | 'quiz' | 'result'



const COMMON_TOPICS = [
  'Present Simple', 'Present Continuous', 'Past Simple', 'Present Perfect',
  'Articles (a / an / the)', 'Prepositions (in/on/at)', 'Modal Verbs',
  'Comparatives & Superlatives', 'Conditionals', 'Passive Voice',
  'Phrasal Verbs', 'Reported Speech',
]

const THEME_KEYS = ['general', 'sport', 'tech', 'travel', 'business', 'food', 'movie']

export default function AiPractice() {
  const { t } = useI18n()
  const currentLevel = useStore(s => s.currentLevel)
  const addXP = useStore(s => s.addXP)
  const level = (currentLevel || 'B1').replace('+', '')

  const weakTopics = useMemo(() => getWeakGrammarLabels(4), [])

  const themeLabels: Record<string, string> = useMemo(() => ({
    general: t('aiPractice.themeGeneral'), sport: t('aiPractice.themeSport'),
    tech: t('aiPractice.themeTech'), travel: t('aiPractice.themeTravel'),
    business: t('aiPractice.themeBusiness'), food: t('aiPractice.themeFood'),
    movie: t('aiPractice.themeMovie'),
  }), [t])

  const [view, setView] = useState<View>('setup')
  const [topic, setTopic] = useState('')
  const [themeKey, setThemeKey] = useState('general')
  const [exercises, setExercises] = useState<GeneratedExercise[]>([])
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [error, setError] = useState('')

  const current = exercises[idx]

  // Demo'dan kelgan ?topic= bo'lsa, avtomatik shu mavzuda mashq yaratamiz
  const [searchParams] = useSearchParams()
  const autoRan = useRef(false)
  useEffect(() => {
    const t = searchParams.get('topic')
    if (t && !autoRan.current) {
      autoRan.current = true
      generate(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function generate(topicStr: string) {
    setTopic(topicStr)
    setView('loading')
    setError('')
    const ex = await generatePracticeExercises(topicStr, themeLabels[themeKey], level, 6)
    if (ex.length === 0) {
      setError(t('aiPractice.error'))
      setView('setup')
      return
    }
    setExercises(ex)
    setIdx(0); setChosen(null); setCorrectCount(0)
    setView('quiz')
  }

  function choose(opt: string) {
    if (chosen) return
    setChosen(opt)
    const correct = opt === current.correct
    feelAnswer({ correct })
    if (correct) setCorrectCount(c => c + 1)
  }

  function next() {
    if (idx < exercises.length - 1) {
      setIdx(i => i + 1)
      setChosen(null)
    } else {
      const pct = Math.round((correctCount / exercises.length) * 100)
      const xp = correctCount * 3
      addXP(xp)
      if (pct === 100) feelLevelUp()
      setView('result')
    }
  }

  function reset() {
    setView('setup'); setExercises([]); setChosen(null); setIdx(0); setCorrectCount(0)
  }

  // ═══ SETUP ═══
  if (view === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
            <Wand2 size={22} className="text-white" />
          </div>
          <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('aiPractice.title')}</h1>
          <p className="text-xs text-gray-500">{t('aiPractice.subtitle')}</p>
          </div>
        </div>

        {error && <div className="rounded-xl p-3 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-600">{error}</div>}

        {/* Theme */}
        <div>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{t('aiPractice.themeTitle')}</p>
          <div className="flex flex-wrap gap-1.5">
            {THEME_KEYS.map(k => {
              const lbl = themeLabels[k]
              return (
                <button key={k} onClick={() => setThemeKey(k)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${themeKey === k ? 'bg-fuchsia-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{lbl}</button>
              )
            })}
          </div>
        </div>

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <div>
            <p className="text-xs font-bold text-rose-600 mb-2">{t('aiPractice.weakTopicsTitle')}</p>
            <div className="space-y-2">
              {weakTopics.map(t => (
                <button key={t} onClick={() => generate(t)} className="w-full text-left p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 hover:shadow-md transition active:scale-[0.98] flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t}</span>
                  <Sparkles size={15} className="text-rose-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Common topics */}
        <div>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{t('aiPractice.grammarTopicsTitle')}</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_TOPICS.map(t => (
              <button key={t} onClick={() => generate(t)} className="text-left p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-fuchsia-300 hover:shadow-md transition active:scale-[0.98]">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ═══ LOADING ═══
  if (view === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-6xl mb-4 animate-bounce">🪄</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('aiPractice.loadingTitle')}</h2>
        <p className="text-sm text-gray-500">{t('aiPractice.loadingDesc', { topic, theme: themeLabels[themeKey] })}</p>
      </div>
    )
  }

  // ═══ RESULT ═══
  if (view === 'result') {
    const pct = Math.round((correctCount / exercises.length) * 100)
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4">
        <div className="text-center pt-4">
          <div className="text-6xl mb-2">{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('aiPractice.resultScore', { correct: String(correctCount), total: String(exercises.length) })}</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <Trophy size={15} /> {t('aiPractice.resultXP', { xp: String(correctCount * 3) })}
          </div>
          <p className="text-xs text-gray-500 mt-2">{t('aiPractice.resultTopic', { topic, theme: themeLabels[themeKey] })}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => generate(topic)} className="flex-1 btn-primary py-3 font-bold flex items-center justify-center gap-1.5"><RefreshCw size={15} /> {t('aiPractice.retryTopic')}</button>
          <button onClick={reset} className="flex-1 btn-secondary py-3 font-bold">{t('aiPractice.newTopic')}</button>
        </div>
      </div>
    )
  }

  // ═══ QUIZ ═══
  if (!current) return null
  const answered = chosen !== null

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all" style={{ width: `${((idx + 1) / exercises.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-gray-400 font-semibold">{idx + 1}/{exercises.length}</span>
      </div>

      {/* Question */}
      <div className="card py-6">
        <p className="text-lg font-bold text-gray-900 dark:text-white text-center leading-relaxed">{current.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {current.options.map((opt, i) => {
          const isCorrect = opt === current.correct
          const isChosen = opt === chosen
          let cls = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
          if (answered && isCorrect) cls = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300'
          else if (answered && isChosen) cls = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300'
          return (
            <button
              key={i}
              onClick={() => choose(opt)}
              disabled={answered}
              className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold flex items-center justify-between transition active:scale-[0.99] ${cls}`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <Check size={17} className="text-emerald-500" />}
              {answered && isChosen && !isCorrect && <X size={17} className="text-rose-500" />}
            </button>
          )
        })}
      </div>

      {/* Explanation + next */}
      {answered && (
        <div className="space-y-3 animate-page-enter">
          <div className="card bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
            {t('aiPractice.explanationLabel')}: {current.explanation}
          </div>
          <button onClick={next} className="w-full btn-primary py-3 font-bold">
            {idx < exercises.length - 1 ? t('aiPractice.quizNext') : t('aiPractice.quizFinish')}
          </button>
        </div>
      )}
    </div>
  )
}
