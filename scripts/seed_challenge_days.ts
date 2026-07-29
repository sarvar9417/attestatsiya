// ═══════════════════════════════════════════════════════════════════════════
// seed_challenge_days.ts — Static day ma'lumotlarini Supabase ga ko'chirish
//
// Ishga tushirish:
//   npx tsx scripts/seed_challenge_days.ts
//
// Talab qiladi:
//   .env da SUPABASE_SERVICE_KEY (maxfiy kalit, VITE_ prefiksisiz)
//   .env da VITE_SUPABASE_URL
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { day1 } from '../src/data/30dayChallenge/day1'
import { day2 } from '../src/data/30dayChallenge/day2'
import type { ChallengeDay } from '../src/data/30dayChallenge/types'

// ── .env ni yuklash ──────────────────────────────────────────────────────────
config({ path: resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ .env da VITE_SUPABASE_URL va SUPABASE_SERVICE_KEY ni tekshiring')
  process.exit(1)
}

// Service role client — RLS ni chetlab o'tadi
const admin = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Mapping ──────────────────────────────────────────────────────────────────

interface TopicInsert {
  day_number: number
  title_uz: string
  title_en: string
  grammar_focus: string | null
  level: string
  scenario_context: string | null
  roleplay_script: unknown | null
  youtube_id: string | null
  transcript: string | null
  timestamps: unknown[]
  learning_objectives: string[]
  highlights: unknown[]
  vocabulary: unknown[]
  sentence_bank: unknown
  exercises: unknown[]
  quiz: unknown[]
  speaking: unknown
  review: unknown
}

function dayToTopic(day: ChallengeDay): TopicInsert {
  // Roleplay exercises → roleplay_script
  const roleplays = day.exercises.filter(
    (ex): ex is { id: number; type: 'roleplay'; instruction: string; scenario: string; tips?: string[] } =>
      ex.type === 'roleplay'
  )

  const roleplayScript = roleplays.length > 0
    ? {
        exercises: roleplays.map(rp => ({
          id: rp.id,
          instruction: rp.instruction,
          scenario: rp.scenario,
          tips: rp.tips ?? [],
        })),
      }
    : null

  // First roleplay → scenario_context
  const scenarioContext = roleplays.length > 0
    ? roleplays[0].scenario
    : null

  return {
    day_number: day.day,
    title_uz: `${day.day}-kun: ${day.title}`,
    title_en: day.title,
    grammar_focus: null,
    level: day.level,
    scenario_context: scenarioContext,
    roleplay_script: roleplayScript,
    youtube_id: day.video?.youtubeId ?? null,
    transcript: day.transcript ?? null,
    timestamps: day.timestamps ?? [],
    learning_objectives: day.learningObjectives ?? [],
    highlights: day.highlights ?? [],
    vocabulary: day.vocabulary ?? [],
    sentence_bank: day.sentenceBank ?? { categories: [], all: [] },
    exercises: day.exercises ?? [],
    quiz: day.quiz ?? [],
    speaking: day.speaking ?? { prompt: '', tips: [], practiceTime: 30 },
    review: day.review ?? { vocabulary: [], keyPhrases: [], mainPoints: [] },
  }
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  const days = [day1, day2]
  let success = 0
  let failed = 0

  for (const day of days) {
    const topic = dayToTopic(day)
    console.log(`📥 Inserting day ${day.day} — "${day.title}"...`)

    // Upsert on day_number
    const { error } = await admin
      .from('topics')
      .upsert(topic, { onConflict: 'day_number' })

    if (error) {
      console.error(`  ❌ Error: ${error.message}`)
      failed++
    } else {
      console.log(`  ✅ Success`)
      success++
    }
  }

  console.log(`\n📊 Done: ${success} success, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

seed()
