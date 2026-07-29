// EnglishPath — Vocabulary Battle question service
// Fetches words from the Supabase `words` table by CEFR level
// and builds multiple-choice questions with random distractors

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

export type LevelId = 'A1' | 'A2' | 'B1' | 'B2'

export interface BattleQuestion {
  id: number
  english: string
  uzbek: string
  options: string[]
  correct: number
}

export interface LevelOption {
  id: LevelId
  label: string
  emoji: string
  color: string
}

export const LEVEL_OPTIONS: LevelOption[] = [
  { id: 'A1', label: 'A1 — Beginner',    emoji: '🌱', color: 'bg-green-500' },
  { id: 'A2', label: 'A2 — Elementary',  emoji: '📘', color: 'bg-blue-500' },
  { id: 'B1', label: 'B1 — Intermediate', emoji: '🔥', color: 'bg-orange-500' },
  { id: 'B2', label: 'B2 — Upper-Intermediate', emoji: '💎', color: 'bg-purple-500' },
]

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Fetch battle questions by mode.
 * - 'vocab': fetches from words table (existing)
 * - 'grammar': uses curated grammar question pool
 * - 'reading': uses curated reading passages + questions
 * - Defaults to vocab if mode not recognized
 */
export async function fetchBattleQuestionsByMode(
  level: LevelId,
  count: number,
  mode: string = 'vocab'
): Promise<{ questions: BattleQuestion[]; passage?: string }> {
  if (mode === 'grammar') {
    const { getGrammarQuestions } = await import('../data/duelQuestions')
    const qs = getGrammarQuestions(level, count)
    return {
      questions: qs.map(q => ({
        id: q.id,
        english: q.english,
        uzbek: '',
        options: q.options,
        correct: q.correct,
      })),
    }
  }

  if (mode === 'speaking') {
    const { getSpeakingPrompt } = await import('../data/duelQuestions')
    const prompt = getSpeakingPrompt()
    // Return a single question representing the speaking prompt + tips
    return {
      questions: [{
        id: 0,
        english: prompt.prompt,
        uzbek: prompt.tips.join(' | '),  // tips as uzbek field for storage
        options: [],
        correct: 0,
      }],
      passage: prompt.tips.join('\n'),
    }
  }

  if (mode === 'reading') {
    const { getReadingQuestions } = await import('../data/duelQuestions')
    const readingQ = getReadingQuestions(level, 4)
    return {
      questions: readingQ.questions.map(q => ({
        id: q.id,
        english: q.english,
        uzbek: q.english,  // reading questions don't need uzbek
        options: q.options,
        correct: q.correct,
      })),
      passage: readingQ.passage,
    }
  }

  // Default: vocab
  return { questions: await fetchBattleQuestions(level, count) }
}

/**
 * Fetch vocab battle questions from the database.
 *
 * 1. Fetches ~30 words from the selected level (correct answers).
 * 2. Fetches all words from other levels (distractor pool).
 * 3. For each question word, picks 3 random uzbek distractors.
 * 4. Shuffles the 4 options and tracks the correct index.
 */
export async function fetchBattleQuestions(
  level: LevelId,
  count: number = 10,
): Promise<BattleQuestion[]> {
  // 1. Fetch words from the selected level (correct answers pool)
  const { data: correctWords, error: correctError } = await supabase
    .from('words')
    .select('id, english, uzbek')
    .eq('level', level)
    .order('id', { ascending: true })

  if (correctError || !correctWords || correctWords.length === 0) {
    monitoring.captureMessage('fetchBattleQuestions error: ' + (correctError?.message ?? 'No words found for level ' + level), 'error')
    return []
  }

  // 2. Fetch all uzbek translations from OTHER levels (distractor pool)
  const { data: distractorRows } = await supabase
    .from('words')
    .select('uzbek')
    .neq('level', level)
    .order('id', { ascending: true })

  const distractors = (distractorRows ?? []).map(w => w.uzbek).filter(Boolean)

  // 3. Pick `count` random words and build questions
  const shuffledCorrect = shuffleArray(correctWords).slice(0, Math.min(count, correctWords.length))

  return shuffledCorrect.map((word) => {
    // Pick 3 random distractors that differ from the correct answer
    const wrongOptions = shuffleArray(distractors)
      .filter(d => d !== word.uzbek)
      .slice(0, 3)

    // If for some reason we couldn't get 3, pad with generic options
    while (wrongOptions.length < 3) {
      wrongOptions.push('???')
    }

    // Combine correct + wrong, shuffle, find correct index
    const allOptions = [word.uzbek, ...wrongOptions]
    const shuffledOptions = shuffleArray(allOptions)
    const correctIndex = shuffledOptions.indexOf(word.uzbek)

    return {
      id: word.id,
      english: word.english,
      uzbek: word.uzbek,
      options: shuffledOptions,
      correct: correctIndex,
    }
  })
}
