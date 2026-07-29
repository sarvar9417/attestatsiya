import { useState, useEffect, useMemo, useRef } from 'react'
import { Shuffle } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GameWord } from '../../store/vocabularyStore'
import { feelAnswer, feelLevelUp } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'

interface Props {
  words: GameWord[]
  onComplete: (score: number, total: number) => void
  onMatch?: (wordId: number, correct: boolean) => void
}

interface MatchPair {
  id: string    // 'en-{word_id}' or 'uz-{word_id}'
  wordId: number
  text: string
  type: 'en' | 'uz'
}

export default function WordGame({ words, onComplete, onMatch }: Props) {
  const displayWords = useMemo(() => words, [words])
  const [pairs, setPairs] = useState<MatchPair[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<string | null>(null)
  const [matchedCount, setMatchedCount] = useState(0)
  const comboRef = useRef(0)

  useEffect(() => {
    const en: MatchPair[] = displayWords.map((w) => ({
      id: `en-${w.word_id}`,
      wordId: w.word_id,
      text: w.english,
      type: 'en',
    }))
    const uz: MatchPair[] = displayWords.map((w) => ({
      id: `uz-${w.word_id}`,
      wordId: w.word_id,
      text: w.uzbek,
      type: 'uz',
    }))
    const shuffled = [...en, ...uz].sort(() => Math.random() - 0.5)
    setPairs(shuffled)
    setMatched(new Set())
    setSelected(null)
    setMatchedCount(0)
  }, [displayWords])

  function handleClick(pair: MatchPair) {
    if (matched.has(pair.wordId)) return
    if (pair.type === 'uz' && !selected) return

    if (!selected) {
      setSelected(pair.id)
      return
    }

    const first = pairs.find((p) => p.id === selected)
    if (!first) { setSelected(null); return }

    if (first.wordId === pair.wordId && first.type !== pair.type) {
      setMatched((prev) => new Set(prev).add(pair.wordId))
      setMatchedCount((c) => c + 1)
      setSelected(null)
      onMatch?.(pair.wordId, true)
      // ── GAME FEEL: to'g'ri moslik ──
      comboRef.current += 1
      feelAnswer({ correct: true, combo: comboRef.current })
      emitXpBurst(5)
      if (matchedCount + 1 >= displayWords.length) {
        feelLevelUp()
        setTimeout(() => onComplete(matchedCount + 1, displayWords.length), 500)
      }
    } else {
      setWrong(pair.id)
      comboRef.current = 0
      feelAnswer({ correct: false })
      setTimeout(() => {
        setWrong(null)
        setSelected(null)
      }, 600)
    }
  }

  const { t } = useI18n()

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shuffle size={16} className="text-b1-500" />
        <p className="text-sm font-medium text-gray-600">
          {t('wordGame.matchWords')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {pairs.map((pair) => {
          const isMatched = matched.has(pair.wordId)
          const isSelected = selected === pair.id
          const isWrong = wrong === pair.id
          let cls = 'border-gray-200 bg-white'
          if (isMatched) cls = 'border-green-300 bg-green-50 opacity-50'
          else if (isWrong) cls = 'border-red-300 bg-red-50'
          else if (isSelected) cls = 'border-b1-400 bg-b1-50'

          return (
            <button
              key={pair.id}
              onClick={() => handleClick(pair)}
              disabled={isMatched}
              className={`p-2 sm:p-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all ${cls} ${
                pair.type === 'uz' ? 'col-span-1' : ''
              }`}
            >
              <span className={`${isMatched ? 'line-through text-gray-400' : ''} truncate block w-full`}>
                {pair.text}
              </span>
              {isMatched && <span className="ml-1 text-green-600">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
