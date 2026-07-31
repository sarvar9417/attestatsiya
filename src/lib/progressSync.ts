/**
 * Progress Sync Service — facade over progressGateway
 *
 * Client-side progress'ni serverga sinxronlaydi. Barcha amallar
 * Fastify backend API orqali bajariladi (progressGateway.ts ga
 * delegatsiya qiladi).
 */
import { monitoring } from './monitoring'
import { progressGateway } from '../features/progress/progressGateway'
import type { DueReviewItem } from '../features/exam/contracts'

const syncedTopics = new Set<string>()

/**
 * Sync topic practice progress to server.
 */
export async function syncTopicProgress(subtopicCode: string): Promise<void> {
  if (syncedTopics.has(subtopicCode)) return

  const { topics_synced, errors } = await progressGateway.sync({
    topics: [
      {
        subtopic_code: subtopicCode,
        completed: true,
        correct_count: 0,
        total_count: 1,
        last_score: 100,
      },
    ],
  })

  if (topics_synced > 0) {
    syncedTopics.add(subtopicCode)
  } else if (errors.length > 0) {
    monitoring.captureMessage(
      `Progress sync: ${errors.join('; ')}`,
      'warn'
    )
  }
}

/**
 * Get constructs due for spaced repetition review.
 */
export async function getDueReviews(): Promise<DueReviewItem[]> {
  return progressGateway.getDueReviews()
}
