import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import PhraseFlashCard from './PhraseFlashCard'
import type { GamePhrase } from '../../store/phrasesStore'
import type { PhraseRating } from '../../services/phrasesService'

interface Props {
  phrase: GamePhrase
  onRate: (phraseId: number, rating: PhraseRating) => void
  onAdvance: () => void
}

const RATING_OPTIONS = [
  { key: 'yodladim' as PhraseRating, label: 'Yodladim', emoji: '⭐', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300', color: 'text-yellow-600' },
  { key: 'bildim' as PhraseRating, label: 'Bildim', emoji: '😊', bg: 'bg-green-50 hover:bg-green-100 border-green-200', color: 'text-green-600' },
  { key: 'qiynaldim' as PhraseRating, label: 'Qiynaldim', emoji: '🤔', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200', color: 'text-orange-600' },
  { key: 'bilmadim' as PhraseRating, label: 'Bilmadim', emoji: '😕', bg: 'bg-red-50 hover:bg-red-100 border-red-200', color: 'text-red-600' },
]

export default function PhraseFlashCardRenderer({ phrase, onRate, onAdvance }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState(false)

  useEffect(() => {
    setFlipped(false)
    setRated(false)
  }, [phrase.phrase_id])

  return (
    <div>
      <PhraseFlashCard phrase={phrase} flipped={flipped} onFlip={() => setFlipped(true)} />

      {!rated && (
        <div className="mt-4 flex gap-2">
          {RATING_OPTIONS.map(({ key, label, emoji, bg, color }) => (
            <button
              key={key}
              onClick={() => { setRated(true); onRate(phrase.phrase_id, key) }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${bg} ${color}`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      )}

      {rated && (
        <div className="mt-4">
          <button
            onClick={onAdvance}
            className="w-full py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2"
          >
            Keyingi <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
