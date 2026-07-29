import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { X, Star, Zap, BookOpen, Trophy, ChevronRight } from 'lucide-react'
import Confetti from '../ui/Confetti'

interface CelebrationProps {
  show: boolean
  lessonTitle: string
  score: number
  xpEarned: number
  newWords: number
  onClose: () => void
  onNextLesson?: () => void
}

function StarRating({ score }: { score: number }) {
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          size={32}
          className={`transition-all duration-500 ${
            i <= stars
              ? 'text-amber-400 fill-amber-400 drop-shadow-lg'
              : 'text-gray-200'
          }`}
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  )
}

export default function LessonCelebration({
  show,
  lessonTitle,
  score,
  xpEarned,
  newWords,
  onClose,
  onNextLesson,
}: CelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { streak, totalXP } = useStore()

  useEffect(() => {
    if (show) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!show) return null

  const message =
    score >= 90 ? "Ajoyib natija! Siz haqiqiy professional bo'lyapsiz!" :
    score >= 70 ? "Yaxshi natija! Davom eting!" :
    score >= 50 ? "Yaxshi harakat! Yana biroz ko'proq mashq qiling." :
    "Mashq qilishda davom eting! Har safar yaxshiroq bo'lasiz."

  const emoji =
    score >= 90 ? '🏆' :
    score >= 70 ? '🌟' :
    score >= 50 ? '👍' :
    '💪'

  return (
    <>
      <Confetti show={showConfetti} duration={3000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in">
          {/* Header gradient */}
          <div className={`h-2 bg-gradient-to-r ${
            score >= 90 ? 'from-amber-400 to-orange-500' :
            score >= 70 ? 'from-primary-500 to-b1-500' :
            'from-gray-300 to-gray-400'
          }`} />

          <div className="p-6 text-center">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>

            {/* Emoji + Title */}
            <div className="text-5xl mb-3">{emoji}</div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Dars yakunlandi!</h2>
            <p className="text-sm text-gray-500 font-medium">{lessonTitle}</p>

            {/* Stars */}
            <div className="my-5">
              <StarRating score={score} />
            </div>

            {/* Score */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-black ${
              score >= 90 ? 'bg-amber-50 text-amber-600' :
              score >= 70 ? 'bg-primary-50 text-primary-600' :
              'bg-gray-50 text-gray-600'
            }`}>
              {score}%
            </div>

            {/* Message */}
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{message}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-violet-50 rounded-xl p-2.5">
                <Zap size={16} className="text-violet-500 mx-auto mb-1" />
                <p className="text-sm font-black text-violet-600">+{xpEarned}</p>
                <p className="text-[10px] text-violet-400">XP</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5">
                <BookOpen size={16} className="text-emerald-500 mx-auto mb-1" />
                <p className="text-sm font-black text-emerald-600">{newWords}</p>
                <p className="text-[10px] text-emerald-400">Yangi so'z</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-2.5">
                <Trophy size={16} className="text-orange-500 mx-auto mb-1" />
                <p className="text-sm font-black text-orange-600">{streak}</p>
                <p className="text-[10px] text-orange-400">Streak</p>
              </div>
            </div>

            {/* Total XP */}
            <p className="mt-3 text-xs text-gray-400">
              Jami XP: <span className="font-bold text-gray-600">{totalXP}</span>
            </p>

            {/* Actions */}
            <div className="mt-5 space-y-2">
              {onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 transition-all flex items-center justify-center gap-2"
                >
                  Keyingi dars <ChevronRight size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Davom etish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
