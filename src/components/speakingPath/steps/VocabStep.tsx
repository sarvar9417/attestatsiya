// Speaking Path — Vocab Step: dedicated vocabulary learning with examples

import { useState } from 'react'
import { BookMarked, Volume2, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  onNext: () => void
}

export default function VocabStep({ day, onNext }: Props) {
  const { speak, supported } = useSpeechSynthesis()
  const [learned, setLearned] = useState<Set<number>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const vocab = day.vocab ?? []

  if (vocab.length === 0) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
          <BookMarked size={32} className="mx-auto text-primary-500 mb-2" />
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">Bu kunda yangi so'zlar yo'q</p>
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

  const toggleLearned = (idx: number) => {
    setLearned(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const progress = Math.round((learned.size / vocab.length) * 100)

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50">
        <div className="flex items-center gap-2 mb-2">
          <BookMarked size={18} className="text-amber-600 dark:text-amber-400" />
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">Lug'at</p>
          <span className="ml-auto text-xs font-bold text-amber-700 dark:text-amber-300">{learned.size}/{vocab.length}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-amber-100 dark:bg-amber-900/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Vocab cards */}
      {(showAll ? vocab : vocab.slice(0, 4)).map((v, i) => {
        const isLearned = learned.has(i)

        return (
          <div
            key={i}
            className={`rounded-xl p-4 border transition-all ${
              isLearned
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black text-base text-gray-900 dark:text-gray-100">{v.en}</p>
                  {supported && (
                    <button
                      onClick={() => speak(v.en)}
                      className="p-1 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{v.uz}</p>
                {v.example && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 italic">"{v.example}"</p>
                )}
              </div>
              <button
                onClick={() => toggleLearned(i)}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isLearned
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-500'
                }`}
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        )
      })}

      {/* Show more / less */}
      {vocab.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {showAll ? 'Kamroq ko\'rish' : `Hammasini ko'rish (${vocab.length})`}
        </button>
      )}

      {/* Reset */}
      {learned.size > 0 && (
        <button
          onClick={() => setLearned(new Set())}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <RotateCcw size={12} /> Qayta boshlash
        </button>
      )}

      {/* Continue */}
      <button
        onClick={onNext}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all shadow-md"
      >
        Grammatikaga o'tish <ArrowRight size={16} className="inline" />
      </button>
    </div>
  )
}
