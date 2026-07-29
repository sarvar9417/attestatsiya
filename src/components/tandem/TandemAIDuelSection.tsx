import { Bot } from 'lucide-react'
import type { DuelMode } from '../../types/tandem'

interface TandemAIDuelSectionProps {
  creatingDuel: boolean
  onAIDuel: (mode: DuelMode) => void
}

export default function TandemAIDuelSection({ creatingDuel, onAIDuel }: TandemAIDuelSectionProps) {
  return (
    <div className="card p-5 space-y-3 border-2 border-primary-100 dark:border-primary-900/50 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-950/20">
      <div className="flex items-center gap-2">
        <Bot size={18} className="text-primary-500" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">AI bilan duel</h3>
      </div>
      <p className="text-xs text-gray-500">
        Do'stingiz bo'lmasa ham — AI bot bilan mashq qiling. Natijalaringizni saqlang!
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(['vocab', 'grammar', 'reading', 'hotseat'] as DuelMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onAIDuel(mode)}
            disabled={creatingDuel}
            className="py-2.5 px-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium
                       hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20
                       transition-all text-gray-700 dark:text-gray-300 disabled:opacity-40"
          >
            {mode === 'vocab' ? "📚 So'z" :
             mode === 'grammar' ? '📖 Grammatika' :
             mode === 'reading' ? "📄 O'qish" :
             '⚡ Hot Seat'}
          </button>
        ))}
      </div>
    </div>
  )
}
