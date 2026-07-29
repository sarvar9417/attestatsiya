// ═══════════════════════════════════════════════════════════════════════════
// FriendNeyronProfile — Do'stning Neyron Profili + Reaksiyalar
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import {
  X, Loader2, Flame, Target,
  TrendingUp,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { fetchQuickWeakSpots } from '../../services/analyticsService'
import { addReaction, removeReaction, getReactions, REACTION_EMOJIS, REACTION_LABELS, type ReactionType } from '../../services/reactionService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  friendId: string
  friendName: string
  onClose: () => void
}

interface FriendStats {
  level: string
  streak: number
  xp: number
  words: number
  currentDay: number
}

interface WeakSpotDisplay {
  category: string
  label: string
  score: number
  icon: string
  detail: string
}

interface ReactionSummary {
  type: ReactionType
  count: number
  iReacted: boolean
}

// ─── Color helpers ───────────────────────────────────────────────────────────

const SPOT_COLORS: Record<string, string> = {
  vocabulary: '#3b82f6',
  phrases: '#8b5cf6',
  grammar: '#f59e0b',
  writing: '#7c3aed',
  speaking: '#e11d48',
  listening: '#06b6d4',
  reading: '#10b981',
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-500'
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
  return 'bg-red-100 dark:bg-red-900/30'
}

// ─── Mini Radar Chart ────────────────────────────────────────────────────────

function MiniRadar({ spots }: { spots: WeakSpotDisplay[] }) {
  if (spots.length === 0) return null

  const SIZE = 160
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 60
  const levels = [20, 40, 60, 80, 100]

  const angleStep = (2 * Math.PI) / spots.length
  const startAngle = -Math.PI / 2

  // Grid lines
  const grid = levels.map((level) => {
    const r = (level / 100) * R
    const points = spots.map((_, i) => {
      const angle = startAngle + i * angleStep
      return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`
    }).join(' ')
    return { level, points }
  })

  // Data polygon
  const dataPoints = spots.map((spot, i) => {
    const angle = startAngle + i * angleStep
    const r = (spot.score / 100) * R
    return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`
  }).join(' ')

  // Labels
  const labels = spots.map((spot, i) => {
    const angle = startAngle + i * angleStep
    const lr = R + 22
    return {
      x: CX + lr * Math.cos(angle),
      y: CY + lr * Math.sin(angle),
      label: spot.label,
      color: SPOT_COLORS[spot.category] ?? '#6b7280',
    }
  })

  return (
    <svg width={SIZE} height={SIZE} className="mx-auto">
      {/* Grid */}
      {grid.map((g) => (
        <polygon
          key={g.level}
          points={g.points}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
          strokeDasharray={g.level === 100 ? 'none' : '3 3'}
        />
      ))}

      {/* Axis lines */}
      {spots.map((_, i) => {
        const angle = startAngle + i * angleStep
        const x2 = CX + R * Math.cos(angle)
        const y2 = CY + R * Math.sin(angle)
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x2}
            y2={y2}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        )
      })}

      {/* Data */}
      <polygon
        points={dataPoints}
        fill="rgba(139, 92, 246, 0.25)"
        stroke="#8b5cf6"
        strokeWidth={2.5}
      />

      {/* Dots */}
      {spots.map((spot, i) => {
        const angle = startAngle + i * angleStep
        const r = (spot.score / 100) * R
        const x = CX + r * Math.cos(angle)
        const y = CY + r * Math.sin(angle)
        return (
          <circle key={i} cx={x} cy={y} r={4} fill="#8b5cf6" stroke="white" strokeWidth={2} />
        )
      })}

      {/* Labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={600}
          fill={l.color}
        >
          {l.label}
        </text>
      ))}
    </svg>
  )
}

// ─── Reaction Buttons ────────────────────────────────────────────────────────

function ReactionBar({
  targetUserId, reactions, onReactChange,
}: {
  targetUserId: string
  reactions: ReactionSummary[]
  onReactChange: () => void
}) {
  const [reacting, setReacting] = useState<string | null>(null)

  const handleReact = async (type: ReactionType, iReacted: boolean) => {
    setReacting(type)
    const ok = iReacted
      ? await removeReaction(targetUserId, type)
      : await addReaction(targetUserId, type)

    if (ok) {
      onReactChange()
    }
    setReacting(null)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {reactions.map((r) => {
        const loading = reacting === r.type
        return (
          <button
            key={r.type}
            onClick={() => handleReact(r.type, r.iReacted)}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-90 ${
              r.iReacted
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={REACTION_LABELS[r.type]}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <span className="text-base">{REACTION_EMOJIS[r.type]}</span>
            )}
            {r.count > 0 && <span className="text-xs">{r.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FriendNeyronProfile({ friendId, friendName, onClose }: Props) {
  const [stats, setStats] = useState<FriendStats | null>(null)
  const [weakSpots, setWeakSpots] = useState<WeakSpotDisplay[]>([])
  const [reactions, setReactions] = useState<ReactionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [myStats, setMyStats] = useState<FriendStats | null>(null)

  useEffect(() => {
    loadFriendData()
    // loadFriendData qasddan kiritilmadi — faqat friendId o'zgarganda qayta
    // yuklash kerak; funksiya har renderda qayta yaratilgani uchun deps'ga
    // qo'shilsa cheksiz refetch bo'lardi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId])

  async function loadFriendData() {
    setLoading(true)
    try {
      // Get current user ID from session
      const { data: { session } } = await supabase.auth.getSession()
      const currentUserId = session?.user.id

      // Friend stats
      const { data: friendData } = await supabase
        .from('users')
        .select('name, level, streak, total_xp, words_learned, current_day')
        .eq('id', friendId)
        .single()

      if (friendData) {
        setStats({
          level: friendData.level ?? 'B1',
          streak: friendData.streak ?? 0,
          xp: friendData.total_xp ?? 0,
          words: friendData.words_learned ?? 0,
          currentDay: friendData.current_day ?? 0,
        })
      }

      // My stats for comparison (only if we have a current user)
      if (currentUserId) {
        const { data: myData } = await supabase
          .from('users')
          .select('level, streak, total_xp, words_learned, current_day')
          .eq('id', currentUserId)
          .single()

      if (myData) {
        setMyStats({
          level: myData.level ?? 'B1',
          streak: myData.streak ?? 0,
          xp: myData.total_xp ?? 0,
          words: myData.words_learned ?? 0,
          currentDay: myData.current_day ?? 0,
        })
      }
      }

      // Weak spots
      try {
        const spots = await fetchQuickWeakSpots(friendId)
        setWeakSpots(spots)
      } catch (e) {
        monitoring.captureMessage('FriendNeyronProfile fetchWeakSpots failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        // Weak spots not available
      }

      // Reactions
      const reacts = await getReactions(friendId)
      setReactions(reacts)
    } catch (e) {
      monitoring.captureMessage('FriendNeyronProfile loadFriendData failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      // Error loading
    }
    setLoading(false)
  }

  // ── Compare bar ──
  function CompareBar({ label, myVal, friendVal, icon }: { label: string; myVal: number; friendVal: number; icon: string }) {
    const max = Math.max(myVal, friendVal, 1)
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{icon} {label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 w-8 text-right">Siz</span>
          <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all"
              style={{ width: `${(myVal / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-primary-600 w-12">{myVal.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 w-8 text-right">{friendName.charAt(0).toUpperCase()}</span>
          <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
              style={{ width: `${(friendVal / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-purple-600 w-12">{friendVal.toLocaleString()}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <div className="flex justify-center py-8">
            <Loader2 size={28} className="animate-spin text-purple-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-6" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-lg backdrop-blur-sm">
              {stats?.level?.charAt(0) ?? '👤'}
            </div>
            <div>
              <h2 className="text-xl font-black">{friendName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  {stats?.level ?? 'B1'}
                </span>
                <span className="text-sm bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Flame size={12} /> {stats?.streak ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '⚡', label: 'XP', value: stats?.xp.toLocaleString() ?? '0' },
              { icon: '📚', label: "So'zlar", value: stats?.words.toLocaleString() ?? '0' },
              { icon: '📅', label: 'Kun', value: `${stats?.currentDay ?? 0}` },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <p className="text-lg">{s.icon}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Comparison */}
          {myStats && stats && (
            <div className="card p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" />
                Progress solishtirish
              </h3>
              <CompareBar label="XP" myVal={myStats.xp} friendVal={stats.xp} icon="⚡" />
              <CompareBar label="Streak" myVal={myStats.streak} friendVal={stats.streak} icon="🔥" />
              <CompareBar label="So'zlar" myVal={myStats.words} friendVal={stats.words} icon="📚" />
            </div>
          )}

          {/* Weak Spots Radar */}
          {weakSpots.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Target size={14} className="text-orange-500" />
                  Neyron Profil — Zaif tomonlar
                </h3>
                {weakSpots[0] && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBg(weakSpots[0].score)} ${scoreColor(weakSpots[0].score)}`}>
                    Eng zaif: {weakSpots[0].score}%
                  </span>
                )}
              </div>

              <MiniRadar spots={weakSpots} />

              {/* Weak spots list */}
              <div className="space-y-2 mt-3">
                {weakSpots.slice(0, 4).map((spot) => (
                  <div key={spot.category} className="flex items-center gap-2">
                    <span className="text-sm">{spot.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400 truncate">{spot.label}</span>
                        <span className={`font-bold ml-2 ${scoreColor(spot.score)}`}>{spot.score}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${spot.score}%`,
                            backgroundColor: SPOT_COLORS[spot.category] ?? '#8b5cf6',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reactions */}
          <div className="card p-4">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
              Reaksiya bildirish
            </h3>
            <ReactionBar targetUserId={friendId} reactions={reactions} onReactChange={() => getReactions(friendId).then(setReactions)} />
          </div>

          {/* Advice */}
          {weakSpots[0] && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800/50">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                💡 <strong>{friendName}</strong> ning eng kuchsiz sohasi — <strong>{weakSpots[0].label}</strong> ({weakSpots[0].score}%).
                {weakSpots[0].score < 40
                  ? ' Bu sohada yordam kerak bo\'lishi mumkin!'
                  : weakSpots[0].score < 70
                  ? ' Yaxshilanish uchun biroz ko\'proq mashq qilsa bo\'ladi.'
                  : ' Yaxshi ko\'rsatkich, ammo hali joy bor!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
