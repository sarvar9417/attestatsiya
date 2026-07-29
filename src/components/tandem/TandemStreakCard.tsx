import { Flame } from 'lucide-react'

interface TandemStreakCardProps {
  streak: number
  totalXp: number
  lastBothActive: string | null
}

const streakLevel = (streak: number): string =>
  streak >= 30 ? 'legendary' : streak >= 14 ? 'epic' : streak >= 7 ? 'great' : streak >= 3 ? 'good' : 'none'

const streakColors: Record<string, string> = {
  none: 'text-gray-400', good: 'text-orange-400', great: 'text-orange-500',
  epic: 'text-purple-500', legendary: 'text-yellow-500',
}
const streakIcons: Record<string, string> = {
  none: '🔥', good: '🔥', great: '🔥🔥', epic: '💪', legendary: '👑',
}

const streakLabel = (s: number) =>
  s < 3 ? "Boshlang'ich" : s < 7 ? `${7 - s} kun qoldi` : s < 14 ? '🔥🔥 7-kun!' : s < 30 ? '💪 14-kun!' : '👑 30-kun!'

export default function TandemStreakCard({ streak, totalXp, lastBothActive }: TandemStreakCardProps) {
  const level = streakLevel(streak)
  const daysSinceLastBoth = lastBothActive
    ? Math.floor((Date.now() - new Date(lastBothActive).getTime()) / 86400000)
    : '-'

  return (
    <div className="card p-5 space-y-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border-2 border-orange-100 dark:border-orange-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={20} className={streakColors[level]} />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Juftlik Streak</h3>
        </div>
        {streak > 0 && (
          <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
            {streakIcons[level]} {streak} kun
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-orange-100 dark:bg-orange-900/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
          {streakLabel(streak)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{streak}</p>
          <p className="text-gray-400">Ketma-ket kun</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{totalXp}</p>
          <p className="text-gray-400">Umumiy XP</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{daysSinceLastBoth}</p>
          <p className="text-gray-400">Oxirgi birgalikda</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {[3, 7, 14, 30].map((milestone) => (
          <span
            key={milestone}
            className={`text-xs px-2 py-0.5 rounded-full ${
              streak >= milestone
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}
          >
            {streak >= milestone ? '✅' : '🔒'} {milestone} kun
          </span>
        ))}
      </div>
    </div>
  )
}
