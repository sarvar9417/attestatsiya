import type { SpeakingPrompt } from '@/services/speakingService'
import { speak as ttsSpeak } from '../../lib/tts'

// ── Types ─────────────────────────────────────────────────────────────────────

export type View        = 'select' | 'record' | 'result' | 'chat-conversation' | 'chat-feedback'
export type RecordState = 'idle' | 'recording' | 'evaluating' | 'done'
export type Mode        = 'prompt' | 'chat'

export interface Scores { fluency: number; grammar: number; vocabulary: number }

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatTopic {
  id: string
  title: string
  category: SpeakingPrompt['category']
  prompt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Matnni TTS orqali o'qish — src/lib/tts.ts dan foydalanadi (voice, cancel, GC himoya) */
export function speakText(text: string) {
  ttsSpeak(text, { rate: 0.85 }).catch(() => {
    // TTS ishlamasa — indamay o'tib ketamiz (UX buzilmasin)
  })
}

export function parseScores(text: string): Scores {
  const get = (key: string) =>
    Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? '0')))
  return { fluency: get('FLUENCY'), grammar: get('GRAMMAR'), vocabulary: get('VOCABULARY') }
}

export function parseFeedback(text: string): string {
  return text.split('FEEDBACK:')[1]?.trim() ?? ''
}
