import { useState, useEffect, useRef } from 'react'
import { WifiOff, Wifi, X, ChevronDown, ChevronUp, BookOpen, BookText, BarChart3, FileCheck, PenLine, Mic, Search, Bot, Users, CloudOff, CheckCircle2, RefreshCw } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'

interface Feature {
  key: keyof TranslationStrings
  icon: React.ReactNode
  available: boolean
}

interface Props {
  isOnline: boolean
  onDismiss?: () => void
}

export default function OfflineBanner({ isOnline, onDismiss }: Props) {
  const { t } = useI18n()
  const [showDetails, setShowDetails] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Track when we come back online
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setReconnecting(false)
    } else if (wasOffline) {
      // Just came back online — show reconnecting state
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

  // If online and was never offline, render nothing
  if (isOnline && !reconnecting) return null

  const features: Feature[] = [
    { key: 'offline.lessons', icon: <BookOpen size={14} />, available: true },
    { key: 'offline.vocabulary', icon: <BookText size={14} />, available: true },
    { key: 'offline.progress', icon: <BarChart3 size={14} />, available: true },
    { key: 'offline.mockTests', icon: <FileCheck size={14} />, available: true },
    { key: 'offline.writing', icon: <PenLine size={14} />, available: true },
    { key: 'offline.speakingPath', icon: <Mic size={14} />, available: true },
    { key: 'offline.dictionary', icon: <Search size={14} />, available: true },
    { key: 'offline.aiFeatures', icon: <Bot size={14} />, available: false },
    { key: 'offline.tandem', icon: <Users size={14} />, available: false },
    { key: 'offline.supabase', icon: <CloudOff size={14} />, available: false },
  ]

  // ── Reconnecting state ─────────────────────────────────────────────────
  if (reconnecting) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
          <div className="flex items-center justify-center gap-2.5 py-3 px-4">
            <RefreshCw size={16} className="animate-spin shrink-0" />
            <span className="text-sm font-semibold">{t('offline.reconnected')}</span>
            <CheckCircle2 size={16} className="shrink-0 animate-pop-in" />
          </div>
        </div>
      </div>
    )
  }

  // ── Offline state ──────────────────────────────────────────────────────
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
      {/* Main banner bar */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <WifiOff size={16} className="shrink-0 animate-pulse" />
            <div className="min-w-0">
              <span className="text-sm font-bold block truncate">{t('offline.title')}</span>
              <span className="text-xs text-white/80 block truncate">{t('offline.subtitle')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors text-xs font-semibold whitespace-nowrap"
              aria-expanded={showDetails}
            >
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showDetails ? t('offline.hideDetails') : t('offline.showDetails')}
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                aria-label={t('offline.dismiss')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable details panel */}
      {showDetails && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-md animate-slide-down">
          <div className="px-4 py-3 space-y-3">
            {/* Sync note */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5 border border-amber-100 dark:border-amber-900/40">
              <RefreshCw size={12} className="shrink-0 mt-0.5" />
              <span>{t('offline.syncPending')}</span>
            </div>

            {/* Available offline */}
            <div>
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                {t('offline.available')}
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {features.filter((f) => f.available).map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-50/60 dark:bg-green-900/15 text-green-700 dark:text-green-300 text-[12px] font-medium"
                  >
                    <span className="shrink-0 opacity-70">{f.icon}</span>
                    <span className="truncate">{t(f.key)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unavailable */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Wifi size={11} />
                {t('offline.unavailable')}
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {features.filter((f) => !f.available).map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 text-[12px] font-medium"
                  >
                    <span className="shrink-0 opacity-50">{f.icon}</span>
                    <span className="truncate">{t(f.key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
