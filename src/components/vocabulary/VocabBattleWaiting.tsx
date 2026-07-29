import { Copy, Check, Share2 } from 'lucide-react'
import type { PlayerId } from './VocabBattleHelpers'

interface Props {
  playerRole: PlayerId | null
  roomId: string
  roomCopied: boolean
  onCopyRoomId: () => void
  onShareRoom: () => void
  onReset: () => void
}

export default function VocabBattleWaiting({
  playerRole, roomId, roomCopied, onCopyRoomId, onShareRoom, onReset,
}: Props) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 animate-page-enter">
      <div className="card p-8 space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {playerRole === 'host' ? 'Raqib kutilmoqda...' : 'Xonaga ulanish...'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {playerRole === 'host'
              ? "Quyidagi xona ID ni do'stingizga yuboring"
              : "Raqibning javobini kuting"}
          </p>
        </div>

        {playerRole === 'host' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold font-mono tracking-[0.3em] text-primary-600 dark:text-primary-400">
                {roomId}
              </span>
              <button
                onClick={onCopyRoomId}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {roomCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400" />}
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={onShareRoom} className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                <Share2 size={14} />
                Ulashish
              </button>
              <button onClick={onReset} className="btn-secondary py-2 px-4 text-sm">
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
