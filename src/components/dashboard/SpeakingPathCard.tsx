import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useAuth } from '../../hooks/useAuth'
import { getSpeakingStats, type SpeakingStats } from '../../services/speakingPathService'
import { getAllChunks, TOTAL_SPEAKING_DAYS } from '../../data/speakingPath'
import { monitoring } from '../../lib/monitoring'

export default function SpeakingPathCard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<SpeakingStats | null>(null)

  useEffect(() => {
    const uid = user?.id
    if (!uid) return
    let active = true
    getSpeakingStats(uid, getAllChunks())
      .then(s => { if (active) setStats(s) })
      .catch((e: unknown) => {
        monitoring.captureMessage('getSpeakingStats failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    return () => { active = false }
  }, [user?.id])

  const day = stats ? Math.min(stats.currentDay, TOTAL_SPEAKING_DAYS) : 0

  return (
    <button
      onClick={() => navigate('/speaking-path')}
      aria-label={t('dashboard.speakingPathTitle')}
      className="w-full rounded-2xl p-4 flex items-center gap-4 text-left
        bg-gradient-to-r from-rose-500 to-orange-500
        hover:from-rose-600 hover:to-orange-600 transition-all
        shadow-lg active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
        🗣️
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-base">{t('dashboard.speakingPathTitle')}</p>
        {stats ? (
          <div className="flex items-center gap-2.5 text-white/85 text-xs font-semibold mt-0.5 flex-wrap">
            <span>{t('dashboard.speakingPathDay', { day, total: TOTAL_SPEAKING_DAYS })}</span>
            {stats.streakDays > 0 && <span>{t('dashboard.speakingPathStreak', { days: stats.streakDays })}</span>}
            <span>{t('dashboard.speakingPathMinutes', { minutes: stats.todayMinutes, target: 15 })}</span>
            {stats.dueCount > 0 && <span>{t('dashboard.speakingPathReview', { count: stats.dueCount })}</span>}
          </div>
        ) : (
          <p className="text-white/80 text-xs">{t('dashboard.speakingPathSubtitle')}</p>
        )}
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        {t('dashboard.speakingPathButton')}
      </span>
    </button>
  )
}
