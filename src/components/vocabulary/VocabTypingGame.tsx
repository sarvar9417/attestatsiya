import { useState, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, X, Loader2, FlaskConical } from 'lucide-react'
import { useI18n } from '../../i18n'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { checkVocabAnswer, generateUzbekSentence, analyzeGrammar } from '../../lib/claude'
import GrammarAnalysisPanel from './GrammarAnalysisPanel'
import { getTodayTashkent } from '../../utils/tashkentDate'

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type Phase = 'level-select' | 'playing' | 'result'

interface Word {
  id: number
  english: string
  uzbek: string
  level: string
  example?: string
}

interface QuizResult {
  word: Word
  userAnswer: string
  correct: boolean
}

const LEVEL_STYLES: Record<Level, { bg: string; text: string; border: string; badge: string; btn: string }> = {
  A1: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', btn: 'hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-500' },
  A2: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', btn: 'hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-500' },
  B1: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', btn: 'hover:bg-indigo-100 hover:border-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500' },
  B2: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', btn: 'hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-900/30 dark:hover:border-purple-500' },
}

const LEVEL_DESC: Record<Level, string> = {
  A1: 'Boshlang\'ich',
  A2: 'Elementar',
  B1: 'O\'rta',
  B2: 'O\'rta-yuqori',
}

const QUESTION_COUNT = 20

export default function VocabTypingGame({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [phase, setPhase] = useState<Phase>('level-select')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [locked, setLocked] = useState(false)
  const [checking, setChecking] = useState(false)
  const [analysisText, setAnalysisText] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [showAnalysisFor, setShowAnalysisFor] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ results: QuizResult[]; nextIdx: number; finished: boolean } | null>(null)
  const savedRef = useRef(false)

  // Save game results to vocabulary_progress
  useEffect(() => {
    if (phase !== 'result' || savedRef.current || results.length === 0) return
    savedRef.current = true

    const saveResults = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) return

      const today = getTodayTashkent()
      for (const r of results) {
        const box = r.correct ? 2 : 1
        const intervalDays = [1, 3, 7, 14, 30, 90][box - 1]
        const d = new Date(today + 'T00:00:00Z')
        d.setUTCDate(d.getUTCDate() + intervalDays)
        const nextReview = d.toISOString().split('T')[0]

        await supabase.from('vocabulary_progress').upsert({
          user_id: uid,
          word_id: r.word.id,
          box,
          next_review: nextReview,
          correct_count: r.correct ? 1 : 0,
          wrong_count: r.correct ? 0 : 1,
          is_learned: false,
          last_reviewed: new Date().toISOString(),
        }, { onConflict: 'user_id,word_id' })
      }
    }
    saveResults()
  }, [phase, results])

  useEffect(() => {
    if (phase === 'playing' && !locked) {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [phase, currentIdx, locked])

  async function startGame(level: Level) {
    savedRef.current = false
    setLoading(true)
    setSelectedLevel(level)

    const { data, error } = await supabase
      .from('words')
      .select('id, english, uzbek, level, example')
      .eq('level', level)
      .limit(300)

    if (error || !data || data.length === 0) {
      setLoading(false)
      return
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT)
    setWords(shuffled)
    setCurrentIdx(0)
    setResults([])
    setInput('')
    setFlash(null)
    setLocked(false)
    setPhase('playing')
    setLoading(false)
  }

  function goNext() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    setFlash(null)
    setShowAnalysisFor(null)
    setAnalysisText('')
    setLocked(false)
    setResults(pending.results)
    setInput('')
    if (pending.finished) {
      setPhase('result')
    } else {
      setCurrentIdx(pending.nextIdx)
    }
  }

  function processResult(word: Word, userAnswer: string, correct: boolean) {
    setChecking(false)
    setFlash(correct ? 'correct' : 'wrong')
    setLocked(true)
    const newResults = [...results, { word, userAnswer, correct }]
    const nextIdx = currentIdx + 1
    pendingRef.current = { results: newResults, nextIdx, finished: nextIdx >= words.length }
  }

  async function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || locked) return

    const word = words[currentIdx]
    setLocked(true)

    if (trimmed.toLowerCase() === word.english.toLowerCase()) {
      processResult(word, trimmed, true)
      return
    }

    setChecking(true)
    try {
      const correct = await checkVocabAnswer(word.uzbek, word.english, trimmed)
      processResult(word, trimmed, correct)
    } catch (e) {
      monitoring.captureMessage('checkVocabAnswer API error, marking as wrong: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      processResult(word, trimmed, false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  const score = results.filter(r => r.correct).length
  const wrongResults = results.filter(r => !r.correct)

  // ── Level select ─────────────────────────────────────────────
  if (phase === 'level-select') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('typingGame.title')}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('typingGame.subtitle', { count: QUESTION_COUNT })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t('typingGame.selectLevel')}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lvl) => {
            const s = LEVEL_STYLES[lvl]
            return (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                disabled={loading}
                className={`rounded-2xl border-2 py-8 text-center transition-all ${s.bg} ${s.border} ${s.btn} disabled:opacity-50`}
              >
                <span className={`text-4xl font-black ${s.text}`}>{lvl}</span>
                <p className="text-xs text-gray-400 mt-1.5">{LEVEL_DESC[lvl]}</p>
                <p className="text-xs text-gray-300 mt-0.5">{t('typingGame.questions', { count: QUESTION_COUNT })}</p>
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">{t('typingGame.loadingWords')}</span>
          </div>
        )}
      </div>
    )
  }

  // ── Playing ─────────────────────────────────────────────────────
  if (phase === 'playing') {
    const word = words[currentIdx]
    const progressPct = (currentIdx / words.length) * 100
    const lvlStyle = LEVEL_STYLES[selectedLevel!]

    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lvlStyle.badge}`}>
              {selectedLevel}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {currentIdx + 1} / {words.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-green-600">
              {t('typingGame.score', { score })}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>

        <div className={`rounded-2xl border-2 py-10 px-6 text-center mb-5 transition-all duration-300 ${
          checking ? 'bg-yellow-50 border-yellow-200' :
          flash === 'correct' ? 'bg-green-50 border-green-300' :
          flash === 'wrong' ? 'bg-red-50 border-red-300' :
          'bg-white border-gray-200'
        }`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t('typingGame.uzbek')}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{word.uzbek}</p>

          {checking && (
            <div className="flex items-center justify-center gap-2 mt-4 text-yellow-600 text-sm font-medium">
              <Loader2 size={16} className="animate-spin" /> {t('typingGame.checking')}
            </div>
          )}

          {!checking && flash === 'correct' && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-1.5 text-green-600 font-semibold text-sm">
                <CheckCircle size={18} /> {t('typingGame.correct')}
              </div>
              <p className="font-bold text-gray-900 mt-1">{word.english}</p>
              {word.example && <p className="text-xs text-gray-400 mt-2 italic px-2">{word.example}</p>}
            </div>
          )}
          {!checking && flash === 'wrong' && (
            <div className="mt-4">
              <p className="text-red-500 text-sm font-semibold flex items-center justify-center gap-1.5">
                <XCircle size={16} /> {t('typingGame.wrong')}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {t('typingGame.correctAnswer', { answer: word.english })}
              </p>
              {word.example && <p className="text-xs text-gray-400 mt-2 italic px-2">{word.example}</p>}
            </div>
          )}

          {!checking && flash && (
            <button
              onClick={async () => {
                if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
                if (showAnalysisFor === currentIdx) return
                setShowAnalysisFor(currentIdx)
                setAnalysisText('')
                setAnalysisLoading(true)
                try {
                  const sentence = await generateUzbekSentence(word.english, word.uzbek, selectedLevel!)
                  analyzeGrammar(
                    sentence, input, selectedLevel!,
                    (token) => setAnalysisText((p) => p + token),
                    () => { setAnalysisLoading(false) },
                    (err) => { monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzeGrammar' }); setAnalysisLoading(false) }
                  )
                } catch (e) {
                  monitoring.captureMessage('Grammar analysis failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
                  setAnalysisLoading(false)
                }
              }}
              className={`w-full mt-3 py-2 px-3 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                showAnalysisFor === currentIdx
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400'
              }`}
            >
              <FlaskConical size={15} />
              {showAnalysisFor === currentIdx ? t('typingGame.analyzing') : t('typingGame.viewAnalysis')}
              {analysisLoading && showAnalysisFor === currentIdx && <Loader2 size={13} className="animate-spin ml-1" />}
            </button>
          )}

          {showAnalysisFor === currentIdx && (
            <GrammarAnalysisPanel text={analysisText} loading={analysisLoading} />
          )}
        </div>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={locked}
            placeholder={t('typingGame.inputPlaceholder')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-900 font-medium transition-all disabled:opacity-50 disabled:bg-gray-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || locked}
            className="px-5 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {locked ? (
          <button
            onClick={goNext}
            className="w-full mt-3 py-2.5 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2"
          >
            {t('typingGame.next')} <ArrowRight size={15} />
          </button>
        ) : (
          <p className="text-center text-xs text-gray-300 mt-3">{t('typingGame.pressEnter')}</p>
        )}
      </div>
    )
  }

  // ── Result ────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((score / words.length) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'

    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-3xl font-black text-gray-900">
            {score}<span className="text-gray-300">/{words.length}</span>
          </h2>
          <p className="text-gray-500 mt-1">{t('typingGame.percentCorrect', { pct })}</p>
          <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${LEVEL_STYLES[selectedLevel!].badge}`}>
            {selectedLevel} · {LEVEL_DESC[selectedLevel!]}
          </span>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => startGame(selectedLevel!)}
            className="flex-1 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> {t('typingGame.playAgain')}
          </button>
          <button
            onClick={() => setPhase('level-select')}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            {t('typingGame.changeLevel')}
          </button>
        </div>

        {wrongResults.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t('typingGame.mistakes', { count: wrongResults.length })}
            </p>
            <div className="space-y-2">
              {wrongResults.map((r, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 py-3 px-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{r.word.uzbek}</p>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle size={11} />
                      {t('typingGame.you')}{' '}
                      <span className="font-mono font-semibold">{r.userAnswer || t('typingGame.empty')}</span>
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={11} />
                      {t('typingGame.correctLabel')}{' '}
                      <span className="font-bold">{r.word.english}</span>
                    </p>
                    {r.word.example && <p className="text-xs text-gray-400 mt-1 italic">{r.word.example}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
            <p className="font-bold text-green-700 text-lg">{t('typingGame.perfectResult')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('typingGame.allCorrect')}</p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-5 py-3 text-gray-400 text-sm hover:text-gray-600 transition-all">
          {t('typingGame.close')}
        </button>
      </div>
    )
  }

  return null
}
