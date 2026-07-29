import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'
import Breadcrumb from '../components/ui/Breadcrumb'
import type { TranslationStrings } from '../i18n/types'
import { LogOut } from 'lucide-react'
import { Certificate } from '../components/ui/Certificate'
import { monitoring } from '../lib/monitoring'
import { getClaimedRewardIds, claimPendingRewards } from '../services/rewardService'
import type { AchievementCategory } from '../data/achievements'
import type { DayData } from '../components/profile/ProfileProgress'
import type { LeaderRow, SortBy } from '../components/profile/ProfileLeaders'
import ProfileInfo from '../components/profile/ProfileInfo'
import ProfileProgress from '../components/profile/ProfileProgress'
import ProfileAchievements from '../components/profile/ProfileAchievements'
import ProfileLeaders from '../components/profile/ProfileLeaders'

// ── Types ─────────────────────────────────────────────────────────────────────

type ProfileTab = 'info' | 'progress' | 'achievements' | 'leaders'

interface SkillSummary {
  date:  string
  score: number
}

interface DailyRow {
  date: string
  xp_earned?: number
  total_minutes?: number
  grammar_pct?: number
  vocab_pct?: number
  listening_pct?: number
  reading_pct?: number
  writing_pct?: number
  words_learned?: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PROFILE_TABS: { id: ProfileTab; labelKey: string; emoji: string }[] = [
  { id: 'info',         labelKey: 'profile.tabInfo',        emoji: '👤' },
  { id: 'progress',     labelKey: 'profile.tabProgress',    emoji: '📊' },
  { id: 'achievements', labelKey: 'profile.tabAchievements',emoji: '🏆' },
  { id: 'leaders',      labelKey: 'profile.tabLeaders',     emoji: '🏅' },
]

// ── Progress Helpers ──────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

function buildTimeline(
  startDate: string,
  currentDay: number,
  dbRows: DailyRow[],
  mockTests: { date: string; total_score: number }[],
  skillMap: Record<string, SkillSummary[]>,
): DayData[] {
  const rowMap = new Map<string, DailyRow>()
  dbRows.forEach((r) => rowMap.set(r.date, r))
  const testMap = new Map<string, number>()
  mockTests.forEach((t) => testMap.set(t.date, t.total_score))

  const days: DayData[] = []
  let cumXP = 0
  let cumWords = 0

  for (let d = 1; d <= Math.min(currentDay, 90); d++) {
    const date = addDays(startDate, d - 1)
    const real = rowMap.get(date)

    const g = skillMap.grammar?.filter((s) => s.date === date)
    const l = skillMap.listening?.filter((s) => s.date === date)
    const r = skillMap.reading?.filter((s) => s.date === date)
    const s = skillMap.speaking?.filter((s) => s.date === date)
    const w = skillMap.writing?.filter((s) => s.date === date)

    const avg = (arr: SkillSummary[] | undefined): number =>
      arr && arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b.score, 0) / arr.length) : 0

    const hours    = real ? (real.total_minutes ?? 0) / 60 : 0
    const xp       = real ? (real.xp_earned ?? 0) : 0
    const newWords = real ? (real.words_learned ?? 0) : 0
    cumXP    += xp
    cumWords += newWords

    days.push({
      date,
      label:        d % 7 === 1 || d <= 5 ? `K${d}` : '',
      day:          d,
      hours:        parseFloat(hours.toFixed(1)),
      xp,
      grammarPct:   real?.grammar_pct ?? avg(g),
      vocabPct:     real?.vocab_pct ?? 0,
      listeningPct: real?.listening_pct ?? avg(l),
      writingPct:   real?.writing_pct ?? avg(w),
      speakingPct:  avg(s),
      readingPct:   avg(r),
      cumulativeXP: cumXP,
      newWords,
      totalWords:   cumWords,
      mockScore:    testMap.get(date) ?? 0,
      hasReal:      !!real,
    })
  }
  return days
}

// ── Main Profile Component ────────────────────────────────────────────────────

export default function Profile() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<ProfileTab>('info')

  const { user, signOut } = useAuth()
  const {
    userName,
    startDate, targetDate,
    totalXP, streak, currentDay,
  } = useStore()

  // Info tab state
  const [showCert, setShowCert]  = useState(false)

  // Progress tab state
  const [timeline, setTimeline]      = useState<DayData[]>([])
  const [radarData, setRadarData]    = useState<{ subject: string; value: number }[]>([])
  const [mockData,  setMockData]     = useState<{ week: string; score: number }[]>([])
  const [progressLoading, setProgressLoading] = useState(true)
  const [supaStreak, setSupaStreak] = useState(0)

  // Achievements tab state
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [showNewBanner, setShowNewBanner] = useState(true)

  // Weekly Duel state
  const [weeklyWins, setWeeklyWins] = useState(0)
  const [weeklyWinsLoading, setWeeklyWinsLoading] = useState(false)

  // Reward state
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([])
  const [rewardsLoading, setRewardsLoading] = useState(true)

  // Leaders tab state
  const [leaders, setLeaders]         = useState<LeaderRow[]>([])
  const [leadersLoading, setLeadersLoading] = useState(true)
  const [sortBy, setSortBy]           = useState<SortBy>('xp')
  const [search, setSearch]           = useState('')
  const [leadersError, setLeadersError] = useState<string | null>(null)
  const [retryKey, setRetryKey]       = useState(0)
  const [showAIChat, setShowAIChat] = useState(false)

  // Shared achievements count state
  const [achievementCounts, setAchievementCounts] = useState<Record<string, number>>({})
  const [totalUsers, setTotalUsers] = useState(1)

  // ── Progress Tab Effects ────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setProgressLoading(false); return }
        const uid = session.user.id

        const [
          { data: profile },
          { data: daily },
          { data: mocks },
          { data: grammarRows },
          { data: listeningRows },
          { data: readingRows },
          { data: speakingRows },
          { data: writingRows },
          { data: vocabRows },
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', uid).single(),
          supabase.from('daily_progress').select('*').eq('user_id', uid).order('date'),
          supabase.from('mock_tests').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('grammar_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('listening_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('reading_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('speaking_progress').select('date, avg_score').eq('user_id', uid).order('completed_at'),
          supabase.from('writings').select('date, score').eq('user_id', uid).order('created_at'),
          supabase.from('vocabulary_sessions').select('session_date, score, words_json').eq('user_id', uid).order('id'),
        ])

        const start = profile?.start_date ?? startDate
        const day   = profile?.current_day ?? currentDay
        const streakVal = profile?.streak ?? streak

        setSupaStreak(streakVal)

        type Row = Record<string, unknown>
        const skillMap: Record<string, SkillSummary[]> = {
          grammar:   (grammarRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          listening: (listeningRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          reading:   (readingRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          speaking:  (speakingRows ?? []).map((r: Row) => ({ date: r.date as string, score: ((r.avg_score as number) ?? 0) * 10 })),
          writing:   (writingRows ?? []).map((r: Row) => ({ date: r.date as string, score: ((r.score as number) ?? 0) * 10 })),
          vocab:     (vocabRows ?? []).map((r: Row) => {
            const wj = r.words_json as Record<string, unknown> | undefined
            const cnt = wj ? Object.keys(wj).length : 1
            return { date: r.session_date as string, score: Math.round(((r.score as number) ?? 0) / cnt * 100) }
          }),
        }

        const tl = buildTimeline(start, day, daily ?? [], mocks ?? [], skillMap)
        setTimeline(tl)

        function avgSkill(arr: SkillSummary[]): number {
          const recent = arr.slice(-14)
          return recent.length ? Math.round(recent.reduce((s, d) => s + d.score, 0) / recent.length) : 0
        }
        setRadarData([
          { subject: 'Grammar',   value: avgSkill(skillMap.grammar)   },
          { subject: 'Vocab',     value: avgSkill(skillMap.vocab ?? []) },
          { subject: 'Listening', value: avgSkill(skillMap.listening) },
          { subject: 'Speaking',  value: avgSkill(skillMap.speaking)  },
          { subject: 'Reading',   value: avgSkill(skillMap.reading)   },
          { subject: 'Writing',   value: avgSkill(skillMap.writing)   },
        ])

        const tests = (mocks ?? [])
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.day as number) - (b.day as number))
          .map((t: Record<string, unknown>) => ({ week: `H${t.week}`, score: t.total_score as number }))
        if (tests.length === 0) {
          setMockData([
            { week: 'H1', score: 0 }, { week: 'H2', score: 0 },
            { week: 'H3', score: 0 }, { week: 'H4', score: 0 },
          ])
        } else {
          setMockData(tests)
        }
      } catch (e) {
        monitoring.captureMessage('Progress load error: ' + (e instanceof Error ? e.message : String(e)), 'error')
      } finally {
        setProgressLoading(false)
      }
    }
    load()
  }, [startDate, currentDay, totalXP, streak])

  // ── Weekly Duel Wins + Rewards (load + claim) ──────────────────────────
  useEffect(() => {
    if (!user?.id) return

    // Weekly wins
    setWeeklyWinsLoading(true)
    import('../services/tandemService').then(({ getWeeklyDuelWins }) => {
      getWeeklyDuelWins(user.id).then((count) => {
        setWeeklyWins(count)
        setWeeklyWinsLoading(false)
      })
    }).catch(() => setWeeklyWinsLoading(false))

    // Load reward badges + claim pending
    setRewardsLoading(true)
    getClaimedRewardIds(user.id).then((ids) => {
      setClaimedRewardIds(ids)
      setRewardsLoading(false)

      // Claim any pending rewards based on current streak
      claimPendingRewards(user.id, streak, ids).then((newRewards) => {
        if (newRewards.length > 0) {
          setClaimedRewardIds(prev => [...prev, ...newRewards.map(r => r.id)])
          import('../utils/toastStore').then(({ useToastStore }) => {
            useToastStore.getState().toast(
              `🎉 ${newRewards[0].title}!${newRewards[0].xpBonus ? ` +${newRewards[0].xpBonus} XP` : ''}`,
              'success', 5000,
            )
          })
        }
      }).catch((e: unknown) => {
        monitoring.captureMessage('claimPendingRewards failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }).catch((e: unknown) => {
      monitoring.captureMessage('loadPendingRewards failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      setRewardsLoading(false)
    })
  }, [user?.id, streak])

  // ── Achievements Tab Effects ────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      if (!cancelled) setTotalUsers(userCount ?? 1)

      const { data: achievements } = await supabase
        .from('achievements')
        .select('achievement_id')
      if (cancelled) return

      if (achievements) {
        const counts: Record<string, number> = {}
        for (const row of achievements) {
          counts[row.achievement_id] = (counts[row.achievement_id] ?? 0) + 1
        }
        setAchievementCounts(counts)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // ── Leaders Tab Effects ─────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    setLeadersLoading(true)
    setLeadersError(null)

    ;(async () => {
      const { data, error: err } = await supabase
        .from('users')
        .select('id, name, total_xp, streak, words_learned')
        .order(sortBy, { ascending: false })
        .limit(100)

      if (cancelled) return
      if (err) {
        setLeadersLoading(false)
        setLeadersError(err.message)
        return
      }

      const users = (data ?? []) as LeaderRow[]

      const userIds = new Set(users.map(u => u.id))
      if (user?.id) userIds.add(user.id)
      const { data: achievements } = await supabase
        .from('achievements')
        .select('user_id, achievement_id')
        .in('user_id', [...userIds])

      if (!cancelled && achievements) {
        const counts: Record<string, number> = {}
        for (const row of achievements) {
          counts[row.user_id] = (counts[row.user_id] ?? 0) + 1
        }
        setAchievementCounts(counts)
      }

      if (!cancelled) {
        setLeaders(users)
        setLeadersLoading(false)
      }
    })()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, retryKey])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('profile.greetingMorning') : hour < 18 ? t('profile.greetingAfternoon') : t('profile.greetingEvening')

  // ── Main Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Breadcrumb items={[
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.profile') },
      ]} />
      {showCert && (
        <Certificate
          userName={userName || t('profile.userFallback')}
          completionDate={targetDate || new Date().toISOString().split('T')[0]}
          totalXP={totalXP}
          onClose={() => setShowCert(false)}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{greeting}, {userName || t('profile.userFallback')}! 👋</p>
        </div>
        {activeTab === 'info' && (
          <button
            onClick={signOut}
            aria-label={t('profile.signOut')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600
              hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            {t('profile.signOut')}
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl sticky top-14 z-10" role="tablist" aria-label="Profil bo'limlari">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-label={t(tab.labelKey as keyof TranslationStrings)}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl
              text-xs sm:text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{t(tab.labelKey as keyof TranslationStrings)}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <ProfileInfo
          claimedRewardIds={claimedRewardIds}
          rewardsLoading={rewardsLoading}
          weeklyWins={weeklyWins}
          weeklyWinsLoading={weeklyWinsLoading}
          showAIChat={showAIChat}
          setShowAIChat={setShowAIChat}
          setShowCert={setShowCert}
        />
      )}
      {activeTab === 'progress' && (
        <ProfileProgress
          timeline={timeline}
          radarData={radarData}
          mockData={mockData}
          progressLoading={progressLoading}
          supaStreak={supaStreak}
        />
      )}
      {activeTab === 'achievements' && (
        <ProfileAchievements
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showUnlockedOnly={showUnlockedOnly}
          setShowUnlockedOnly={setShowUnlockedOnly}
          showNewBanner={showNewBanner}
          setShowNewBanner={setShowNewBanner}
          achievementCounts={achievementCounts}
          totalUsers={totalUsers}
        />
      )}
      {activeTab === 'leaders' && (
        <ProfileLeaders
          leaders={leaders}
          leadersLoading={leadersLoading}
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
          leadersError={leadersError}
          setRetryKey={setRetryKey}
          achievementCounts={achievementCounts}
        />
      )}
    </div>
  )
}
