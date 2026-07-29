import { useState, useMemo } from 'react'
import { CheckCircle, XCircle, ArrowRight, X } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GamePhrase } from '../../store/phrasesStore'

interface Props {
  phrases: GamePhrase[]
  onComplete: (score: number, total: number) => void
  onClose: () => void
}

export default function PhraseScrambleGame({ phrases, onComplete, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [results, setResults] = useState<{ correct: boolean }[]>([])
  const [showResult, setShowResult] = useState(false)

  const currentPhrase = phrases[currentIdx]

  const shuffledWords = useMemo(() => {
    if (!currentPhrase) return []
    const words = currentPhrase.english.split(' ')
    return [...words].sort(() => Math.random() - 0.5)
  }, [currentPhrase])

  const remainingWords = shuffledWords.filter(w => !selectedWords.includes(w))

  function handleWordClick(word: string) {
    if (showResult) return
    setSelectedWords(prev => [...prev, word])
  }

  function handleUndo() {
    if (showResult || selectedWords.length === 0) return
    setSelectedWords(prev => prev.slice(0, -1))
  }

  function handleSubmit() {
    const userAnswer = selectedWords.join(' ')
    const isCorrect = userAnswer.toLowerCase().trim() === currentPhrase.english.toLowerCase().trim()
    const newResults = [...results, { correct: isCorrect }]
    setResults(newResults)
    setShowResult(true)
  }

  function handleNext() {
    const nextIdx = currentIdx + 1
    if (nextIdx >= phrases.length) {
      const score = results.filter(r => r.correct).length
      onComplete(score, phrases.length)
    } else {
      setCurrentIdx(nextIdx)
      setSelectedWords([])
      setShowResult(false)
    }
  }

  const { t } = useI18n()
  const score = results.filter(r => r.correct).length

  if (!currentPhrase) return null

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {currentPhrase.level}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            {currentIdx + 1} / {phrases.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-green-600">{t('scrambleGame.score', { score })}</span>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('scrambleGame.uzbekPhrase')}
        </p>
        <p className="text-lg font-medium text-gray-800 leading-relaxed">
          {currentPhrase.uzbek}
        </p>
      </div>

      <div className="min-h-[80px] p-4 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 mb-4 flex flex-wrap items-center gap-2">
        {selectedWords.length === 0 ? (
          <p className="text-sm text-gray-400 w-full text-center">
            {t('scrambleGame.clickWords')}
          </p>
        ) : (
          selectedWords.map((word, i) => (
            <span
              key={`sel-${i}`}
              className="px-3 py-1.5 bg-indigo-500 text-white font-medium text-sm rounded-lg"
            >
              {word}
            </span>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {remainingWords.map((word, i) => (
          <button
            key={`word-${i}`}
            onClick={() => handleWordClick(word)}
            disabled={showResult}
            className="px-3 py-1.5 bg-white border-2 border-gray-200 text-gray-700 font-medium text-sm rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-30"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={selectedWords.length === 0 || showResult}
          className="px-4 py-2 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-gray-300 disabled:opacity-30 transition-all text-sm"
        >
          {t('scrambleGame.undo')}
        </button>
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length === 0}
            className="flex-1 py-2 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition-all text-sm"
          >
            {t('scrambleGame.check')} <ArrowRight size={16} className="inline" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-2 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all text-sm"
          >
            {t('scrambleGame.next')} <ArrowRight size={16} className="inline" />
          </button>
        )}
      </div>

      {showResult && (
        <div className={`mt-4 p-3 rounded-xl text-center ${
          results[results.length - 1]?.correct
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-center gap-1.5 font-semibold text-sm">
            {results[results.length - 1]?.correct ? (
              <><CheckCircle size={18} className="text-green-600" /> <span className="text-green-700">{t('scrambleGame.correct')}</span></>
            ) : (
              <><XCircle size={18} className="text-red-500" /> <span className="text-red-600">{t('scrambleGame.wrong')}</span></>
            )}
          </div>
          {!results[results.length - 1]?.correct && (
            <p className="text-xs text-gray-500 mt-1">
              {t('scrambleGame.correctAnswer', { answer: currentPhrase.english })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
