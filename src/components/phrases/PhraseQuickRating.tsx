import { useState } from 'react'
import type { PhraseRating } from '../../types/phrases'

const RATING_CONFIG: { key: PhraseRating; emoji: string }[] = [
  { key: 'yodladim',  emoji: '⭐' },
  { key: 'bildim',    emoji: '😊' },
  { key: 'qiynaldim', emoji: '🤔' },
  { key: 'bilmadim',  emoji: '😕' },
]

export default function PhraseQuickRating({
  phraseId,
  lastRating,
  onRate,
}: {
  phraseId: number
  lastRating?: string
  onRate: (phraseId: number, rating: PhraseRating) => void
}) {
  const [flash, setFlash] = useState<PhraseRating | null>(null)

  return (
    <div className="relative flex items-center gap-1 sm:gap-0.5 ml-1 sm:ml-1.5 border-l border-gray-200 pl-1 sm:pl-1.5">
      {flash && (
        <span className="absolute -top-4 right-0 text-xs font-semibold whitespace-nowrap animate-bounce text-green-600">
          {RATING_CONFIG.find(r => r.key === flash)?.emoji}
        </span>
      )}
      {RATING_CONFIG.map(({ key, emoji }) => {
        const active = lastRating === key
        const ringColor =
          key === 'yodladim' ? 'ring-yellow-400 bg-yellow-100 dark:bg-yellow-900/40' :
          key === 'bildim' ? 'ring-green-400 bg-green-100 dark:bg-green-900/40' :
          key === 'qiynaldim' ? 'ring-orange-400 bg-orange-100 dark:bg-orange-900/40' :
          'ring-red-400 bg-red-100 dark:bg-red-900/40'
        const hoverColor =
          key === 'yodladim' ? 'hover:bg-yellow-100' :
          key === 'bildim' ? 'hover:bg-green-100' :
          key === 'qiynaldim' ? 'hover:bg-orange-100' :
          'hover:bg-red-100'
        return (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation()
              setFlash(key)
              setTimeout(() => setFlash(null), 500)
              onRate(phraseId, key)
            }}
            className={`w-11 h-11 sm:w-5 sm:h-5 flex items-center justify-center rounded text-sm sm:text-xs transition-all active:scale-90 ${
              active ? `scale-110 ring-2 ${ringColor}` : hoverColor + ' hover:scale-110'
            }`}
            title={key}
          >
            {emoji}
          </button>
        )
      })}
    </div>
  )
}
