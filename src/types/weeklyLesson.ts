// ═══════════════════════════════════════════════════════════════════════════
// Weekly Lessons — haftalik dars rejasi tiplari
// Migration: supabase/migrations/20260722000000_weekly_lessons.sql
// ═══════════════════════════════════════════════════════════════════════════

export type LessonMode = 'green' | 'yellow' | 'red'
export type UnitStatus = 'planned' | 'active' | 'done' | 'archived'
export type LessonStatus = 'todo' | 'in_progress' | 'done' | 'skipped'

// ─── Kontent bloklari ─────────────────────────────────────────────────────
// Har blok — bitta "meaningful" qism. roadmap/03 §3: one task at a time.

export interface TextBlock {
  type: 'text'
  title?: string
  body: string
}

export interface RuleBlock {
  type: 'rule'
  title: string
  rule: string
  examples: { en: string; uz: string }[]
}

export interface VocabBlock {
  type: 'vocab'
  title?: string
  items: { en: string; uz: string; example?: string }[]
}

export interface TaskBlock {
  type: 'task'
  prompt: string
  hint?: string
  answer?: string
}

export interface SpeakingBlock {
  type: 'speaking'
  prompt: string
  seconds: number
}

export interface LinkBlock {
  type: 'link'
  label: string
  url: string
  source?: string
}

export type LessonBlock =
  | TextBlock
  | RuleBlock
  | VocabBlock
  | TaskBlock
  | SpeakingBlock
  | LinkBlock

export type BlockType = LessonBlock['type']

// ─── Jadval qatorlari ─────────────────────────────────────────────────────

export interface WeeklyUnit {
  id: number
  user_id: string
  week_no: number
  title: string
  subtitle: string | null
  objective: string | null
  success_criteria: string[]
  phase: string | null
  start_date: string | null
  end_date: string | null
  status: UnitStatus
  created_at: string
  updated_at: string
}

export interface WeeklyLesson {
  id: number
  user_id: string
  unit_id: number
  day_no: number
  title: string
  objective: string | null
  mode: LessonMode
  duration_min: number
  blocks: LessonBlock[]
  status: LessonStatus
  notes: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

/** Hafta + uning kunlik darslari — hub sahifasi uchun */
export interface WeeklyUnitWithLessons extends WeeklyUnit {
  lessons: WeeklyLesson[]
}

// ─── DTO'lar ──────────────────────────────────────────────────────────────

export interface CreateUnitDTO {
  week_no: number
  title: string
  subtitle?: string
  objective?: string
  success_criteria?: string[]
  phase?: string
  start_date?: string
  end_date?: string
  status?: UnitStatus
}

export type UpdateUnitDTO = Partial<CreateUnitDTO>

export interface CreateLessonDTO {
  unit_id: number
  day_no: number
  title: string
  objective?: string
  mode?: LessonMode
  duration_min?: number
  blocks?: LessonBlock[]
  status?: LessonStatus
  notes?: string
}

export type UpdateLessonDTO = Partial<Omit<CreateLessonDTO, 'unit_id'>>

// ─── Ko'rinish yordamchilari ──────────────────────────────────────────────

export const MODE_MINUTES: Record<LessonMode, number> = {
  green: 90,
  yellow: 45,
  red: 10,
}

export const MODE_LABEL: Record<LessonMode, string> = {
  green: 'Green 90',
  yellow: 'Yellow 45',
  red: 'Red 10',
}

export const BLOCK_LABEL: Record<BlockType, string> = {
  text: 'Matn',
  rule: 'Qoida',
  vocab: "Lug'at",
  task: 'Topshiriq',
  speaking: 'Speaking',
  link: 'Havola',
}

/** Bo'sh blok — admin formada yangi blok qo'shganda boshlang'ich qiymat */
export function emptyBlock(type: BlockType): LessonBlock {
  switch (type) {
    case 'text':     return { type: 'text', body: '' }
    case 'rule':     return { type: 'rule', title: '', rule: '', examples: [] }
    case 'vocab':    return { type: 'vocab', items: [] }
    case 'task':     return { type: 'task', prompt: '' }
    case 'speaking': return { type: 'speaking', prompt: '', seconds: 60 }
    case 'link':     return { type: 'link', label: '', url: '' }
  }
}
