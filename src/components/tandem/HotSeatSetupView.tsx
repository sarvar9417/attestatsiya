import { Zap, Monitor, Wifi } from 'lucide-react'
import type { LevelId } from './hotSeatHelpers'

interface HotSeatSetupViewProps {
  selectedLevel: LevelId
  selectedMode: 'vocab' | 'grammar'
  onLevelChange: (level: LevelId) => void
  onModeChange: (mode: 'vocab' | 'grammar') => void
  onStartSameDevice: () => void
  onStartOnline: () => void
  onBack: () => void
}

const levelColors: Record<LevelId, string> = {
  A1: 'border-green-200 bg-green-50',
  A2: 'border-blue-200 bg-blue-50',
  B1: 'border-orange-200 bg-orange-50',
  B2: 'border-purple-200 bg-purple-50',
}

export default function HotSeatSetupView({
  selectedLevel, selectedMode,
  onLevelChange, onModeChange,
  onStartSameDevice, onStartOnline, onBack,
}: HotSeatSetupViewProps) {
  return (
    <div className="max-w-lg mx-auto space-y-6 animate-page-enter p-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hot Seat 🔥</h1>
        <p className="text-sm text-gray-500">5 soniya tezkor duel — do'stingiz bilan kim tezroq?</p>
      </div>

      {/* Mode & Level */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Rejim</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['vocab', 'grammar'] as const).map((mode) => (
            <button key={mode} onClick={() => onModeChange(mode)}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedMode === mode
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-gray-300'
              }`}
            >{mode === 'vocab' ? "📚 So'z" : '📖 Grammatika'}</button>
          ))}
        </div>

        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Daraja</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['A1', 'A2', 'B1', 'B2'] as LevelId[]).map((level) => (
            <button key={level} onClick={() => onLevelChange(level)}
              className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                levelColors[level]
              } ${selectedLevel === level ? 'ring-2 ring-offset-1 scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
            >{level}</button>
          ))}
        </div>
      </div>

      {/* Mode buttons */}
      <button onClick={onStartSameDevice}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-base
          flex items-center justify-center gap-2.5 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Monitor size={20} />
        Same Device — Bir telefonda
      </button>

      <button onClick={onStartOnline}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-base
          flex items-center justify-center gap-2.5 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Wifi size={20} />
        Online — Ikki telefonda
      </button>

      <button onClick={onBack} className="btn-secondary w-full py-2.5 text-sm">Ortga</button>
    </div>
  )
}
