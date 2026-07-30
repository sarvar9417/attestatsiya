import type { ExamOption } from '../contracts'

interface Y2MatchProps {
  prompt: string
  left: ExamOption[]
  right: ExamOption[]
  value: Record<string, string>
  disabled?: boolean
  onChange: (pairs: Record<string, string>) => void
}

export default function Y2Match({
  prompt,
  left,
  right,
  value,
  disabled = false,
  onChange,
}: Y2MatchProps) {
  const usedRightIds = new Set(Object.values(value))

  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-medium text-gray-900 dark:text-white mb-2 whitespace-pre-wrap">
        {prompt}
      </legend>
      <p className="text-xs text-gray-500 mb-4">
        Har bir chap element uchun bitta mos variantni tanlang.
      </p>
      <div className="space-y-3">
        {left.map((leftOption, index) => {
          const selectId = `match-${leftOption.id}`

          return (
            <div
              key={leftOption.id}
              className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <label
                htmlFor={selectId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
              >
                {index + 1}. {leftOption.content_md}
              </label>
              <span className="hidden sm:inline text-gray-400" aria-hidden="true">
                →
              </span>
              <select
                id={selectId}
                value={value[leftOption.id] ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [leftOption.id]: event.target.value,
                  })
                }
                className="input w-full text-sm disabled:opacity-70"
              >
                <option value="">Mos variantni tanlang</option>
                {right.map((rightOption) => (
                  <option
                    key={rightOption.id}
                    value={rightOption.id}
                    disabled={
                      usedRightIds.has(rightOption.id) &&
                      value[leftOption.id] !== rightOption.id
                    }
                  >
                    {rightOption.content_md}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
