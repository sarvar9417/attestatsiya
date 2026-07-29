import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'
import type { Level } from '../../store/types'
import {
  User, Mail, Medal, Target, Calendar,
  Flame, Trophy, Save, CheckCircle,
  ChevronRight, Sparkles, Crown,
  Zap, Bot, MessageCircle, GraduationCap,
} from 'lucide-react'
import NotificationSettings from '../notifications/NotificationSettings'
import GameFeelSettings from '../ui/GameFeelSettings'
import { AVATARS } from '../ui/AvatarSelector'
import { AvatarSelector } from '../ui/AvatarSelector'
import AIBuddyChatModal from '../study/AIBuddyChatModal'
import ProfileBadges from './ProfileBadge'

// ── Constants ─────────────────────────────────────────────────────────────────

const LEVELS: { value: Level; label: string; descKey: string; color: string }[] = [
  { value: 'A2+', label: 'A2+', descKey: 'profile.levelA2Plus',    color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { value: 'B1',  label: 'B1',  descKey: 'profile.levelB1',        color: 'bg-b1-100 text-b1-700 border-b1-200' },
  { value: 'B1+', label: 'B1+', descKey: 'profile.levelB1Plus',    color: 'bg-b1-100 text-b1-800 border-b1-200' },
  { value: 'B2',  label: 'B2',  descKey: 'profile.levelB2',        color: 'bg-b2-100 text-b2-700 border-b2-200' },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  claimedRewardIds: string[]
  rewardsLoading: boolean
  weeklyWins: number
  weeklyWinsLoading: boolean
  showAIChat: boolean
  setShowAIChat: (v: boolean) => void
  setShowCert: (v: boolean) => void
}

// ── Study Buddy Section ───────────────────────────────────────────────────────

function StudyBuddySection({ userId, onOpenAIChat }: { userId?: string; onOpenAIChat: () => void }) {
  const { t } = useI18n()
  const { totalXP, streak, totalWordsLearned } = useStore()
  const [buddy, setBuddy] = useState<{ id: string; name: string } | null>(null)
  const [buddyEmail, setBuddyEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buddyXP, setBuddyXP] = useState(0)
  const [buddyStreak, setBuddyStreak] = useState(0)
  const [buddyWords, setBuddyWords] = useState(0)
  const [duoStreakToday, setDuoStreakToday] = useState(false)
  const [challengeSent, setChallengeSent] = useState(false)
  const [buddyLoading, setBuddyLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    import('../../services/studyBuddyService').then(({ getStudyBuddy }) =>
      getStudyBuddy(userId).then(async (b) => {
        setBuddy(b)
        setLoading(false)
        if (!b) { setBuddyLoading(false); return }
        try {
          const { data: buddyData } = await supabase
            .from('users')
            .select('total_xp, streak, words_learned, name')
            .eq('id', b.id)
            .single()
          if (buddyData) {
            setBuddyXP(buddyData.total_xp ?? 0)
            setBuddyStreak(buddyData.streak ?? 0)
            setBuddyWords(buddyData.words_learned ?? 0)
          }
          const { checkDuoStreak } = await import('../../services/studyBuddyService')
          const bothDone = await checkDuoStreak(userId, b.id)
          setDuoStreakToday(bothDone)
        } catch { /* ignore */ }
        setBuddyLoading(false)
      })
    )
  }, [userId])

  function handleSendChallenge() {
    setChallengeSent(true)
    setTimeout(() => setChallengeSent(false), 3000)
  }

  const myBar = (myVal: number, buddyVal: number) => {
    const max = Math.max(myVal, buddyVal, 1)
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-10 text-right text-gray-400 font-medium">{t('profile.studyBuddy.youLabel')}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(myVal / max) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-10 text-right text-gray-400 font-medium">{t('profile.studyBuddy.buddyLabel')}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(buddyVal / max) * 100}%` }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
        {t('profile.studyBuddy.title')}
      </h3>
      {loading ? (
        <div className="text-sm text-gray-400">{t('profile.studyBuddy.loading')}</div>
      ) : buddy ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <div className="w-10 h-10 rounded-xl bg-green-200 dark:bg-green-700 flex items-center justify-center text-lg">
              👥
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-white">{buddy.name}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {t('profile.studyBuddy.studyingTogether')}
              </p>
            </div>
            <div className={`flex flex-col items-center px-2 py-1 rounded-lg ${duoStreakToday ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <div className="flex items-center gap-1">
                <Flame size={12} className={duoStreakToday ? 'text-orange-500' : 'text-gray-400'} />
                <span className={`text-xs font-bold ${duoStreakToday ? 'text-orange-600' : 'text-gray-400'}`}>
                  {duoStreakToday ? t('profile.studyBuddy.duoStreakToday') : t('profile.studyBuddy.duoStreakNotToday')}
                </span>
              </div>
              <span className="text-xs text-gray-400">{t('profile.studyBuddy.duoStreakLabel')}</span>
            </div>
          </div>

          {!buddyLoading && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('profile.studyBuddy.progressTitle')}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400">{t('profile.studyBuddy.xpLabel')}</p>
                  <p className="text-sm font-bold text-primary-600">{totalXP.toLocaleString()}</p>
                  <p className="text-xs text-green-600">{buddyXP.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400">{t('profile.studyBuddy.streakLabel')}</p>
                  <p className="text-sm font-bold text-orange-500">{streak} {t('profile.info.dayLabel').toLowerCase()}</p>
                  <p className="text-xs text-green-600">{buddyStreak} {t('profile.info.dayLabel').toLowerCase()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400">{t('profile.studyBuddy.wordsLabel')}</p>
                  <p className="text-sm font-bold text-b1-600">{totalWordsLearned}</p>
                  <p className="text-xs text-green-600">{buddyWords}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">{t('profile.studyBuddy.comparisonTitle')}</p>
                {myBar(totalXP, buddyXP)}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSendChallenge}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                challengeSent
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-md active:scale-[0.98]'
              }`}
            >
              {challengeSent ? (
                <>{t('profile.studyBuddy.challengeSent')}</>
              ) : (
                <><Zap size={14} /> {t('profile.studyBuddy.challengeSend')}</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder={t('profile.studyBuddy.emailPlaceholder')}
              value={buddyEmail}
              onChange={e => setBuddyEmail(e.target.value)}
              className="input flex-1 text-sm"
            />
            <button
              onClick={async () => {
                if (!userId || !buddyEmail.trim()) return
                setError('')
                const { addStudyBuddy } = await import('../../services/studyBuddyService')
                const ok = await addStudyBuddy(userId, buddyEmail.trim())
                if (ok) {
                  setBuddy({ id: '', name: buddyEmail.trim() })
                } else {
                  setError(t('profile.studyBuddy.userNotFound'))
                }
              }}
              className="btn-primary text-sm px-4"
            >
              {t('profile.studyBuddy.addButton')}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}

      <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t('profile.studyBuddy.aiTitle')}</p>
            <p className="text-xs text-gray-400">{t('profile.studyBuddy.aiDesc')}</p>
          </div>
        </div>
        <button
          onClick={onOpenAIChat}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 transition-colors"
        >
          <MessageCircle size={14} />
          {t('profile.studyBuddy.aiChatButton')}
        </button>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileInfo({
  claimedRewardIds,
  rewardsLoading,
  weeklyWins,
  weeklyWinsLoading,
  showAIChat,
  setShowAIChat,
  setShowCert,
}: Props) {
  const { t } = useI18n()
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    userName, setUserName,
    currentLevel, setLevel,
    startDate, targetDate,
    totalXP, streak, currentDay,
    avatarId, setAvatarId,
    totalWordsLearned, todayXP, weeklyXP, todayMinutes,
  } = useStore()

  const [name, setName] = useState(userName)
  const [level, setLevelSel] = useState<Level>(currentLevel)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(userName)
    setLevelSel(currentLevel)
  }, [userName, currentLevel])

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(targetDate).getTime() - Date.now()) / 86400000
  ))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setError(t('profile.info.errorNameTooShort'))
      setSaving(false)
      return
    }

    setUserName(trimmedName)
    setLevel(level)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {          const { error: dbError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              name: trimmedName,
              level,
              email: session.user.email ?? '',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any, { onConflict: 'id' })

        if (dbError) throw dbError

        await supabase.auth.updateUser({
          data: { name: trimmedName },
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('profile.info.errorSaveFailed'))
      setSaving(false)
      return
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Rewards Badges */}
      {user?.id && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-yellow-500" />
            <h3 className="font-bold text-sm text-gray-900">
              {t('profile.info.badgesTitle')}
            </h3>
          </div>
          <ProfileBadges
            streak={streak}
            claimedRewardIds={claimedRewardIds}
            loading={rewardsLoading}
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Flame, value: `${streak}`, label: t('profile.info.streakLabel'), color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: Trophy, value: totalXP.toLocaleString(), label: t('profile.info.totalXPLabel'), color: 'text-b2-600', bg: 'bg-b2-50' },
          { icon: Target, value: `${t('profile.info.dayLabel')} ${currentDay}/126`, label: t('profile.info.dayLabel'), color: 'text-primary-600', bg: 'bg-primary-50' },
          { icon: Calendar, value: `${daysLeft}`, label: t('profile.info.daysLeftLabel'), color: 'text-b1-600', bg: 'bg-b1-50' },
        ].map((stat) => (
          <div key={stat.label} className="card !p-3 sm:!p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Duel Wins */}
      {weeklyWins > 0 && (
        <div className="card !p-3 sm:!p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Zap size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 leading-tight">
              {weeklyWinsLoading ? '...' : weeklyWins}
            </p>
            <p className="text-xs text-gray-500">{t('profile.info.weeklyWinsLabel')}</p>
          </div>
        </div>
      )}

      {/* Featured Avatar Card */}
      <div className="card bg-gradient-to-br from-primary-50 via-purple-50 to-indigo-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border-primary-100 dark:border-primary-800/50">
        {(() => {
          const av = AVATARS.find(a => a.id === avatarId)
          if (!av) return null
          return (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-4xl sm:text-5xl">
                  {av.emoji}
                </div>
                {av.isSpecial && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Crown size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{av.label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-gray-800/70 text-primary-600 dark:text-primary-400 font-semibold border border-primary-200 dark:border-primary-700">
                    {av.personality}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  "{av.trait}"
                </p>
                {av.achievementHint && av.isSpecial && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                    <Sparkles size={10} />
                    {av.achievementHint}
                  </p>
                )}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="card space-y-5">
        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <User size={16} className="text-primary-600" />
          {t('profile.info.personalInfoTitle')}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-gray-400" />
              {t('profile.info.nameLabel')}
            </div>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('profile.info.namePlaceholder')}
            required
            minLength={2}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {t('profile.info.emailLabel')}
            </div>
          </label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="input opacity-60 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">{t('profile.info.emailChangeNote')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Medal size={14} className="text-gray-400" />
              {t('profile.info.levelLabel')}
            </div>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevelSel(l.value)}
                className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200
                  ${level === l.value
                    ? `${l.color} ring-2 ring-offset-1 scale-105`
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <p className={`font-bold text-sm ${level === l.value ? '' : 'text-gray-700'}`}>{l.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{t(l.descKey as keyof TranslationStrings)}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/placement-test')}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <GraduationCap size={15} /> {t('profile.info.levelTestButton')}
          </button>
        </div>

        <AvatarSelector current={avatarId} onChange={setAvatarId} userXP={totalXP} userStreak={streak} userWords={totalWordsLearned} userDay={currentDay} />

        <div className="bg-gradient-to-r from-primary-50 to-b1-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary-600" />
              <span className="font-semibold text-sm text-gray-900">{t('profile.info.goalTitle')}</span>
            </div>
            <span className="text-xs font-bold text-primary-600">
              {currentDay}/126 {t('profile.info.dayLabel').toLowerCase()}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill bg-gradient-to-r from-primary-500 to-b1-500"
              style={{ width: `${(currentDay / 126) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>{t('profile.info.goalStarted', { date: startDate })}</span>
            <span>{t('profile.info.goalTarget', { date: targetDate, days: String(daysLeft) })}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {currentDay >= 126 && (
          <button
            type="button"
            onClick={() => setShowCert(true)}
            className="w-full flex items-center justify-center gap-2 py-3
              bg-gradient-to-r from-yellow-400 to-orange-500
              text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
          >
            {t('profile.info.certButton')}
          </button>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? t('profile.info.savingButton') : t('profile.info.saveButton')}
          </button>

          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-slide-in">
              <CheckCircle size={16} />
              {t('profile.info.savedLabel')}
            </div>
          )}
        </div>
      </form>

      {/* Account Info */}
      <div className="card">
        <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <User size={15} className="text-gray-400" />
          {t('profile.info.accountTitle')}
        </h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">{t('profile.info.userIdLabel')}</span>
            <span className="text-gray-700 font-mono text-xs truncate ml-4 max-w-[200px]">
              {user?.id ?? '—'}
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">{t('profile.info.emailConfirmedLabel')}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              user?.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user?.email_confirmed_at ? t('profile.info.emailConfirmedYes') : t('profile.info.emailConfirmedNo')}
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">{t('profile.info.registeredAtLabel')}</span>
            <span className="text-gray-700 text-xs">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('uz-UZ') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Game Feel Settings */}
      <GameFeelSettings />

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Study Buddy */}
      <StudyBuddySection userId={user?.id} onOpenAIChat={() => setShowAIChat(true)} />

      {/* AI Study Buddy Chat Modal */}
      {showAIChat && (
        <AIBuddyChatModal
          context={{
            userName: userName || t('profile.userFallback'),
            currentLevel,
            currentDay,
            streak,
            totalXP,
            todayXP,
            weeklyXP: weeklyXP ?? 0,
            todayMinutes,
            totalWordsLearned,
          }}
          onClose={() => setShowAIChat(false)}
        />
      )}

      {/* Password Reset Link */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-gray-900">{t('profile.info.passwordTitle')}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('profile.info.passwordDesc')}</p>
        </div>
        <button
          onClick={async () => {
            const email = user?.email
            if (!email) return
            const { supabase } = await import('../../lib/supabase')
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/reset-password`,
            })
            alert(t('profile.info.passwordResetAlert'))
          }}
          className="flex items-center gap-1 text-sm text-primary-600 font-semibold hover:gap-2 transition-all"
        >
          {t('profile.info.passwordReset')} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
