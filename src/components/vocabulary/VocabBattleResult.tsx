import { Sparkles } from 'lucide-react'
import type { GameMode, AIDifficulty } from './VocabBattleHelpers'
import { AI_OPPONENTS } from './VocabBattleHelpers'

interface ResultsProps {
  hostScore: number
  guestScore: number
  userName: string
  opponentName: string
  opponentEmoji: string
  gameMode: GameMode | null
  opponentDifficulty: AIDifficulty | null
  onReset: () => void
}

export function VocabBattleResults({
  hostScore, guestScore, userName, opponentName, opponentEmoji,
  gameMode, opponentDifficulty, onReset,
}: ResultsProps) {
  const isTie = hostScore === guestScore
  const isHostWinner = hostScore > guestScore

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-page-enter">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
            isTie ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'
          }`}>
            {isTie ? '🤝' : isHostWinner ? '🏆' : '😔'}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isTie ? 'Durang!' : "O'yin tugadi!"}
        </h2>
        <p className="text-sm text-gray-500">
          {isTie ? 'Ikkalangiz ham teng kuchli!' :
            isHostWinner ? 'Tabriklaymiz! Siz yutdingiz!' : 'Keyingi safar omad!'}
        </p>
        {gameMode === 'ai' && opponentDifficulty && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">
            {AI_OPPONENTS[opponentDifficulty].emoji} {AI_OPPONENTS[opponentDifficulty].name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`card p-5 text-center space-y-2 ${isHostWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
          <span className="text-3xl block mb-1">👤</span>
          <p className="text-xs font-semibold text-gray-400 uppercase">Siz</p>
          <p className="font-bold text-gray-900 dark:text-gray-100">{userName}</p>
          <p className="text-4xl font-bold text-primary-600">{hostScore}</p>
          <p className="text-xs text-gray-400">to'g'ri</p>
        </div>
        <div className={`card p-5 text-center space-y-2 ${!isHostWinner && !isTie ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
          <span className="text-3xl block mb-1">{opponentEmoji}</span>
          <p className="text-xs font-semibold text-gray-400 uppercase">Raqib</p>
          <p className="font-bold text-gray-900 dark:text-gray-100">{opponentName}</p>
          <p className="text-4xl font-bold text-primary-600">{guestScore}</p>
          <p className="text-xs text-gray-400">to'g'ri</p>
        </div>
      </div>

      <button onClick={onReset} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
        <Sparkles size={18} />
        Yangi o'yin boshlash
      </button>
    </div>
  )
}

interface ErrorViewProps {
  message: string
  onReset: () => void
}

export function VocabBattleError({ message, onReset }: ErrorViewProps) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-4">
      <div className="card p-8">
        <p className="text-red-500 font-semibold mb-2">{message || 'Xatolik yuz berdi'}</p>
        <button onClick={onReset} className="btn-primary">
          Qaytadan urinish
        </button>
      </div>
    </div>
  )
}
