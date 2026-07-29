import { useMemo } from 'react'
import { Check, Flag } from 'lucide-react'

interface JourneyPreviewProps {
  currentLevel: string
  startDay: number
  onNext: () => void
}

const ROUTE_STOPS = [
  { level: 'A1',  day: 1,   label: 'Toshkent',       emoji: '🏠', color: 'bg-gray-400' },
  { level: 'A2',  day: 5,   label: 'Poytaxt',         emoji: '🌿', color: 'bg-blue-400' },
  { level: 'B1',  day: 28,  label: 'Samarqand',       emoji: '💼', color: 'bg-purple-400' },
  { level: 'B1+', day: 56,  label: 'Istanbul',        emoji: '🏙️', color: 'bg-orange-400' },
  { level: 'B2',  day: 79,  label: 'London 🎯',       emoji: '🚀', color: 'bg-red-400' },
  { level: 'B2+', day: 100, label: 'Maqsad — Cheksiz', emoji: '🌟', color: 'bg-yellow-400' },
]

export function JourneyPreview({ currentLevel, startDay, onNext }: JourneyPreviewProps) {
  const userStopIdx = useMemo(() => {
    const idx = ROUTE_STOPS.findIndex(s => s.level === currentLevel)
    return idx >= 0 ? idx : 0
  }, [currentLevel])

  const progress = useMemo(() => {
    const start = ROUTE_STOPS[userStopIdx]?.day ?? 1
    const end = 99
    return Math.min(100, Math.round(((start) / end) * 100))
  }, [userStopIdx])

  return (
    <div className="w-full animate-slide-up">
      <div className="text-center mb-6">
        <span className="text-5xl block mb-3">🗺️</span>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          Sizning yo'lingiz
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentLevel} → B2 ga 126 kunlik sayohat
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Progress map */}
        <div className="relative pt-8 pb-10">
          {/* Background path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">
            <path
              d="M30 220 Q120 60 200 120 Q280 180 370 40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
              strokeDasharray="8 4"
              className="dark:stroke-gray-700"
            />
            {/* Completed path */}
            <path
              d="M30 220 Q120 60 200 120 Q280 180 370 40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={progress > 0 ? `${(progress / 100) * 400} 400` : '0 400'}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Route stops */}
          {ROUTE_STOPS.map((stop, idx) => {
            const isReached = idx <= userStopIdx
            const isCurrent = idx === userStopIdx
            const positions = [
              { x: '8%', y: '82%' },
              { x: '25%', y: '25%' },
              { x: '48%', y: '50%' },
              { x: '65%', y: '72%' },
              { x: '85%', y: '18%' },
              { x: '95%', y: '5%' },
            ]
            const pos = positions[idx] ?? { x: '50%', y: '50%' }

            return (
              <div
                key={stop.level}
                className="absolute flex flex-col items-center transition-all duration-500"
                style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
              >
                {/* Stop marker */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl border-4
                    transition-all duration-500 shadow-lg
                    ${isReached
                      ? `${stop.color} border-white dark:border-gray-800 scale-100`
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 scale-90'
                    }
                    ${isCurrent ? 'ring-4 ring-primary-300 dark:ring-primary-600 animate-pulse' : ''}
                  `}
                >
                  {isReached ? (
                    <span className="text-white">{stop.emoji}</span>
                  ) : (
                    <span className="text-gray-400">{idx + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className={`text-center mt-1.5 ${isReached ? '' : 'opacity-40'}`}>
                  <p className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-primary-600 dark:text-primary-400'
                      : isReached
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {stop.label}
                  </p>
                  <p className={`text-[8px] ${
                    isReached ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'
                  }`}>
                    Kun {stop.day}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-2">
          {[
            { label: 'Davomiylik', value: '126 kun', icon: '📅', color: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20' },
            { label: 'Darslar', value: '126 ta', icon: '📚', color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' },
            { label: 'Maqsad', value: 'B2 🇬🇧', icon: '🎯', color: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' },
          ].map(stat => (
            <div key={stat.label} className={`card text-center py-3 bg-gradient-to-br ${stat.color}`}>
              <p className="text-lg">{stat.icon}</p>
              <p className="text-sm font-black text-gray-800 dark:text-white mt-0.5">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Journey highlights */}
        <div className="mt-4 space-y-2">
          {[
            { day: startDay, text: `Siz ${currentLevel} darajasidan boshlaysiz — kun ${startDay}` },
            { day: 28, text: 'B1 darajasiga ko\'tarilasiz — mustaqil so\'zlashuvchi' },
            { day: 56, text: 'B1+ darajasiga yetasiz — professional til' },
            { day: 79, text: 'B2 darajasiga o\'tasiz — yuqori daraja' },
            { day: 126, text: '🎉 B2 ni yakunlaysiz — 126 kunlik sayohat muvaffaqiyatli!' },
          ].map((milestone, i) => {
            const reached = milestone.day <= startDay
            return (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${
                reached
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : milestone.day === startDay
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  reached
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {reached ? <Check size={12} /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <p className={`text-xs ${
                  reached
                    ? 'text-green-700 dark:text-green-400 line-through'
                    : milestone.day === startDay
                    ? 'text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {milestone.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={onNext} className="btn-primary w-full mt-6 py-3 font-bold flex items-center justify-center gap-2">
        Boshlaymiz! <Flag size={16} />
      </button>
    </div>
  )
}
