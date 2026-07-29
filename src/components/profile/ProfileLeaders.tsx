import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'
import { useAuth } from '../../hooks/useAuth'
import {
  Trophy, Flame, Users, Search, Loader2,
  Crown, Medal, Zap, BookCopy,
} from 'lucide-react'
import ErrorState from '../ui/ErrorState'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeaderRow {
  id:               string
  name:             string | null
  total_xp:         number
  streak:           number
  words_learned:    number
}

export type SortBy = 'xp' | 'streak' | 'words'

// ── Constants ─────────────────────────────────────────────────────────────────

const LEADER_TABS: { key: SortBy; labelKey: string; Icon: typeof Trophy; color: string; bg: string }[] = [
  { key: 'xp',     labelKey: 'profile.leaderSortXP',     Icon: Zap,      color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { key: 'streak', labelKey: 'profile.leaderSortStreak', Icon: Flame,    color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'words',  labelKey: 'profile.leaderSortWords',  Icon: BookCopy, color: 'text-b1-600',    bg: 'bg-b1-50' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getField(row: LeaderRow, sort: SortBy): number {
  if (sort === 'xp')     return row.total_xp
  if (sort === 'streak') return row.streak
  return row.words_learned
}

function formatValue(val: number, sort: SortBy): string {
  if (sort === 'xp')     return `${val.toLocaleString()} XP`
  if (sort === 'streak') return `${val} kun`
  return `${val.toLocaleString()} ta`
}

function rankIcon(index: number) {
  if (index === 0) return <Crown size={16} className="text-yellow-500" />
  if (index === 1) return <Medal size={16} className="text-gray-400" />
  if (index === 2) return <Medal size={16} className="text-amber-600" />
  return null
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  leaders: LeaderRow[]
  leadersLoading: boolean
  sortBy: SortBy
  setSortBy: (v: SortBy) => void
  search: string
  setSearch: (v: string) => void
  leadersError: string | null
  setRetryKey: (fn: (k: number) => number) => void
  achievementCounts: Record<string, number>
}

// ── Leader Row Component ──────────────────────────────────────────────────────

function LeaderRowItem({
  row, index, sort, isMe, achievementCount,
}: {
  row:   LeaderRow
  index: number
  sort:  SortBy
  isMe:  boolean
  achievementCount: number
}) {
  const { t } = useI18n()
  const value   = getField(row, sort)
  const icon    = rankIcon(index)
  const initial = (row.name ?? t('profile.leaderRow.userFallback')).charAt(0).toUpperCase()

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        ${isMe
          ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 ring-1 ring-primary-200 dark:ring-primary-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
        }`}
    >
      <div className="w-7 flex-shrink-0 text-center">
        {icon ?? (
          <span className={`text-xs font-bold ${isMe ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
            #{index + 1}
          </span>
        )}
      </div>

      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
        ${isMe ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {row.name ?? t('profile.leaderRow.userFallback')}
          {isMe && <span className="ml-1.5 text-xs text-primary-500 dark:text-primary-400 font-normal">{t('profile.meLabel')}</span>}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {formatValue(value, sort)}
          {achievementCount > 0 && (
            <span className="ml-1.5">· {achievementCount} 🏆</span>
          )}
        </p>
      </div>

      {sort === 'xp' && value >= 1000 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-semibold border border-yellow-100 dark:border-yellow-800">
          VIP
        </span>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileLeaders({
  leaders,
  leadersLoading,
  sortBy,
  setSortBy,
  search,
  setSearch,
  leadersError,
  setRetryKey,
  achievementCounts,
}: Props) {
  const { t } = useI18n()
  const { user } = useAuth()

  const filtered = search.trim()
    ? leaders.filter((r) =>
        (r.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : leaders

  const myIndex = user ? leaders.findIndex((r) => r.id === user.id) : -1
  const me      = user ? leaders.find((r) => r.id === user.id) ?? null : null

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('profile.leaders.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl
            bg-gray-50 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
            outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl mb-4">
        {LEADER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortBy(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
              transition-all duration-200
              ${sortBy === tab.key
                ? `${tab.bg} ${tab.color} shadow-sm`
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
          >
            <tab.Icon size={14} />
            {t(tab.labelKey as keyof TranslationStrings)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {leadersLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 size={24} className="animate-spin text-gray-300" />
          <p className="text-xs text-gray-400">{t('profile.leaders.loading')}</p>
        </div>
      )}

      {/* Error */}
      {leadersError && !leadersLoading && (
        <ErrorState
          icon={Users}
          title={t('profile.leaders.errorTitle')}
          error={leadersError}
          onRetry={() => setRetryKey((k) => k + 1)}
          size="sm"
        />
      )}

      {/* Empty state */}
      {!leadersLoading && !leadersError && filtered.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-800">{t('profile.leaders.emptyTitle')}</p>
          <p className="text-xs text-gray-400 mt-1">
            {search.trim()
              ? t('profile.leaders.emptySearch', { query: search })
              : t('profile.leaders.emptyNoSearch')}
          </p>
          {search.trim() && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-xs text-primary-600 font-semibold hover:underline"
            >
              {t('profile.leaders.filterClear')}
            </button>
          )}
        </div>
      )}

      {/* Leader list */}
      {!leadersLoading && !leadersError && filtered.length > 0 && (
        <div className="space-y-1.5">
          {filtered.map((row, index) => (
            <LeaderRowItem
              key={row.id}
              row={row}
              index={index}
              sort={sortBy}
              isMe={user?.id === row.id}
              achievementCount={achievementCounts[row.id] ?? 0}
            />
          ))}
        </div>
      )}

      {/* My position */}
      {!leadersLoading && !leadersError && me && myIndex >= 100 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 text-center">{t('profile.leaders.myPosition')}</p>
          <LeaderRowItem row={me} index={myIndex} sort={sortBy} isMe achievementCount={achievementCounts[me.id] ?? 0} />
        </div>
      )}

      {/* Info footer */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
          <Users size={11} className="text-gray-400" />
          <span className="text-xs text-gray-400">
            {t('profile.leaders.activeUsers', { count: String(leaders.length) })}
          </span>
        </div>
      </div>
    </div>
  )
}
