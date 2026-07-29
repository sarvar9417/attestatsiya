// Speaking Path — Yutuqlar (Achievements) komponenti
// Speaking Path sahifasida foydalanuvchining speaking yutuqlarini ko'rsatadi

import { useState, useMemo } from 'react'
import { Trophy, ChevronDown, ChevronUp, Lock, Sparkles } from 'lucide-react'
import { ACHIEVEMENTS, type Achievement } from '../../data/achievements'
import type { SpeakingAchievementResult } from '../../services/speakingAchievementService'

interface Props {
  unlockedIds: string[]
  progress: SpeakingAchievementResult['progress']
  className?: string
  compact?: boolean
}

// ── Achievement Card ──

function SpeakingAchCard({ ach, unlocked, progress }: { ach: Achievement; unlocked: boolean; progress: SpeakingAchievementResult['progress'] }) {
  // Progress bar (qancha qolgan)
  const required = ach.requirement.value
  const current = (() => {
    switch (ach.requirement.type) {
      case 'speaking_days': return progress.daysCompleted
      case 'speaking_streak': return progress.speakingStreak
      case 'chunks_mastered': return progress.chunksMastered
      case 'speaking_perfect_day': return Math.min(100, progress.bestSpeakScore)
      case 'speaking_conversations': return progress.daysCompleted
      case 'speaking_cefr': return progress.daysCompleted
      default: return 0
    }
  })()

  const pct = unlocked ? 100 : Math.min(100, Math.round((current / required) * 100))

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${unlocked ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800/40' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-70'}`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${unlocked ? 'bg-emerald-500/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
        {unlocked ? ach.icon : <Lock size={16} className="text-gray-300 dark:text-gray-600" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`text-xs font-bold truncate ${unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {ach.title}
          </p>
          {unlocked && <Sparkles size={10} className="text-amber-500 shrink-0" />}
        </div>
        <p className={`text-xs leading-tight mt-0.5 ${unlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {ach.description}
        </p>

        {/* Progress bar (faqat ochilmagan bo'lsa) */}
        {!unlocked && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 shrink-0">
              {current}/{required}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ──

export default function SpeakingAchievements({ unlockedIds, progress, className = '', compact = false }: Props) {
  const [open, setOpen] = useState(false)

  const achievements = useMemo(() => {
    return ACHIEVEMENTS
      .filter(a => a.category === 'speaking')
      .sort((a, b) => a.order - b.order)
  }, [])

  const unlockedCount = useMemo(() =>
    achievements.filter(a => unlockedIds.includes(a.id)).length,
    [achievements, unlockedIds]
  )

  if (compact) {
    // Compact mode — Speaking Path done screenida ko'rsatish uchun
    const recentUnlocked = achievements
      .filter(a => unlockedIds.includes(a.id))
      .slice(-3)

    if (recentUnlocked.length === 0) return null

    return (
      <div className={className}>
        <div className="flex items-center gap-1.5 mb-2">
          <Trophy size={14} className="text-amber-500" />
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Speaking yutuqlari</p>
        </div>
        <div className="space-y-1.5">
          {recentUnlocked.map(ach => (
            <div key={ach.id} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
              <span className="text-lg">{ach.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{ach.title}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Full mode — Speaking Path dashboardida ko'rsatish uchun
  return (
    <div className={className}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-amber-200/50 dark:border-amber-800/30 text-xs hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-amber-500" />
          <span className="font-semibold text-gray-600 dark:text-gray-400">🏆 Speaking yutuqlari</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {unlockedCount}/{achievements.length}
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="mt-1.5 space-y-1.5 animate-slide-up">
          {/* Overall progress */}
          <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Umumiy progress</p>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {unlockedCount}/{achievements.length}
              </p>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1.5 text-center">
              {progress.cefr} daraja · {progress.daysCompleted} kun · {progress.chunksMastered} ta ibora o'zlashtirilgan
            </p>
          </div>

          {/* Achievement cards */}
          {achievements.map(ach => (
            <SpeakingAchCard
              key={ach.id}
              ach={ach}
              unlocked={unlockedIds.includes(ach.id)}
              progress={progress}
            />
          ))}
        </div>
      )}
    </div>
  )
}
