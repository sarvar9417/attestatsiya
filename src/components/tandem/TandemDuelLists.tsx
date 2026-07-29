import { Target, Sword, Zap, ArrowRight } from 'lucide-react'
import { getDuelById } from '../../services/tandemService'
import type { DuellistItem } from '../../types/tandem'

interface TandemDuelListsProps {
  pendingOpponentDuels: DuellistItem[]
  activeDuels: DuellistItem[]
  onSetActiveDuel: (duel: any) => void
  onCancelDuel: (duelId: string) => void
}

export default function TandemDuelLists({
  pendingOpponentDuels, activeDuels, onSetActiveDuel, onCancelDuel,
}: TandemDuelListsProps) {
  return (
    <>
      {/* Pending Duels (Opponent's turn) */}
      {pendingOpponentDuels.length > 0 && (
        <div className="card p-5 space-y-3 border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/20">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-blue-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Sizni kutayotgan duellar ({pendingOpponentDuels.length})
            </h3>
          </div>
          {pendingOpponentDuels.map((duel) => (
            <div key={duel.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <Sword size={16} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {duel.mode === 'lesson' ? (duel.lessonTitle ? `📘 ${duel.lessonTitle}` : 'Dars dueli') :
                     duel.mode === 'vocab' ? "So'z dueli" :
                     duel.mode === 'grammar' ? 'Grammatika dueli' :
                     duel.mode === 'reading' ? "O'qish dueli" :
                     'Speaking dueli'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.max(0, Math.floor((new Date(duel.expiresAt).getTime() - Date.now()) / 3600000))} soat qoldi
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  const fullDuel = await getDuelById(duel.id)
                  if (fullDuel) onSetActiveDuel(fullDuel)
                }}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                O'ynash <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Duels */}
      {activeDuels.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-orange-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Faol duellar</h3>
          </div>
          {activeDuels.map((duel) => {
            const myTurnToPlay = duel.status === 'pending' && duel.myScore === null
            return (
              <div key={duel.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3 min-w-0">
                  <Sword size={16} className="text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {duel.mode === 'lesson' && duel.lessonTitle ? `📘 ${duel.lessonTitle}` : `${duel.opponentName} · ${duel.mode}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {myTurnToPlay ? '⏳ Sizning navbatingiz' : duel.isBot ? '🤖 AI Bot' : "👤 Do'st o'ynashini kutmoqda"}
                    </p>
                  </div>
                </div>
                {myTurnToPlay ? (
                  <button
                    onClick={async () => {
                      const fullDuel = await getDuelById(duel.id)
                      if (fullDuel) onSetActiveDuel(fullDuel)
                    }}
                    className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    O'ynash <ArrowRight size={12} />
                  </button>
                ) : (
                  <button onClick={() => onCancelDuel(duel.id)} className="text-xs text-red-400 hover:text-red-500 px-2 py-1 shrink-0">
                    Bekor qilish
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
