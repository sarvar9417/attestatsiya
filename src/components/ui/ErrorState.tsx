import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  error?: Error | string | null
  onRetry?: () => void
  retryLabel?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: {
    wrapper: 'py-8',
    iconWrapper: 'w-10 h-10',
    iconSize: 18,
    title: 'text-sm',
    desc: 'text-xs',
  },
  md: {
    wrapper: 'py-12',
    iconWrapper: 'w-14 h-14',
    iconSize: 24,
    title: 'text-base',
    desc: 'text-sm',
  },
  lg: {
    wrapper: 'py-16',
    iconWrapper: 'w-16 h-16',
    iconSize: 28,
    title: 'text-lg',
    desc: 'text-sm',
  },
}

function extractMessage(error: Error | string | null | undefined): string | null {
  if (!error) return null
  if (typeof error === 'string') return error
  return error.message || null
}

export default function ErrorState({
  icon: Icon = AlertTriangle,
  title = 'Xatolik yuz berdi',
  description,
  error,
  onRetry,
  retryLabel = 'Qayta urinish',
  size = 'md',
}: ErrorStateProps) {
  const s = SIZE_CLASSES[size]
  const detail = extractMessage(error)

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center ${s.wrapper} text-center px-4`}
    >
      <div className={`${s.iconWrapper} rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4`}>
        <Icon size={s.iconSize} className="text-red-500 dark:text-red-400" />
      </div>
      <h3 className={`${s.title} font-bold text-gray-900 dark:text-gray-100`}>
        {title}
      </h3>
      {(description || detail) && (
        <p className={`${s.desc} text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs`}>
          {description ?? detail}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800
            text-white text-sm font-semibold rounded-xl transition-all
            flex items-center gap-2 shadow-sm hover:shadow-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <RefreshCw size={15} />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
