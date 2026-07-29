import { useState, useEffect } from 'react'
import { X, Flame } from 'lucide-react'
import Confetti from '../ui/Confetti'
import { STREAK_MILESTONES } from '../../store/progressSlice'

interface StreakCelebrationProps {
  show: boolean
  streak: number
  onClose: () => void
}

export default function StreakCelebration({ show, streak, onClose }: StreakCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (show) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!show) return null

  const milestone = STREAK_MILESTONES.find(m => m.days === streak)
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak)

  const tier =
    streak >= 90 ? { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-600', emoji: '👑' } :
    streak >= 60 ? { bg: 'from-purple-500 to-violet-500', text: 'text-purple-600', emoji: '💎' } :
    streak >= 30 ? { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600', emoji: '⭐' } :
    streak >= 21 ? { bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-600', emoji: '⚡' } :
    streak >= 14 ? { bg: 'from-green-500 to-emerald-500', text: 'text-green-600', emoji: '💪' } :
    streak >= 7  ? { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', emoji: '🔥' } :
    streak >= 3  ? { bg: 'from-orange-400 to-yellow-400', text: 'text-orange-500', emoji: '🔥' } :
                   { bg: 'from-gray-400 to-gray-500', text: 'text-gray-500', emoji: '🔥' }

  return (
    <>
      <Confetti show={showConfetti} duration={3000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`h-2 bg-gradient-to-r ${tier.bg}`} />

          <div className="p-6 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>

            {/* Streak Icon */}
            <div className="relative inline-block mb-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tier.bg} flex items-center justify-center`}>
                <Flame size={40} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 text-2xl">{tier.emoji}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-gray-900 mb-1">
              {streak} kunlik streak!
            </h2>

            {/* Milestone badge */}
            {milestone && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full mt-2">
                <span className="text-sm">{milestone.icon}</span>
                <span className="text-xs font-bold text-amber-700">{milestone.label}</span>
                <span className="text-xs text-amber-500">+{milestone.xp} XP</span>
              </div>
            )}

            {/* Motivation */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {streak >= 90 ? "Siz EnglishPath Graduate bo'ldingiz! Ajoyib yutuq!" :
               streak >= 60 ? "60 kun! Siz haqiqiy champion!" :
               streak >= 30 ? "30 kun! Siz juda kuchli!" :
               streak >= 21 ? "21 kunlik streak! Yo'ldan qaytmang!" :
               streak >= 14 ? "14 kun! Odat shakllanmoqda!" :
               streak >= 7  ? "7 kun! Birinchi haftani yakunladingiz!" :
               streak >= 3  ? "3 kun! Davom eting!" :
               "Dastlabki qadamlar eng muhimi!"}
            </p>

            {/* Next milestone */}
            {nextMilestone && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Keyingi maqsad</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm">{nextMilestone.icon}</span>
                  <span className="text-sm font-bold text-gray-700">{nextMilestone.days} kun</span>
                  <span className="text-xs text-gray-400">(+{nextMilestone.xp} XP)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tier.bg} transition-all duration-700`}
                    style={{ width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 transition-all"
            >
              Davom etish
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
