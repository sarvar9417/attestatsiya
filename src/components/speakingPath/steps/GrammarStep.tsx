// Speaking Path — Grammar Step: chunk grammar tips, common mistakes, stress patterns

import { useState } from 'react'
import { BookOpen, AlertTriangle, Volume2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  onNext: () => void
}

export default function GrammarStep({ day, onNext }: Props) {
  const { speak, supported } = useSpeechSynthesis()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const hasGrammar = day.chunks.some(c => c.grammarTip || c.commonMistake)

  if (!hasGrammar) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
          <BookOpen size={32} className="mx-auto text-primary-500 mb-2" />
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">Bu kunda maxsus grammatika qoidasi yo'q</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Keyingi qadamga o'ting</p>
          <button
            onClick={onNext}
            className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-blue-600 text-white font-bold text-sm hover:from-primary-600 hover:to-blue-700 active:scale-[0.98] transition-all shadow-md"
          >
            Davom etish <ArrowRight size={16} className="inline" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-violet-600 dark:text-violet-400" />
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">Grammatika va talaffuz</p>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Har bir iboradagi grammatika qoidasini va xato ehtimolini tekshiring.
        </p>
      </div>

      {/* Grammar point badge */}
      {day.grammarPoint && (
        <div className="rounded-xl px-4 py-2.5 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/50 flex items-center gap-2">
          <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">Mavzu:</span>
          <span className="text-sm font-black text-violet-900 dark:text-violet-100">{day.grammarPoint}</span>
        </div>
      )}

      {/* Chunks with grammar */}
      {day.chunks.map((c, i) => {
        const isOpen = expanded[c.id]
        const hasDetail = !!(c.grammarTip || c.commonMistake)

        return (
          <div
            key={c.id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          >
            {/* Chunk header */}
            <button
              onClick={() => hasDetail && toggle(c.id)}
              className="w-full p-3.5 flex items-start gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{c.en}</p>
                  {c.stressWord && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      Stress: {c.stressWord}
                    </span>
                  )}
                  {supported && (
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(c.en) }}
                      className="p-1 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.uz}</p>
              </div>
              {hasDetail && (
                isOpen
                  ? <ChevronUp size={16} className="text-gray-400 shrink-0 mt-1" />
                  : <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1" />
              )}
            </button>

            {/* Expanded details */}
            {isOpen && hasDetail && (
              <div className="px-3.5 pb-3.5 space-y-2 animate-in fade-in duration-200">
                {c.grammarTip && (
                  <div className="rounded-lg p-2.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookOpen size={12} className="text-violet-600 dark:text-violet-400" />
                      <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">Qoida</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{c.grammarTip}</p>
                  </div>
                )}
                {c.commonMistake && (
                  <div className="rounded-lg p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Xato ehtimoli</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{c.commonMistake}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Continue */}
      <button
        onClick={onNext}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm hover:from-violet-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-md"
      >
        Eshitish qadamiga o'tish <ArrowRight size={16} className="inline" />
      </button>
    </div>
  )
}
