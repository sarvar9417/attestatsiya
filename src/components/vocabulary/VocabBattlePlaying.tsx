import { Clock, Check } from 'lucide-react'
import { feelTap } from '../../lib/gameFeel'
import type { BattleQuestion } from './VocabBattleHelpers'
import { QUESTIONS_PER_GAME, QUESTION_TIME } from './VocabBattleHelpers'

interface Props {
  questions: BattleQuestion[]
  currentQ: number
  selected: number | null
  timeLeft: number
  hostScore: number
  guestScore: number
  userName: string
  opponentName: string
  opponentEmoji: string
  aiThinking: boolean
  aiAnswered: boolean
  onAnswer: (index: number) => void
}

export default function VocabBattlePlaying({
  questions, currentQ, selected, timeLeft,
  hostScore, guestScore, userName, opponentName, opponentEmoji,
  aiThinking, aiAnswered, onAnswer,
}: Props) {
  const q = questions[currentQ]
  if (!q) return null

  const progress = ((currentQ + 1) / QUESTIONS_PER_GAME) * 100
  const timerPct = (timeLeft / QUESTION_TIME) * 100

  const handleClick = (i: number) => {
    feelTap()
    onAnswer(i)
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in">
      {/* Top bar — players */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">{userName}</span>
          <span className="font-bold text-primary-600">{hostScore}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-gray-400">{currentQ + 1}/{QUESTIONS_PER_GAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary-600">{guestScore}</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{opponentName}</span>
          <span className="text-lg">{opponentEmoji}</span>
          {aiThinking && (
            <span className="inline-flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
          {aiAnswered && !aiThinking && <Check size={14} className="text-green-500" />}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
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

      {/* Question card */}
      <div className="card p-6 space-y-4 animate-pop-in">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            {q.english} — ma'nosi?
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-500">
            <Clock size={14} />
            {timeLeft}s
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center py-2">
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
                onClick={() => handleClick(i)}
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
    </div>
  )
}
