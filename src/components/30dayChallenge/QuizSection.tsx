import { useState, useCallback, useMemo } from 'react'
import { Check, X, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import type { ChallengeQuiz } from '../../data/30dayChallenge'

interface Props {
  quiz: ChallengeQuiz[]
  onComplete?: (score: number) => void
}

export default function QuizSection({ quiz, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)

  const handleAnswer = useCallback((qId: number, idx: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: idx }))
  }, [submitted])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    let correct = 0
    for (const q of quiz) {
      if (answers[q.id] === q.correct) correct++
    }
    const score = Math.round((correct / quiz.length) * 100)
    onComplete?.(score)
    setTimeout(() => setShowScoreAnimation(true), 100)
  }, [quiz, answers, onComplete])

  const handleReset = useCallback(() => {
    setAnswers({})
    setSubmitted(false)
    setShowScoreAnimation(false)
  }, [])

  const correctCount = useMemo(() =>
    submitted ? quiz.filter(q => answers[q.id] === q.correct).length : 0,
    [submitted, quiz, answers]
  )

  const score = submitted ? Math.round((correctCount / quiz.length) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Header with live score */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          📝 Test ({quiz.length} ta savol)
        </h3>
        {submitted && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm animate-pop-in ${
            score === 100
              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
              : score >= 70
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
          }`}>
            <Trophy size={16} className={score === 100 ? 'text-yellow-500' : ''} />
            {correctCount}/{quiz.length} to'g'ri ({score}%)
          </div>
        )}
      </div>

      {/* Score animation overlay */}
      {showScoreAnimation && (
        <div className="text-center py-6 animate-scale-in">
          <div className="text-5xl mb-2">
            {score === 100 ? '🏆' : score >= 70 ? '🌟' : score >= 50 ? '💪' : '📚'}
          </div>
          <p className="text-lg font-black text-gray-900 dark:text-gray-100">
            {score === 100 ? "Mukammal!" : score >= 70 ? "Zo'r!" : score >= 50 ? "Yaxshi!" : "Davom eting!"}
          </p>
        </div>
      )}

      {/* Questions */}
      {quiz.map((q, idx) => {
        const selected = answers[q.id]
        const isCorrect = submitted && selected === q.correct
        const isWrong = submitted && selected !== null && selected !== q.correct

        return (
          <div
            key={q.id}
            className={`
              rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300
              ${isCorrect
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600 shadow-md'
                : isWrong
                  ? 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-400 dark:border-red-600 animate-wrong-shake'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600'
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{q.question}</span>
            </p>

            <div className="space-y-2 pl-8">
              {q.options.map((opt, optIdx) => {
                const isSelected = selected === optIdx
                const showCorrect = submitted && q.correct === optIdx

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswer(q.id, optIdx)}
                    disabled={submitted}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left
                      transition-all duration-200
                      ${showCorrect
                        ? 'bg-green-100 dark:bg-green-900/40 border-2 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200'
                        : isSelected && !isCorrect
                          ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                          : isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-600'
                            : 'bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }
                      ${submitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                    `}
                  >
                    <span className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                      ${showCorrect
                        ? 'bg-green-500 text-white shadow-md'
                        : isSelected && !isCorrect
                          ? 'bg-red-500 text-white shadow-md'
                          : isSelected
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {showCorrect ? <Check size={14} /> : isSelected && !isCorrect ? <X size={14} /> : String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className={`
                mt-4 ml-8 p-3 rounded-xl text-sm animate-slide-down
                ${isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }
              `}>
                <p className="font-bold mb-1 flex items-center gap-1">
                  {isCorrect ? '✅ To\'g\'ri!' : '❌ Noto\'g\'ri'}
                  {isCorrect && <Sparkles size={14} />}
                </p>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        )
      })}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.length}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg disabled:shadow-none"
          >
            {Object.keys(answers).length < quiz.length
              ? `Barcha savollarga javob bering (${Object.keys(answers).length}/${quiz.length})`
              : '✅ Natijani tekshirish'}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all active:scale-[0.98]"
          >
            <RotateCcw size={16} className="inline mr-1" />
            Qayta ishlash
          </button>
        )}
      </div>
    </div>
  )
}
