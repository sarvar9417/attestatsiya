import { useEffect, useState } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import { MAX_HEARTS, getRegenTimeRemaining } from '../../data/hearts'
import { useStore } from '../../store/useStore'

const sizeMap = { sm: 16, md: 20, lg: 28 }
const iconMap = { sm: 12, md: 14, lg: 18 }

interface HeartsIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  onShopClick?: () => void
}

export function HeartsIndicator({ size = 'md', onShopClick }: HeartsIndicatorProps) {
  const { hearts, heartsLastLostAt, regenHearts } = useStore()
  const [animatingIdx] = useState<number | null>(null)
  const [showTimer, setShowTimer] = useState(false)
  const px = sizeMap[size]
  const iconPx = iconMap[size]

  // Regen timer countdown
  const [timeLeft, setTimeLeft] = useState(() => getRegenTimeRemaining(hearts, heartsLastLostAt))

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRegenTimeRemaining(hearts, heartsLastLostAt)
      setTimeLeft(remaining)
      regenHearts()
    }, 1000)
    return () => clearInterval(interval)
  }, [hearts, heartsLastLostAt, regenHearts])

  const formatTime = (ms: number) => {
    const mins = Math.ceil(ms / 60000)
    if (mins <= 0) return 'Har qanday vaqtda'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h}s ${m}m`
    return `${m}m`
  }

  const emptyHearts = hearts <= 0

  return (
    <div className="flex items-center gap-1 relative">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => {
        const filled = i < hearts
        const isAnimating = animatingIdx === i

        return (
          <div
            key={i}
            className={`relative transition-all duration-300 ${
              isAnimating ? 'animate-heart-break' : ''
            } ${filled ? 'scale-100' : 'scale-90 opacity-40'}`}
          >
            {filled ? (
              <Heart
                size={px}
                className="text-red-500 drop-shadow-sm"
                fill="currentColor"
              />
            ) : (
              <HeartOff
                size={px}
                className="text-gray-300"
              />
            )}
            {/* Shatter particles for lost heart */}
            {isAnimating && (
              <>
                <div className="absolute top-0 left-0 w-1 h-1 bg-red-400 rounded-full animate-particle-1" />
                <div className="absolute top-1 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-particle-2" />
                <div className="absolute bottom-0 left-1 w-0.5 h-0.5 bg-red-300 rounded-full animate-particle-3" />
              </>
            )}
          </div>
        )
      })}

      {/* Regen timer tooltip */}
      {hearts < MAX_HEARTS && (
        <div className="relative">
          <button
            onClick={() => setShowTimer(s => !s)}
            className="ml-1 text-xs text-gray-400 hover:text-red-400 transition-colors font-medium"
            title="Yurak tiklanish vaqti"
          >
            ⏳
          </button>
          {showTimer && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20
              bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg animate-scale-in">
              <p>Keyingi yurak: {formatTime(timeLeft)}</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2
                border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>
      )}

      {/* Empty state message */}
      {emptyHearts && (
        <span className="text-xs text-red-400 font-semibold ml-1 animate-pulse">
          Yuraklar tugadi!
        </span>
      )}

      {/* Shop button */}
      {onShopClick && hearts < MAX_HEARTS && (
        <button
          onClick={onShopClick}
          className="ml-1.5 px-1.5 py-0.5 rounded-md bg-red-50 text-red-500
            text-xs font-bold hover:bg-red-100 transition-colors"
          title="Yurak sotib olish"
        >
          +{iconPx}
        </button>
      )}
    </div>
  )
}

/** Standalone heart regeneration timer bar — shows time until next heart */
export function HeartRegenBar({ hearts, heartsLastLostAt }: { hearts: number; heartsLastLostAt: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getRegenTimeRemaining(hearts, heartsLastLostAt))
  const REFILL_MS = 1800000 // 30 min
  const pct = timeLeft > 0 ? ((REFILL_MS - timeLeft) / REFILL_MS) * 100 : 100

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRegenTimeRemaining(hearts, heartsLastLostAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [hearts, heartsLastLostAt])

  const formatTime = (ms: number) => {
    const mins = Math.ceil(ms / 60000)
    if (mins <= 0) return 'Har qanday vaqtda'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h} soat ${m} daqiqa`
    return `${m} daqiqa`
  }

  if (hearts >= MAX_HEARTS) return null

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Yurak tiklanishi</span>
        <span className="font-medium">{formatTime(timeLeft)}</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
