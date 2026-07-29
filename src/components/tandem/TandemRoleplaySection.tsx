import { Theater, Loader2 } from 'lucide-react'

interface TandemRoleplaySectionProps {
  tandemPair: { id: string } | null
  creatingDuel: boolean
  roleplaySessions: { id: string; status: string; scenarioEmoji: string; scenarioTitle: string; scoreA: number | null; scoreB: number | null }[]
  onStartRoleplay: () => void
}

export default function TandemRoleplaySection({
  tandemPair, creatingDuel, roleplaySessions, onStartRoleplay,
}: TandemRoleplaySectionProps) {
  if (!tandemPair) return null

  const completedSessions = roleplaySessions.filter(s => s.status === 'completed')

  return (
    <>
      {/* AI Roleplay Duo */}
      <div className="card p-5 space-y-3 border-2 border-pink-100 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/30 to-purple-50/30 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-2">
          <Theater size={18} className="text-pink-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">AI Roleplay Duo</h3>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-pink-600 dark:text-pink-400">
            Premium
          </span>
        </div>
        <p className="text-xs text-gray-500">
          2 do'st + AI hakam. Bir scenario'da ikkalangiz ham rol o'ynang va AI dan shaxsiy baho oling.
        </p>
        <button
          onClick={onStartRoleplay}
          disabled={creatingDuel}
          className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          {creatingDuel ? <Loader2 size={16} className="animate-spin" /> : <Theater size={16} />}
          Roleplay Duo boshlash
        </button>
      </div>

      {/* Roleplay Duo History */}
      {completedSessions.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Theater size={18} className="text-pink-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Roleplay Duo tarixi ({completedSessions.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {completedSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-xs">
                <div className="flex items-center gap-2">
                  <span>{s.scenarioEmoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">{s.scenarioTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.scoreA !== null && s.scoreB !== null && (
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {s.scoreA} : {s.scoreB}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
