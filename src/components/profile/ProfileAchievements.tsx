import { useState, useEffect } from 'react'
import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'
import { useStore } from '../../store/useStore'
import {
  Trophy, Medal, ChevronDown, Sparkles, Lock, Award, Users,
} from 'lucide-react'
import { ACHIEVEMENTS, CATEGORY_INFO, type AchievementCategory } from '../../data/achievements'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: AchievementCategory[] = ['day', 'xp', 'streak', 'words', 'games', 'mocktest']

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  selectedCategory: AchievementCategory | 'all'
  setSelectedCategory: (v: AchievementCategory | 'all') => void
  showUnlockedOnly: boolean
  setShowUnlockedOnly: (v: boolean) => void
  showNewBanner: boolean
  setShowNewBanner: (v: boolean) => void
  achievementCounts: Record<string, number>
  totalUsers: number
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function CategoryIcon({ cat }: { cat: AchievementCategory }) {
  const info = CATEGORY_INFO[cat]
  return <span className="text-lg">{info.icon}</span>
}

function AchievementCard({
  achievement,
  unlocked,
  isNew,
  unlockCount,
  totalUsers,
}: {
  achievement: typeof ACHIEVEMENTS[number]
  unlocked: boolean
  isNew: boolean
  unlockCount: number
  totalUsers: number
}) {
  const { t } = useI18n()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all duration-500 ${
        unlocked
          ? isNew
            ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-200/50 scale-[1.02]'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          : 'border-gray-100 bg-gray-50/50 opacity-60'
      } ${animate ? 'scale-100' : ''}`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <Sparkles size={28} className="text-yellow-500 animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
              NEW
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            unlocked
              ? 'bg-gradient-to-br from-yellow-100 to-amber-100 shadow-sm'
              : 'bg-gray-100'
          }`}
        >
          {unlocked ? achievement.icon : <Lock size={18} className="text-gray-300" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              {achievement.title}
            </h3>
            {unlocked && (
              <Award size={14} className="text-yellow-500 flex-shrink-0" />
            )}
          </div>
          <p className={`text-xs mt-0.5 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>

          {unlockCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Users size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                {unlockCount} / {totalUsers} {t('profile.achievements.users')}
              </span>
              <div className="flex-1 max-w-[60px] ml-1">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      unlockCount / totalUsers < 0.3
                        ? 'bg-yellow-500'
                        : unlockCount / totalUsers < 0.6
                        ? 'bg-green-400'
                        : 'bg-b1-500'
                    }`}
                    style={{ width: `${(unlockCount / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileAchievements({
  selectedCategory,
  setSelectedCategory,
  showUnlockedOnly,
  setShowUnlockedOnly,
  showNewBanner,
  setShowNewBanner,
  achievementCounts,
  totalUsers,
}: Props) {
  const { t } = useI18n()
  const {
    unlockedAchievements,
    lastUnlockedAchievement,
    clearLastUnlocked,
    currentDay,
    totalXP,
    streak,
    totalWordsLearned,
  } = useStore()

  const newAchievementId = lastUnlockedAchievement
  const newAchievement = newAchievementId
    ? ACHIEVEMENTS.find((a) => a.id === newAchievementId)
    : null

  const dismissNew = () => {
    setShowNewBanner(false)
    clearLastUnlocked()
  }

  let filtered = ACHIEVEMENTS
  if (selectedCategory !== 'all') {
    filtered = filtered.filter((a) => a.category === selectedCategory)
  }
  if (showUnlockedOnly) {
    filtered = filtered.filter((a) => unlockedAchievements.includes(a.id))
  }

  const unlockedCount = unlockedAchievements.length
  const totalCount = ACHIEVEMENTS.length
  const progressPct = Math.round((unlockedCount / totalCount) * 100)

  const categoryStats = CATEGORIES.map((cat) => {
    const total = ACHIEVEMENTS.filter((a) => a.category === cat).length
    const unlocked = ACHIEVEMENTS.filter(
      (a) => a.category === cat && unlockedAchievements.includes(a.id)
    ).length
    return { cat, total, unlocked }
  })

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* New Achievement Banner */}
      {showNewBanner && newAchievement && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 p-5 sm:p-6 text-white shadow-xl animate-slide-in">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="text-5xl animate-bounce">{newAchievement.icon}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-100">
                {t('profile.achievements.newBanner')}
              </p>
              <h2 className="text-xl font-bold mt-1 leading-tight">{newAchievement.title}</h2>
              <p className="text-sm text-yellow-100 mt-1">{newAchievement.description}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={dismissNew}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white
                    text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  {t('profile.achievements.awesomeButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy size={22} className="text-yellow-500" />
            {t('profile.achievements.title')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t('profile.achievements.unlocked', { count: String(unlockedCount), total: String(totalCount) })}
          </p>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Medal size={18} className="text-yellow-500" />
            <span className="font-bold text-sm text-gray-900">{t('profile.achievements.progressTitle')}</span>
          </div>
          <span className="text-xs font-bold text-gray-600">{progressPct}%</span>
        </div>
        <div className="progress-bar h-3">
          <div
            className="progress-fill bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {categoryStats.map(({ cat, total, unlocked }) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
            className={`card !p-3 text-center transition-all duration-200 ${
              selectedCategory === cat
                ? 'ring-2 ring-primary-500 ring-offset-2 scale-105'
                : 'hover:border-gray-300'
            }`}
          >
            <CategoryIcon cat={cat} />
            <p className="text-xs font-bold text-gray-800 mt-1">{CATEGORY_INFO[cat].label}</p>
            <p className="text-xs text-gray-400">{unlocked}/{total}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            showUnlockedOnly
              ? 'bg-primary-100 text-primary-700 border-primary-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          {showUnlockedOnly ? t('profile.achievements.showUnlocked') : t('profile.achievements.showAll')}
        </button>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600"
          >
            {t('profile.achievements.filterClear')}
          </button>
        )}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedAchievements.includes(achievement.id)}
            isNew={achievement.id === newAchievementId}
            unlockCount={achievementCounts[achievement.id] ?? 0}
            totalUsers={totalUsers}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-10">
          <Trophy size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">{t('profile.achievements.emptyTitle')}</p>
          <p className="text-xs text-gray-400 mt-1">
            {showUnlockedOnly
              ? t('profile.achievements.emptyNoUnlocked')
              : t('profile.achievements.emptyNoCategory')}
          </p>
        </div>
      )}

      {/* Quick Progress */}
      <details className="card">
        <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700">
          <span>{t('profile.achievements.quickStats')}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </summary>
        <div className="mt-4 space-y-3 text-sm">
          {[
            { labelKey: 'profile.achievements.statsDay', value: currentDay, target: 90 },
            { labelKey: 'profile.achievements.statsXP', value: totalXP, target: 10000 },
            { labelKey: 'profile.achievements.statsStreak', value: streak, target: 90 },
            { labelKey: 'profile.achievements.statsWords', value: totalWordsLearned, target: 1000 },
          ].map((stat, i) => {
            const pct = Math.min(100, Math.round((stat.value / stat.target) * 100))
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{t(stat.labelKey as keyof TranslationStrings)}</span>
                  <span className="text-gray-900 font-medium">
                    {stat.value.toLocaleString()} / {stat.target.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className="progress-fill bg-gradient-to-r from-primary-400 to-b1-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </details>
    </div>
  )
}
