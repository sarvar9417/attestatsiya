/**
 * Progress Sync Service
 *
 * Synchronizes client-side progress (localStorage) to Supabase server.
 * Uses RPCs for secure, idempotent updates.
 */
import { typedSupabase } from './supabase'
import { resolveLessonUuid, resolveModuleUuid } from './resolveIds'
import { monitoring } from './monitoring'

const syncedTopics = new Set<string>()

/**
 * Mark a lesson as read by the current user.
 */
export async function markLessonRead(lessonId: string): Promise<void> {
  const { error } = await typedSupabase.rpc('mark_lesson_read', {
    p_lesson_id: lessonId,
  })
  if (error) {
    monitoring.captureException(new Error(error.message), {
      area: 'progress.mark-lesson',
      lessonId,
    })
  }
}

/**
 * Sync topic practice progress to server.
 */
export async function syncTopicProgress(subtopicCode: string): Promise<void> {
  if (syncedTopics.has(subtopicCode)) return

  const lessonUuid = await resolveLessonUuid(subtopicCode)
  if (!lessonUuid) {
    monitoring.captureMessage(`Progress sync: topic "${subtopicCode}" not found in DB`, 'warn')
    return
  }

  await markLessonRead(lessonUuid)
  syncedTopics.add(subtopicCode)
}

/**
 * Sync module progress to server.
 */
export async function syncModuleProgress(
  moduleCode: string,
  examScore: number
): Promise<void> {
  const moduleUuid = await resolveModuleUuid(moduleCode)
  if (!moduleUuid) {
    monitoring.captureMessage(`Module sync: "${moduleCode}" not found`, 'warn')
    return
  }

  const { data: userData } = await typedSupabase.auth.getUser()
  const userId = userData?.user?.id
  if (!userId) {
    monitoring.captureMessage('Progress sync: no authenticated user', 'warn')
    return
  }

  const { error } = await typedSupabase
    .from('user_module_progress')
    .upsert(
      { user_id: userId, module_id: moduleUuid, exam_best_score: examScore },
      { onConflict: 'user_id,module_id' }
    )

  if (error) {
    monitoring.captureException(new Error(error.message), {
      area: 'progress.module-sync',
      moduleCode,
    })
  }
}

interface DueReviewItem {
  construct_id: string
  title_uz: string
  group_code: string
  due_at: string | null
  accuracy: number
}

/**
 * Get constructs due for spaced repetition review.
 */
export async function getDueReviews(): Promise<DueReviewItem[]> {
  const { data, error } = await typedSupabase.rpc('get_due_reviews')
  if (error) {
    monitoring.captureException(new Error(error.message), {
      area: 'progress.due-reviews',
    })
    return []
  }
  return (data as unknown as DueReviewItem[]) ?? []
}
