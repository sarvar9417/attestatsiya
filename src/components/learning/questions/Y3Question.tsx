import { ChevronUp, ChevronDown, CheckCircle2, XCircle } from 'lucide-react'

interface Item {
  id: string
  content: string
}

interface Props {
  prompt: string
  items: Item[]
  order?: string[]
  correctOrder?: string[]
  showResult?: boolean
  onChange: (order: string[]) => void
  disabled?: boolean
}

export default function Y3Question({ prompt, items, order = items.map(i => i.id), correctOrder, showResult, onChange, disabled }: Props) {
  const orderedItems = order.map(id => items.find(i => i.id === id)!).filter(Boolean)

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const newOrder: string[] = [...order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]]
    onChange(newOrder)
  }

  const moveDown = (idx: number) => {
    if (idx === order.length - 1) return
    const newOrder: string[] = [...order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]]
    onChange(newOrder)
  }

  const isCorrectOrder = correctOrder && order.every((id, i) => id === correctOrder[i])

  return (
    <div>
      <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{prompt}</p>
      <p className="text-xs text-gray-500 mb-3">Elementlarni to'g'ri tartibga keltiring</p>
      <div className="space-y-2">
        {orderedItems.map((item, idx) => {
          const isCorrect = correctOrder && order[idx] === correctOrder[idx]
          const isWrong = showResult && correctOrder && order[idx] !== correctOrder[idx]
          return (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isWrong ? 'border-red-200 bg-red-50' : isCorrect ? 'border-green-200 bg-green-50' : 'border-gray-200 dark:border-gray-700'}`}>
              <span className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.content}</span>
              {!disabled && !showResult && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronUp size={16} /></button>
                  <button onClick={() => moveDown(idx)} disabled={idx === order.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronDown size={16} /></button>
                </div>
              )}
              {showResult && isCorrect && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
              {isWrong && <XCircle size={18} className="text-red-600 shrink-0" />}
            </div>
          )
        })}
      </div>
      {showResult && correctOrder && (
        <div className={`mt-3 p-3 rounded-xl text-sm ${isCorrectOrder ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={isCorrectOrder ? 'text-green-700' : 'text-red-700'}>
            {isCorrectOrder ? "To'g'ri tartib ✅" : "Noto'g'ri tartib ❌"}
          </p>
          {!isCorrectOrder && (
            <p className="text-gray-500 text-xs mt-1">To'g'ri tartib: {correctOrder.map(id => items.find(i => i.id === id)?.content).join(' → ')}</p>
          )}
        </div>
      )}
    </div>
  )
}
