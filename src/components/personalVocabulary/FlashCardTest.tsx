import { useState, useEffect, useCallback, useMemo } from 'react'
import type { PersonalWord, WordSessionResult, VocabRating } from '../../types/personalVocabulary'
import { ChevronLeft, ChevronRight, X, CheckCircle2, XCircle, HelpCircle, Star, Trophy, RotateCcw, BarChart3, Clock, Brain } from 'lucide-react'
import { useI18n } from '../../i18n'

interface FlashCardTestProps {
  words: PersonalWord[]
  onComplete: (results: WordSessionResult[]) => void
  onExit: () => void
  initialMode?: TestMode
}

type TestMode = 'translation' | 'fill-blank' | 'type-answer' | 'definition'

const RATING_OPTIONS: { value: VocabRating; label: string; icon: React.ReactNode; color: string; keyLabel: string }[] = [
  { value: 'bilmadim', label: 'Bilmadim', icon: <XCircle size={20} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800', keyLabel: '1' },
  { value: 'qiynaldim', label: 'Qiynaldim', icon: <HelpCircle size={20} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800', keyLabel: '2' },
  { value: 'bildim', label: 'Bildim', icon: <CheckCircle2 size={20} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800', keyLabel: '3' },
  { value: 'yodladim', label: 'Yodladim', icon: <Star size={20} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800', keyLabel: '4' },
]

function ProgressDots({ total, current, results }: { total: number; current: number; results: WordSessionResult[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: Math.min(total, 20) }, (_, i) => {
        const isActive = i === current
        const isDone = i < current
        const result = results[i]
        const isCorrect = result?.result === 'correct'
        return (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive
                ? 'w-6 bg-primary-500 shadow-sm shadow-primary-500/50'
                : isDone
                ? isCorrect
                  ? 'w-2 bg-green-400'
                  : 'w-2 bg-red-400'
                : 'w-2 bg-gray-200 dark:bg-gray-700'
            }`}
          />
        )
      })}
      {total > 20 && <span className="text-[10px] text-gray-400 ml-1">+{total - 20}</span>}
    </div>
  )
}

function SessionSummary({ results, words, onFinish, onRestart }: {
  results: WordSessionResult[]
  words: PersonalWord[]
  onFinish: () => void
  onRestart: () => void
}) {
  const correct = results.filter(r => r.result === 'correct').length
  const wrong = results.filter(r => r.result === 'wrong').length
  const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0
  
  const correctWords = results.filter(r => r.result === 'correct')
  const wrongWords = results.filter(r => r.result === 'wrong')

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Trophy size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Test yakunlandi!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {words.length} ta so'zdan {correct} tasini bildingiz
        </p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
              className="text-gray-100 dark:text-gray-700" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - accuracy / 100)}`}
              className="text-primary-500 transition-all duration-1000"
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{accuracy}%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Aniqlik</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800/30">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{correct}</div>
          <div className="text-[10px] text-green-600/70 dark:text-green-400/70 uppercase tracking-wider">To'g'ri</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-100 dark:border-red-800/30">
          <div className="text-xl font-bold text-red-600 dark:text-red-400">{wrong}</div>
          <div className="text-[10px] text-red-600/70 dark:text-red-400/70 uppercase tracking-wider">Xato</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700/30">
          <div className="text-xl font-bold text-gray-600 dark:text-gray-400">{results.length}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Jami</div>
        </div>
      </div>

      {/* Words Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {correctWords.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Bilgan so'zlar
            </h4>
            <div className="space-y-1">
              {correctWords.map((r, i) => (
                <div key={i} className="text-xs text-gray-600 dark:text-gray-400 bg-green-50/50 dark:bg-green-900/10 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{r.english}</span>
                  {' — '}{r.uzbek}
                </div>
              ))}
            </div>
          </div>
        )}
        {wrongWords.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
              <XCircle size={14} /> Bililmagan so'zlar
            </h4>
            <div className="space-y-1">
              {wrongWords.map((r, i) => (
                <div key={i} className="text-xs text-gray-600 dark:text-gray-400 bg-red-50/50 dark:bg-red-900/10 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{r.english}</span>
                  {' — '}{r.uzbek}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-all border border-gray-200 dark:border-gray-700"
        >
          <RotateCcw size={18} />
          Qayta boshlash
        </button>
        <button
          onClick={onFinish}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
        >
          <X size={18} />
          Yakunlash
        </button>
      </div>
    </div>
  )
}

export default function FlashCardTest({ words, onComplete, onExit, initialMode }: FlashCardTestProps) {
  const { t } = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState<TestMode>(initialMode || 'translation')
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState<WordSessionResult[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerActive, setTimerActive] = useState(true)

  // Timer
  useEffect(() => {
    if (!timerActive) return
    const interval = setInterval(() => {
      setElapsedTime(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive])

  const currentWord = words[currentIndex]
  const totalWords = words.length
  const progress = totalWords > 0 ? ((currentIndex) / totalWords) * 100 : 0

  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedTime / 60)
    const secs = elapsedTime % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [elapsedTime])

  const resetCard = useCallback(() => {
    setUserAnswer('')
    setShowAnswer(false)
    setIsFlipped(false)
  }, [])

  useEffect(() => {
    resetCard()
  }, [currentIndex, resetCard])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setIsFlipped(true)
  }, [])

  const handleRate = useCallback((rating: VocabRating) => {
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
    setResults(newResults)

    if (currentIndex + 1 < totalWords) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setTimerActive(false)
      setShowSummary(true)
    }
  }, [currentIndex, currentWord, results, totalWords])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!showAnswer) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          handleShowAnswer()
        }
      } else {
        const ratingMap: Record<string, VocabRating> = {
          '1': 'bilmadim', '2': 'qiynaldim', '3': 'bildim', '4': 'yodladim',
        }
        if (ratingMap[e.key]) {
          e.preventDefault()
          handleRate(ratingMap[e.key])
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAnswer, handleShowAnswer, handleRate])

  const handleSkip = () => {
    const result: WordSessionResult = {
      vocabId: currentWord.id,
      english: currentWord.english,
      uzbek: currentWord.uzbek,
      level: currentWord.level,
      box: currentWord.box,
      result: 'wrong',
    }
    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 < totalWords) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setTimerActive(false)
      setShowSummary(true)
    }
  }

  const handleTypeAnswer = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.uzbek.trim().toLowerCase()
    if (isCorrect) {
      handleRate('bildim')
    } else {
      setShowAnswer(true)
    }
  }

  const getQuestion = (): { question: string; answer: string } => {
    switch (mode) {
      case 'translation':
        return { question: currentWord.english, answer: currentWord.uzbek }
      case 'fill-blank': {
        const sentence = currentWord.example || `I want to learn the word ${currentWord.english}.`
        const blanked = sentence.replace(
          new RegExp(`\\b${currentWord.english}\\b`, 'i'),
          '_____'
        )
        return { question: blanked, answer: currentWord.english }
      }
      case 'type-answer':
        return { question: currentWord.english, answer: currentWord.uzbek }
      case 'definition':
        return { question: currentWord.uzbek, answer: currentWord.english }
      default:
        return { question: currentWord.english, answer: currentWord.uzbek }
    }
  }

  const { question, answer } = getQuestion()

  // Show summary screen
  if (showSummary) {
    return (
      <SessionSummary
        results={results}
        words={words}
        onFinish={() => onComplete(results)}
        onRestart={() => {
          setCurrentIndex(0)
          setResults([])
          setShowSummary(false)
          setElapsedTime(0)
          setTimerActive(true)
        }}
      />
    )
  }

  if (totalWords === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 mb-4">{t('personalVocab.noWordsForReview') || "Takrorlash uchun so'zlar topilmadi"}</p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700">
          Orqaga
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {t('personalVocab.flashCardTest') || 'Flash Card Test'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {totalWords}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
            <Clock size={12} />
            {formattedTime}
          </div>
          <button
            onClick={onExit}
            aria-label="Flash card testidan chiqish"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar + Dots */}
      <div className="space-y-2">
        <ProgressDots total={totalWords} current={currentIndex} results={results} />
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-1.5">
        {([
          { value: 'translation' as const, label: 'Tarjima' },
          { value: 'fill-blank' as const, label: "Bo'sh joy" },
          { value: 'type-answer' as const, label: 'Yozish' },
          { value: 'definition' as const, label: 'Teskari' },
        ]).map((m) => (
          <button
            key={m.value}
            onClick={() => { setMode(m.value); resetCard() }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m.value
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Card with 3D Flip */}
      <div className="perspective-1000" style={{ perspective: '1000px' }}>
        <div
          className={`relative transition-transform duration-500 ease-in-out ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d', minHeight: '320px' }}
        >
          {/* Front of Card */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800/90 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {!showAnswer ? (
              <>
                {/* Mode indicator */}
                <div className="flex items-center gap-1.5 mb-4 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                  <Brain size={12} />
                  {mode === 'translation' && "So'zni tarjima qiling"}
                  {mode === 'fill-blank' && "Bo'sh joyni to'ldiring"}
                  {mode === 'type-answer' && "Javobni yozing"}
                  {mode === 'definition' && "So'zni toping"}
                </div>

                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center leading-relaxed">
                  {question}
                </p>

                {/* Type answer mode */}
                {mode === 'type-answer' && (
                  <div className="w-full max-w-md">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTypeAnswer()}
                      placeholder="Javobni yozing..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                      autoFocus
                    />
                    <button
                      onClick={handleTypeAnswer}
                      disabled={!userAnswer.trim()}
                      className="w-full mt-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                      Tekshirish
                    </button>
                  </div>
                )}

                {/* Show answer button for other modes */}
                {(mode === 'translation' || mode === 'definition' || mode === 'fill-blank') && (
                  <button
                    onClick={handleShowAnswer}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
                  >
                    Javobni ko'rish
                  </button>
                )}

                {/* Keyboard hint */}
                {mode !== 'type-answer' && (
                  <p className="text-center text-[11px] text-gray-400 mt-4">
                    Enter/Space — javobni ko'rish
                  </p>
                )}
              </>
            ) : (
              /* Back of card - will be hidden via backface-visibility and shown via rotateY */
              null
            )}
          </div>

          {/* Back of Card */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800/90 rounded-2xl p-8 shadow-lg border border-primary-100 dark:border-primary-800/30 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {showAnswer && (
              <>
                <div className="flex items-center gap-1.5 mb-3 text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Javob
                </div>

                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3 text-center">
                  {answer}
                </p>

                {currentWord.example && (
                  <div className="mb-4 text-center max-w-md space-y-1">
                    <p className="text-sm text-gray-500 italic">
                      &ldquo;{currentWord.example}&rdquo;
                    </p>
                    {currentWord.example_uzbek && (
                      <p className="text-xs text-gray-500 not-italic">
                        📖 {currentWord.example_uzbek}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                  <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">{currentWord.level}</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>Box {currentWord.box}</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Siz bu so'zni qanchalik yaxshi bilasiz?
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleRate(opt.value)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium border transition-all hover:scale-105 active:scale-95 ${opt.color}`}
                    >
                      {opt.icon}
                      <span className="hidden xs:inline">{opt.label}</span>
                      <span className="text-[10px] opacity-50 ml-0.5">({opt.keyLabel})</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Oldingi
        </button>
        
        {/* Session Progress */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <BarChart3 size={12} />
          <span>{results.filter(r => r.result === 'correct').length} ✓</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{results.filter(r => r.result === 'wrong').length} ✗</span>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium"
        >
          O'tkazib yuborish
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
