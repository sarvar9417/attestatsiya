import { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, Brain, CalendarDays, Target, Library, FileQuestion } from 'lucide-react'
import { useI18n } from '../../i18n'
import EmptyState from '../ui/EmptyState'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { db } from '../../lib/db'
import type { DaySession } from '../../services/vocabularyService'

interface Props {
  userId: string
  sessions: Map<string, DaySession>
  levelCounts?: Map<string, number>
}

const BOX_COLORS = ['#9CA3AF', '#34D399', '#60A5FA', '#A78BFA', '#FBBF24', '#F97316']
const BOX_LABELS = ['1-kun', '3-kun', '7-kun', '14-kun', '30-kun', '90-kun']

interface BoxStat {
  name: string
  value: number
  color: string
}

interface DailyStat {
  date: string
  label: string
  words: number
  score: number
  pct: number
}

interface LevelStat {
  level: string
  studied: number
  learned: number
  total: number
  color: string
}

function fmtShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

function getLast14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#9CA3AF', A2: '#3B82F6', B1: '#6366F1', B2: '#8B5CF6',
}

export default function VocabAnalytics({ userId, sessions, levelCounts }: Props) {
  const { t } = useI18n()
  const [boxData, setBoxData] = useState<BoxStat[]>([])
  const [levelData, setLevelData] = useState<LevelStat[]>([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalWordsStudied, setTotalWordsStudied] = useState(0)
  const [totalWordsLearned, setTotalWordsLearned] = useState(0)
  const [avgDaily, setAvgDaily] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      setLoading(true)
      try {
        const { data: boxRows } = await supabase
          .from('vocabulary_progress')
          .select('box, is_learned')
          .eq('user_id', userId)

        const boxCounts = [0, 0, 0, 0, 0, 0]
        let learned = 0
        for (const row of boxRows ?? []) {
          if (row.box >= 1 && row.box <= 6) {
            boxCounts[row.box - 1]++
          }
          if (row.is_learned) learned++
        }
        setTotalWordsLearned(learned)
        setTotalWordsStudied((boxRows ?? []).length)

        setBoxData(
          boxCounts.map((count, i) => ({
            name: BOX_LABELS[i],
            value: count,
            color: BOX_COLORS[i],
          }))
        )

        const lvlResult = await supabase
          .from('vocabulary_progress')
          .select('word_id, is_learned, words(level)')
          .eq('user_id', userId)
        const lvlRows = db.cast<{ word_id: number; is_learned: boolean; words: { level: string } | null }[]>(lvlResult.data ?? [])

        const lvlStudiedMap = new Map<string, number>()
        const lvlLearnedMap = new Map<string, number>()
        for (const row of lvlRows ?? []) {
          const lvl = row.words?.level ?? 'A1'
          lvlStudiedMap.set(lvl, (lvlStudiedMap.get(lvl) ?? 0) + 1)
          if (row.is_learned) {
            lvlLearnedMap.set(lvl, (lvlLearnedMap.get(lvl) ?? 0) + 1)
          }
        }

        setLevelData(
          ['A1', 'A2', 'B1', 'B2'].map(lvl => ({
            level: lvl,
            studied: lvlStudiedMap.get(lvl) ?? 0,
            learned: lvlLearnedMap.get(lvl) ?? 0,
            total: levelCounts?.get(lvl) ?? 0,
            color: LEVEL_COLORS[lvl] ?? '#9CA3AF',
          }))
        )

        const last14Days = getLast14Days()
        let studiedInPeriod = 0
        for (const day of last14Days) {
          const s = sessions.get(day)
          if (s) studiedInPeriod += s.total_words
        }
        setAvgDaily(Math.round(studiedInPeriod / 14))

        setTotalSessions(sessions.size)
      } catch (e) {
        monitoring.captureMessage('loadAnalytics error: ' + (e instanceof Error ? e.message : String(e)), 'error')
      } finally {
        setLoading(false)
      }
    })()
  }, [userId, levelCounts, sessions])

  // Build daily chart data from sessions
  const last14Days = getLast14Days()
  const dailyChartData: DailyStat[] = last14Days.map(date => {
    const s = sessions.get(date)
    return {
      date,
      label: fmtShort(date),
      words: s?.total_words ?? 0,
      score: s?.total_score ?? 0,
      pct: s && s.total_words > 0 ? Math.round((s.total_score / s.total_words) * 100) : 0,
    }
  })

  const totalBoxWords = boxData.reduce((a, b) => a + b.value, 0)

  if (loading) {
    return (
      <div className="card p-6 text-center text-sm text-gray-400 dark:text-gray-500">
        {t('analytics.loading')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { icon: BookOpen, label: t('analytics.studied'), value: totalWordsStudied, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Brain, label: t('analytics.learned'), value: totalWordsLearned, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: CalendarDays, label: t('analytics.dailyAvg'), value: `${avgDaily} ${t('analytics.wordCount', { count: '' })}`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: Target, label: t('analytics.sessions'), value: totalSessions, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`card p-3 text-center ${bg}/30 dark:bg-gray-800/50`}>
            <div className={`w-8 h-8 rounded-lg ${bg} dark:bg-gray-700 flex items-center justify-center mx-auto mb-1.5`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Daily activity chart ── */}
      <div className="card p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-b1-500" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('analytics.dailyActivity')}</h3>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{t('analytics.wordsViewed')}</span>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData} barCategoryGap={3}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                formatter={(value: number) => [value, t('analytics.wordsViewed')]}
                labelFormatter={(label: string) => {
                  const day = dailyChartData.find(d => d.label === label)
                  return day ? day.date : label
                }}
              />
              <Bar dataKey="words" fill="#6366F1" radius={[3, 3, 0, 0]} name="words" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Box distribution + Level distribution ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Box chart */}
        <div className="card p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Brain size={15} className="text-purple-500" />
            {t('analytics.boxDistribution')}
          </h3>
          {totalBoxWords > 0 ? (
            <div className="space-y-2">
              {boxData.map((box, i) => {
                const pct = totalBoxWords > 0 ? Math.round((box.value / totalBoxWords) * 100) : 0
                return (
                  <div key={box.name}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Box {i + 1}</span>
                      <span className="text-gray-400 dark:text-gray-500">{t('analytics.wordCount', { count: box.value })} · {pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: box.color }}
                      />
                    </div>
                  </div>
                )
              })}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                <span className="font-semibold text-green-600 dark:text-green-400">{t('analytics.learnedPerLevel', { learned: totalWordsLearned, studied: totalBoxWords, total: totalBoxWords })}</span>
              </p>
            </div>
          ) : (
            <EmptyState icon={Library} title={t('analytics.noWordsYet')} description={t('analytics.addWordsDesc')} size="sm" />
          )}
        </div>

        {/* Level chart */}
        <div className="card p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <BookOpen size={15} className="text-blue-500" />
            {t('analytics.byLevel')}
          </h3>
          {levelData.length > 0 ? (
            <div className="space-y-2.5">
              {levelData.map(lvl => {
                const studiedPct = lvl.total > 0 ? Math.round((lvl.studied / lvl.total) * 100) : 0
                return (
                  <div key={lvl.level}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{lvl.level}</span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {t('analytics.learnedPerLevel', { learned: lvl.learned, studied: lvl.studied, total: lvl.total })}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                      {/* Studied bar */}
                      <div
                        className="h-full rounded-full absolute top-0 left-0 transition-all duration-500 opacity-30"
                        style={{ width: `${studiedPct}%`, backgroundColor: LEVEL_COLORS[lvl.level] }}
                      />
                      {/* Learned bar */}
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${lvl.total > 0 ? Math.round((lvl.learned / lvl.total) * 100) : 0}%`,
                          backgroundColor: LEVEL_COLORS[lvl.level],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={FileQuestion} title={t('analytics.noData')} description={t('analytics.addWordsDesc')} size="sm" />
          )}
        </div>
      </div>
    </div>
  )
}
