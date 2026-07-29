// Speaking Path — Qadam 3: Gapir (ovozli active recall) ⭐
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning bloklarini navbatma-navbat recall qiladi (RecallPanel) va o'rtacha
// ballni keyingi qadamga uzatadi.

import { useState, useCallback, useMemo } from 'react'
import { Check, BarChart3 } from 'lucide-react'
import RecallPanel from '../RecallPanel'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  userId?: string
  /** o'rtacha ball (0–100) bilan keyingi qadamga */
  onNext: (avgScore: number) => void
}

export default function SpeakStep({ day, userId, onNext }: Props) {
  const [index, setIndex] = useState(0)
  const [chunkScores, setChunkScores] = useState<number[]>([])

  const chunk = day.chunks[index]
  const isLast = index >= day.chunks.length - 1
  const allDone = index >= day.chunks.length
  const totalChunks = day.chunks.length

  const handleDone = useCallback((bestSim: number) => {
    const pct = Math.round(bestSim * 100)
    setChunkScores(prev => [...prev, pct])
    if (isLast) {
      setIndex(i => i + 1) // → allDone = true
    } else {
      setIndex(i => i + 1)
    }
  }, [isLast])

  const avgScore = useMemo(() => {
    return chunkScores.length
      ? Math.round(chunkScores.reduce((a, b) => a + b, 0) / chunkScores.length)
      : 0
  }, [chunkScores])

  // ── Summary view after all chunks done ──
  if (allDone) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
            <BarChart3 size={24} className="text-white" />
          </div>
          <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Mashq yakunlandi! 🎉</p>
          <p className="text-2xl font-black text-primary-600 dark:text-primary-400 mt-1">{avgScore}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{totalChunks} ta ibora</p>
        </div>

        {/* Per-chunk scores */}
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Har bir ibora bo'yicha natija</p>
          <div className="space-y-2">
            {day.chunks.map((c, i) => {
              const score = chunkScores[i] ?? 0
              const correct = score >= 65
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${correct ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {correct ? <Check size={13} className="text-white" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{c.en}</p>
                    <p className="text-xs text-gray-400">{c.uz}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>{score}%</p>
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 mt-0.5">
                      <div className={`h-full rounded-full transition-all ${correct ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ width: `${Math.min(100, score)}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => onNext(avgScore)}
          className="w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          Suhbatga o'tish
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🎙️ Inglizcha ayting</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{index + 1} / {totalChunks}</p>
      </div>

      {/* Chunk progress dots */}
      <div className="flex gap-1.5 justify-center">
        {day.chunks.map((_, i) => {
          const score = chunkScores[i]
          let color = 'bg-gray-200 dark:bg-gray-700'
          if (i === index) color = 'bg-primary-400'
          else if (score !== undefined) color = score >= 65 ? 'bg-emerald-500' : 'bg-rose-400'
          return (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${color} ${i === index ? 'ring-2 ring-primary-300' : ''}`}
              title={score !== undefined ? `${score}%` : `Chunk ${i + 1}`}
            />
          )
        })}
      </div>

      <RecallPanel key={chunk.id} chunk={chunk} userId={userId} isLast={isLast} onDone={handleDone} />
    </div>
  )
}
