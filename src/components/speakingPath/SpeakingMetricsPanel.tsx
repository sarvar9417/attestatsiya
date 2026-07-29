import { useState, useEffect } from 'react'
import { ChevronDown, AlertTriangle, TrendingUp } from 'lucide-react'
import type { SpeakingStats } from '../../services/speakingPathService'
import { getFrequentErrors, getDrillSuggestions, getErrorTrend } from '../../services/pronunciationErrorService'
import type { SoundErrorCount, DrillSuggestion } from '../../services/pronunciationErrorService'
import { useNavigate } from 'react-router-dom'

interface Props {
  stats: SpeakingStats
  showWeeklyGoal?: boolean
  className?: string
}

export default function SpeakingMetricsPanel({ stats, showWeeklyGoal, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [frequentErrors, setFrequentErrors] = useState<SoundErrorCount[]>([])
  const [drillSuggestions, setDrillSuggestions] = useState<DrillSuggestion[]>([])
  const [errorTrend, setErrorTrend] = useState<{ date: string; count: number }[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    getFrequentErrors(5).then(setFrequentErrors)
    getDrillSuggestions().then(setDrillSuggestions)
    getErrorTrend(7).then(setErrorTrend)
  }, [open])

  const totalErrorCount = frequentErrors.reduce((s, e) => s + e.count, 0)
  const errorDelta = errorTrend.length >= 2
    ? errorTrend[errorTrend.length - 1].count - errorTrend[0].count
    : 0

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-rose-200/50 dark:border-rose-800/30 text-xs hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors"
      >
        <span className="font-semibold text-gray-600 dark:text-gray-400">📊 Batafsil statistika</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-1.5 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-rose-200/50 dark:border-rose-800/30 space-y-3 animate-slide-up">
          {/* Asosiy statistikalar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">🎯 Talaffuz aniqlik (7 kun)</span>
              <span className={`text-xs font-bold ${stats.avgSpeakScore7d >= 70 ? 'text-emerald-600' : stats.avgSpeakScore7d >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                {stats.avgSpeakScore7d}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">🎯 Talaffuz aniqlik (30 kun)</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stats.avgSpeakScore30d}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">📅 Kuniga o'rtacha gapirish</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stats.avgMinutesPerDay7d} daqiqa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">✅ O'zlashtirilgan iboralar</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stats.chunksMastered} ta</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">📊 O'rtacha retention</span>
              <span className={`text-xs font-bold ${stats.avgChunkStability >= 30 ? 'text-emerald-600' : stats.avgChunkStability >= 15 ? 'text-amber-600' : 'text-rose-600'}`}>
                {stats.avgChunkStability.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">🔥 Streak</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stats.streakDays} kun</span>
            </div>
          </div>

          {/* Weekly progress bar */}
          {showWeeklyGoal && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Haftalik maqsad</span>
                <span>{stats.todayMinutes}/15 daq bugun</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all"
                  style={{ width: `${Math.min(100, (stats.todayMinutes / 15) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Pronunciation error monitoring */}
          {totalErrorCount > 0 && (
            <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} className="text-amber-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Eng ko'p xato qilingan tovushlar</span>
                {errorDelta > 0 && (
                  <span className="text-xs text-rose-500 font-semibold">+{errorDelta} (7 kun)</span>
                )}
              </div>

              {/* Error bars */}
              <div className="space-y-1.5">
                {frequentErrors.map((err, i) => {
                  const pct = totalErrorCount > 0 ? (err.count / totalErrorCount) * 100 : 0
                  return (
                    <div key={err.soundId}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 dark:text-gray-300">{err.label}</span>
                        <span className="text-gray-500">{err.count}×</span>
                      </div>
                      <div className="mt-0.5 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${i === 0 ? 'bg-rose-400' : i === 1 ? 'bg-amber-400' : 'bg-blue-400'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Drill suggestions */}
              {drillSuggestions.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Tavsiya qilingan mashqlar</span>
                  </div>
                  <div className="space-y-1">
                    {drillSuggestions.map(d => (
                      <button
                        key={d.categoryId}
                        onClick={() => navigate('/pronunciation')}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs transition-colors"
                      >
                        <span className="text-gray-700 dark:text-gray-300">{d.label}</span>
                        <span className="text-gray-400">{d.count}× xato</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
