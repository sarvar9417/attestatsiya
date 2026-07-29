import type { ListeningQuestion } from '../../data/dailyLessons'
import { assignSpeakerVoices, type SpeakerVoice } from '../../lib/voiceGender'

export interface SpeakerSegment {
  speaker: string
  text: string
}

export const YT_BASE = 'https://www.youtube.com/embed/'
export const SS = typeof window !== 'undefined' ? window.speechSynthesis : null

export const SPEAKER_COLORS = [
  { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/40', dot: 'bg-sky-500', border: 'border-sky-300 dark:border-sky-700' },
  { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/40', dot: 'bg-violet-500', border: 'border-violet-300 dark:border-violet-700' },
  { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40', dot: 'bg-emerald-500', border: 'border-emerald-300 dark:border-emerald-700' },
  { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', dot: 'bg-orange-500', border: 'border-orange-300 dark:border-orange-700' },
]

export const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5]

export const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  easy: { label: 'Oson', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  medium: { label: "O'rtacha", color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  hard: { label: 'Qiyin', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
}

export function parseTranscript(transcript: string): SpeakerSegment[] {
  const lines = transcript.split('\n').map(l => l.trim()).filter(Boolean)
  const segments: SpeakerSegment[] = []
  for (const line of lines) {
    const match = line.match(/^([A-Za-z\u0400-\u04FF' -]+?):\s*(.+)/)
    if (match) {
      segments.push({ speaker: match[1].trim(), text: match[2].trim() })
    } else if (segments.length > 0) {
      segments[segments.length - 1].text += ' ' + line
    }
  }
  return segments
}

export function getVoices(segments: SpeakerSegment[]): Map<string, SpeakerVoice> {
  const unique = [...new Set(segments.map(s => s.speaker))]
  return assignSpeakerVoices(unique)
}

export function extractVocabulary(segments: SpeakerSegment[]): string[] {
  const words = segments.flatMap(s => s.text.split(/\s+/))
  const midFreq = words.filter(w => w.length > 4 && /^[a-z]+$/i.test(w))
  const unique = [...new Set(midFreq.map(w => w.toLowerCase()))]
  return unique.slice(0, 6)
}

export function getQuestionKey(q: ListeningQuestion): string {
  switch (q.type) {
    case 'multiple-choice': return `mc-${q.id}`
    case 'true-false': return `tf-${q.id}`
    case 'multiple-answer': return `ma-${q.id}`
    case 'fill-blank': return `fb-${q.id}`
    case 'ordering': return `ord-${q.id}`
    case 'matching': return `mat-${q.id}`
    default: return ''
  }
}

export function checkAnswer(
  q: ListeningQuestion,
  userAns: number | number[] | string | boolean | string[] | undefined
): boolean {
  switch (q.type) {
    case 'multiple-choice': return userAns === q.correctIndex
    case 'true-false': return userAns === q.answer
    case 'fill-blank':
      return typeof userAns === 'string' && typeof q.answer === 'string' &&
        userAns.toLowerCase().trim() === q.answer.toLowerCase().trim()
    case 'multiple-answer':
      return Array.isArray(userAns) && Array.isArray(q.correctIndices) &&
        userAns.length === q.correctIndices.length &&
        userAns.every(i => q.correctIndices!.includes(i as number))
    case 'ordering':
      return Array.isArray(userAns) && Array.isArray(q.correctOrder) &&
        userAns.length === q.correctOrder.length &&
        userAns.every((v, i) => v === q.correctOrder![i])
    case 'matching':
      return Array.isArray(userAns) && Array.isArray(q.pairs) &&
        userAns.length === q.pairs.length &&
        userAns.every((v, i) => v === q.pairs![i].right)
    default: return false
  }
}
