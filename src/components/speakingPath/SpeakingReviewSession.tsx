// Speaking Path — SRS takror sessiyasi (due bloklar)
// Reja: docs/speaking-path-roadmap.md (Faza 5)
// Bugun takrorlash kerak bo'lgan bloklarni ovozli recall qiladi (RecallPanel).

import { useState, useCallback, useMemo } from 'react'
import { X, Sparkles, Check, RotateCcw, Brain } from 'lucide-react'
import { loadSrsMap, computeSRSDistribution, type SRSDistribution } from '../../services/speakingPathService'
import RecallPanel from './RecallPanel'
import type { SpeakingChunk } from '../../data/speakingPath/types'
import { monitoring } from '../../lib/monitoring'

interface Props {
  chunks: SpeakingChunk[]
  userId?: string
  onExit: () => void
}

export default function SpeakingReviewSession({ chunks, userId, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [chunkScores, setChunkScores] = useState<number[]>([])
  const [globalSrsDist, setGlobalSrsDist] = useState<SRSDistribution[] | null>(null)
  const [showGlobalSrs, setShowGlobalSrs] = useState(false)

  const chunk = chunks[index]
  const isLast = index >= chunks.length - 1
  const allDone = index >= chunks.length

  const handleDone = useCallback((bestSim: number) => {
    const pct = Math.round(bestSim * 100)
    setChunkScores(prev => [...prev, pct])
    if (isLast) {
      setIndex(i => i + 1) // → allDone = true
      // Load global SRS stats (non-blocking)
      if (userId) {
        loadSrsMap(userId).then(map => {
          setGlobalSrsDist(computeSRSDistribution(map))
        }).catch((e: unknown) => {
          monitoring.captureMessage('loadSrsMap (review session) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        })
      }
    } else {
      setIndex(i => i + 1)
    }
  }, [isLast, userId])

  const avgScore = useMemo(() => {
    return chunkScores.length
      ? Math.round(chunkScores.reduce((a, b) => a + b, 0) / chunkScores.length)
      : 0
  }, [chunkScores])

  const correctCount = useMemo(() => {
    return chunkScores.filter(s => s >= 65).length
  }, [chunkScores])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 mobile-safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
          <X size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">🔁 Takrorlash</p>
          {!allDone && <p className="text-xs text-gray-500 dark:text-gray-400">{index + 1} / {chunks.length} ibora</p>}
        </div>
      </div>

      {allDone ? (
        <div className="space-y-3">
          {/* 🎉 Done card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
              <Sparkles size={28} className="text-white" />
            </div>
            <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Takror tugadi! 🎉</p>
            <p className="text-2xl font-black text-primary-600 dark:text-primary-400 mt-1">{avgScore}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chunks.length} ibora · {correctCount}/{chunks.length} to'g'ri</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Natijalar FSRS rejasiga yozildi.</p>
          </div>

          {/* 📊 Per-chunk breakdown */}
          <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Har bir ibora bo'yicha natija</p>
            <div className="space-y-2">
              {chunks.map((c, i) => {
                const score = chunkScores[i] ?? 0
                const correct = score >= 65
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${correct ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {correct ? <Check size={13} className="text-white" /> : <RotateCcw size={11} className="text-gray-400" />}
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

          {/* 📊 Global SRS distribution */}
          {globalSrsDist && (
            <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowGlobalSrs(v => !v)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Brain size={16} className="text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Umumiy SRS holati</p>
                </div>
                <span className="text-xs text-gray-400">{showGlobalSrs ? '▲' : '▼'}</span>
              </button>

              {showGlobalSrs && (
                <div className="mt-3 animate-slide-up">
                  {/* Stacked bar */}
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 flex overflow-hidden">
                    {globalSrsDist.map((b, i) => (
                      <div
                        key={i}
                        className="h-full transition-all duration-700"
                        style={{
                          width: b.count > 0 ? `${(b.count / globalSrsDist.reduce((s, x) => s + x.count, 0)) * 100}%` : '0%',
                          backgroundColor: b.color,
                        }}
                      />
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {globalSrsDist.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                        {b.label}: <span className="font-semibold">{b.count}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Jami {globalSrsDist.reduce((s, b) => s + b.count, 0)} ta iboradan {(globalSrsDist[3]?.count || 0) + (globalSrsDist[4]?.count || 0)} tasi o'zlashtirilgan
                  </p>
                </div>
              )}
            </div>
          )}

          <button onClick={onExit} className="w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all">
            Narvonga qaytish
          </button>
        </div>
      ) : (
        <>
          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center">
            {chunks.map((c, i) => {
              const score = chunkScores[i]
              let color = 'bg-gray-200 dark:bg-gray-700'
              if (i === index) color = 'bg-primary-400 dark:bg-primary-500'
              else if (score !== undefined) color = score >= 65 ? 'bg-emerald-500' : 'bg-rose-400'
              return (
                <div
                  key={c.id}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${color} ${i === index ? 'ring-2 ring-primary-300 dark:ring-primary-600' : ''}`}
                  title={score !== undefined ? `${score}%` : c.en}
                />
              )
            })}
          </div>
          <RecallPanel key={chunk.id} chunk={chunk} userId={userId} isLast={isLast} onDone={handleDone} />
        </>
      )}
    </div>
  )
}
