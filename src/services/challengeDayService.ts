// ═══════════════════════════════════════════════════════════════════════════
// challengeDayService.ts — 30-Day Challenge content from Supabase
// ═══════════════════════════════════════════════════════════════════════════
//
// Pattern: static day fayllari → Supabase ga migratsiya qilingandan keyin
//           bu service orqali yuklanadi. Agar DB bo'sh bo'lsa, static data
//           ishlatiladi (fallback).
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import type {
  ChallengeDay,
  ChallengeVocab,
  LessonHighlight,
  SentenceBank,
  ChallengeExercise,
  ChallengeQuiz,
  ChallengeSpeaking,
  ChallengeReview,
  Timestamp,
} from '../data/30dayChallenge/types'

// ─── Types ───────────────────────────────────────────────────────────────────

/** Supabase topics jadvalidagi Row tipi (typed) */
interface TopicRow {
  id: string
  day_number: number
  title_en: string
  level: string
  youtube_id: string | null
  scenario_context: string | null
  roleplay_script: unknown | null
  transcript: string | null
  timestamps: unknown
  learning_objectives: unknown
  highlights: unknown
  vocabulary: unknown
  sentence_bank: unknown
  exercises: unknown
  quiz: unknown
  speaking: unknown
  review: unknown
}

// ─── Mapping ─────────────────────────────────────────────────────────────────

function mapTopicToDay(topic: TopicRow): ChallengeDay {
  const timestamps = db.jsonFrom<Timestamp[]>(topic.timestamps as never) ?? []
  const objectives = db.jsonFrom<string[]>(topic.learning_objectives as never) ?? []
  const highlights = db.jsonFrom<LessonHighlight[]>(topic.highlights as never) ?? []
  const vocabulary = db.jsonFrom<ChallengeVocab[]>(topic.vocabulary as never) ?? []
  const sentenceBank = db.jsonFrom<SentenceBank>(topic.sentence_bank as never) ?? { categories: [], all: [] }
  const exercises = db.jsonFrom<ChallengeExercise[]>(topic.exercises as never) ?? []
  const quiz = db.jsonFrom<ChallengeQuiz[]>(topic.quiz as never) ?? []
  const speaking = db.jsonFrom<ChallengeSpeaking>(topic.speaking as never) ?? { prompt: '', tips: [], practiceTime: 30 }
  const review = db.jsonFrom<ChallengeReview>(topic.review as never) ?? { vocabulary: [], keyPhrases: [], mainPoints: [] }

  return {
    id: `day-${topic.day_number}`,
    day: topic.day_number,
    title: topic.title_en,
    level: topic.level,
    video: topic.youtube_id ? { youtubeId: topic.youtube_id } : undefined,
    transcript: topic.transcript ?? '',
    timestamps: timestamps.length > 0 ? timestamps : undefined,
    learningObjectives: objectives,
    highlights,
    vocabulary,
    sentenceBank,
    exercises,
    quiz,
    speaking,
    review,
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Supabase dan bitta kunning ma'lumotlarini olish.
 * @returns ChallengeDay | null — agar topilmasa null
 */
export async function getChallengeDayFromDB(dayNumber: number): Promise<ChallengeDay | null> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('day_number', dayNumber)
    .maybeSingle()

  if (error || !data) return null

  return mapTopicToDay(data as unknown as TopicRow)
}

/**
 * Supabase dan barcha kunlarni olish (day_number bo'yicha tartiblangan)
 */
export async function getAllDaysFromDB(): Promise<ChallengeDay[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('day_number')

  if (error || !data || data.length === 0) return []

  return data
    .filter(row => row.day_number >= 1 && row.day_number <= 30)
    .sort((a, b) => a.day_number - b.day_number)
    .map(row => mapTopicToDay(row as unknown as TopicRow))
}

/**
 * Supabase da ma'lum bir kun bor-yo'qligini tekshirish
 */
export async function hasDayInDB(dayNumber: number): Promise<boolean> {
  const { count, error } = await supabase
    .from('topics')
    .select('*', { count: 'exact', head: true })
    .eq('day_number', dayNumber)

  return !error && (count ?? 0) > 0
}

/**
 * Seed qilingan kunlar sonini qaytarish (0 = hali seed qilinmagan)
 */
export async function getSeededDayCount(): Promise<number> {
  const { count, error } = await supabase
    .from('topics')
    .select('*', { count: 'exact', head: true })

  return error ? 0 : (count ?? 0)
}
