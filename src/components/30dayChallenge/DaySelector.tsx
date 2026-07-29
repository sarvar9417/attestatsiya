import { useMemo, useState } from 'react'
import { Check, Lock } from 'lucide-react'

interface Props {
  currentDay: number
  totalDays: number
  completedDays: number[]
  onSelect: (day: number) => void
}

export default function DaySelector({ currentDay, totalDays, completedDays, onSelect }: Props) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const chunks = useMemo(() => {
    const result: number[][] = []
    for (let i = 1; i <= totalDays; i += 10) {
      result.push(Array.from({ length: Math.min(10, totalDays - i + 1) }, (_, j) => i + j))
    }
    return result
  }, [totalDays])

  const maxCompleted = completedDays.length > 0 ? Math.max(...completedDays) : 0

  return (
    <div className="space-y-1.5">
      {/* Range labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 font-medium px-1">
        {chunks.map((chunk, idx) => (
          <span key={idx}>Kun {chunk[0]}-{chunk[chunk.length - 1]}</span>
        ))}
      </div>

      {chunks.map((chunk, idx) => (
        <div key={idx} className="flex gap-1.5 justify-center">
          {chunk.map(day => {
            const isActive = day === currentDay
            const isDone = completedDays.includes(day)
            const isLocked = day > maxCompleted + 1 && !isDone

            return (
              <div key={day} className="relative group">
                <button
                  onClick={() => !isLocked && onSelect(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  disabled={isLocked}
                  className={`
                    relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-bold
                    transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg scale-110 ring-2 ring-primary-300 dark:ring-primary-600'
                      : isDone
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md hover:shadow-lg'
                        : isLocked
                          ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                    }
                    ${!isActive && !isDone && !isLocked ? 'hover:scale-110' : ''}
                  `}
                >
                  {isDone ? (
                    <Check size={16} className="mx-auto animate-pop-in" />
                  ) : isLocked ? (
                    <Lock size={12} className="mx-auto" />
                  ) : (
                    <span className={isActive ? 'animate-pop-in' : ''}>{day}</span>
                  )}
                </button>

                {/* Tooltip on hover */}
                {hoveredDay === day && !isActive && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs whitespace-nowrap shadow-lg animate-fade-in">
                    {isDone ? `Kun ${day} — bajarildi ✅` : isLocked ? `Kun ${day} — bloklangan 🔒` : `Kun ${day}`}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
