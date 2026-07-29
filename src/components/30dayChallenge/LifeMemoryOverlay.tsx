import { Heart, Trash2, X } from 'lucide-react'
import type { UserFact } from '../../hooks/useLifeMemory'

interface Props {
  facts: UserFact[]
  factCount: number
  onDelete: (id: string) => void
  onClear: () => void
  onClose: () => void
}

export default function LifeMemoryOverlay({ facts, factCount, onDelete, onClear, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Life Memory ({factCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {facts.length === 0 ? (
          <div className="py-8 text-center">
            <Heart size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500">Hali faktlar yo'q</p>
            <p className="text-xs text-gray-400 mt-1">Suhbat davomida o'zingiz haqingizda gapirishingiz bilan AI eslab qoladi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {facts.map(fact => (
              <div key={fact.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    {fact.key}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                    {fact.value}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {fact.learnedFrom}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(fact.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            <button
              onClick={() => { onClear(); onClose() }}
              className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Barcha faktlarni o'chirish
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Suhbatga qaytish
        </button>
      </div>
    </div>
  )
}
