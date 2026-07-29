import { useState, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, X, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { checkPhraseTranslationDetailed } from '../../lib/ai/claude-vocab'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { useI18n } from '../../i18n'

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type Phase = 'level-select' | 'playing' | 'result'

interface PhraseItem {
  id: number
  english: string
  uzbek: string
  level: string
}

interface QuizResult {
  phrase: PhraseItem
  userAnswer: string
  correct: boolean
  explanation?: string
  correctAnswer?: string
}

const LEVEL_STYLES: Record<Level, { bg: string; text: string; border: string; badge: string; btn: string }> = {
  A1: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', btn: 'hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-500' },
  A2: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', btn: 'hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-500' },
  B1: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', btn: 'hover:bg-indigo-100 hover:border-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500' },
  B2: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', btn: 'hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-900/30 dark:hover:border-purple-500' },
}

const LEVEL_DESC: Record<Level, string> = {
  A1: "Boshlang'ich",
  A2: 'Elementar',
  B1: "O'rta",
  B2: "O'rta-yuqori",
}

const QUESTION_COUNT = 20

function normalizeAnswer(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s']/g, '').replace(/\s+/g, ' ').trim()
}

export default function PhraseTypingGame({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [phase, setPhase] = useState<Phase>('level-select')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [phrases, setPhrases] = useState<PhraseItem[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [locked, setLocked] = useState(false)
  const [checking, setChecking] = useState(false)
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiCorrectAnswer, setAiCorrectAnswer] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ results: QuizResult[]; nextIdx: number; finished: boolean } | null>(null)
  const savedRef = useRef(false)

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

        await supabase.from('phrase_progress').upsert({
          user_id: uid,
          phrase_id: r.phrase.id,
          box,
          next_review: nextReview,
          correct_count: r.correct ? 1 : 0,
          wrong_count: r.correct ? 0 : 1,
          is_learned: false,
          last_reviewed: new Date().toISOString(),
        }, { onConflict: 'user_id,phrase_id' })
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
      .from('phrases')
      .select('id, english, uzbek, level')
      .eq('level', level)
      .limit(300)

    if (error || !data || data.length === 0) {
      setLoading(false)
      return
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT)
    setPhrases(shuffled)
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
    setLocked(false)
    setResults(pending.results)
    setInput('')
    setAiExplanation('')
    setAiCorrectAnswer('')
    if (pending.finished) {
      setPhase('result')
    } else {
      setCurrentIdx(pending.nextIdx)
    }
  }

  function processResult(phrase: PhraseItem, userAnswer: string, correct: boolean) {
    setFlash(correct ? 'correct' : 'wrong')
    setLocked(true)
    const newResults = [...results, {
      phrase,
      userAnswer,
      correct,
      explanation: correct ? undefined : aiExplanation || undefined,
      correctAnswer: correct ? undefined : aiCorrectAnswer || undefined,
    }]
    const nextIdx = currentIdx + 1
    pendingRef.current = { results: newResults, nextIdx, finished: nextIdx >= phrases.length }
  }

  async function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || locked) return

    const phrase = phrases[currentIdx]
    setLocked(true)
    setAiExplanation('')
    setAiCorrectAnswer('')

    // Aniq mos kelsa — API chaqirmasdan darhol to'g'ri
    if (normalizeAnswer(trimmed) === normalizeAnswer(phrase.english)) {
      processResult(phrase, trimmed, true)
      return
    }

    // Mos kelmasa — AI orqali tekshirish (boshqa tarjima varianti bo'lishi mumkin)
    setChecking(true)
    try {
      const result = await checkPhraseTranslationDetailed(phrase.uzbek, phrase.english, trimmed)
      setChecking(false)
      if (result.correct) {
        processResult(phrase, trimmed, true)
      } else {
        setAiExplanation(result.explanation)
        setAiCorrectAnswer(result.correctAnswer)
        processResult(phrase, trimmed, false)
      }
    } catch (e) {
      monitoring.captureMessage('checkPhraseTranslationDetailed API error, marking as wrong: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      // API ishlamasa — noto'g'ri deb hisoblash
      setChecking(false)
      processResult(phrase, trimmed, false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  const score = results.filter(r => r.correct).length
  const wrongResults = results.filter(r => !r.correct)

  if (phase === 'level-select') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gap yozish o'yini</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              O'zbekcha gap → Inglizcha yozish · {QUESTION_COUNT} savol
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Daraja tanlang
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
                <p className="text-xs text-gray-300 mt-0.5">{QUESTION_COUNT} ta savol</p>
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Gaplar yuklanmoqda...</span>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'playing') {
    const phrase = phrases[currentIdx]
    const progressPct = (currentIdx / phrases.length) * 100
    const lvlStyle = LEVEL_STYLES[selectedLevel!]

    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lvlStyle.badge}`}>
              {selectedLevel}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {currentIdx + 1} / {phrases.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-green-600">{score} ball</span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div
          className={`rounded-2xl border-2 py-10 px-6 text-center mb-5 transition-all duration-300 ${
            checking
              ? 'bg-yellow-50 border-yellow-200'
              : flash === 'correct'
              ? 'bg-green-50 border-green-300'
              : flash === 'wrong'
              ? 'bg-red-50 border-red-300'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            O'zbekcha gap
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {phrase.uzbek}
          </p>

          {checking && (
            <div className="flex items-center justify-center gap-2 mt-4 text-yellow-600 text-sm font-medium">
              <Loader2 size={16} className="animate-spin" /> AI tekshirilmoqda...
            </div>
          )}

          {!checking && flash === 'correct' && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-1.5 text-green-600 font-semibold text-sm">
                <CheckCircle size={18} /> To'g'ri!
              </div>
              <p className="font-bold text-gray-900 mt-1">{phrase.english}</p>
            </div>
          )}
          {!checking && flash === 'wrong' && (
            <div className="mt-4">
              <p className="text-red-500 text-sm font-semibold flex items-center justify-center gap-1.5">
                <XCircle size={16} /> Noto'g'ri
              </p>
              <p className="text-gray-600 text-sm mt-1">
                To'g'ri javob:{' '}
                <span className="font-bold text-gray-900">{aiCorrectAnswer || phrase.english}</span>
              </p>
              {aiExplanation && (
                <div className="mt-3 p-3 bg-white border border-amber-300 rounded-xl text-left shadow-sm">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1.5">💡 Tushuntirish:</p>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">{aiExplanation}</p>
                </div>
              )}
            </div>
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
            placeholder="Inglizcha gapni yozing..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-900 font-medium transition-all disabled:opacity-50 disabled:bg-gray-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || locked}
            aria-label={t('aria.submit')}
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
            Keyingi <ArrowRight size={15} />
          </button>
        ) : (
          <p className="text-center text-xs text-gray-300 mt-3">
            Enter tugmasini bosing
          </p>
        )}
      </div>
    )
  }

  if (phase === 'result') {
    const pct = Math.round((score / phrases.length) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'

    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-3xl font-black text-gray-900">
            {score}
            <span className="text-gray-300">/{phrases.length}</span>
          </h2>
          <p className="text-gray-500 mt-1">{pct}% to'g'ri</p>
          <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${LEVEL_STYLES[selectedLevel!].badge}`}>
            {selectedLevel} · {LEVEL_DESC[selectedLevel!]}
          </span>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => startGame(selectedLevel!)}
            className="flex-1 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Qayta o'ynash
          </button>
          <button
            onClick={() => setPhase('level-select')}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Daraja o'zgartir
          </button>
        </div>

        {wrongResults.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Xatolar — {wrongResults.length} ta
            </p>
            <div className="space-y-2">
              {wrongResults.map((r, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 py-3 px-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{r.phrase.uzbek}</p>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle size={11} />
                      Sizning javob:{' '}
                      <span className="font-mono font-semibold">{r.userAnswer || '(bo\'sh)'}</span>
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={11} />
                      To'g'ri:{' '}
                      <span className="font-bold">{r.correctAnswer || r.phrase.english}</span>
                    </p>
                  </div>
                  {r.explanation && (
                    <div className="mt-2 p-2 bg-white border border-amber-300 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">{r.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
            <p className="font-bold text-green-700 text-lg">Mukammal natija!</p>
            <p className="text-sm text-gray-400 mt-1">Barcha gaplar to'g'ri yozildi</p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-5 py-3 text-gray-400 text-sm hover:text-gray-600 transition-all">
          Yopish
        </button>
      </div>
    )
  }

  return null
}
