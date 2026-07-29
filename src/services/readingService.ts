import { READING_TEXTS } from '../data/reading'
import type { ReadingText } from '../data/reading'
import { todayDate, fetchContent, saveScore } from './contentService'

/** Save reading quiz result to Supabase */
export async function saveReadingResult(params: {
  userId:         string
  textId:         string
  textTitle:      string
  correctCount:   number
  totalQuestions: number
  xpEarned:       number
}) {
  const { userId, textId, textTitle, correctCount, totalQuestions, xpEarned } = params
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  await saveScore('reading_progress', ['user_id', 'date', 'text_id'], {
    user_id:         userId,
    date:            todayDate(),
    text_id:         textId,
    text_title:      textTitle,
    score,
    correct_count:   correctCount,
    total_questions: totalQuestions,
    xp_earned:       xpEarned,
    completed_at:    new Date().toISOString(),
  })
}

export async function fetchReadingTexts(): Promise<ReadingText[]> {
  return fetchContent<ReadingText>('reading_texts', READING_TEXTS)
}
