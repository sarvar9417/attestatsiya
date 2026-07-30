import { useState, useEffect, useRef } from 'react'
import { WifiOff, Wifi, X, ChevronDown, ChevronUp, CheckCircle2, RefreshCw } from 'lucide-react'

interface Props {
  isOnline: boolean
  onDismiss?: () => void
}

export default function OfflineBanner({ isOnline, onDismiss }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setReconnecting(false)
    } else if (wasOffline) {
      setReconnecting(true)
      setShowDetails(false)
      reconnectTimerRef.current = setTimeout(() => {
        setReconnecting(false)
        setWasOffline(false)
      }, 3000)
    }
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    }
  }, [isOnline, wasOffline])

  if (isOnline && !reconnecting) return null

  if (reconnecting) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
          <div className="flex items-center justify-center gap-2.5 py-3 px-4">
            <RefreshCw size={16} className="animate-spin shrink-0" />
            <span className="text-sm font-semibold">Tarmoq tiklandi</span>
            <CheckCircle2 size={16} className="shrink-0 animate-pop-in" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <WifiOff size={16} className="shrink-0 animate-pulse" />
            <div className="min-w-0">
              <span className="text-sm font-bold block truncate">Internet yo'q</span>
              <span className="text-xs text-white/80 block truncate">Ba'zi funksiyalar ishlamasligi mumkin</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowDetails(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-xs font-semibold"
            >
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {onDismiss && (
              <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-md">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5">
              <RefreshCw size={12} className="shrink-0 mt-0.5" />
              <span>Ma'lumotlar internet tiklanganidan keyin sinxronlanadi</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Wifi size={11} />
                Internet talab qilinadi
              </h4>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[12px] font-medium">
                  Supabase ma'lumotlari
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
