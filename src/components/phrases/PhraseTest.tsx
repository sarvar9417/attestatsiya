import { useState, useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GamePhrase } from '../../store/phrasesStore'

interface Props {
  phrase: GamePhrase
  allPhrases: GamePhrase[]
  onAnswer: (correct: boolean) => void
}

export default function PhraseTest({ phrase, allPhrases, onAnswer }: Props) {
  const { t } = useI18n()
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const direction = useMemo<'en→uz' | 'uz→en'>(
    () => (Math.random() < 0.5 ? 'en→uz' : 'uz→en'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phrase]
  )

  const { question, correctAnswer, options } = useMemo(() => {
    if (direction === 'en→uz') {
      const correct = phrase.uzbek
      const others = allPhrases
        .filter((p) => p.phrase_id !== phrase.phrase_id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((p) => p.uzbek)
      return {
        question: phrase.english,
        correctAnswer: correct,
        options: [correct, ...others].sort(() => Math.random() - 0.5),
      }
    } else {
      const correct = phrase.english
      const others = allPhrases
        .filter((p) => p.phrase_id !== phrase.phrase_id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((p) => p.english)
      return {
        question: phrase.uzbek,
        correctAnswer: correct,
        options: [correct, ...others].sort(() => Math.random() - 0.5),
      }
    }
  }, [phrase, allPhrases, direction])

  function handlePick(opt: string) {
    if (revealed) return
    setSelected(opt)
    setRevealed(true)
    setTimeout(() => {
      onAnswer(opt === correctAnswer)
      setSelected(null)
      setRevealed(false)
    }, 1200)
  }

  const isCorrect = selected === correctAnswer

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {phrase.level} · {phrase.category}
        </span>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-3 leading-relaxed">{question}</p>
        <p className="text-sm text-gray-400 mt-1">
          {t(direction === 'en→uz' ? 'phraseTest.findUzbek' : 'phraseTest.findEnglish')}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt) => {
          let cls = 'border-gray-200 bg-white hover:border-b1-300'
          let icon = null
          if (revealed && opt === correctAnswer) {
            cls = 'border-green-400 bg-green-50'
            icon = <Check size={16} className="text-green-600" />
          } else if (revealed && opt === selected && !isCorrect) {
            cls = 'border-red-300 bg-red-50'
            icon = <X size={16} className="text-red-500" />
          }
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left ${cls}`}
            >
              <span className="font-medium text-gray-800 text-sm leading-relaxed">{opt}</span>
              {icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
