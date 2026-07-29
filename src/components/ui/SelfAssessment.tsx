import { useState, useEffect } from 'react'

interface SelfAssessmentProps {
  lessonId: string
  onAssessmentComplete?: (beforeScore: number, afterScore: number) => void
  showAfterLesson?: boolean
}

const ASSESSMENT_OPTIONS = [
  { score: 1, emoji: '😕', label: 'Hech narsa bilmayman' },
  { score: 2, emoji: '🤔', label: 'Kam bilaman' },
  { score: 3, emoji: '😐', label: "O'rtacha" },
  { score: 4, emoji: '🙂', label: 'Yaxshi bilaman' },
  { score: 5, emoji: '😎', label: 'Mukammal bilaman' },
]

function getStorageKey(lessonId: string, phase: 'before' | 'after') {
  return `self-assessment-${lessonId}-${phase}`
}

export default function SelfAssessment({
  lessonId,
  onAssessmentComplete,
  showAfterLesson = false,
}: SelfAssessmentProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [beforeScore, setBeforeScore] = useState<number | null>(null)
  const [improvementMessage, setImprovementMessage] = useState<string | null>(null)

  useEffect(() => {
    if (showAfterLesson) {
      const savedBefore = localStorage.getItem(getStorageKey(lessonId, 'before'))
      if (savedBefore) {
        setBeforeScore(parseInt(savedBefore, 10))
      }
    } else {
      const savedBefore = localStorage.getItem(getStorageKey(lessonId, 'before'))
      if (savedBefore) {
        setSelectedScore(parseInt(savedBefore, 10))
        setIsSubmitted(true)
      }
    }
  }, [lessonId, showAfterLesson])

  const handleSelect = (score: number) => {
    if (isSubmitted) return
    setSelectedScore(score)
  }

  const handleSubmit = () => {
    if (selectedScore === null) return

    const phase = showAfterLesson ? 'after' : 'before'
    localStorage.setItem(getStorageKey(lessonId, phase), selectedScore.toString())
    setIsSubmitted(true)

    if (showAfterLesson && beforeScore !== null) {
      const improvement = selectedScore - beforeScore
      if (improvement > 0) {
        setImprovementMessage(
          `Ajoyib! Siz ${improvement} ball yaxshiladingiz! 🎉`
        )
      } else if (improvement === 0) {
        setImprovementMessage('Siz o\'z darajangizni saqlab qoldingiz.')
      } else {
        setImprovementMessage('Keyingi safar yaxshiroq natija ko\'rsatasiz!')
      }
    }

    if (onAssessmentComplete && beforeScore !== null) {
      onAssessmentComplete(beforeScore, selectedScore)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {showAfterLesson
          ? 'Darsdan keyin o\'z bilimingizni baholang:'
          : 'Bu mavzoni qanchalik bilasiz?'}
      </h3>

      {!isSubmitted ? (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {ASSESSMENT_OPTIONS.map((option) => (
            <button
              key={option.score}
              onClick={() => handleSelect(option.score)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl
                transition-all duration-200 border-2
                ${
                  selectedScore === option.score
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-2xl sm:text-3xl">{option.emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          {selectedScore !== null && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">
                {ASSESSMENT_OPTIONS[selectedScore - 1].emoji}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {ASSESSMENT_OPTIONS[selectedScore - 1].label}
              </span>
            </div>
          )}

          {improvementMessage && (
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-2 animate-fade-in">
              {improvementMessage}
            </p>
          )}
        </div>
      )}

      {!isSubmitted && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedScore === null}
            className="
              px-5 py-2 rounded-xl text-sm font-semibold
              bg-primary-600 hover:bg-primary-700 active:bg-primary-800
              text-white transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md
            "
          >
            Tasdiqlash
          </button>
        </div>
      )}
    </div>
  )
}
