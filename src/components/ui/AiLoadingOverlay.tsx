import { useState, useEffect } from 'react'
import { Loader2, X } from 'lucide-react'

const STEPS = ['Thinking...', 'Analyzing...', 'Generating response...']

interface AiLoadingOverlayProps {
  onCancel: () => void
}

export function AiLoadingOverlay({ onCancel }: AiLoadingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping" />
          <Loader2 size={40} className="relative text-primary-600 dark:text-primary-400 animate-spin" />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {STEPS[stepIndex]}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            This usually takes 5–10 seconds
          </p>
        </div>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors text-sm font-medium"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </div>
  )
}
