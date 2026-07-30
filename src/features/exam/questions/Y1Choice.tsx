import type { ExamOption } from '../contracts'

interface Y1ChoiceProps {
  prompt: string
  options: ExamOption[]
  value?: string
  disabled?: boolean
  onChange: (optionId: string) => void
}

export default function Y1Choice({
  prompt,
  options,
  value,
  disabled = false,
  onChange,
}: Y1ChoiceProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-medium text-gray-900 dark:text-white mb-4 whitespace-pre-wrap">
        {prompt}
      </legend>
      <div className="space-y-2">
        {options.map((option, index) => {
          const selected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors disabled:cursor-not-allowed ${
                selected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold shrink-0 ${
                  selected
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {option.content_md}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
