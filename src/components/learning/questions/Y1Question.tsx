import { CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  prompt: string
  options: string[]
  selected?: number
  correct?: number
  showResult?: boolean
  onSelect: (idx: number) => void
  disabled?: boolean
}

export default function Y1Question({ prompt, options, selected, correct, showResult, onSelect, disabled }: Props) {
  return (
    <div>
      <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{prompt}</p>
      <div className="space-y-2">
        {options.map((opt, oi) => {
          let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
          let icon = null
          if (showResult && correct !== undefined) {
            if (oi === correct) { cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'; icon = <CheckCircle2 size={18} className="text-green-600 shrink-0" /> }
            else if (oi === selected) { cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'; icon = <XCircle size={18} className="text-red-600 shrink-0" /> }
          } else if (selected === oi) {
            cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          }
          return (
            <button key={oi} onClick={() => !disabled && onSelect(oi)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${cls} ${disabled ? 'cursor-default' : ''}`}>
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold shrink-0 ${showResult && oi === correct ? 'border-green-500 text-green-600 bg-green-50' : showResult && oi === selected && oi !== correct ? 'border-red-500 text-red-600 bg-red-50' : selected === oi ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-300 text-gray-500'}`}>
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{opt}</span>
              {icon && <span className="ml-auto">{icon}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
