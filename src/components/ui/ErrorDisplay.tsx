import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
      <AlertTriangle size={48} className="text-red-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message || 'Xatolik yuz berdi'}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
          <RefreshCw size={16} />
          Qayta urinish
        </button>
      )}
    </div>
  )
}
