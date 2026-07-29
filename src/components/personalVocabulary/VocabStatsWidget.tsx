import { useMemo } from 'react'
import type { PersonalWord, PersonalVocabSession } from '../../types/personalVocabulary'
import { getTodayTashkent, addDaysTashkent } from '../../utils/tashkentDate'
import {
  BarChart3, PieChart, Activity,
  Brain, Target, Layers, CheckCircle2, AlertTriangle
} from 'lucide-react'

interface VocabStatsWidgetProps {
  words: PersonalWord[]
  sessions?: PersonalVocabSession[]
}

const BOX_LABELS = ['1', '2', '3', '4', '5', '6']
const BOX_COLORS_BG = [
  'bg-gray-300 dark:bg-gray-600',
  'bg-blue-400 dark:bg-blue-500',
  'bg-cyan-400 dark:bg-cyan-500',
  'bg-amber-400 dark:bg-amber-500',
  'bg-orange-400 dark:bg-orange-500',
  'bg-green-500 dark:bg-green-500',
]


function formatNumber(n: number): string {
  return n.toLocaleString()
}

export default function VocabStatsWidget({ words, sessions = [] }: VocabStatsWidgetProps) {
  const stats = useMemo(() => {
    const total = words.length
    if (total === 0) return null

    const today = getTodayTashkent()

    // Box distribution
    const boxDist = Array(6).fill(0)
    words.forEach(w => {
      const idx = Math.min(Math.max(w.box - 1, 0), 5)
      boxDist[idx]++
    })

    // Mastery categories
    const mastered = words.filter(w => w.box >= 6 && w.is_learned).length
    const learning = words.filter(w => !w.is_learned && w.box >= 2).length
    const newWords = words.filter(w => w.box <= 1 && !w.is_learned).length
    const due = words.filter(w => !w.is_learned && w.next_review <= today).length
    const overdue = words.filter(w => {
      if (w.is_learned) return false
      const diff = new Date(today).getTime() - new Date(w.next_review).getTime()
      return diff > 2 * 24 * 60 * 60 * 1000
    }).length

    // Accuracy
    const totalCorrect = words.reduce((s, w) => s + w.correct_count, 0)
    const totalWrong = words.reduce((s, w) => s + w.wrong_count, 0)
    const totalAttempts = totalCorrect + totalWrong
    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

    // By level accuracy
    const levels = ['A1', 'A2', 'B1', 'B2'] as const
    const levelAccuracy = levels.map(l => {
      const levelWords = words.filter(w => w.level === l && (w.correct_count + w.wrong_count) > 0)
      const correct = levelWords.reduce((s, w) => s + w.correct_count, 0)
      const total = correct + levelWords.reduce((s, w) => s + w.wrong_count, 0)
      return {
        level: l,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        count: levelWords.length,
      }
    })

    // Review activity from immutable session rows.
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = addDaysTashkent(-i)
      const daySessions = sessions.filter(session => session.session_date === date)
      return {
        date,
        count: daySessions.length,
        correct: daySessions.filter(session => session.result === 'correct').length,
        wrong: daySessions.filter(session => session.result === 'wrong').length,
      }
    }).reverse()

    // Average SRS metrics
    const avgStability = words.reduce((s, w) => s + (w.fsrs_stability || 0), 0) / Math.max(total, 1)
    const avgDifficulty = words.reduce((s, w) => s + (w.fsrs_difficulty || 5), 0) / Math.max(total, 1)

    return {
      total, mastered, learning, newWords, due, overdue,
      boxDist, overallAccuracy, levelAccuracy, recentActivity,
      avgStability: Math.round(avgStability * 10) / 10,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10,
      totalAttempts,
    }
  }, [words, sessions])

  if (!stats) return null

  const maxBox = Math.max(...stats.boxDist, 1)

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-primary-500" />
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">O'zlashtirish</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.mastered}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">{stats.total} ta so'zdan {Math.round((stats.mastered / stats.total) * 100)}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-green-500" />
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aniqlik</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.overallAccuracy}%</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">{formatNumber(stats.totalAttempts)} ta urinish</div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={14} className="text-violet-500" />
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stability</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgStability}d</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">O'rtacha barqarorlik</div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-amber-500" />
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Difficulty</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgDifficulty}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">O'rtacha qiyinchilik</div>
        </div>
      </div>

      {/* Box Distribution Chart */}
      <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={14} className="text-primary-500" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Box Distribution (Leitner)</span>
          <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">
            {stats.due} ta takrorlanishi kerak
            {stats.overdue > 0 && (
              <span className="text-red-500 ml-1">· {stats.overdue} ta kechikkan</span>
            )}
          </span>
        </div>
        <div className="space-y-1.5">
          {BOX_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 w-4 text-right shrink-0">
                {label}
              </span>
              <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all duration-500 ${BOX_COLORS_BG[i]}`}
                  style={{ width: `${(stats.boxDist[i] / maxBox) * 100}%` }}
                />
                {stats.boxDist[i] > 0 && (
                  <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-white mix-blend-difference">
                    {stats.boxDist[i]} ta
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-gray-400 dark:text-gray-500">
          <span>Box 1 — Yangi</span>
          <span>Box 3 — O'rta</span>
          <span>Box 6 — O'zlashtirilgan</span>
        </div>
      </div>

      {/* Mastery Donut + Level Accuracy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Mastery Donut */}
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={14} className="text-primary-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">O'zlashtirish</span>
          </div>
          <div className="flex items-center gap-4">
            {/* SVG Donut */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {(() => {
                  const masteredAngle = (stats.mastered / stats.total) * 360
                  const learningAngle = (stats.learning / stats.total) * 360
                  const newAngle = (stats.newWords / stats.total) * 360

                  let offset = 0
                  const segments = [
                    { angle: newAngle, color: '#9CA3AF', label: 'Yangi' },
                    { angle: learningAngle, color: '#FBBF24', label: 'O\'rganilmoqda' },
                    { angle: masteredAngle, color: '#22C55E', label: 'O\'zlashtirilgan' },
                  ].filter(s => s.angle > 0)

                  return segments.map((seg) => {
                    const r = 16
                    const x1 = Math.sin((offset * Math.PI) / 180) * r
                    const y1 = -Math.cos((offset * Math.PI) / 180) * r
                    const x2 = Math.sin(((offset + seg.angle) * Math.PI) / 180) * r
                    const y2 = -Math.cos(((offset + seg.angle) * Math.PI) / 180) * r
                    const largeArc = seg.angle > 180 ? 1 : 0
                    const startX = 18 + x1
                    const startY = 18 + y1
                    const endX = 18 + x2
                    const endY = 18 + y2
                    offset += seg.angle

                    return (
                      <path
                        key={seg.label}
                        d={`M 18 18 L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`}
                        fill={seg.color}
                        className="transition-all duration-500"
                      />
                    )
                  })
                })()}
                <circle cx="18" cy="18" r="9" className="fill-white dark:fill-gray-800" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.total}</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-1.5">
              {[
                { label: 'O\'zlashtirilgan', count: stats.mastered, color: 'bg-green-500' },
                { label: 'O\'rganilmoqda', count: stats.learning, color: 'bg-amber-400' },
                { label: 'Yangi', count: stats.newWords, color: 'bg-gray-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Accuracy */}
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Daraja bo'yicha aniqlik</span>
          </div>
          <div className="space-y-3">
            {stats.levelAccuracy.map(l => (
              <div key={l.level}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{l.level}</span>
                    <span className="text-gray-400 dark:text-gray-500">({l.count} ta)</span>
                  </div>
                  <span className={`font-bold ${
                    l.accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                    l.accuracy >= 50 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {l.accuracy}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      l.accuracy >= 80 ? 'bg-green-500' :
                      l.accuracy >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${l.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
            <AlertTriangle size={10} />
            <span>Kam urinish statistikasi aniq bo'lmasligi mumkin</span>
          </div>
        </div>
      </div>

      {/* Review Activity (last 7 days) */}
      <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-primary-500" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">So'nggi 7 kunlik faollik</span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {stats.recentActivity.map((day, i) => {
            const maxDayCount = Math.max(...stats.recentActivity.map(d => d.count), 1)
            const height = (day.count / maxDayCount) * 100
            const isToday = i === stats.recentActivity.length - 1
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isToday ? 'bg-primary-500' : 'bg-primary-300 dark:bg-primary-600'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                  />
                </div>
                <span className={`text-[9px] font-medium ${
                  isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'][new Date(day.date + 'T12:00:00').getDay()]}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-primary-300 dark:bg-primary-600" />
            Oldingi kunlar
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-primary-500" />
            Bugun
          </span>
        </div>
      </div>
    </div>
  )
}
