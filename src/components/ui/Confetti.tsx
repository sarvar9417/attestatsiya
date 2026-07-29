import { useEffect, useState } from 'react'

interface ConfettiProps {
  show: boolean
  duration?: number
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
  shape: 'square' | 'circle' | 'triangle'
}

const COLORS = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ef4444']

function createParticle(id: number): Particle {
  return {
    id,
    x: Math.random() * 100,
    y: -10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 3,
    velocityY: Math.random() * 3 + 2,
    shape: (['square', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }
}

export default function Confetti({ show, duration = 2000, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!show) {
      setParticles([])
      return
    }

    const newParticles = Array.from({ length: 50 }, (_, i) => createParticle(i))
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            rotation: p.rotation + p.velocityX * 10,
            velocityY: p.velocityY + 0.1,
          }))
          .filter(p => p.y < 120)
      )
    }, 30)

    const timeout = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [show, duration, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
            transform: `rotate(${p.rotation}deg) ${p.shape === 'triangle' ? 'scale(1.5)' : ''}`,
            clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            opacity: Math.max(0, 1 - p.y / 100),
          }}
        />
      ))}
    </div>
  )
}
