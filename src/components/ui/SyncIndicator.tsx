import { CloudOff, RefreshCw, Check } from 'lucide-react'
import { useSyncQueue } from '../../hooks/useSyncQueue'
import { useI18n } from '../../i18n'

/**
 * SyncIndicator — Offline sync queue holatini ko'rsatadi.
 * Offline bo'lsa: pending elementlar sonini + CloudOff icon.
 * Online bo'lsa: sync tugallangandan keyin Check icon.
 * Sync jarayonda: RefreshCw animation.
 */
export default function SyncIndicator() {
  const { pending, isOnline } = useSyncQueue()
  const { t } = useI18n()

  // Agar offline va pending yo'q bo'lsa — ko'rsatmaslik
  if (isOnline && pending === 0) return null

  // Offline banner
  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium" role="status" aria-live="polite">
        <CloudOff size={14} className="flex-shrink-0" />
        <span>{t('sync.offline') ?? 'Offline'}</span>
        {pending > 0 && (
          <span className="ml-auto bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
            {pending}
          </span>
        )}
      </div>
    )
  }

  // Sync in progress (pending > 0 and online)
  if (pending > 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium" role="status" aria-live="polite">
        <RefreshCw size={14} className="flex-shrink-0 animate-spin" />
        <span>{t('sync.syncing') ?? 'Sinxronizatsiya...'}</span>
        <span className="ml-auto bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
          {pending}
        </span>
      </div>
    )
  }

  // Sync complete flash
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-medium" role="status">
      <Check size={14} className="flex-shrink-0" />
      <span>{t('sync.complete') ?? 'Sinxronizatsiya tugadi'}</span>
    </div>
  )
}
