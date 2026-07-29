import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { BookOpen, Zap, ChevronRight, Sparkles } from 'lucide-react'

export default function StartLessonButton() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { todayXP, streak, lessonProgress, lessons } = useStore()

  const completedLessons = Object.keys(lessonProgress).length
  const totalLessons = lessons.length || 137
  const progressPct = Math.round((completedLessons / totalLessons) * 100)

  const motivationalText =
    streak >= 7 ? "Streak saqlab qoling! Davom eting!" :
    streak >= 3 ? "Ajoyib harakat! Yana biroz!" :
    todayXP > 0 ? "Bugun allaqachon boshlagansiz!" :
    "Yangi darsni boshlang!"

  return (
    <button
      onClick={() => navigate('/lesson')}
      aria-label={t('dashboard.startLessonTitle')}
      className="w-full rounded-2xl overflow-hidden text-left transition-all active:scale-[0.98] group"
    >
      {/* Main gradient background */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-b1-600 p-4 sm:p-5">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Icon with pulse */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
              <Sparkles size={12} className="text-amber-800" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-black text-base sm:text-lg leading-tight">
              {t('dashboard.startLessonTitle')}
            </h2>
            <p className="text-white/70 text-xs mt-0.5">{motivationalText}</p>

            {/* Mini stats */}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-white/60 text-[10px]">
                <Zap size={10} /> {todayXP} XP
              </span>
              <span className="flex items-center gap-1 text-white/60 text-[10px]">
                🔥 {streak} streak
              </span>
              <span className="flex items-center gap-1 text-white/60 text-[10px]">
                📚 {completedLessons}/{totalLessons}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight size={24} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-white/40 text-[10px] mt-1 text-right">{progressPct}% umumiy progress</p>
        </div>
      </div>
    </button>
  )
}
