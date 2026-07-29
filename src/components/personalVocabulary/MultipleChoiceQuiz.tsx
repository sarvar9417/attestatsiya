import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { PersonalWord, WordSessionResult, VocabRating } from '../../types/personalVocabulary'
import { X, CheckCircle2, XCircle, HelpCircle, Star, Volume2, Zap, RefreshCw } from 'lucide-react'
import { speakNatural } from '../../lib/openaiTts'

interface MultipleChoiceQuizProps {
  words: PersonalWord[]
  allWords: PersonalWord[]
  onComplete: (results: WordSessionResult[]) => void
  onExit: () => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

const RATING_OPTIONS: { value: VocabRating; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'bilmadim', label: 'Bilmadim', icon: <XCircle size={18} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800' },
  { value: 'qiynaldim', label: 'Qiynaldim', icon: <HelpCircle size={18} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800' },
  { value: 'bildim', label: 'Bildim', icon: <CheckCircle2 size={18} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800' },
  { value: 'yodladim', label: 'Yodladim', icon: <Star size={18} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800' },
]

/**
 * MultipleChoiceQuiz — 4 variantli test.
 * Foydalanuvchi so'zni ko'radi, 4 ta variantdan to'g'risini tanlaydi.
 * Distraktorlar boshqa so'zlardan olinadi, shuning uchun doim mos keladi.
 * Past bosim — taxmin qilishga ham ruxsat.
 */
export default function MultipleChoiceQuiz({ words, allWords, onComplete, onExit }: MultipleChoiceQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [results, setResults] = useState<WordSessionResult[]>([])
  const [direction, setDirection] = useState<'en→uz' | 'uz→en'>('en→uz')
  const [isComplete, setIsComplete] = useState(false)
  const [streak, setStreak] = useState(0)
  const pendingNextRef = useRef(false)

  const currentWord = words[currentIndex]
  const totalWords = words.length

  // Generate options for current word
  const options = useMemo(() => {
    if (!currentWord) return []

    const correctAnswer = direction === 'en→uz' ? currentWord.uzbek : currentWord.english
    const otherWords = [...allWords].filter(w => w.id !== currentWord.id)

    // Fisher-Yates avoids mutating props and gives a stable-quality shuffle.
    for (let i = otherWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[otherWords[i], otherWords[j]] = [otherWords[j], otherWords[i]]
    }
    const distractors = [...new Set(
      otherWords.map(w => direction === 'en→uz' ? w.uzbek : w.english)
    )].filter(answer => answer !== correctAnswer).slice(0, 3)

    const allOptions = [correctAnswer, ...distractors]
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
    }
    return allOptions
  }, [currentWord, allWords, direction])

  // Toggle direction occasionally for variety
  useEffect(() => {
    setDirection(Math.random() < 0.5 ? 'en→uz' : 'uz→en')
  }, [currentIndex])

  // Reset on new word
  useEffect(() => {
    setSelectedOption(null)
    setShowFeedback(false)
    pendingNextRef.current = false
  }, [currentIndex])

  const handleSelect = useCallback((optionIndex: number) => {
    if (selectedOption !== null || showFeedback) return

    setSelectedOption(optionIndex)

    const correctAnswer = direction === 'en→uz' ? currentWord.uzbek : currentWord.english
    const isCorrect = options[optionIndex] === correctAnswer

    if (isCorrect) {
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    const result: WordSessionResult = {
      vocabId: currentWord.id,
      english: currentWord.english,
      uzbek: currentWord.uzbek,
      level: currentWord.level,
      box: currentWord.box,
      result: isCorrect ? 'correct' : 'wrong',
      rating: isCorrect ? 'bildim' : 'bilmadim',
    }

    setResults(prev => [...prev, result])
    setShowFeedback(true)
  }, [currentWord, direction, options, selectedOption, showFeedback])

  const goNext = useCallback(() => {
    if (pendingNextRef.current) return
    pendingNextRef.current = true

    if (currentIndex + 1 < totalWords) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, totalWords])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (showFeedback) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault()
          goNext()
        }
        return
      }
      if (selectedOption === null) {
        const optionMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 }
        if (optionMap[e.key] !== undefined && optionMap[e.key] < options.length) {
          e.preventDefault()
          handleSelect(optionMap[e.key])
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFeedback, selectedOption, isComplete, options.length, goNext, handleSelect])

  const speakEnglish = useCallback(() => {
    if (currentWord?.english) {
      speakNatural(currentWord.english, 0.9).catch(() => {})
    }
  }, [currentWord])

  // Auto-speak current word
  useEffect(() => {
    if (currentWord?.english) {
      const timer = setTimeout(() => speakNatural(currentWord.english, 0.9).catch(() => {}), 300)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, currentWord])

  // Completion Screen
  if (isComplete) {
    const correct = results.filter(r => r.result === 'correct').length
    const wrong = results.filter(r => r.result === 'wrong').length
    const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0

    return (
      <div className="max-w-lg mx-auto p-4 space-y-6 text-center">
        <div className="text-5xl mb-2">{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Test yakunlandi!</h2>
        <p className="text-gray-500 dark:text-gray-400">{totalWords} ta so'z tekshirildi</p>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800/30">
            <div className="text-xl font-bold text-green-600">{correct}</div>
            <div className="text-[10px] text-green-600/70 uppercase">To'g'ri</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-100 dark:border-red-800/30">
            <div className="text-xl font-bold text-red-600">{wrong}</div>
            <div className="text-[10px] text-red-600/70 uppercase">Xato</div>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 border border-primary-100 dark:border-primary-800/30">
            <div className="text-xl font-bold text-primary-600">{accuracy}%</div>
            <div className="text-[10px] text-primary-600/70 uppercase">Aniqlik</div>
          </div>
        </div>

        {/* Wrong words review */}
        {results.filter(r => r.result === 'wrong').length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Xato qilingan so'zlar:</p>
            <div className="space-y-1.5">
              {results.filter(r => r.result === 'wrong').map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-3 py-1.5 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{r.english}</span>
                  <span className="text-gray-500 dark:text-gray-400">{r.uzbek}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { setCurrentIndex(0); setResults([]); setIsComplete(false) }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-all border border-gray-200 dark:border-gray-700"
          >
            <RefreshCw size={18} />
            Qayta boshlash
          </button>
          <button
            onClick={() => onComplete(results)}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg transition-all active:scale-[0.98]"
          >
            Yakunlash
          </button>
        </div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="text-gray-500 mb-4">Test uchun so'zlar topilmadi</p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          Orqaga
        </button>
      </div>
    )
  }

  // Calculate correct answer for display
  const correctAnswer = direction === 'en→uz' ? currentWord.uzbek : currentWord.english
  const correctIndex = options.indexOf(correctAnswer)
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / totalWords) * 100
  const correctSoFar = results.filter(r => r.result === 'correct').length
  const wrongSoFar = results.filter(r => r.result === 'wrong').length

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Zap size={16} className="text-primary-500" />
          <span className="text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-700 dark:text-gray-300">{currentIndex + 1}</span>/{totalWords}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-green-600 dark:text-green-400 font-medium">{correctSoFar}✓</span>
          {wrongSoFar > 0 && <span className="text-red-500 font-medium">{wrongSoFar}✗</span>}
          {streak > 1 && (
            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Zap size={14} />{streak}
            </span>
          )}
        </div>
        <button onClick={onExit} aria-label="Testdan chiqish" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 p-6 space-y-5">
        {/* Direction indicator */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
            {currentWord.level}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {direction === 'en→uz' ? "Inglizcha → O'zbekcha" : "O'zbekcha → Inglizcha"}
          </span>
        </div>

        {/* Question */}
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-medium">
            {direction === 'en→uz' ? "So'zni tarjima qiling" : "So'zni toping"}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {direction === 'en→uz' ? currentWord.english : currentWord.uzbek}
          </p>
          {direction === 'en→uz' && currentWord.phonetic && (
            <p className="text-xs text-gray-400 italic mt-1">{currentWord.phonetic}</p>
          )}
        </div>

        {/* Speak Button */}
        <div className="flex justify-center">
          <button
            onClick={speakEnglish}
            className="p-2 rounded-xl text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 transition-all"
            title="Talaffuzni eshitish"
          >
            <Volume2 size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx
            const isCorrectOpt = idx === correctIndex
            let btnClass = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'

            if (showFeedback) {
              if (isCorrectOpt) {
                btnClass = 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-600'
              } else if (isSelected && !isCorrectOpt) {
                btnClass = 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              } else {
                btnClass = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            } else if (isSelected) {
              btnClass = 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-300 dark:ring-primary-600'
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedOption !== null}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all disabled:cursor-default ${btnClass}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  showFeedback && isCorrectOpt
                    ? 'bg-green-500 text-white'
                    : showFeedback && isSelected && !isCorrectOpt
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {showFeedback && isCorrectOpt ? '✓' : showFeedback && isSelected && !isCorrectOpt ? '✗' : OPTION_LABELS[idx]}
                </span>
                <span className={`text-left ${
                  showFeedback && isCorrectOpt ? 'font-bold' : ''
                }`}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-xl p-3 text-xs border ${
            selectedOption === correctIndex
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {selectedOption === correctIndex ? (
                <><CheckCircle2 size={14} /> To'g'ri!</>
              ) : (
                <><XCircle size={14} /> Xato! To'g'ri javob: <span className="font-bold">{correctAnswer}</span></>
              )}
            </div>
            {currentWord.example && (
              <div className="mt-1 space-y-0.5">
                <p className="text-gray-500 dark:text-gray-400 italic">&ldquo;{currentWord.example}&rdquo;</p>
                {currentWord.example_uzbek && (
                  <p className="text-gray-500 dark:text-gray-400 not-italic text-[10px]">📖 {currentWord.example_uzbek}</p>
                )}
              </div>
            )}
            {/* Rating after feedback */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-green-200 dark:border-green-800">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 mr-1 self-center">O'z bahongiz:</span>
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const lastResult = results[results.length - 1]
                    if (lastResult) {
                      const updatedResults = [...results]
                      updatedResults[updatedResults.length - 1] = {
                        ...lastResult,
                        rating: opt.value,
                        result: opt.value === 'bilmadim' ? 'wrong' : 'correct',
                      }
                      setResults(updatedResults)
                    }
                    goNext()
                  }}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all hover:scale-105 ${opt.color}`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between text-xs">
        <p className="text-gray-400 dark:text-gray-500">
          {!selectedOption ? '1-4 yoki A-D — tanlash' : showFeedback ? 'Enter/Space — davom etish' : ''}
        </p>
      </div>
    </div>
  )
}
