import { Award, TrendingUp, Trophy, Loader2 } from 'lucide-react'
import { DaysRemaining } from './tandemHelpers'
import type { WeeklyDuelData } from '../../services/tandemService'

interface TandemWeeklyDuelCardProps {
  currentUserId: string
  tandemPair: { id: string; user_a: string }
  weeklyDuel: WeeklyDuelData | null
  weeklyLoading: boolean
}

export default function TandemWeeklyDuelCard({
  currentUserId, tandemPair, weeklyDuel, weeklyLoading,
}: TandemWeeklyDuelCardProps) {
  const isUserA = currentUserId === tandemPair.user_a
  const myXP = isUserA ? (weeklyDuel?.user_a_xp ?? 0) : (weeklyDuel?.user_b_xp ?? 0)
  const theirXP = isUserA ? (weeklyDuel?.user_b_xp ?? 0) : (weeklyDuel?.user_a_xp ?? 0)

  return (
    <div className="card p-5 space-y-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-2 border-emerald-100 dark:border-emerald-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-emerald-600" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Haftalik Duel</h3>
        </div>
        {weeklyDuel?.settled_at ? (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
            ✅ Yakunlangan
          </span>
        ) : (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
            🏃 Davom etmoqda
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Hafta davomida eng ko'p XP yig'gan g'olib bo'ladi! G'olib nomi profilingizda ko'rinadi.
      </p>

      {weeklyLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 size={18} className="animate-spin text-emerald-500" />
        </div>
      ) : weeklyDuel ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Siz: <span className="text-emerald-600 font-bold">{myXP} XP</span>
              </span>
              <span className="text-gray-400 font-bold">VS</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Juft: <span className="text-blue-600 font-bold">{theirXP} XP</span>
              </span>
            </div>

            <div className="relative h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              {(() => {
                const total = weeklyDuel.user_a_xp + weeklyDuel.user_b_xp
                const pctA = total > 0 ? (weeklyDuel.user_a_xp / total) * 100 : 50
                const pctB = total > 0 ? (weeklyDuel.user_b_xp / total) * 100 : 50
                return (
                  <>
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pctA}%` }} />
                    <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-400 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${pctB}%` }} />
                  </>
                )
              })()}
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <TrendingUp size={12} />
              <span>Jami: {weeklyDuel.user_a_xp + weeklyDuel.user_b_xp} XP</span>
            </div>
          </div>

          {weeklyDuel.winner_id && weeklyDuel.settled_at && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 text-center">
              <Trophy size={18} className="mx-auto text-yellow-500 mb-1" />
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">🏆 Hafta g'olibi!</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(() => {
                  const isDraw = weeklyDuel.user_a_xp === weeklyDuel.user_b_xp
                  const userWon = isUserA
                    ? weeklyDuel.user_a_xp > weeklyDuel.user_b_xp
                    : weeklyDuel.user_b_xp > weeklyDuel.user_a_xp
                  return isDraw ? "Durang!" : userWon ? 'Siz gʻalaba qozondingiz!' : "Juftingiz gʻalaba qozondi!"
                })()}
              </p>
            </div>
          )}

          {!weeklyDuel.settled_at && weeklyDuel.week_start && (
            <DaysRemaining weekStart={weeklyDuel.week_start} />
          )}
        </>
      ) : (
        <div className="text-center py-3">
          <p className="text-xs text-gray-400">Haftalik duel ma'lumotlari yuklanmoqda...</p>
        </div>
      )}
    </div>
  )
}
