import { useEffect, useRef } from 'react'
import { useI18n } from '../../i18n'

export interface PitchPoint {
  time: number
  frequency: number
}

interface IntonationContourProps {
  pitchData: PitchPoint[]
  duration: number
  width?: number
  height?: number
  color?: string
}

function smoothPitch(data: PitchPoint[], windowSize = 3): PitchPoint[] {
  if (data.length < windowSize) return data
  const result: PitchPoint[] = []
  for (let i = 0; i < data.length; i++) {
    let sum = 0
    let count = 0
    for (let j = Math.max(0, i - Math.floor(windowSize / 2)); j < Math.min(data.length, i + Math.ceil(windowSize / 2)); j++) {
      if (data[j].frequency > 0) {
        sum += data[j].frequency
        count++
      }
    }
    result.push({
      time: data[i].time,
      frequency: count > 0 ? sum / count : 0,
    })
  }
  return result
}

function classifyDirection(points: PitchPoint[], i: number): 'rising' | 'falling' | 'flat' {
  if (i < 2 || i >= points.length - 2) return 'flat'
  const before = (points[i - 2].frequency + points[i - 1].frequency) / 2
  const after = (points[i + 1].frequency + points[i + 2].frequency) / 2
  const diff = after - before
  const threshold = 15
  if (diff > threshold) return 'rising'
  if (diff < -threshold) return 'falling'
  return 'flat'
}

export default function IntonationContour({
  pitchData,
  duration,
  width = 240,
  height = 48,
  color = '#818cf8',
}: IntonationContourProps) {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || pitchData.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.classList.contains('dark')
    const lineColor = color
    const fillColor = isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)'

    ctx.clearRect(0, 0, width, height)

    const smoothed = smoothPitch(pitchData.filter(p => p.frequency > 0))
    if (smoothed.length < 2) {
      ctx.fillStyle = isDark ? '#4b5563' : '#d1d5db'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t('intonation.noPitchData'), width / 2, height / 2 + 3)
      return
    }

    const minFreq = Math.max(0, Math.min(...smoothed.map(p => p.frequency)) - 30)
    const maxFreq = Math.max(...smoothed.map(p => p.frequency)) + 30
    const freqRange = Math.max(maxFreq - minFreq, 50)

    const pad = 8
    const drawW = width - pad * 2
    const drawH = height - pad * 2

    // Draw grid lines
    ctx.strokeStyle = isDark ? '#374151' : '#e5e7eb'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 4; i++) {
      const y = pad + (drawH / 3) * i
      ctx.beginPath()
      ctx.moveTo(pad, y)
      ctx.lineTo(width - pad, y)
      ctx.stroke()
    }

    // Draw contour line
    ctx.beginPath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'

    for (let i = 0; i < smoothed.length; i++) {
      const x = pad + (smoothed[i].time / duration) * drawW
      const y = pad + drawH - ((smoothed[i].frequency - minFreq) / freqRange) * drawH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Fill under the curve
    const last = smoothed[smoothed.length - 1]
    ctx.lineTo(pad + (last.time / duration) * drawW, pad + drawH)
    ctx.lineTo(pad, pad + drawH)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()

    // Draw direction markers (rising/falling)
    const markerStep = Math.max(1, Math.floor(smoothed.length / 8))
    for (let i = markerStep; i < smoothed.length - markerStep; i += markerStep) {
      const dir = classifyDirection(smoothed, i)
      if (dir === 'flat') continue

      const x = pad + (smoothed[i].time / duration) * drawW
      const y = pad + drawH - ((smoothed[i].frequency - minFreq) / freqRange) * drawH

      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = dir === 'rising' ? '#10b981' : '#ef4444'
      ctx.fillText(dir === 'rising' ? '↗' : '↘', x, y - 6)
    }

    // Y-axis labels
    ctx.font = '8px monospace'
    ctx.fillStyle = isDark ? '#6b7280' : '#9ca3af'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(maxFreq)}Hz`, pad - 2, pad + 8)
    ctx.fillText(`${Math.round(minFreq)}Hz`, pad - 2, pad + drawH)
  }, [pitchData, duration, color, width, height, t])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full rounded-lg"
    />
  )
}
