import { useState } from 'react'
import { AlertCircle, AlertTriangle, WifiOff, RefreshCw, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useToastStore } from '../../utils/toastStore'
import { useI18n } from '../../i18n'

type ErrorVariant = 'error' | 'warning' | 'offline'

interface ErrorDisplayProps {
  icon?: LucideIcon
  title: string
  message: string
  detail?: string
  variant?: ErrorVariant
  retry?: () => void
  retryLabel?: string
  size?: 'sm' | 'md' | 'lg'
}

const VARIANT_STYLES: Record<ErrorVariant, {
  wrapper: string
  iconWrapper: string
  iconColor: string
  titleColor: string
  msgColor: string
  borderColor: string
}> = {
  error: {
    wrapper: 'border-red-100 dark:border-red-900/40',
    iconWrapper: 'bg-red-50 dark:bg-red-900/30',
    iconColor: 'text-red-400 dark:text-red-400',
    titleColor: 'text-red-700 dark:text-red-400',
    msgColor: 'text-red-600 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  warning: {
    wrapper: 'border-amber-100 dark:border-amber-900/40',
    iconWrapper: 'bg-amber-50 dark:bg-amber-900/30',
    iconColor: 'text-amber-400 dark:text-amber-400',
    titleColor: 'text-amber-700 dark:text-amber-400',
    msgColor: 'text-amber-600 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  offline: {
    wrapper: 'border-orange-100 dark:border-orange-900/40',
    iconWrapper: 'bg-orange-50 dark:bg-orange-900/30',
    iconColor: 'text-orange-400 dark:text-orange-400',
    titleColor: 'text-orange-700 dark:text-orange-400',
    msgColor: 'text-orange-600 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
}

const SIZE_CLASSES = {
  sm: {
    wrapper: 'py-6',
    iconWrapper: 'w-9 h-9',
    iconSize: 18,
    title: 'text-sm',
    msg: 'text-xs',
    padding: 'p-4',
  },
  md: {
    wrapper: 'py-10',
    iconWrapper: 'w-12 h-12',
    iconSize: 22,
    title: 'text-base',
    msg: 'text-sm',
    padding: 'p-5',
  },
  lg: {
    wrapper: 'py-14',
    iconWrapper: 'w-14 h-14',
    iconSize: 26,
    title: 'text-lg',
    msg: 'text-sm',
    padding: 'p-6',
  },
}

const DEFAULT_ICONS: Record<ErrorVariant, LucideIcon> = {
  error: AlertCircle,
  warning: AlertTriangle,
  offline: WifiOff,
}

export default function ErrorDisplay({
  icon: CustomIcon,
  title,
  message,
  detail,
  variant = 'error',
  retry,
  retryLabel = 'Qayta urinish',
  size = 'md',
}: ErrorDisplayProps) {
  const { t } = useI18n()
  const [showDetail, setShowDetail] = useState(false)
  const toast = useToastStore((s) => s.toast)
  const styles = VARIANT_STYLES[variant]
  const s = SIZE_CLASSES[size]
  const Icon = CustomIcon ?? DEFAULT_ICONS[variant]

  const handleCopy = () => {
    const text = `Xato: ${title}\n\n${message}${detail ? `\n\nTafsilot:\n${detail}` : ''}`
    navigator.clipboard.writeText(text).then(
      () => toast('Xato tafsilotlari nusxalandi', 'success'),
      () => toast('Nusxalashda xatolik', 'error'),
    )
  }

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center ${s.wrapper} text-center px-4 border ${styles.wrapper}`}
    >
      <div
        className={`${s.iconWrapper} rounded-full ${styles.iconWrapper} flex items-center justify-center mb-4 ring-4 ring-white dark:ring-gray-900`}
      >
        <Icon size={s.iconSize} className={styles.iconColor} />
      </div>
      <h3 className={`${s.title} font-bold ${styles.titleColor}`}>{title}</h3>
      <p className={`${s.msg} ${styles.msgColor} mt-1.5 max-w-sm`}>{message}</p>

      <div className="flex items-center gap-2 mt-5">
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold
              text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
              active:bg-gray-100 dark:active:bg-gray-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} />
            {retryLabel}
          </button>
        )}
        {detail && (
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium
              text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            {showDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Tafsilot
          </button>
        )}
        {detail && (
          <button
            onClick={handleCopy}
            aria-label={t('aria.copy')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium
              text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="Nusxalash"
          >
            <Copy size={14} />
          </button>
        )}
      </div>

      {showDetail && detail && (
        <div
          className={`mt-4 w-full max-w-md text-left ${s.msg} p-3 rounded-lg
            bg-gray-50 dark:bg-gray-800/50 border ${styles.borderColor} overflow-auto max-h-32`}
        >
          <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 font-mono">
            {detail}
          </pre>
        </div>
      )}
    </div>
  )
}
