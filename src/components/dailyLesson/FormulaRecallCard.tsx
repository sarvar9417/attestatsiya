import { useState, useRef } from 'react'
import { Eye, EyeOff, Volume2, Lightbulb, Target, BookOpen } from 'lucide-react'
import { COLOR_STYLES } from './helpers'

interface Props {
  label: string
  structure: string
  color: string
  explanation?: string
  example?: string
  whenToUse?: string
  pronunciation?: string
}

export default function FormulaRecallCard({ label, structure, color, explanation, example, whenToUse, pronunciation }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const countRef = useRef(0)
  const [count, setCount] = useState(0)

  const s = COLOR_STYLES[color] ?? COLOR_STYLES.blue

  const handleClick = () => {
    if (!revealed) {
      setRevealed(true)
    } else {
      setShowDetails(!showDetails)
    }
    countRef.current += 1
    setCount(countRef.current)
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer select-none transition-all hover:shadow-md active:scale-[0.98] rounded-xl overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        <div className={`w-1.5 flex-shrink-0 ${s.bg.replace('-50', '-500')}`} />
        <div className={`flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-y border-r ${s.border} rounded-r-xl px-4 py-3`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${s.text}`}>{label}</span>
              <span className="text-[10px] bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-1.5 py-0.5 rounded-full font-medium leading-none">
                🧠 Eslab qol
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {revealed && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  👁 {count} marta ko'rildi
                </span>
              )}
              <span className="text-gray-400">
                {revealed ? (showDetails ? <EyeOff size={14} /> : <Eye size={14} />) : <EyeOff size={14} />}
              </span>
            </div>
          </div>

          {/* Formula structure */}
          {revealed ? (
            <div key={count} className="animate-slide-down">
              <p className={`font-mono text-sm font-bold ${s.text} mt-1 leading-relaxed whitespace-pre-line`}>
                {structure}
              </p>

              {/* Pronunciation */}
              {pronunciation && (
                <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Volume2 size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{pronunciation}</span>
                </div>
              )}

              {/* Toggle details */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails) }}
                className={`mt-2 text-[10px] font-semibold ${s.text} flex items-center gap-1 hover:opacity-80 transition-opacity`}
              >
                {showDetails ? 'Kamroq' : "Batafsil ko'rish"} →
              </button>

              {/* Expanded details */}
              {showDetails && (
                <div className="mt-3 space-y-2.5 border-t border-gray-100 dark:border-gray-700 pt-3 animate-slide-down">
                  {/* Explanation */}
                  {explanation && (
                    <div className="flex items-start gap-2">
                      <Lightbulb size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Tushuntirish</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {example && (
                    <div className="flex items-start gap-2">
                      <BookOpen size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Misol</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg leading-relaxed">{example}</p>
                      </div>
                    </div>
                  )}

                  {/* When to use */}
                  {whenToUse && (
                    <div className="flex items-start gap-2">
                      <Target size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Qachon ishlatiladi?</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{whenToUse}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              ❓ Qanday formula edi? Bosing!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
