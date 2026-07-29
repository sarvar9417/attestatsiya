// ═══════════════════════════════════════════════════════════════════════════
// FriendLeaderboard — Do'stlar orasida XP/Streak va Elo reytingi
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import {
  Trophy, TrendingUp, Flame, Loader2,
  ChevronDown, ChevronUp, Swords,
} from 'lucide-react'
import {
  getFriendLeaderboard,
  getEloLeaderboard,
} from '../../services/tandemService'
import { db } from '../../lib/db'
import type { LeaderboardEntry, EloLeaderboardEntry } from '../../services/tandemService'
import { leagues } from '../../data/leagues'
import { getEloTierInfo } from '../../utils/eloRating'

type Tab = 'xp' | 'elo'

function getLeagueEmoji(xp: number): string {
  for (let i = leagues.length - 1; i >= 0; i--) {
    if (xp >= leagues[i].minXp) return leagues[i].emoji
  }
  return '🥉'
}

function getRankEmoji(rank: number): string {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `#${rank + 1}`
}

function getRankBg(rank: number): string {
  if (rank === 0) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  if (rank === 1) return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
  if (rank === 2) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
  return 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
}

function getRankIcon(rank: number): string {
  if (rank === 0) return 'text-yellow-500'
  if (rank === 1) return 'text-gray-400'
  if (rank === 2) return 'text-orange-500'
  return 'text-gray-400'
}

export default function FriendLeaderboard() {
  const [tab, setTab] = useState<Tab>('xp')
  const [xpEntries, setXpEntries] = useState<LeaderboardEntry[]>([])
  const [eloEntries, setEloEntries] = useState<EloLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getFriendLeaderboard(),
      getEloLeaderboard(),
    ]).then(([xp, elo]) => {
      setXpEntries(xp)
      setEloEntries(elo)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-center py-4">
          <Loader2 size={18} className="animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const entries = tab === 'xp' ? xpEntries : eloEntries
  if (entries.length === 0) return null

  const maxXP = Math.max(...xpEntries.map(e => e.totalXP), 1)
  const displayEntries = expanded ? entries : entries.slice(0, 5)

  return (
    <div className="card p-5 space-y-3 border-2 border-amber-100 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/20 to-transparent dark:from-amber-950/10">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Reyting</h3>
          <span className="text-xs text-gray-400 font-medium">{entries.length} ta o'yinchi</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setTab('xp'); setExpanded(false) }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              tab === 'xp'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            XP
          </button>
          <button
            onClick={() => { setTab('elo'); setExpanded(false) }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              tab === 'elo'
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Swords size={11} /> Elo
          </button>
        </div>
      </div>

      {/* Elo info banner */}
      {tab === 'elo' && (
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-xs text-purple-600 dark:text-purple-400 flex items-start gap-1.5">
          <Swords size={13} className="shrink-0 mt-0.5" />
          <span>Elo rating — duel natijalariga asoslangan mahorat darajasi. Yangi foydalanuvchilar 1000 Elo dan boshlaydi.</span>
        </div>
      )}

      {/* Tab header buttons */}
      {entries.length > 5 && (
        <div className="flex justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-amber-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            {expanded ? 'Yopish' : 'Hammasi'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      )}

      {/* Leaderboard list */}
      <div className="space-y-1.5">
        {displayEntries.map((entry, index) => {
          const isUser = entry.isCurrentUser
          const rankBg = getRankBg(index)
          const rankIcon = getRankIcon(index)

          if (tab === 'elo') {
            const eloEntry = db.cast<EloLeaderboardEntry>(entry)
            const tierInfo = getEloTierInfo(eloEntry.elo)
            const maxElo = Math.max(...eloEntries.map(e => e.elo), 1)
            const eloPct = (eloEntry.elo / maxElo) * 100

            return (
              <div
                key={eloEntry.userId}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  isUser
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 ring-1 ring-primary-200 dark:ring-primary-800'
                    : rankBg
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  index < 3 ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <span className={rankIcon}>{getRankEmoji(index)}</span>
                </div>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                    : index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                        : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                          : 'bg-gradient-to-br from-blue-400 to-purple-500'
                }`}>
                  {eloEntry.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-semibold truncate ${
                      isUser ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {eloEntry.name}
                    </p>
                    {isUser && (
                      <span className="text-xs font-bold text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-1.5 py-0.5 rounded-full shrink-0">Siz</span>
                    )}
                  </div>
                  <div className="relative mt-1.5 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-400 to-purple-500"
                      style={{ width: `${eloPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {tierInfo.emoji} {eloEntry.elo}
                    </p>
                    <p className="text-xs text-gray-400">Elo</p>
                  </div>
                  <div className="text-xs text-gray-400 text-right min-w-[24px]">
                    <span className="font-bold">{eloEntry.matchesPlayed}</span>
                    <p className="text-xs">o'yin</p>
                  </div>
                </div>
              </div>
            )
          }

          // XP tab
          const xpEntry = entry as LeaderboardEntry
          const xpPct = maxXP > 0 ? (xpEntry.totalXP / maxXP) * 100 : 0
          const emoji = getLeagueEmoji(xpEntry.totalXP)

          return (
            <div
              key={xpEntry.userId}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                isUser
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 ring-1 ring-primary-200 dark:ring-primary-800'
                  : rankBg
              }`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                index < 3 ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <span className={rankIcon}>{getRankEmoji(index)}</span>
              </div>

              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                isUser
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                  : index === 0
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                    : index === 1
                      ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                      : index === 2
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
              }`}>
                {xpEntry.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-semibold truncate ${
                    isUser ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {xpEntry.name}
                  </p>
                  {isUser && (
                    <span className="text-xs font-bold text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-1.5 py-0.5 rounded-full shrink-0">
                      Siz
                    </span>
                  )}
                </div>

                {/* XP Bar */}
                <div className="relative mt-1.5 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUser
                        ? 'bg-gradient-to-r from-primary-400 to-primary-500'
                        : index === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }`}
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {emoji} {xpEntry.totalXP.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-500 min-w-[32px] justify-end">
                  <Flame size={11} />
                  <span className="font-bold">{xpEntry.streak}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer stats */}
      {entries.length > 1 && tab === 'xp' && (
        <div className="flex items-center justify-center gap-4 pt-1 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Eng yuqori: {(entries[0] as LeaderboardEntry).totalXP.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={12} />
            <span>{xpEntries.reduce((sum, e) => sum + e.streak, 0)} umumiy streak</span>
          </div>
        </div>
      )}

      {entries.length > 1 && tab === 'elo' && (
        <div className="flex items-center justify-center pt-1 text-xs text-gray-400">
          <Swords size={12} className="mr-1" />
          <span>Eng yuqori Elo: {Math.max(...eloEntries.map(e => e.elo))}</span>
        </div>
      )}
    </div>
  )
}
