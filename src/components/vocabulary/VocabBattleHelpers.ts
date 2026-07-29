// ─── Types ──────────────────────────────────────────────────────────────

export type GameState = 'lobby' | 'waiting' | 'playing' | 'results' | 'error'
export type PlayerId = 'host' | 'guest'
export type LevelId = 'A1' | 'A2' | 'B1' | 'B2'
export type AIDifficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'multiplayer' | 'ai'

export interface BattleQuestion {
  id: number
  english: string
  uzbek: string
  options: string[]
  correct: number
}

export interface BattleMessage {
  type: 'join' | 'answer' | 'start'
  player: PlayerId
  answer?: number
  questionIndex?: number
  playerName?: string
}

export interface AIOpponent {
  name: string
  emoji: string
  difficulty: AIDifficulty
  accuracy: number
  delayMin: number
  delayMax: number
}

// ─── Constants ──────────────────────────────────────────────────────────

export const QUESTIONS_PER_GAME = 10
export const QUESTION_TIME = 15

export const AI_OPPONENTS: Record<AIDifficulty, AIOpponent> = {
  easy: {
    name: 'Bot Junior',
    emoji: '🤖',
    difficulty: 'easy',
    accuracy: 0.6,
    delayMin: 2,
    delayMax: 5,
  },
  medium: {
    name: 'AI Challenger',
    emoji: '⚡',
    difficulty: 'medium',
    accuracy: 0.75,
    delayMin: 1.5,
    delayMax: 4,
  },
  hard: {
    name: 'Grandmaster AI',
    emoji: '🧠',
    difficulty: 'hard',
    accuracy: 0.9,
    delayMin: 1,
    delayMax: 3,
  },
}

export const LEVEL_COLORS: Record<string, string> = {
  A1: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
  A2: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
  B1: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20',
  B2: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
}

export const LEVEL_RING_COLORS: Record<string, string> = {
  A1: 'ring-green-400',
  A2: 'ring-blue-400',
  B1: 'ring-orange-400',
  B2: 'ring-purple-400',
}

export const DIFFICULTY_COLORS = {
  easy: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:border-green-300',
  medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 hover:border-yellow-300',
  hard: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 hover:border-red-300',
}

export const DIFFICULTY_RING_COLORS = {
  easy: 'ring-green-400',
  medium: 'ring-yellow-400',
  hard: 'ring-red-400',
}

export const DIFFICULTY_ICONS = { easy: '🤖', medium: '⚡', hard: '🧠' }

export const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: "Asosiy so'zlar",
  A2: "Kundalik so'zlar",
  B1: 'Akademik so\'zlar',
  B2: 'Yuqori daraja',
}

// ─── Helpers ────────────────────────────────────────────────────────────

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function aiAnswer(question: BattleQuestion, accuracy: number): number {
  if (Math.random() < accuracy) {
    return question.correct
  }
  const wrongOptions = [0, 1, 2, 3].filter(i => i !== question.correct)
  return wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
}
