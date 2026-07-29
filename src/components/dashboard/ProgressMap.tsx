import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { Map, MapPin } from 'lucide-react'
import { STORY_BEATS, getStoryBeat } from '../../data/narrative/storyline'

// ═══════════════════════════════════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════════════════════════════════

const WEEK_THEMES = [
  'Foundation Reset',         // 1
  'Present & Past Mastery',   // 2
  'Future & Conditionals',    // 3
  'Vocabulary Sprint',        // 4
  'Reading & Listening',      // 5
  'Grammar Deep Dive',        // 6
  'Writing Workshop',         // 7
  'Mock Test Prep',           // 8
  'B1 Consolidation',         // 9
  'B1+ Push',                 // 10
  'Advanced Grammar',         // 11
  'B2 Introduction',          // 12
  'Final Sprint',             // 13
]

interface Phase {
  label: string
  emoji: string
  color: string
  bg: string
  lightBg: string
  border: string
  weekStart: number
  weekEnd: number
}

const PHASES: Phase[] = [
  { label: 'A2+', emoji: '🌱',  color: '#059669', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50',     border: 'border-emerald-200', weekStart: 1, weekEnd: 3 },
  { label: 'B1',  emoji: '💼',  color: '#2563eb', bg: 'bg-blue-500',    lightBg: 'bg-sky-50',          border: 'border-blue-200',    weekStart: 4, weekEnd: 6 },
  { label: 'B1+', emoji: '🏙️', color: '#7c3aed', bg: 'bg-violet-500',  lightBg: 'bg-violet-50',       border: 'border-violet-200',  weekStart: 7, weekEnd: 9 },
  { label: 'B2',  emoji: '🌟',  color: '#d97706', bg: 'bg-amber-500',   lightBg: 'bg-amber-50',        border: 'border-amber-200',   weekStart: 10, weekEnd: 13 },
]

// ═══════════════════════════════════════════════════════════════════════════
// SVG geometry helper
// ═══════════════════════════════════════════════════════════════════════════

const SVG_W = 1000
const SVG_H = 260
const MARGIN = 60
const TRACK_Y = 150

const ACT_COLORS: Record<string, string> = {
  prologue: '#6b7280',
  act1: '#059669',
  act2: '#2563eb',
  act3: '#7c3aed',
  act4: '#d97706',
  epilogue: '#dc2626',
}

function dayToWeek(day: number): number {
  return Math.min(13, Math.max(1, Math.ceil(day / 7)))
}

function weekX(week: number): number {
  return MARGIN + ((week - 1) / 12) * (SVG_W - 2 * MARGIN)
}

function weekY(week: number): number {
  // Gentle arc: start low → rise to middle → fall to end
  const progress = (week - 1) / 12
  return TRACK_Y - 35 * Math.sin(progress * Math.PI)
}

interface WeekPos { x: number; y: number; week: number }

function getWeekPositions(): WeekPos[] {
  return Array.from({ length: 13 }, (_, i) => ({
    week: i + 1,
    x: weekX(i + 1),
    y: weekY(i + 1),
  }))
}

/** Generate a smooth SVG path through all week positions */
function buildPath(positions: WeekPos[]): string {
  if (positions.length < 2) return ''
  let d = `M ${positions[0].x} ${positions[0].y}`
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const cpx = (prev.x + curr.x) / 2
    const cpy = prev.y
    d += ` Q ${cpx} ${cpy}, ${curr.x} ${curr.y}`
  }
  return d
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function ProgressMap() {
  const { currentWeek, currentDay, currentLevel } = useStore()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  const positions = useMemo(getWeekPositions, [])
  const path = useMemo(() => buildPath(positions), [positions])

  const highlight = hoveredWeek ?? selectedWeek
  const highlightTheme = highlight ? WEEK_THEMES[highlight - 1] : null

  // Week in day numbers for display
  const weekDayStart = (w: number) => (w - 1) * 7 + 1
  const weekDayEnd = (w: number) => Math.min(w * 7, 90)

  // Current week info
  const currentPhase = PHASES.find(p => currentWeek >= p.weekStart && currentWeek <= p.weekEnd)
  const currentBeat = getStoryBeat(currentDay)

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Map size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">90-Kunlik Yo'l Xaritasi</h3>
            <p className="text-xs text-gray-400">
              {currentLevel} · {currentWeek}-hafta (kun {currentDay})
            </p>
          </div>
        </div>

        {/* Phase badges */}
        <div className="hidden sm:flex gap-1.5">
          {PHASES.map((p) => (
            <span
              key={p.label}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-all
                ${currentPhase?.label === p.label
                  ? `${p.bg} text-white border-transparent`
                  : `${p.lightBg} ${p.border} text-gray-600`
                }`}
            >
              {p.emoji} {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SVG Timeline */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative -mx-2">
        {/* Phase background strips */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ maxHeight: 260 }}
        >
          <defs>
            {/* Glow filter for current week */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <style>{`
            @keyframes pulse-dot {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            .current-dot { animation: pulse-dot 2s ease-in-out infinite; }
          `}</style>

          {/* Phase background strips */}
          {PHASES.map((p) => {
            const x1 = weekX(p.weekStart) - 8
            const x2 = weekX(p.weekEnd) + 8
            const w = x2 - x1
            return (
              <rect
                key={p.label}
                x={x1}
                y={TRACK_Y - 28}
                width={w}
                height={56}
                rx={12}
                fill={p.color}
                opacity={0.07}
              />
            )
          })}

          {/* ─── Act zones — o'rganish bosqichlari ─────────── */}
          {STORY_BEATS.map((beat) => {
            const wStart = dayToWeek(beat.dayRange[0])
            const wEnd = dayToWeek(beat.dayRange[1])
            const x1 = weekX(wStart) - 6
            const x2 = weekX(wEnd) + 6
            const w = x2 - x1
            const isCurrentAct = getStoryBeat(currentDay).act === beat.act
            return (
              <g key={beat.act}>
                <rect
                  x={x1}
                  y={8}
                  width={w}
                  height={24}
                  rx={6}
                  fill={ACT_COLORS[beat.act] || '#6b7280'}
                  opacity={isCurrentAct ? 0.2 : 0.07}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={24}
                  textAnchor="middle"
                  fill={isCurrentAct ? ACT_COLORS[beat.act] : '#9ca3af'}
                  fontSize={isCurrentAct ? 10 : 9}
                  fontWeight={isCurrentAct ? 700 : 500}
                  fontFamily="system-ui, sans-serif"
                >
                  {beat.emoji} {beat.act === 'prologue' ? 'Prolog' : beat.act.replace('act', '')}-qism
                </text>
              </g>
            )
          })}

          {/* ─── Location indicator ─────────────────────────────────── */}
          <line
            x1={weekX(dayToWeek(56))}
            y1={5}
            x2={weekX(dayToWeek(56))}
            y2={36}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4,3"
            opacity={0.5}
          />
          <text x={20} y={22} fontSize={11} fontWeight={600} fill="#6b7280" fontFamily="system-ui, sans-serif">
            🇺🇿 Toshkent
          </text>
          <text x={weekX(13) - 10} y={22} textAnchor="end" fontSize={11} fontWeight={600} fill="#6b7280" fontFamily="system-ui, sans-serif">
            🇬🇧 London
          </text>

          {/* Phase divider lines */}
          {PHASES.slice(1).map((p) => (
            <line
              key={`div-${p.label}`}
              x1={weekX(p.weekStart)}
              y1={TRACK_Y - 20}
              x2={weekX(p.weekStart)}
              y2={TRACK_Y + 20}
              stroke="#d1d5db"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.5}
            />
          ))}

          {/* Track path (behind dots) */}
          <path
            d={path}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Colored phase segments on top of the track */}
          {(() => {
            // Build path segments per phase
            const segments: { phase: Phase; path: string }[] = []
            for (const p of PHASES) {
              const segPositions = positions.filter(
                pos => pos.week >= p.weekStart && pos.week <= p.weekEnd
              )
              if (segPositions.length >= 2) {
                segments.push({ phase: p, path: buildPath(segPositions) })
              }
            }
            return segments.map(({ phase, path: segPath }) => (
              <path
                key={segPath}
                d={segPath}
                fill="none"
                stroke={phase.color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              />
            ))
          })()}

          {/* Phase label backgrounds + emoji */}
          {PHASES.map((p) => {
            const cx = (weekX(p.weekStart) + weekX(p.weekEnd)) / 2
            const isCurrent = currentPhase?.label === p.label
            return (
              <g key={`label-${p.label}`}>
                <rect
                  x={cx - 28}
                  y={TRACK_Y + 32}
                  width={56}
                  height={26}
                  rx={13}
                  fill={isCurrent ? p.color : '#f3f4f6'}
                  opacity={isCurrent ? 1 : 1}
                />
                <text
                  x={cx}
                  y={TRACK_Y + 49}
                  textAnchor="middle"
                  fill={isCurrent ? 'white' : '#6b7280'}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="system-ui, sans-serif"
                >
                  {p.emoji} {p.label}
                </text>
              </g>
            )
          })}

          {/* Week dots */}
          {positions.map((pos) => {
            const isCurrent = pos.week === currentWeek
            const isCompleted = pos.week < currentWeek
            const isLocked = pos.week > currentWeek
            const isHighlighted = pos.week === highlight

            return (
              <g key={pos.week}>
                {/* Outer glow for current */}
                {isCurrent && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={18}
                    fill={currentPhase?.color ?? '#6366f1'}
                    opacity={0.1}
                  />
                )}

                {/* Dot shadow */}
                <circle
                  cx={pos.x + 1}
                  cy={pos.y + 1}
                  r={isCurrent ? 12 : isHighlighted ? 9 : 7}
                  fill="rgba(0,0,0,0.08)"
                />

                {/* Main dot */}
                {isCurrent ? (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={12}
                    fill={currentPhase?.color ?? '#6366f1'}
                    stroke="white"
                    strokeWidth={3}
                    filter="url(#glow)"
                    className="current-dot"
                  />
                ) : isCompleted ? (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHighlighted ? 10 : 8}
                    fill="#10b981"
                    stroke="white"
                    strokeWidth={2}
                    style={{ transition: 'r 0.2s' }}
                  />
                ) : (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHighlighted ? 9 : 7}
                    fill={isHighlighted ? '#9ca3af' : '#d1d5db'}
                    stroke="white"
                    strokeWidth={2}
                    style={{ transition: 'r 0.2s' }}
                  />
                )}

                {/* Checkmark for completed */}
                {isCompleted && (
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9}
                    fontWeight={700}
                    fontFamily="system-ui, sans-serif"
                  >
                    ✓
                  </text>
                )}

                {/* Lock icon for locked */}
                {isLocked && !isHighlighted && (
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={8}
                    fontFamily="system-ui, sans-serif"
                  >
                    🔒
                  </text>
                )}

                {/* Week number label */}
                <text
                  x={pos.x}
                  y={TRACK_Y + 28}
                  textAnchor="middle"
                  fill={isCurrent ? '#374151' : '#9ca3af'}
                  fontSize={isCurrent ? 11 : 10}
                  fontWeight={isCurrent ? 700 : 500}
                  fontFamily="system-ui, sans-serif"
                >
                  {pos.week}
                </text>

                {/* Clickable area */}
                <rect
                  x={pos.x - 16}
                  y={pos.y - 16}
                  width={32}
                  height={32}
                  rx={16}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredWeek(pos.week)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  onClick={() => setSelectedWeek(pos.week === selectedWeek ? null : pos.week)}
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Detail panel — shows theme on hover/click */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {highlight && highlightTheme && (
        <div className="mt-2 px-3 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status badge */}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                highlight === currentWeek
                  ? 'bg-primary-100 text-primary-700'
                  : highlight < currentWeek
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {highlight === currentWeek ? '📍 Joriy' :
                 highlight < currentWeek ? '✅ Bajarilgan' : '🔒 Kelgusi'}
              </span>
              <span className="text-xs font-semibold text-gray-800">
                Hafta {highlight}
              </span>
              <span className="text-xs text-gray-400">
                (kun {weekDayStart(highlight)}–{weekDayEnd(highlight)})
              </span>
            </div>
            <button
              onClick={() => setSelectedWeek(null)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-700 mt-0.5 font-medium">
            {highlightTheme}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Phase legend (mobile friendly) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex sm:hidden gap-1.5 mt-3 flex-wrap">
        {PHASES.map((p) => (
          <span
            key={p.label}
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-all
              ${currentPhase?.label === p.label
                ? `${p.bg} text-white border-transparent`
                : `${p.lightBg} ${p.border} text-gray-600`
              }`}
          >
            {p.emoji} {p.label}
          </span>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Bottom: story beat + current week detail */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
          <span className="text-sm leading-none">{currentBeat.emoji}</span>
          <span className="font-medium text-gray-700 truncate">
            {currentBeat.title}
          </span>
          <span className="hidden sm:inline text-gray-300">·</span>
          <span className="hidden sm:inline text-gray-400 truncate">
            {currentBeat.location}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={10} /> {currentPhase?.label} · Hafta {currentWeek}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">
              Kun {currentDay}/126
            </span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-b1-500 transition-all duration-500"
                style={{ width: `${(currentDay / 126) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {currentDay >= 1 && (
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          {currentBeat.context}
        </p>
      )}
    </div>
  )
}
