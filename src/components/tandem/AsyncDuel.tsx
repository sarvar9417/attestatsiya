// ═══════════════════════════════════════════════════════════════════════════
// AsyncDuel — Asinxron duel o'yini (VocabBattle asosida)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { Clock, Sparkles, Bot, Loader2, Trophy } from 'lucide-react'
import { feelTap, feelAnswer } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'
import { submitDuelAnswers } from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'
import type { Duel, DuelQuestion, DuelMode } from '../../types/tandem'
import SpeakingDuelPlayer from './SpeakingDuelPlayer'

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TIME = 20

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  duel: Duel
  mode: DuelMode
  onComplete: () => void
  userRole: 'challenger' | 'opponent'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AsyncDuel({ duel, mode, onComplete, userRole }: Props) {
  const userName = useStore((s) => s.userName) || 'Foydalanuvchi'
  const [questions, setQuestions] = useState<DuelQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [duelScore, setDuelScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [locked, setLocked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<{ questionIndex: number; answerIndex: number }[]>([])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Init questions ────────────────────────────────────────────────────────

  useEffect(() => {
    setQuestions(duel.question_set || [])
  }, [duel.question_set])

  // ── Timer ─────────────────────────────────────────────────────────────────

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(QUESTION_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (timeLeft === 0 && !locked && !finished) {
      handleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // ── Start playing ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (questions.length > 0 && !finished) {
      setCurrentQ(0)
      setSelected(null)
      setLocked(false)
      startTimer()
    }
  }, [questions.length, finished, startTimer])

  // ── Handle answer ─────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (locked || finished) return
      setLocked(true)
      if (timerRef.current) clearInterval(timerRef.current)
      setSelected(answerIndex)

      const q = questions[currentQ]
      const isCorrect = answerIndex === q?.correct
      if (isCorrect) {
        setDuelScore((s) => s + 1)
        emitXpBurst(5)
      }

      setAnswers((prev) => [...prev, { questionIndex: currentQ, answerIndex }])
      feelAnswer({ correct: isCorrect })

      setTimeout(() => advanceQuestion(), 1200)
    },
    // advanceQuestion qasddan kiritilmadi — u quyida e'lon qilingan va setTimeout
    // ichida chaqiriladi; deps'ga qo'shilsa handleAnswer keraksiz qayta yaratiladi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locked, finished, questions, currentQ]
  )

  // ── Advance question ──────────────────────────────────────────────────────

  const advanceQuestion = useCallback(() => {
    const next = currentQ + 1
    if (next >= questions.length) {
      setFinished(true)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setCurrentQ(next)
    setSelected(null)
    setLocked(false)
    startTimer()
  }, [currentQ, questions.length, startTimer])

  // ── Submit results ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setSubmitting(true)
    const result = await submitDuelAnswers(duel.id, answers)
    if (result.success) {
      useToastStore.getState().toast(`✅ ${result.score}/${questions.length} to'g'ri!`, 'success')
      onComplete()
    } else {
      useToastStore.getState().toast('Xatolik yuz berdi', 'error')
    }
    setSubmitting(false)
  }

  // ── Render results ────────────────────────────────────────────────────────

  if (finished) {
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              duelScore >= questions.length * 0.8
                ? 'bg-green-100 dark:bg-green-900/30'
                : duelScore >= questions.length * 0.5
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Trophy size={40} className={
                duelScore >= questions.length * 0.8
                  ? 'text-yellow-500'
                  : duelScore >= questions.length * 0.5
                    ? 'text-gray-400'
                    : 'text-gray-300'
              } />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Duel tugadi!
          </h2>
          <p className="text-sm text-gray-500">
            {userRole === 'challenger' ? 'Endi do\'stingizning javobini kutish qoldi' : 'Natijangiz saqlandi'}
          </p>
        </div>

        <div className="card p-6 text-center space-y-3">
          <p className="text-5xl font-bold text-primary-600">{duelScore}</p>
          <p className="text-sm text-gray-500">
            {questions.length} ta savoldan {duelScore} tasi to'g'ri
          </p>
          <p className="text-sm text-gray-400">
            ({Math.round((duelScore / questions.length) * 100)}%)
          </p>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                duelScore >= questions.length * 0.8
                  ? 'bg-green-500'
                  : duelScore >= questions.length * 0.5
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${(duelScore / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Sparkles size={18} />
              Natijalarni saqlash
            </>
          )}
        </button>
      </div>
    )
  }

  // ── Speaking mode ────────────────────────────────────────────────────────

  if (mode === 'speaking' && questions.length > 0) {
    return (
      <SpeakingDuelPlayer
        duel={duel}
        question={questions[0]}
        onComplete={onComplete}
      />
    )
  }

  // ── Render question ──────────────────────────────────────────────────────

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    )
  }

  const q = questions[currentQ]
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0
  const timerPct = (timeLeft / QUESTION_TIME) * 100

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {mode === 'lesson' ? '📘' : mode === 'vocab' ? '📚' : mode === 'grammar' ? '📖' : mode === 'reading' ? '📄' : mode === 'speaking' ? '🎤' : '⚡'}
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {userName}
          </span>
          <span className="font-bold text-primary-600">{duelScore}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-gray-400">{currentQ + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="card p-6 space-y-4 animate-pop-in">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            {mode === 'lesson' ? (duel.lesson_title ?? 'Dars dueli') :
             mode === 'vocab' ? 'So\'z — ma\'nosi?' :
             mode === 'grammar' ? 'Grammatika — to\'g\'ri variant' :
             mode === 'reading' ? "O'qish — matnni tushundingizmi?" :
             'Savol'}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-500">
            <Clock size={14} />
            {timeLeft}s
          </span>
        </div>

        {/* Reading mode: show passage */}
        {mode === 'reading' && q.passage && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-blue-100 dark:border-blue-900/50 max-h-48 overflow-y-auto">
            {q.passage}
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 text-center py-2">
          {q.english}
        </h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let cls = 'w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left '
            if (selected === null) {
              cls += 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 hover:scale-[1.02]'
            } else if (i === q.correct) {
              cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            } else if (i === selected) {
              cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            } else {
              cls += 'border-gray-100 dark:border-gray-800 text-gray-400 opacity-50'
            }
            return (
              <button
                key={i}
                onClick={() => { feelTap(); handleAnswer(i) }}
                disabled={selected !== null}
                className={cls}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-center leading-6 text-xs font-bold mr-2">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bot status */}
      {duel.is_bot && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Bot size={12} />
          <span>AI botga qarshi o'ynayapsiz</span>
        </div>
      )}
    </div>
  )
}
