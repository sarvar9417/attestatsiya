import { CheckCircle2, XCircle } from 'lucide-react'

interface Pair {
  leftId: string
  leftContent: string
  rightContent: string
}

interface Props {
  prompt: string
  pairs: Pair[]
  selected?: Record<string, string>
  correct?: Record<string, string>
  showResult?: boolean
  onChange: (pairs: Record<string, string>) => void
  disabled?: boolean
}

export default function Y2Question({ prompt, pairs, selected = {}, correct, showResult, onChange, disabled }: Props) {
  const options = pairs.map(p => p.rightContent)
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5)

  return (
    <div>
      <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{prompt}</p>
      <p className="text-xs text-gray-500 mb-3">Har bir chap elementga mos o'ng variantni tanlang</p>
      <div className="space-y-3">
        {pairs.map((pair) => {
          const selectedRight = selected[pair.leftId]
          const isCorrect = correct ? selected[pair.leftId] === correct[pair.leftId] : false
          const isWrong = showResult && selected[pair.leftId] && correct && selected[pair.leftId] !== correct[pair.leftId]
          return (
            <div key={pair.leftId} className={`flex items-center gap-3 p-3 rounded-xl border ${isWrong ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : showResult && isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">{pair.leftContent}</span>
              <span className="text-gray-400">→</span>
              <select
                value={selectedRight || ''}
                onChange={(e) => onChange({ ...selected, [pair.leftId]: e.target.value })}
                disabled={disabled || showResult}
                className="input flex-1 text-sm disabled:opacity-70"
              >
                <option value="">Tanlang...</option>
                {shuffledOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {showResult && isCorrect && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
              {isWrong && <XCircle size={18} className="text-red-600 shrink-0" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
