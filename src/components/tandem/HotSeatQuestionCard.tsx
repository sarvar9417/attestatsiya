import { Clock } from 'lucide-react'
import type { HotSeatQuestion } from './hotSeatHelpers'

interface HotSeatQuestionCardProps {
  question: HotSeatQuestion
  mode: 'vocab' | 'grammar'
  selectedAnswer: number | null
  timeLeft: number
  onSelect: (index: number) => void
}

export default function HotSeatQuestionCard({
  question, mode, selectedAnswer, timeLeft, onSelect,
}: HotSeatQuestionCardProps) {
  return (
    <div className="card p-5 space-y-4 animate-pop-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          {mode === 'vocab' ? "So'z — ma'nosi?" : 'Grammatika'}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold text-gray-500">
          <Clock size={14} /> {timeLeft}s
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 text-center py-2">
        {question.english}
      </h3>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let cls = 'w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left '
          if (selectedAnswer === null) {
            cls += 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 text-gray-700 hover:scale-[1.02] active:scale-[0.97]'
          } else if (i === question.correct) {
            cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700'
          } else if (i === selectedAnswer) {
            cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700'
          } else {
            cls += 'border-gray-100 dark:border-gray-800 text-gray-400 opacity-50'
          }
          return (
            <button key={i} onClick={() => onSelect(i)} disabled={selectedAnswer !== null} className={cls}>
              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-center leading-6 text-xs font-bold mr-2">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
