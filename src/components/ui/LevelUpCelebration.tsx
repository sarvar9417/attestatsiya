import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Zap, Star, Trophy, Crown, Shield, Flame, Rocket, Share2, ChevronRight, Target } from 'lucide-react'
import { feelLevelUp } from '../../lib/gameFeel'
import { playSfx } from '../../lib/sfx'
import { monitoring } from '../../lib/monitoring'
import { useI18n, type TranslationStrings } from '../../i18n'

interface LevelUpCelebrationProps {
  fromLevel: string
  toLevel: string
  xpEarned: number
  onDismiss: () => void
}

const LEVEL_THEME: Record<string, {
  emoji: string; gradient: string; icon: typeof Star; color: string; descKey: string
}> = {
  'A1':  { emoji: '🌱', gradient: 'from-gray-500 to-gray-400',      icon: Star,  color: '#9CA3AF', descKey: 'levelUp.a1Desc' },
  'A2':  { emoji: '🌿', gradient: 'from-blue-500 to-cyan-400',     icon: Shield, color: '#60A5FA', descKey: 'levelUp.a2Desc' },
  'B1':  { emoji: '🌳', gradient: 'from-purple-500 to-pink-400',   icon: Trophy, color: '#A78BFA', descKey: 'levelUp.b1Desc' },
  'B1+': { emoji: '🔥', gradient: 'from-orange-500 to-red-400',    icon: Flame, color: '#FB923C', descKey: 'levelUp.b1pDesc' },
  'B2':  { emoji: '👑', gradient: 'from-yellow-400 to-amber-600',  icon: Crown, color: '#FBBF24', descKey: 'levelUp.b2Desc' },
  'C1':  { emoji: '🚀', gradient: 'from-emerald-500 to-teal-400',  icon: Rocket,color: '#34D399', descKey: 'levelUp.c1Desc' },
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1']

const LEVEL_UNLOCKS: Record<string, { icon: string; labelKey: string }[]> = {
  'A1': [
    { icon: '📖', labelKey: 'levelUp.a1Unlock1' },
    { icon: '🔤', labelKey: 'levelUp.a1Unlock2' },
    { icon: '👋', labelKey: 'levelUp.a1Unlock3' },
  ],
  'A2': [
    { icon: '💬', labelKey: 'levelUp.a2Unlock1' },
    { icon: '📝', labelKey: 'levelUp.a2Unlock2' },
    { icon: '🎧', labelKey: 'levelUp.a2Unlock3' },
  ],
  'B1': [
    { icon: '🗣️', labelKey: 'levelUp.b1Unlock1' },
    { icon: '📄', labelKey: 'levelUp.b1Unlock2' },
    { icon: '🎥', labelKey: 'levelUp.b1Unlock3' },
  ],
  'B1+': [
    { icon: '🎯', labelKey: 'levelUp.b1pUnlock1' },
    { icon: '📊', labelKey: 'levelUp.b1pUnlock2' },
    { icon: '🎭', labelKey: 'levelUp.b1pUnlock3' },
  ],
  'B2': [
    { icon: '🏆', labelKey: 'levelUp.b2Unlock1' },
    { icon: '📚', labelKey: 'levelUp.b2Unlock2' },
    { icon: '🌍', labelKey: 'levelUp.b2Unlock3' },
  ],
  'C1': [
    { icon: '🎓', labelKey: 'levelUp.c1Unlock1' },
    { icon: '✍️', labelKey: 'levelUp.c1Unlock2' },
    { icon: '🎙️', labelKey: 'levelUp.c1Unlock3' },
  ],
}

// ─── Confetti: shapes + emoji mix ────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
  '#AA96DA', '#FCBAD3', '#A8D8EA', '#FFD93D', '#6BCB77',
  '#FF8C94', '#B5EAD7', '#C7CEEA', '#FFB7B2', '#E2F0CB',
]

const CONFETTI_EMOJIS = ['🌟', '✨', '🎉', '⭐', '💫', '🎊', '✨', '🌟']

function ConfettiRain({ level }: { level: string }) {
  const density = Math.min(90, 40 + LEVEL_ORDER.indexOf(level) * 10)

  const particles = useMemo(() => {
    const items: Array<{
      id: number
      type: 'shape' | 'emoji' | 'star'
      left: number
      delay: number
      duration: number
      size: number
      color?: string
      emoji?: string
    }> = []

    for (let i = 0; i < density; i++) {
      const type = i < 15 ? 'emoji' : i < 30 ? 'star' : 'shape'
      items.push({
        id: i,
        type,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: type === 'emoji' ? 3.5 + Math.random() * 2.5 : 2.5 + Math.random() * 3.5,
        size: type === 'emoji' ? 16 + Math.random() * 10 : 5 + Math.random() * 12,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        emoji: type === 'emoji' ? CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)] : undefined,
      })
    }
    return items
  }, [density])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(p => {
        if (p.type === 'emoji') {
          return (
            <div
              key={p.id}
              className="absolute top-0 animate-emoji-confetti"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                fontSize: `${p.size}px`,
              }}
            >
              {p.emoji}
            </div>
          )
        }
        if (p.type === 'star') {
          return (
            <div
              key={p.id}
              className="absolute top-0 animate-star-confetti"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                fontSize: `${p.size * 0.8}px`,
                color: p.color,
              }}
            >
              ✦
            </div>
          )
        }
        return (
          <div
            key={p.id}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size * 0.6}px`,
              backgroundColor: p.color,
              borderRadius: '2px',
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.9,
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Star burst ──────────────────────────────────────────────────────────────

function StarBurst() {
  const { keyframes, stars } = useMemo(() => {
    const s = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * 360
      const distance = 80 + Math.random() * 60
      return {
        id: i, angle, distance,
        delay: Math.random() * 0.3,
        size: 8 + Math.random() * 12,
      }
    })

    const kf = s.map(star => `
      @keyframes star-burst-${star.id} {
        0% { transform: translate(0, 0) scale(0); opacity: 0; }
        30% { opacity: 1; }
        100% { transform: translate(
          ${Math.cos((star.angle * Math.PI) / 180) * star.distance}px,
          ${Math.sin((star.angle * Math.PI) / 180) * star.distance}px
        ) scale(0.3); opacity: 0; }
      }
    `).join('\n')

    return { keyframes: kf, stars: s }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <style>{keyframes}</style>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute"
          style={{
            animation: `star-burst-${s.id} 1.5s ease-out ${s.delay}s forwards`,
            opacity: 0,
          }}
        >
          <span className="text-yellow-300" style={{ fontSize: `${s.size}px` }}>✦</span>
        </div>
      ))}
    </div>
  )
}

// ─── Progress Ring ───────────────────────────────────────────────────────────

function ProgressRing({ toLevel }: { toLevel: string }) {
  const toIdx = LEVEL_ORDER.indexOf(toLevel)
  const progress = toIdx > 0 ? ((toIdx) / (LEVEL_ORDER.length - 1)) * 100 : 0

  const size = 120
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-[120px] h-[120px] mx-auto mb-3">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-black text-lg leading-none">{toLevel}</span>
        <span className="text-white/50 text-xs mt-0.5">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// ─── Social Share Button ────────────────────────────────────────────────────

function SocialShareButton({ fromLevel, toLevel, xpEarned }: { fromLevel: string; toLevel: string; xpEarned: number }) {
  const [shared, setShared] = useState(false)

  const handleShare = useCallback(async () => {
    const shareData: ShareData = {
      title: `EnglishPath — ${toLevel} darajasi!`,
      text: `🎉 Men EnglishPath platformasida ${fromLevel} → ${toLevel} darajasiga ko'tarildim! +${xpEarned} XP ishlab oldim! 🚀`,
      url: window.location.origin,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        setShared(true)
        setTimeout(() => setShared(false), 3000)
      } catch {
        monitoring.captureMessage('Native share failed or was cancelled', 'warn')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text ?? '')
        setShared(true)
        setTimeout(() => setShared(false), 3000)
      } catch {
        monitoring.captureMessage('Clipboard write failed', 'warn')
      }
    }
  }, [fromLevel, toLevel, xpEarned])

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
        transition-all duration-200
        ${shared
          ? 'bg-green-500/30 text-green-200'
          : 'bg-white/15 hover:bg-white/25 text-white/90 hover:text-white'
        }
      `}
    >
      <Share2 size={16} className={shared ? 'text-green-300' : ''} />
      {shared ? 'Nusxalandi! ✅' : 'Ulashish'}
    </button>
  )
}

// ─── Level Detail Cards ──────────────────────────────────────────────────────

function LevelDetails({ level }: { level: string }) {
  const unlocks = LEVEL_UNLOCKS[level] ?? LEVEL_UNLOCKS['A1']
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {unlocks.map((item, idx) => (
        <div
          key={item.labelKey}
          className="bg-white/15 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5 animate-pop-in"
          style={{
            animationDelay: `${300 + idx * 100}ms`,
            animationFillMode: 'both',
          }}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-xs text-white/80 font-medium whitespace-nowrap">{t(item.labelKey as keyof TranslationStrings)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Animated CountUp ───────────────────────────────────────────────────────

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = 1200

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return <>{display}{suffix}</>
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function LevelUpCelebration({
  fromLevel, toLevel, xpEarned, onDismiss
}: LevelUpCelebrationProps) {
  const [visible, setVisible] = useState(false)
  const [showShareHint, setShowShareHint] = useState(false)
  const theme = LEVEL_THEME[toLevel] ?? LEVEL_THEME.B2
  const themeFrom = LEVEL_THEME[fromLevel] ?? LEVEL_THEME.A1
  const { t } = useI18n()

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }, [onDismiss])

  useEffect(() => {
    feelLevelUp()

    // Play extended fanfare for higher levels
    const levelIdx = LEVEL_ORDER.indexOf(toLevel)
    if (levelIdx >= 3) {
      const t3 = setTimeout(() => playSfx('levelup'), 700)
      const t4 = setTimeout(() => playSfx('levelup'), 1400)
      return () => { clearTimeout(t3); clearTimeout(t4) }
    }
    return undefined
  }, [toLevel])

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => setShowShareHint(true), 2500)
    const t3 = setTimeout(() => dismiss(), 8000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [dismiss])

  const achievements = [
    { emoji: themeFrom.emoji, label: fromLevel },
    { emoji: '➡️', label: '' },
    { emoji: theme.emoji, label: toLevel },
    { emoji: '⚡', label: `+${xpEarned} XP` },
  ]

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center
        transition-all duration-500
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Level up celebration"
      onClick={dismiss}
    >
      {/* Background with gradient */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${theme.gradient}
          transition-opacity duration-700
          ${visible ? 'opacity-80' : 'opacity-0'}
        `}
      />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Confetti & effects */}
      {visible && <ConfettiRain level={toLevel} />}
      {visible && <StarBurst />}

      {/* Main content */}
      <div
        className={`
          relative text-center transform transition-all duration-700 px-4
          ${visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-16'}
        `}
      >
        {/* Level emoji — animated entrance */}
        <div className="text-7xl mb-3 animate-bounce drop-shadow-2xl">
          {theme.emoji}
        </div>

        {/* Progress ring */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <ProgressRing toLevel={toLevel} />
        </div>

        {/* Level title */}
        <h1
          className="text-4xl font-black text-white dark:text-gray-50 mb-1 drop-shadow-lg animate-slide-up"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        >
          {toLevel} darajasi!
        </h1>

        {/* From → To */}
        <p className="text-white/70 dark:text-gray-300 text-base mb-1 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          {fromLevel} → {toLevel}
        </p>

        {/* Description */}
        <p className="text-white/50 dark:text-gray-400 text-sm mb-3 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          {t(theme.descKey as keyof TranslationStrings)}
        </p>

        {/* XP badge — animated count */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 animate-pop-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            <Zap size={18} className="text-yellow-300 dark:text-yellow-400" />
            <span className="text-white dark:text-gray-100 font-black text-lg">
              +<CountUp value={xpEarned} /> XP
            </span>
          </div>
        </div>

        {/* Level details — what's unlocked */}
        <div className="animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <LevelDetails level={toLevel} />
        </div>

        {/* Achievement badges */}
        <div className="flex justify-center gap-2 mb-4 animate-stagger">
          {achievements.filter(a => a.label).map(ach => (
            <div
              key={ach.label}
              className="bg-white/15 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl px-3 py-2 flex flex-col items-center gap-1 min-w-[64px]"
            >
              <span className="text-xl">{ach.emoji}</span>
              <span className="text-xs text-white/80 dark:text-gray-300 font-medium">{ach.label}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          {/* Social share */}
          {showShareHint && (
            <div className="animate-fade-in">
              <SocialShareButton fromLevel={fromLevel} toLevel={toLevel} xpEarned={xpEarned} />
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={(e) => { e.stopPropagation(); dismiss() }}
            className="
              group flex items-center gap-2 px-6 py-3 rounded-xl
              bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50
              text-white dark:text-gray-100 font-bold text-sm
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-lg hover:shadow-xl
            "
          >
            <Target size={16} className="opacity-70" />
            Davom etish
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Hint text */}
          <p className="text-white/20 dark:text-gray-500 text-xs">
            Yoki ekranga bosing
          </p>
        </div>
      </div>
    </div>
  )
}
