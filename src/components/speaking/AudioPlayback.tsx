import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'
import { useI18n } from '../../i18n'

export interface PitchPoint {
  time: number
  frequency: number
}

interface AudioPlaybackProps {
  audioUrl: string
  label?: string
  color?: string
  /** Native speaker audio URL — comparison mode */
  comparisonUrl?: string
  comparisonLabel?: string
  onEnded?: () => void
  /** Intonation contour data — draws pitch line over waveform */
  intonationData?: PitchPoint[]
}

function drawIntonationContour(
  ctx: CanvasRenderingContext2D,
  data: PitchPoint[],
  duration: number,
  w: number,
  h: number,
) {
  if (data.length < 2) return
  const isDark = document.documentElement.classList.contains('dark')

  const valid = data.filter(p => p.frequency > 50 && p.frequency < 500)
  if (valid.length < 2) return

  const minFreq = Math.max(0, Math.min(...valid.map(p => p.frequency)) - 20)
  const maxFreq = Math.max(...valid.map(p => p.frequency)) + 20
  const range = Math.max(maxFreq - minFreq, 50)

  ctx.beginPath()
  ctx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b'
  ctx.lineWidth = 1.5
  ctx.lineJoin = 'round'

  for (let i = 0; i < valid.length; i++) {
    const x = (valid[i].time / duration) * w
    const y = h - ((valid[i].frequency - minFreq) / range) * h
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

export default function AudioPlayback({
  audioUrl,
  label,
  color = 'text-primary-600',
  comparisonUrl,
  comparisonLabel,
  onEnded,
  intonationData,
}: AudioPlaybackProps) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const intonationCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  // Setup audio element
  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const onLoaded = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnd = () => { setPlaying(false); onEnded?.() }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
    }
  }, [audioUrl, onEnded])

  // Draw intonation contour overlay
  useEffect(() => {
    const canvas = intonationCanvasRef.current
    if (!canvas || !intonationData || intonationData.length < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)
    drawIntonationContour(ctx, intonationData, duration || audioRef.current?.duration || 0, w, h)
  }, [intonationData, duration])

  // Draw waveform from audio element
  useEffect(() => {
    const canvasEl = canvasRef.current
    const audio = audioRef.current
    if (!canvasEl || !audio) return

    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    let cancelled = false

    async function draw() {
      if (!audio || !ctx || cancelled) return

      // Create offline context for waveform extraction
      try {
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioCtx = new AudioContext()
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
        const channelData = audioBuffer.getChannelData(0)

      if (!canvasEl) return
      const w = canvasEl.width
      const h = canvasEl.height
        const step = Math.floor(channelData.length / w)
        const isDark = document.documentElement.classList.contains('dark')

        ctx.clearRect(0, 0, w, h)

        for (let i = 0; i < w; i++) {
          let sum = 0
          const start = i * step
          for (let j = 0; j < step; j++) {
            sum += Math.abs(channelData[start + j] || 0)
          }
          const avg = sum / step
          const barHeight = Math.max(2, avg * h * 1.5)

          // Current position highlight
          const progress = audio.duration ? audio.currentTime / audio.duration : 0
          const isPlayed = i / w < progress

          ctx.fillStyle = isPlayed
            ? (isDark ? '#818cf8' : '#6366f1')
            : (isDark ? '#374151' : '#d1d5db')

          ctx.fillRect(i, (h - barHeight) / 2, 1, barHeight)
        }

        audioCtx.close()
      } catch {
        // Fallback: simple animated bars
        drawFallback(ctx, canvasEl, audio)
      }

      if (!cancelled) animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelled = true
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [audioUrl])

  function drawFallback(ctx: CanvasRenderingContext2D, el: HTMLCanvasElement | null, audio: HTMLAudioElement) {
    if (!el) return
    const w = el.width
    const h = el.height
    const isDark = document.documentElement.classList.contains('dark')
    const barCount = 48
    const barW = (w - (barCount - 1) * 2) / barCount

    ctx.clearRect(0, 0, w, h)

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.max(2, Math.random() * h * 0.8)
      const progress = audio.duration ? audio.currentTime / audio.duration : 0
      const isPlayed = i / barCount < progress

      ctx.fillStyle = isPlayed
        ? (isDark ? '#818cf8' : '#6366f1')
        : (isDark ? '#374151' : '#d1d5db')

      ctx.fillRect(i * (barW + 2), (h - barHeight) / 2, barW, barHeight)
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
    } else {
      audio.play().catch((e: unknown) => {
        monitoring.captureMessage('AudioPlayback play failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 space-y-2">
      {/* Label + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 size={14} className={color} />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{label ?? t('audioPlayback.yourAudio')}</span>
        </div>
        <span className="text-xs font-mono text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Waveform + play button */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all"
          aria-label={playing ? t('audioPlayback.pause') : t('audioPlayback.play')}
        >
          {playing ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
        </button>

        <div className="flex-1 h-12 relative">
          <canvas
            ref={canvasRef}
            width={240}
            height={48}
            className="w-full h-full rounded-lg"
          />
          {intonationData && intonationData.length > 1 && (
            <canvas
              ref={intonationCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Comparison mode */}
      {comparisonUrl && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <ComparisonRow url={comparisonUrl} label={comparisonLabel ?? t('audioPlayback.sample')} color="text-violet-500" />
        </div>
      )}
    </div>
  )
}

function ComparisonRow({ url, label }: { url: string; label: string; color?: string }) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setPlaying(false)
    audio.onplay = () => setPlaying(true)
    audio.onpause = () => setPlaying(false)
    return () => { audio.pause(); audio.src = '' }
  }, [url])

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (playing) audioRef.current?.pause()
          else audioRef.current?.play().catch((e: unknown) => {
            monitoring.captureMessage('AudioPlayback mini play failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          })
        }}
        className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0 active:scale-95 transition-all"
        aria-label={playing ? t('audioPlayback.pause') : t('audioPlayback.play')}
      >
        {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
      </button>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
      {playing && <span className="text-xs text-violet-500 animate-pulse">{t('audioPlayback.playing')}</span>}
    </div>
  )
}
