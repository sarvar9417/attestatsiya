import { Trophy, Target, Sparkles, Clock } from 'lucide-react'
import type { ChallengeDay } from '../../data/30dayChallenge'

interface Props {
  day: ChallengeDay
  isCompleted: boolean
  completedCount: number
  totalDays: number
}

export default function ChallengeHeader({ day, isCompleted, completedCount, totalDays }: Props) {
  const progressPct = Math.round((completedCount / totalDays) * 100)

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-400/10 rounded-full blur-lg" />

      <div className="relative p-4 sm:p-5">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <Clock size={12} />
            Kun {day.day} / {totalDays}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
            <Target size={12} />
            {day.level}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-400/30 px-3 py-1 rounded-full animate-pop-in">
              ✅ Bajarildi
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-2xl font-black mb-1 leading-tight">{day.title}</h2>
        <p className="text-white/70 text-sm flex items-center gap-1">
          <Sparkles size={14} />
          {day.learningObjectives.length} ta o'rganish maqsadi
        </p>

        {/* Progress section */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span className="flex items-center gap-1">
              <Trophy size={12} />
              Umumiy taraqqiyot
            </span>
            <span className="font-bold text-white/90">{completedCount}/{totalDays} kun</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-white via-yellow-200 to-green-300 transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
