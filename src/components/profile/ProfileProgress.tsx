import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'
import { useStore } from '../../store/useStore'
import { useNavigate } from 'react-router-dom'
import { useInView } from '../../hooks/useInView'
import { LESSON_INDEX } from '../../data/daily/lessonsIndex'
import {
  Flame, BarChart2, TrendingUp, Award, Target, ChevronRight,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DayData {
  date:         string
  label:        string
  day:          number
  hours:        number
  xp:           number
  grammarPct:   number
  vocabPct:     number
  listeningPct: number
  writingPct:   number
  speakingPct:  number
  readingPct:   number
  cumulativeXP: number
  newWords:     number
  totalWords:   number
  mockScore:    number
  hasReal:      boolean
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  timeline: DayData[]
  radarData: { subject: string; value: number }[]
  mockData: { week: string; score: number }[]
  progressLoading: boolean
  supaStreak: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function heatColor(hours: number) {
  if (hours === 0)  return 'bg-gray-100 dark:bg-gray-800'
  if (hours < 4)    return 'bg-green-200 dark:bg-green-900/40'
  if (hours < 8)    return 'bg-green-300 dark:bg-green-800/50'
  if (hours < 11)   return 'bg-green-400 dark:bg-green-700/60'
  if (hours < 14)   return 'bg-green-600 dark:bg-green-600/70'
  return 'bg-green-800 dark:bg-green-500/80'
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function StreakCalendar({ days }: { days: DayData[] }) {
  const { t } = useI18n()
  const weeks: DayData[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  const dayLabels = ['Dt', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        <div className="flex flex-col gap-1 mr-1">
          <div className="h-4" />
          {dayLabels.map((lbl) => (
            <div key={lbl} className="h-3 flex items-center">
              <span className="text-xs text-gray-400 w-4">{lbl}</span>
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 h-4 flex items-center">
              {wi % 2 === 0 ? `${wi + 1}h` : ''}
            </span>
            {[0, 1, 2, 3, 4, 5, 6].map((di) => {
              const d = week[di]
              return d ? (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm cursor-default ${heatColor(d.hours)}`}
                  title={`${d.date}: ${d.hours}h, ${d.xp} XP`}
                />
              ) : (
                <div key={di} className="w-3 h-3 rounded-sm bg-gray-50" />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-xs text-gray-400">{t('profile.progress.heatLow')}</span>
        {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'].map((cls) => (
          <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-xs text-gray-400">{t('profile.progress.heatHigh')}</span>
      </div>
    </div>
  )
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function HoursTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  const { t } = useI18n()
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-primary-600">{t('profile.progress.hoursTooltip', { value: String(payload[0]?.value) })}</p>
    </div>
  )
}

function GrowthSnapshot({ timeline, currentDay }: { timeline: DayData[]; currentDay: number }) {
  const { t } = useI18n()
  if (timeline.length < 5) return null
  const firstWeek = timeline.filter(d => d.day <= 7)
  const startDay = firstWeek.length > 0 ? firstWeek[0].day : 1
  const startXP = firstWeek.length > 0 ? firstWeek[0].cumulativeXP - firstWeek[0].xp : 0
  const startWords = firstWeek.length > 0 ? firstWeek[0].totalWords - firstWeek[0].newWords : 0
  const last = timeline[timeline.length - 1]

  if (currentDay - startDay < 10) return null

  const items = [
    { labelKey: 'profile.progress.growthLessons', before: `${startDay}`,  after: `${currentDay}` },
    { labelKey: 'profile.progress.growthXP',       before: `${startXP}`,   after: `${last.cumulativeXP.toLocaleString()}` },
    { labelKey: 'profile.progress.growthWords',  before: `${startWords}`, after: `${last.totalWords}` },
  ]

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
        {t('profile.progress.growthTitle', { days: String(currentDay - startDay) })}
      </h3>
      <div className="grid grid-cols-3 gap-2">            {items.map((item, i) => (
          <div key={i} className="text-center bg-white dark:bg-gray-800 rounded-xl p-2.5">
            <p className="text-xs text-gray-400 mb-1">{t(item.labelKey as keyof TranslationStrings)}</p>
            <p className="text-xs text-gray-400 line-through">{item.before}</p>
            <p className="text-base font-bold text-green-600 dark:text-green-400">{item.after}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PredictionCard({ timeline, currentDay }: { timeline: DayData[]; currentDay: number }) {
  const { t } = useI18n()
  const totalDays = 126
  const remaining = totalDays - currentDay
  const weeksWithData = Math.max(1, Math.ceil(timeline.length / 7))
  const daysWithActivity = timeline.filter(d => d.hours > 0).length
  const avgDaysPerWeek = +(daysWithActivity / weeksWithData).toFixed(1)
  const daysUntilDone = avgDaysPerWeek > 0
    ? Math.ceil(remaining / (avgDaysPerWeek / 7))
    : null
  const finishDate = daysUntilDone
    ? new Date(Date.now() + daysUntilDone * 86_400_000).toLocaleDateString('uz-UZ')
    : null
  const faster = avgDaysPerWeek > 0
    ? Math.ceil(remaining / ((avgDaysPerWeek + 1) / 7))
    : null
  const fasterDate = faster
    ? new Date(Date.now() + faster * 86_400_000).toLocaleDateString('uz-UZ')
    : null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        {t('profile.progress.predictionTitle')}
      </h3>
      {finishDate ? (
        <>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {t('profile.progress.predictionDays', { days: String(daysUntilDone) })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('profile.progress.predictionDate', { date: finishDate })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t('profile.progress.predictionPace', { days: String(avgDaysPerWeek) })}
          </p>
          {fasterDate && (
            <p className="text-xs text-indigo-500 mt-2">
              {t('profile.progress.predictionFaster', { date: fasterDate })}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400">{t('profile.progress.predictionNoData')}</p>
      )}
    </div>
  )
}

// ── CEFR Progress ───────────────────────────────────────────────────────────

const CEFR_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2'] as const

const LEVEL_BAR_COLORS: Record<string, string> = {
  A0: 'bg-gray-400',
  A1: 'bg-blue-500',
  A2: 'bg-teal-500',
  B1: 'bg-amber-500',
  'B1+': 'bg-orange-500',
  B2: 'bg-purple-600',
}

function CefrProgressCard() {
  const { t } = useI18n()
  const lessonProgress = useStore((s) => s.lessonProgress)
  const navigate = useNavigate()
  const { ref, isInView } = useInView<HTMLDivElement>()

  const levelData = CEFR_LEVELS.map((level) => {
    const levelLessons = LESSON_INDEX.filter((l) => l.level === level)
    const total = levelLessons.length
    const done = levelLessons.filter((l) => lessonProgress[l.id] !== undefined).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { level, total, done, pct }
  })

  const totalAll = levelData.reduce((s, d) => s + d.total, 0)
  const doneAll = levelData.reduce((s, d) => s + d.done, 0)
  const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0

  return (
    <div ref={ref} className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('cefrProgress.title')}</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          {t('cefrProgress.viewAll')} <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50 dark:border-gray-700">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${isInView ? overallPct : 0}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{doneAll}/{totalAll}</span>
      </div>

      <div className="space-y-2.5">
        {levelData.map(({ level, total, done, pct }, i) => (
          <div key={level} className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-8 flex-shrink-0">{level}</span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${LEVEL_BAR_COLORS[level] ?? 'bg-gray-400'}`}
                style={{
                  width: `${isInView ? pct : 0}%`,
                  transitionDelay: `${isInView ? 150 + i * 80 : 0}ms`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right flex-shrink-0">
              {done}/{total}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileProgress({
  timeline,
  radarData,
  mockData,
  progressLoading,
  supaStreak,
}: Props) {
  const { t } = useI18n()
  const { totalXP, streak, currentDay } = useStore()

  const activeDays = timeline.filter(d => d.hours > 0).length
  const avgHours = activeDays
    ? (timeline.reduce((s, d) => s + d.hours, 0) / activeDays).toFixed(1)
    : '0.0'

  const barData = timeline.map((d, i) => ({
    ...d,
    label: i % 7 === 0 ? `K${d.day}` : '',
  }))

  const xpData = timeline.map((d) => ({
    label:        d.label || '',
    cumulativeXP: d.cumulativeXP,
  }))

  const logRows = [...timeline].reverse().slice(0, 30)

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* CEFR Progress */}
      <CefrProgressCard />

      {/* Growth snapshot */}
      <GrowthSnapshot timeline={timeline} currentDay={currentDay} />

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: <Award size={16} />,   color: 'text-b2-600',     labelKey: 'profile.progress.totalXPLabel',    value: totalXP.toLocaleString()        },
          { icon: <Flame size={16} />,   color: 'text-orange-500', labelKey: 'profile.progress.streakLabel',     value: `${supaStreak || streak} ${t('profile.info.dayLabel').toLowerCase()}`   },
          { icon: <BarChart2 size={16}/>, color: 'text-primary-600',labelKey: 'profile.progress.avgLabel',        value: `${avgHours}h/kun`              },
          { icon: <TrendingUp size={16}/>,color: 'text-green-600',  labelKey: 'profile.progress.currentDayLabel',    value: `${t('profile.info.dayLabel')} ${currentDay}`            },
        ].map((s, i) => (
          <div key={i} className="card text-center py-3">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{t(s.labelKey as keyof TranslationStrings)}</p>
          </div>
        ))}
      </div>

      {/* Prediction card */}
      <PredictionCard timeline={timeline} currentDay={currentDay} />

      {/* Row 1: Bar chart + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title={t('profile.progress.chartHoursTitle')} sub={t('profile.progress.chartHoursSub')}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<HoursTip />} />
                <ReferenceLine
                  y={14}
                  stroke="#f59e0b"
                  strokeDasharray="5 3"
                  label={{ value: '14h', fill: '#f59e0b', fontSize: 10, position: 'right' }}
                />
                <Bar dataKey="hours" fill="#1a56db" radius={[3, 3, 0, 0]} maxBarSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title={t('profile.progress.chartRadarTitle')} sub={t('profile.progress.chartRadarSub')}>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={t('profile.progress.chartRadarTitle')}
                dataKey="value"
                stroke="#1a56db"
                fill="#1a56db"
                fillOpacity={0.25}
              />
              <Tooltip                formatter={(v: number) => [`${v}%`, 'Score']}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Mock test */}
      <ChartCard title={t('profile.progress.chartMockTitle')} sub={t('profile.progress.chartMockSub')}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={mockData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Score']}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <ReferenceLine y={60} stroke="#10b981" strokeDasharray="4 2"
              label={{ value: 'B1', fill: '#10b981', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={80} stroke="#1a56db" strokeDasharray="4 2"
              label={{ value: 'B2', fill: '#1a56db', fontSize: 9, position: 'right' }} />
            <Line
              type="monotone" dataKey="score" name="Ball"
              stroke="#7e3af2" strokeWidth={2.5}
              dot={{ fill: '#7e3af2', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Streak calendar */}
      <ChartCard title={t('profile.progress.chartCalendarTitle')} sub={t('profile.progress.chartCalendarSub')}>
        <StreakCalendar days={timeline} />
      </ChartCard>

      {/* XP area chart */}
      <ChartCard title={t('profile.progress.chartXPHistoryTitle')} sub={t('profile.progress.chartXPHistorySub')}>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={xpData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7e3af2" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7e3af2" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v: number) => [`${v.toLocaleString()} XP`, t('profile.progress.totalXPLabel')]}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Area
              type="monotone" dataKey="cumulativeXP" name="Jami XP"
              stroke="#7e3af2" fill="url(#xpGrad)" strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Daily log table */}
      <div className="card">
        <p className="font-semibold text-gray-800 text-sm mb-3">{t('profile.progress.dailyLogTitle')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {[t('profile.progress.tableDate'), t('profile.progress.tableHours'), t('profile.progress.tableTopics'), 'XP'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-gray-400 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logRows.map((d) => {
                const topics: string[] = []
                if (d.grammarPct   >= 20) topics.push('📚 Grammar')
                if (d.vocabPct     >= 20) topics.push('📝 Vocab')
                if (d.listeningPct >= 20) topics.push('🎧 Listening')
                if (d.writingPct   >= 20) topics.push('✍️ Writing')
                if (d.speakingPct  >= 20) topics.push('🎤 Speaking')
                if (d.readingPct   >= 20) topics.push('📖 Reading')

                return (
                  <tr key={d.date} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">{d.date}</td>
                    <td className="py-2 pr-4 font-semibold text-gray-800">{d.hours}h</td>
                    <td className="py-2 pr-4 text-gray-600">
                      {topics.length > 0 ? topics.join(' · ') : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2 font-semibold text-primary-600">{d.xp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
