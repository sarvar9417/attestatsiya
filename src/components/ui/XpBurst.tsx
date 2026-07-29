import { useState, useEffect, useCallback } from 'react'

interface Burst {
  id: number
  xp: number
  critical: boolean
  createdAt: number
}

let _listeners: ((b: Burst) => void)[] = []
let _id = 0

export function emitXpBurst(xp: number, critical?: boolean): void {
  const burst: Burst = { id: ++_id, xp, critical: !!critical, createdAt: Date.now() }
  _listeners.forEach(fn => fn(burst))
}

const SPARKLE_COUNT = 8

function SparkleParticles({ critical }: { critical: boolean }) {
  return (
    <>
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
        const angle = (i / SPARKLE_COUNT) * 360
        const distance = critical ? 60 + Math.random() * 40 : 30 + Math.random() * 30
        const size = critical ? 4 + Math.random() * 4 : 2 + Math.random() * 3
        const delay = Math.random() * 0.15

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: size,
              height: size,
              borderRadius: critical ? '2px' : '50%',
              background: critical
                ? ['#fbbf24', '#f59e0b', '#ef4444', '#a78bfa', '#22d3ee'][i % 5]
                : ['#fbbf24', '#fde68a', '#fff176'][i % 3],
              animation: `xp-sparkle-burst 0.8s ease-out ${delay}s forwards`,
              ['--sparkle-angle' as string]: `${angle}deg`,
              ['--sparkle-distance' as string]: `${distance}px`,
              opacity: 0,
            }}
          />
        )
      })}
    </>
  )
}

function BurstItem({ burst, onDone }: { burst: Burst; onDone: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(burst.id), 1200)
    return () => clearTimeout(timer)
  }, [burst.id, onDone])

  return (
    <div
      key={burst.id}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2"
    >
      {/* Sparkle particles */}
      <SparkleParticles critical={burst.critical} />

      {/* XP text */}
      <div
        className="relative text-xl font-bold"
        style={{
          color: burst.critical ? '#f59e0b' : '#fbbf24',
          animation: 'xp-text-float 1.2s ease-out forwards',
          textShadow: burst.critical
            ? '0 0 10px rgba(245,158,11,0.8), 0 0 20px rgba(239,68,68,0.4)'
            : '0 0 6px rgba(251,191,36,0.6)',
        }}
      >
        +{burst.xp} XP{burst.critical ? ' 🔥' : ''}
      </div>
    </div>
  )
}

export function XpBurstOverlay() {
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    const handler = (b: Burst) => setBursts(prev => [...prev, b])
    _listeners.push(handler)
    return () => { _listeners = _listeners.filter(fn => fn !== handler) }
  }, [])

  const remove = useCallback((id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bursts.map(b => (
        <BurstItem key={b.id} burst={b} onDone={remove} />
      ))}
    </div>
  )
}

export const XpBurst = XpBurstOverlay
