import { useToastStore, type ToastType } from '../utils/toastStore'
import { useI18n } from '../i18n'

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300',
  warning: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300',
}

const TYPE_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const { t } = useI18n()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-fade-in-right ${TYPE_STYLES[toast.type]}`}
        >
          <span className="mt-0.5">{TYPE_ICONS[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            aria-label={t('aria.close')}
            className="ml-1 opacity-40 hover:opacity-70 dark:hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
