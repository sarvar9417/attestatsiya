import { Trophy, CheckCircle, Clock, Star, Target } from 'lucide-react'

interface Props {
  score: number
  total: number
  dictationCorrect: number
  dictationTotal: number
  timeTaken: number
  xpEarned: number
  onRetry: () => void
}

export default function ListeningResults({ score, total, dictationCorrect, dictationTotal, timeTaken, xpEarned, onRetry }: Props) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border-primary-100 dark:border-primary-800 text-center">
        <Trophy size={36} className="mx-auto text-primary-500 mb-2" />
        <p className="text-2xl font-black text-primary-700 dark:text-primary-300">{pct}%</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {score}/{total} to'g'ri
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-xs font-bold text-gray-500">Savollar</span>
          </div>
          <p className="text-lg font-black text-gray-900 dark:text-gray-100">{score}/{total}</p>
        </div>
        {dictationTotal > 0 && (
          <div className="card text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-gray-500">Dictation</span>
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-gray-100">{dictationCorrect}/{dictationTotal}</p>
          </div>
        )}
        <div className="card text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-500">Vaqt</span>
          </div>
          <p className="text-lg font-black text-gray-900 dark:text-gray-100">
            {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}
          </p>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={14} className="text-violet-500" />
            <span className="text-xs font-bold text-gray-500">XP</span>
          </div>
          <p className="text-lg font-black text-primary-600 dark:text-primary-400">+{xpEarned}</p>
        </div>
      </div>

      <button onClick={onRetry} className="btn-primary w-full py-3">
        Qaytadan Sinab Ko'rish
      </button>
    </div>
  )
}
