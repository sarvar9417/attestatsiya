import { Sword, Loader2 } from 'lucide-react'
import type { DuelMode } from '../../types/tandem'

interface TandemDuelModalProps {
  name: string
  duelMode: DuelMode
  creatingDuel: boolean
  onModeChange: (mode: DuelMode) => void
  onStart: () => void
  onClose: () => void
}

const MODE_LABELS: Record<DuelMode, string> = {
  vocab: "📚 So'z dueli",
  grammar: '📖 Grammatika dueli',
  reading: "📄 O'qish dueli",
  hotseat: '⚡ Hot Seat',
  lesson: '📘 Dars dueli',
  speaking: '🎤 Speaking dueli',
}

export default function TandemDuelModal({ name, duelMode, creatingDuel, onModeChange, onStart, onClose }: TandemDuelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
          {name} bilan duel
        </h3>
        <p className="text-sm text-gray-500 mb-4">Rejimni tanlang:</p>
        <div className="space-y-2">
          {(['vocab', 'grammar', 'reading', 'hotseat'] as DuelMode[]).map((mode) => (
            <label
              key={mode}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                duelMode === mode
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="duelMode"
                className="accent-primary-600"
                checked={duelMode === mode}
                onChange={() => onModeChange(mode)}
              />
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{MODE_LABELS[mode]}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5 text-sm">Bekor qilish</button>
          <button onClick={onStart} disabled={creatingDuel} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5">
            {creatingDuel ? <Loader2 size={16} className="animate-spin" /> : <Sword size={16} />}
            Boshlash
          </button>
        </div>
      </div>
    </div>
  )
}
