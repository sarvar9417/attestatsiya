import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { useProgress } from '../../hooks/useProgress'
import { AVATARS } from '../ui/AvatarSelector'
import { LogOut, Flame, Zap } from 'lucide-react'

export default function TopBar() {
  const { t } = useI18n()
  const { currentLevel, currentWeek, currentDay, streak: localStreak, userName: localName, avatarId, totalXP } = useStore()
  const { displayName, signOut } = useAuth()
  const { dbStreak } = useProgress()

  const userName = displayName || localName
  const streak   = dbStreak   || localStreak

  const dayNum = Math.max(1, currentDay || 1)
  const dayInWeek = ((dayNum - 1) % 7) + 1

  const level =
    totalXP >= 5000 ? { label: 'B2', color: 'from-purple-500 to-violet-600', emoji: '💎' } :
    totalXP >= 2000 ? { label: 'B1+', color: 'from-blue-500 to-cyan-500', emoji: '⭐' } :
    totalXP >= 1000 ? { label: 'B1', color: 'from-blue-400 to-blue-600', emoji: '🌟' } :
    totalXP >= 500  ? { label: 'A2', color: 'from-primary-500 to-primary-600', emoji: '📚' } :
    totalXP >= 100  ? { label: 'A1', color: 'from-green-400 to-emerald-500', emoji: '🌱' } :
                      { label: 'A0', color: 'from-gray-400 to-gray-500', emoji: '🎯' }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? t('dashboard.greetingMorning') :
    hour < 18 ? t('dashboard.greetingAfternoon')  : t('dashboard.greetingEvening')

  return (
    <header className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0 gap-2">
      {/* Left: Avatar + Name */}
      <div className="min-w-0 flex items-center gap-2.5">
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-lg">
            {AVATARS.find(a => a.id === avatarId)?.emoji ?? '👤'}
          </div>
          {streak > 0 && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
              <Flame size={8} className="text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-gray-400 font-medium leading-tight">{greeting}</p>
          <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">
            {userName || t('sidebar.userFallback')}
          </h1>
        </div>
      </div>

      {/* Right: Stats */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 border border-orange-100">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600">{streak}</span>
          </div>
        )}

        {/* XP */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 border border-violet-100">
          <Zap size={12} className="text-violet-500" />
          <span className="text-xs font-bold text-violet-600">{totalXP}</span>
        </div>

        {/* Level badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${level.color} text-white`}>
          <span className="text-xs">{level.emoji}</span>
          <span className="text-xs font-bold">{currentLevel}</span>
          <span className="text-[10px] opacity-70">W{currentWeek}·D{dayInWeek}</span>
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          title={t('dashboard.signOutTitle')}
          aria-label={t('dashboard.signOutTitle')}
          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
