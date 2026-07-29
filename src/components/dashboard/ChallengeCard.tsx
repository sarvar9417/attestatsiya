import { useNavigate } from 'react-router-dom'
import { Target, ChevronRight, Mic } from 'lucide-react'

export default function ChallengeCard() {
  const progress = (() => {
    try {
      const saved = localStorage.getItem('30dayChallenge_progress')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { completedDays: [], currentDay: 1, totalXp: 0 }
  })()
  const completedDays = progress.completedDays?.length ?? 0
  const totalDays = 30
  const totalXp = progress.totalXp ?? 0
  const navigate = useNavigate()
  const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

  return (
    <button
      onClick={() => navigate('/30-day-challenge')}
      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 text-white text-left hover:shadow-lg active:scale-[0.98] transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Target size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-black text-sm">30-Day Speaking Challenge</p>
          <Mic size={14} className="text-white/70" />
        </div>
        <p className="text-xs text-white/70 mt-0.5">{completedDays}/{totalDays} kun bajarildi</p>
        {/* Progress bar */}
        <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-white/60 mt-0.5">{totalXp} XP · {progressPct}%</p>
      </div>
      <ChevronRight size={18} className="text-white/50 group-hover:text-white transition-colors shrink-0" />
    </button>
  )
}
