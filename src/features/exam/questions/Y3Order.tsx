import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ExamOption } from '../contracts'

interface Y3OrderProps {
  prompt: string
  items: ExamOption[]
  value: string[]
  disabled?: boolean
  onChange: (order: string[]) => void
}

export default function Y3Order({
  prompt,
  items,
  value,
  disabled = false,
  onChange,
}: Y3OrderProps) {
  const byId = new Map(items.map((item) => [item.id, item]))
  const orderedItems = value
    .map((id) => byId.get(id))
    .filter((item): item is ExamOption => Boolean(item))

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= value.length) return

    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-medium text-gray-900 dark:text-white mb-2 whitespace-pre-wrap">
        {prompt}
      </legend>
      <p className="text-xs text-gray-500 mb-4">
        Elementlarni yuqoriga va pastga tugmalari bilan tartiblang.
      </p>
      <div className="space-y-2">
        {orderedItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <span className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
              {index + 1}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 whitespace-pre-wrap">
              {item.content_md}
            </span>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                aria-label={`${item.content_md} — yuqoriga`}
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={`${item.content_md} — pastga`}
                disabled={disabled || index === orderedItems.length - 1}
                onClick={() => move(index, 1)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
