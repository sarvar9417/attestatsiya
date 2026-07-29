import { AlertCircle, BookOpen } from 'lucide-react'
import type { RoleplayEvaluation, RoleplaySession } from '../../types/tandem'
import type { ConversationScenario } from '../../data/conversationScenarios'

// ─── Types ────────────────────────────────────────────────────────────────

export interface Msg { role: 'user' | 'assistant'; content: string }

export type View = 'scenario-select' | 'playing' | 'waiting' | 'waiting_partner' | 'loading-report' | 'results'

export interface RoleplayProps {
  session: RoleplaySession
  currentUserId: string
  currentUserName: string
  isCreator: boolean
  onBack: () => void
  onComplete: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────

export const CATEGORY_LABEL: Record<ConversationScenario['category'], string> = {
  kundalik: 'Kundalik', sayohat: 'Sayohat', ish: 'Ish', ijtimoiy: 'Ijtimoiy',
}

export const CATEGORY_COLOR: Record<ConversationScenario['category'], string> = {
  kundalik: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sayohat:  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  ish:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  ijtimoiy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-bold text-gray-700 dark:text-gray-300">{value}/10</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  )
}

export function EvalSection({
  label, evaluation, userName,
}: {
  label: string
  evaluation: RoleplayEvaluation
  userName: string
}) {
  const avgScore = Math.round((evaluation.fluency + evaluation.taskSuccess) / 2)
  return (
    <div className="card p-5 space-y-4 border-2 border-indigo-100 dark:border-indigo-900/50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-500">{userName}</p>
        </div>
      </div>
      <div className="text-center">
        <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}</span>
        <span className="text-gray-400 text-sm">/10</span>
      </div>
      <div className="space-y-2">
        <Bar label="Ravonlik" value={evaluation.fluency} color="bg-blue-500" />
        <Bar label="Maqsad bajarilishi" value={evaluation.taskSuccess} color="bg-emerald-500" />
      </div>
      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {evaluation.encouragement}
      </div>
      {evaluation.newWords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-emerald-500" />
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Yangi so'zlar</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.newWords.map((w) => (
              <span key={w.word} className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {w.word} — {w.meaning}
              </span>
            ))}
          </div>
        </div>
      )}
      {evaluation.mistakes.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-rose-500" />
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Tuzatishlar</h4>
          </div>
          {evaluation.mistakes.map((m, i) => (
            <div key={i} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-xs space-y-0.5">
              <p className="text-rose-500 line-through">{m.wrong}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.correct}</p>
              <p className="text-gray-500">💡 {m.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
