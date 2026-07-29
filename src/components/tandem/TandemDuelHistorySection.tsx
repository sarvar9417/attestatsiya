import { Trophy } from 'lucide-react'
import type { DuellistItem } from '../../types/tandem'

interface TandemDuelHistorySectionProps {
  duelHistory: DuellistItem[]
}

export default function TandemDuelHistorySection({ duelHistory }: TandemDuelHistorySectionProps) {
  if (duelHistory.length === 0) return null

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-yellow-500" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Tarix ({duelHistory.length})</h3>
      </div>
      <div className="space-y-1.5">
        {duelHistory.slice(0, 5).map((duel) => (
          <div key={duel.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                {duel.mode === 'lesson' ? '📘' : duel.mode === 'vocab' ? '📚' : duel.mode === 'grammar' ? '📖' : '📄'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {duel.mode === 'lesson' && duel.lessonTitle ? duel.lessonTitle : duel.opponentName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {duel.myScore ?? '?'} : {duel.theirScore ?? '?'}
              </span>
              {duel.myScore !== null && duel.theirScore !== null && (
                <span className={
                  duel.myScore > duel.theirScore ? 'text-green-500' :
                  duel.myScore < duel.theirScore ? 'text-red-400' : 'text-yellow-500'
                }>
                  {duel.myScore > duel.theirScore ? "G'alaba" : duel.myScore < duel.theirScore ? "Mag'lubiyat" : 'Durang'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
