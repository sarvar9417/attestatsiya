import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'
import type { OnlinePhase } from './hotSeatHelpers'

interface HotSeatOnlineWaitingProps {
  roomId: string
  playerRole: 'host' | 'guest'
  phase: OnlinePhase
  onReset: () => void
}

async function copyText(text: string): Promise<void> {
  try { await navigator.clipboard.writeText(text) } catch { /* noop */ }
}

export default function HotSeatOnlineWaiting({ roomId, playerRole, phase, onReset }: HotSeatOnlineWaitingProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => { setCopied(false) }, [roomId])

  const handleCopy = () => {
    copyText(roomId).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const handleShare = async () => {
    const shareData = {
      title: 'EnglishPath Hot Seat',
      text: `🔥 Men bilan EnglishPath Hot Seat o'ynang! Xona ID: ${roomId}`,
    }
    try { await navigator.share(shareData) } catch (e) {
      monitoring.captureMessage('HotSeatDuel share failed (fallback to copy): ' + (e instanceof Error ? e.message : String(e)), 'warn')
      handleCopy()
    }
  }

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 animate-page-enter p-4">
      <div className="card p-8 space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {playerRole === 'host' ? 'Raqib kutilmoqda...' : phase === 'waiting' ? 'Xonaga ulanish...' : 'O\'yin boshlanishini kuting'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {playerRole === 'host'
              ? "Quyidagi xona ID ni do'stingizga yuboring"
              : "O'yin boshlanishini kuting"}
          </p>
        </div>
        {playerRole === 'host' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold font-mono tracking-[0.3em] text-primary-600 dark:text-primary-400">
                {roomId}
              </span>
              <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400" />}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                <Share2 size={14} /> Ulashish
              </button>
              <button onClick={onReset} className="btn-secondary py-2 px-4 text-sm">Bekor qilish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
