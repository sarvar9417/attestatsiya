// ═══════════════════════════════════════════════════════════════════════════
// HotSeatDuel uchun umumiy tiplar, konstantalar va helper funksiyalar
// ═══════════════════════════════════════════════════════════════════════════

export const QUESTIONS_PER_PLAYER = 10
export const QUESTION_TIME = 5
export const TRANSITION_DELAY = 2000

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameMode = 'setup' | 'same_device' | 'online'
export type OnlinePhase = 'lobby' | 'waiting' | 'playing' | 'results' | 'error'
export type LevelId = 'A1' | 'A2' | 'B1' | 'B2'

export interface HotSeatQuestion {
  id: number
  english: string
  options: string[]
  correct: number
  passage?: string
}

export interface PlayerScore {
  name: string
  score: number
  answers: { questionIndex: number; answerIndex: number; correct: boolean }[]
  timeouts: number
}

export interface OnlineMessage {
  type: 'join' | 'start' | 'answer' | 'done'
  playerId?: 'host' | 'guest'
  playerName?: string
  answer?: { questionIndex: number; answerIndex: number }
  questions?: HotSeatQuestion[]
  mode?: string
  level?: string
  myScore?: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function getXP(score: number): number {
  return score * 15
}
