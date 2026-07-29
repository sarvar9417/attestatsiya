import { useState, useEffect, useCallback } from 'react'
import type { PersonalWord, WordSessionResult, VocabRating } from '../../types/personalVocabulary'
import { X, CheckCircle2, XCircle, HelpCircle, Star, Volume2, Zap, ChevronRight } from 'lucide-react'
import { speakNatural } from '../../lib/openaiTts'

interface QuickReviewProps {
  words: PersonalWord[]
  onComplete: (results: WordSessionResult[]) => void
  onExit: () => void
}

const RATING_OPTIONS: { value: VocabRating; label: string; icon: React.ReactNode; color: string; key: string }[] = [
  { value: 'bilmadim', label: 'Bilmadim', icon: <XCircle size={22} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 active:bg-red-300 dark:active:bg-red-900/70 border-red-200 dark:border-red-800', key: '1' },
  { value: 'qiynaldim', label: 'Qiynaldim', icon: <HelpCircle size={22} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 active:bg-yellow-300 dark:active:bg-yellow-900/70 border-yellow-200 dark:border-yellow-800', key: '2' },
  { value: 'bildim', label: 'Bildim', icon: <CheckCircle2 size={22} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 border-blue-200 dark:border-blue-800', key: '3' },
  { value: 'yodladim', label: 'Yodladim', icon: <Star size={22} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50 active:bg-green-300 dark:active:bg-green-900/70 border-green-200 dark:border-green-800', key: '4' },
]

/**
 * QuickReview — minimallashtirilgan, tezkor flashcard rejimi.
 * Maqsad: so'zni ko'rsatish → javobni ochish → bir tugma bilan baholash.
 * Hech qanday keraksiz animatsiya yoki UI elementlari yo'q.
 */
export default function QuickReview({ words, onComplete, onExit }: QuickReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState<WordSessionResult[]>([])
  const [lastRating, setLastRating] = useState<VocabRating | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const currentWord = words[currentIndex]
  const totalWords = words.length

  // Reset state for each new word
  useEffect(() => {
    setShowAnswer(false)
    setLastRating(null)
  }, [currentIndex])

  const handleRate = useCallback((rating: VocabRating) => {
    setLastRating(rating)
    
    const result: WordSessionResult = {
      vocabId: currentWord.id,
      english: currentWord.english,
      uzbek: currentWord.uzbek,
      level: currentWord.level,
      box: currentWord.box,
      result: rating === 'bilmadim' ? 'wrong' : 'correct',
      rating,
    }

    const newResults = [...results, result]

    // Brief delay before moving to next word
    setTimeout(() => {
      if (currentIndex + 1 < totalWords) {
        setResults(newResults)
        setCurrentIndex(prev => prev + 1)
      } else {
        setResults(newResults)
        setIsComplete(true)
      }
    }, 150)
  }, [currentIndex, currentWord, results, totalWords])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!showAnswer) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault()
          setShowAnswer(true)
        }
        return
      }
      const ratingMap: Record<string, VocabRating> = {
        '1': 'bilmadim', '2': 'qiynaldim', '3': 'bildim', '4': 'yodladim',
      }
      if (ratingMap[e.key]) {
        e.preventDefault()
        handleRate(ratingMap[e.key])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAnswer, isComplete, handleRate])

  const speakEnglish = useCallback(() => {
    if (currentWord?.english) {
      speakNatural(currentWord.english, 0.9).catch(() => {})
    }
  }, [currentWord])

  // Auto-speak when showing answer
  useEffect(() => {
    if (showAnswer && currentWord?.english) {
      const timer = setTimeout(() => speakNatural(currentWord.english, 0.9).catch(() => {}), 200)
      return () => clearTimeout(timer)
    }
  }, [showAnswer, currentWord])

  // Completion screen
  if (isComplete) {
    const correct = results.filter(r => r.result === 'correct').length
    const wrong = results.filter(r => r.result === 'wrong').length
    const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0

    return (
      <div className="max-w-lg mx-auto p-4 space-y-6 text-center">
        <div className="text-5xl mb-2">{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tezkor takrorlash yakunlandi!</h2>
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

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { setCurrentIndex(0); setResults([]); setIsComplete(false); setShowAnswer(false) }}
            className="flex-1 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-all border border-gray-200 dark:border-gray-700"
          >
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
        <p className="text-gray-500 mb-4">Takrorlash uchun so'zlar topilmadi</p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          Orqaga
        </button>
      </div>
    )
  }

  const progress = ((currentIndex + (showAnswer ? 1 : 0)) / totalWords) * 100
  const correctSoFar = results.filter(r => r.result === 'correct').length
  const wrongSoFar = results.filter(r => r.result === 'wrong').length

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Zap size={16} className="text-primary-500" />
          <span className="text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-700 dark:text-gray-300">{currentIndex + 1}</span>/{totalWords}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-green-600 dark:text-green-400 font-medium">{correctSoFar}✓</span>
          {wrongSoFar > 0 && <span className="text-red-500 font-medium">{wrongSoFar}✗</span>}
        </div>
        <button onClick={onExit} aria-label="Takrorlashdan chiqish" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 min-h-[280px] flex flex-col items-center justify-center p-8 relative">
        {/* Word Level Badge */}
        <span className="absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
          {currentWord.level}
        </span>

        {/* Last Rating Indicator */}
        {lastRating && (
          <div className="absolute top-4 right-4 animate-fadeOut pointer-events-none">
            {lastRating === 'bildim' && <CheckCircle2 size={20} className="text-blue-500" />}
            {lastRating === 'yodladim' && <Star size={20} className="text-green-500" />}
            {lastRating === 'qiynaldim' && <HelpCircle size={20} className="text-yellow-500" />}
            {lastRating === 'bilmadim' && <XCircle size={20} className="text-red-500" />}
          </div>
        )}

        {!showAnswer ? (
          <>
            {/* Question */}
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 leading-relaxed">
              {currentWord.english}
            </p>

            {/* Speak button */}
            <button
              onClick={(e) => { e.stopPropagation(); speakEnglish() }}
              className="p-2 rounded-xl text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 transition-all mb-4"
              title="Talaffuzni eshitish"
            >
              <Volume2 size={20} />
            </button>

            {/* Reveal button */}
            <button
              onClick={() => setShowAnswer(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg transition-all active:scale-[0.97] flex items-center gap-2"
            >
              Javobni ko'rish
              <ChevronRight size={18} />
            </button>
          </>
        ) : (
          <>
            {/* Answer */}
            {currentWord.phonetic && (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-1">{currentWord.phonetic}</p>
            )}
            <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 text-center mb-2">
              {currentWord.uzbek}
            </p>
            {currentWord.example && (
              <div className="text-center mb-4 max-w-sm space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  &ldquo;{currentWord.example.length > 100 ? currentWord.example.slice(0, 100) + '...' : currentWord.example}&rdquo;
                </p>
                {currentWord.example_uzbek && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 not-italic">
                    📖 {currentWord.example_uzbek}
                  </p>
                )}
              </div>
            )}

            {/* Rating Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleRate(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium border transition-all hover:scale-105 active:scale-95 ${opt.color}`}
                >
                  {opt.icon}
                  <span className="hidden sm:inline text-sm">{opt.label}</span>
                  <span className="text-[10px] opacity-50 ml-0.5 font-mono">{opt.key}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Keyboard Hint */}
      <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
        {!showAnswer
          ? 'Enter/Space — javobni ko\'rish'
          : '1-4 — baho berish'}
      </p>

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8) translateY(-10px); }
        }
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
