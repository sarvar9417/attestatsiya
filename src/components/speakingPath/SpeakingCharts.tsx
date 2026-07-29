// Speaking Path — Analytics Charts (Phase 2)
// Progress trend, SRS distribution, weekly activity

import { useState, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts'
import { TrendingUp, Brain, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react'
import type { TrendPoint, SRSDistribution } from '../../services/speakingPathService'

interface Props {
  trend: TrendPoint[]
  srsDistribution: SRSDistribution[]
  avgScore7d: number
  avgStability: number
  className?: string
}

// ── Custom Tooltips ──

function ScoreTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">Ball: {payload[0]?.value}%</p>
    </div>
  )
}

function MinuteTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400">{payload[0]?.value} daqiqa</p>
    </div>
  )
}

function SRSTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-gray-600 dark:text-gray-400" style={{ color: payload[0]?.color }}>{payload[0]?.value} ta ibora</p>
    </div>
  )
}

// ── Chart Components ──

function ProgressTrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = data.slice(-21) // So'nggi 21 kun
  const hasData = chartData.some(d => d.score > 0)

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
        <TrendingUp size={28} className="mb-2 opacity-50" />
        <p className="text-xs font-medium">Hali ma'lumot yo'q</p>
        <p className="text-xs mt-0.5">Speaking session yakunlaganingizdan so'ng grafik paydo bo'ladi</p>
      </div>
    )
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            width={25}
          />
          <Tooltip content={<ScoreTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: '#6366F1', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function WeeklyActivityChart({ data }: { data: TrendPoint[] }) {
  const weeklyData = useMemo(() => {
    const last7 = data.slice(-7)
    const dayNames: Record<string, string> = {
      'Ya': 'Yak', 'Du': 'Du', 'Se': 'Se', 'Ch': 'Chor', 'Pa': 'Pay', 'Ju': 'Ju', 'Sh': 'Shan'
    }
    return last7.map(d => ({
      ...d,
      fullLabel: dayNames[d.label] || d.label,
    }))
  }, [data])

  const hasMinutes = weeklyData.some(d => d.minutes > 0)

  if (!hasMinutes) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-400 dark:text-gray-500">
        <CalendarDays size={24} className="mb-2 opacity-50" />
        <p className="text-xs font-medium">Hali ma'lumot yo'q</p>
      </div>
    )
  }

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="fullLabel"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            width={22}
          />
          <Tooltip content={<MinuteTooltip />} />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {weeklyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.minutes > 0 ? '#10B981' : '#E5E7EB'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function SRSDistributionChart({ data }: { data: SRSDistribution[] }) {
  const total = data.reduce((s, b) => s + b.count, 0)

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-400 dark:text-gray-500">
        <Brain size={24} className="mb-2 opacity-50" />
        <p className="text-xs font-medium">Hali SRS ma'lumoti yo'q</p>
        <p className="text-xs mt-0.5">Iboralarni o'rganishni boshlaganingizdan so'ng ko'rinadi</p>
      </div>
    )
  }

  return (
    <div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              width={95}
            />
            <Tooltip content={<SRSTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SRS Legend with counts */}
      <div className="grid grid-cols-5 gap-1 mt-2">
        {data.map(b => (
          <div key={b.range} className="text-center">
            <div
              className="h-1.5 rounded-full mb-1"
              style={{ backgroundColor: b.color, opacity: b.count > 0 ? 0.8 : 0.2 }}
            />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{b.count}</p>
            <p className="text-[8px] text-gray-400 dark:text-gray-500 leading-tight">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Export ──

export default function SpeakingCharts({ trend, srsDistribution, avgScore7d, avgStability, className = '' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-indigo-200/50 dark:border-indigo-800/30 text-xs hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-500" />
          <span className="font-semibold text-gray-600 dark:text-gray-400">📈 Grafiklar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {avgScore7d > 0 && `${avgScore7d}% ball · ${avgStability.toFixed(1)} stability`}
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="mt-1.5 space-y-4 animate-slide-up">
          {/* Row 1: Progress Trend + Weekly Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Progress Trend Chart */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-indigo-200/50 dark:border-indigo-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={12} className="text-indigo-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Talaffuz trendi (21 kun)</span>
              </div>
              <ProgressTrendChart data={trend} />
            </div>

            {/* Weekly Activity Chart */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-indigo-200/50 dark:border-indigo-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <CalendarDays size={12} className="text-emerald-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Haftalik faollik (daqiqa)</span>
              </div>
              <WeeklyActivityChart data={trend} />
            </div>
          </div>

          {/* Row 2: SRS Distribution */}
          <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-indigo-200/50 dark:border-indigo-800/30">
            <div className="flex items-center gap-1.5 mb-2">
              <Brain size={12} className="text-purple-500" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">SRS Stability taqsimoti</span>
            </div>
            <SRSDistributionChart data={srsDistribution} />
          </div>
        </div>
      )}
    </div>
  )
}
