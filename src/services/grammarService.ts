import { GRAMMAR_TOPICS } from '../data/grammar'
import type { GrammarTopic } from '../data/grammar'
import { todayDate, fetchContent, saveScore } from './contentService'
import { monitoring } from '../lib/monitoring'
import { GrammarResultSchema } from '../lib/validations'

/** Save grammar exercise result to Supabase */
export async function saveGrammarResult(params: {
  userId:       string
  topicId:      string
  topicTitle:   string
  correctCount: number
  total:        number
  xpEarned:     number
}) {
  const { userId, topicId, topicTitle, correctCount, total, xpEarned } = params

  const validation = GrammarResultSchema.safeParse({ userId, topicId, topicTitle, correctCount, total, xpEarned })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in saveGrammarResult: ${validation.error.message}`, 'warn')
  }

  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0

  await saveScore('grammar_progress', ['user_id', 'date', 'topic_id'], {
    user_id:         userId,
    date:            todayDate(),
    topic_id:        topicId,
    topic_title:     topicTitle,
    score,
    correct_count:   correctCount,
    total_exercises: total,
    xp_earned:       xpEarned,
    completed_at:    new Date().toISOString(),
  })
}

export async function fetchGrammarTopics(): Promise<GrammarTopic[]> {
  return fetchContent<GrammarTopic>('grammar_topics', GRAMMAR_TOPICS, 'order_index')
}
