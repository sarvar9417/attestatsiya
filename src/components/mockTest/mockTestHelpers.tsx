import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TestType = 'a1' | 'b1' | 'b2' | 'ielts'
export type View = 'select' | 'weekly' | 'ielts-reading' | 'ielts-listening' | 'ielts-writing' | 'ielts-speaking' | 'result'

export interface IELTSScores {
  reading:   number
  listening: number
  writingT1: number
  writingT2: number
  speaking1: number
  speaking2: number
}

export interface ResultData {
  type:         TestType
  weeklyScore?: number
  weeklyTotal?: number
  ielts?:       IELTSScores
  overallBand:  number
  prevScore?:   number
  savedId?:     number
}

// ── Speech recognition types ──────────────────────────────────────────────────

export interface SpeechTypes {
  SpeechRecognition?: new () => SpeechRec
  webkitSpeechRecognition?: new () => SpeechRec
}

export interface SpeechRecognitionEventType extends Event {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

export interface SpeechRec {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((ev: SpeechRecognitionEventType) => void) | null
  onend: (() => void) | null
  onerror: ((ev: Event) => void) | null
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- global Window augmentation
  interface Window extends SpeechTypes {}
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setLeft(seconds)
    setActive(false)
  }, [seconds])

  useEffect(() => {
    if (!active || left <= 0) return
    const id = setInterval(() => setLeft((n) => n - 1), 1000)
    return () => clearInterval(id)
  }, [active, left])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return { left, fmt: fmt(left), pct: (left / seconds) * 100, start: () => setActive(true) }
}

export function wordCount(t: string) {
  return t.trim().split(/\s+/).filter(Boolean).length
}

export function parseAIScore(text: string, key: string) {
  const m = text.match(new RegExp(`${key}:\\s*(\\d+)`))
  if (!m) return 5
  const n = parseInt(m[1], 10)
  return Number.isNaN(n) ? 5 : Math.min(10, Math.max(0, n))
}

// ── Sub-components ────────────────────────────────────────────────────────────

export function Timer({ fmt, warn }: { fmt: string; pct?: number; warn?: boolean }) {
  return (
    <div aria-live="polite" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-semibold
      ${warn ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
      <Clock size={13} /> {fmt}
    </div>
  )
}

export function BandBadge({ band }: { band: number }) {
  const color = band >= 7 ? 'text-green-700 bg-green-100' : band >= 6 ? 'text-b1-700 bg-b1-100' : 'text-orange-700 bg-orange-100'
  return <span className={`font-bold px-3 py-1 rounded-full text-sm ${color}`}>{band.toFixed(1)}</span>
}

export function SectionBar({ label, pct, band }: { label: string; pct: number; band: number }) {
  const color = band >= 7 ? 'bg-green-500' : band >= 6 ? 'bg-b1-500' : 'bg-orange-500'
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <BandBadge band={band} />
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
