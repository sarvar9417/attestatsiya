import { supabase, getAuthedClient } from '../lib/supabase.js'
import { resolveLessonUuid } from '../lib/resolveIds.js'
import type {
  SyncProgressInput,
  ModuleProgressResponse,
  MasteryItemResponse,
  MasteryResponse,
  MasteryStatus,
  ReadinessResponse,
} from '../schemas/progress.js'
import {
  calculateReadiness,
  type IndependentEvidence,
} from './readiness.js'

/**
 * Progress Service
 *
 * Handles synchronization of user progress between client and server.
 * Uses authed client for user-scoped RPCs (mark_lesson_read uses auth.uid()).
 */
export const progressService = {
  /**
   * Sync client progress to server.
   * - Topics: mark lessons as read via `mark_lesson_read` RPC
   * - Module scores: upsert into `user_module_progress`
   */
  async sync(userId: string, userToken: string, input: SyncProgressInput) {
    const authedClient = getAuthedClient(userToken)
    const results = {
      topics_synced: 0,
      modules_synced: 0,
      errors: [] as string[],
    }

    // Sync topics — must use authed client because mark_lesson_read uses auth.uid()
    if (input.topics) {
      for (const topic of input.topics) {
        const lessonId = await resolveLessonUuid(topic.subtopic_code)

        if (lessonId) {
          const { error } = await authedClient.rpc('mark_lesson_read', {
            p_lesson_id: lessonId,
          })

          if (error) {
            results.errors.push(`Topic ${topic.subtopic_code}: ${error.message}`)
          } else {
            results.topics_synced++
          }
        }
      }
    }

    // Sync module scores — admin client is fine here (direct table upsert)
    if (input.module_scores) {
      for (const mod of input.module_scores) {
        const { data: module } = await supabase
          .from('modules')
          .select('id')
          .eq('code', mod.module_code)
          .maybeSingle()

        if (module) {
          const { error } = await authedClient
            .from('user_module_progress')
            .upsert(
              {
                user_id: userId,
                module_id: module.id,
                exam_best_score: mod.exam_score,
              },
              { onConflict: 'user_id,module_id' }
            )

          if (error) {
            results.errors.push(`Module ${mod.module_code}: ${error.message}`)
          } else {
            results.modules_synced++
          }
        }
      }
    }

    return results
  },



  /**
   * Server-authoritative construct mastery snapshot.
   *
   * Service-role client ishlatilgani uchun userId explicit filter majburiy.
   * Read model answer key yoki savol matnini qaytarmaydi.
   */
  async getMastery(userId: string): Promise<MasteryResponse> {
    const { data: rows, error } = await supabase
      .from('user_construct_stats')
      .select(
        'construct_id, attempts, correct, mastery_status, review_stage, interval_days, due_at, last_seen_at, independent_attempts, guided_attempts, retry_attempts, bilish_attempts, bilish_correct, qollash_attempts, qollash_correct, mulohaza_attempts, mulohaza_correct'
      )
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false, nullsFirst: false })

    if (error) {
      // T-034 migration productionga hali qo'llanmagan bo'lsa eski schema
      // ustunlarni topa olmaydi. Bu holatni fake mastery bilan yashirmaymiz.
      throw new Error(`Mastery ma'lumotlarini olishda xatolik: ${error.message}`)
    }

    const constructIds = (rows ?? []).map(row => row.construct_id)
    const constructBy = new Map<
      string,
      { id: string; code: string; group_code: string; title_uz: string }
    >()

    if (constructIds.length > 0) {
      const { data: constructs, error: constructError } = await supabase
        .from('constructs')
        .select('id, code, group_code, title_uz')
        .in('id', constructIds)

      if (constructError) {
        throw new Error(
          `Mastery konstruktlarini olishda xatolik: ${constructError.message}`
        )
      }

      for (const construct of constructs ?? []) {
        constructBy.set(construct.id, construct)
      }
    }

    const now = Date.now()
    const items: MasteryItemResponse[] = (rows ?? []).map(row => {
      const construct = constructBy.get(row.construct_id)
      const attempts = Number(row.attempts ?? 0)
      const correct = Number(row.correct ?? 0)
      const status = row.mastery_status as MasteryStatus

      return {
        construct_id: row.construct_id,
        code: construct?.code ?? '',
        group_code: construct?.group_code ?? '',
        title_uz: construct?.title_uz ?? '',
        mastery_status: status,
        attempts,
        correct,
        accuracy_percent:
          attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
        review_stage: Number(row.review_stage ?? 0),
        interval_days: Number(row.interval_days ?? 0),
        due_at: row.due_at ?? null,
        last_seen_at: row.last_seen_at ?? null,
        independent_attempts: Number(row.independent_attempts ?? 0),
        guided_attempts: Number(row.guided_attempts ?? 0),
        retry_attempts: Number(row.retry_attempts ?? 0),
        cognitive: {
          bilish: {
            attempts: Number(row.bilish_attempts ?? 0),
            correct: Number(row.bilish_correct ?? 0),
          },
          qollash: {
            attempts: Number(row.qollash_attempts ?? 0),
            correct: Number(row.qollash_correct ?? 0),
          },
          mulohaza: {
            attempts: Number(row.mulohaza_attempts ?? 0),
            correct: Number(row.mulohaza_correct ?? 0),
          },
        },
      }
    })

    return {
      items,
      summary: {
        tracked: items.length,
        learning: items.filter(item => item.mastery_status === 'learning').length,
        provisional: items.filter(item => item.mastery_status === 'provisional').length,
        stable: items.filter(item => item.mastery_status === 'stable').length,
        regressed: items.filter(item => item.mastery_status === 'regressed').length,
        due: items.filter(
          item => item.due_at !== null && Date.parse(item.due_at) <= now
        ).length,
      },
    }
  },


  /**
   * Blueprint-weighted readiness estimate and one clear next action.
   *
   * Only independent evidence participates in readiness. Missing blueprint
   * groups lower confidence/coverage instead of being scored as wrong.
   */
  async getReadiness(userId: string): Promise<ReadinessResponse> {
    const unavailable = (
      reason: ReadinessResponse['unavailable_reason']
    ): ReadinessResponse => ({
      available: false,
      readiness_percent: null,
      confidence: 'insufficient',
      independent_evidence: 0,
      covered_blueprint_questions: 0,
      total_blueprint_questions: 50,
      coverage_percent: 0,
      due_reviews: 0,
      regressed_constructs: 0,
      next_action: {
        kind: 'diagnostic',
        href: '/exam/diagnostika',
        label: 'Diagnostikani boshlash',
        reason: 'Boshlang‘ich tayyorgarlik darajasini aniqlash kerak.',
      },
      unavailable_reason: reason,
    })

    const { data: blueprint, error: blueprintError } = await supabase
      .from('blueprints')
      .select('id, total_questions')
      .eq('is_active', true)
      .maybeSingle()

    if (blueprintError || !blueprint) {
      return unavailable('no_active_blueprint')
    }

    const { data: quotas, error: quotaError } = await supabase
      .from('blueprint_quotas')
      .select('group_code, question_count')
      .eq('blueprint_id', blueprint.id)
      .order('order_idx', { ascending: true })

    if (quotaError) {
      throw new Error(`Readiness blueprintini olishda xatolik: ${quotaError.message}`)
    }

    const { data: evidenceRows, error: evidenceError } = await supabase
      .from('mastery_evidence')
      .select('construct_id, is_correct, evidence_kind')
      .eq('user_id', userId)
      .eq('evidence_kind', 'independent')

    if (evidenceError) {
      const message = evidenceError.message.toLowerCase()
      const schemaPending =
        evidenceError.code === '42P01' ||
        evidenceError.code === 'PGRST205' ||
        message.includes('mastery_evidence') &&
          (message.includes('does not exist') || message.includes('schema cache'))

      if (schemaPending) return unavailable('mastery_schema_pending')

      throw new Error(
        `Readiness evidence'ini olishda xatolik: ${evidenceError.message}`
      )
    }

    const constructIds = [
      ...new Set((evidenceRows ?? []).map(row => row.construct_id)),
    ]
    const groupByConstruct = new Map<string, string>()

    if (constructIds.length > 0) {
      const { data: constructs, error: constructError } = await supabase
        .from('constructs')
        .select('id, group_code')
        .in('id', constructIds)

      if (constructError) {
        throw new Error(
          `Readiness konstruktlarini olishda xatolik: ${constructError.message}`
        )
      }

      for (const construct of constructs ?? []) {
        groupByConstruct.set(construct.id, construct.group_code)
      }
    }

    const evidence: IndependentEvidence[] = (evidenceRows ?? [])
      .map(row => {
        const groupCode = groupByConstruct.get(row.construct_id)
        if (!groupCode) return null
        return {
          group_code: groupCode,
          is_correct: Boolean(row.is_correct),
        }
      })
      .filter((row): row is IndependentEvidence => row !== null)

    const { data: stats, error: statsError } = await supabase
      .from('user_construct_stats')
      .select('mastery_status, due_at')
      .eq('user_id', userId)

    if (statsError) {
      const message = statsError.message.toLowerCase()
      if (
        statsError.code === '42703' ||
        message.includes('mastery_status') &&
          (message.includes('does not exist') || message.includes('schema cache'))
      ) {
        return unavailable('mastery_schema_pending')
      }
      throw new Error(
        `Readiness progressini olishda xatolik: ${statsError.message}`
      )
    }

    const now = Date.now()
    const dueReviews = (stats ?? []).filter(
      row => row.due_at !== null && Date.parse(row.due_at) <= now
    ).length
    const regressedConstructs = (stats ?? []).filter(
      row => row.mastery_status === 'regressed'
    ).length

    const calculation = calculateReadiness({
      quotas: (quotas ?? []).map(quota => ({
        group_code: quota.group_code,
        question_count: Number(quota.question_count),
      })),
      evidence,
      dueReviews,
      regressedConstructs,
    })

    return {
      available: true,
      ...calculation,
      due_reviews: dueReviews,
      regressed_constructs: regressedConstructs,
      total_blueprint_questions:
        Number(blueprint.total_questions) || calculation.total_blueprint_questions,
      unavailable_reason: null,
    }
  },

  /**
   * Get all module progress for a user.
   */
  async getModuleProgress(userId: string): Promise<ModuleProgressResponse[]> {
    const { data: modules } = await supabase
      .from('modules')
      .select('id, code, title_uz, order_idx')
      .eq('status', 'published')
      .order('order_idx', { ascending: true })

    if (!modules) return []

    const { data: userProgress } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId)

    const progressMap = new Map((userProgress || []).map(p => [p.module_id, p]))

    // Get topic counts from lessons
    const { data: lessons } = await supabase
      .from('lessons')
      .select('module_id, id')
      .eq('status', 'published')

    const lessonCountMap = new Map<string, number>()
    for (const lesson of lessons || []) {
      lessonCountMap.set(lesson.module_id, (lessonCountMap.get(lesson.module_id) || 0) + 1)
    }

    // Get completed topic counts from user_lesson_progress
    const { data: completedLessons } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)

    const completedSet = new Set((completedLessons || []).map(cl => cl.lesson_id))

    // Build map of module_id → how many of its lessons are completed
    const completedByModule = new Map<string, number>()
    for (const [modId] of lessonCountMap) {
      completedByModule.set(modId, 0)
    }
    for (const lesson of lessons || []) {
      if (completedSet.has(lesson.id)) {
        completedByModule.set(lesson.module_id, (completedByModule.get(lesson.module_id) || 0) + 1)
      }
    }

    return modules.map(mod => {
      const totalTopics = lessonCountMap.get(mod.id) || 0
      const progress = progressMap.get(mod.id)

      return {
        module_id: mod.id,
        module_code: mod.code || '',
        module_title: mod.title_uz,
        exam_best_score: progress?.exam_best_score ?? null,
        completed_at: progress?.completed_at ?? null,
        unlocked_at: progress?.unlocked_at ?? new Date().toISOString(),
        topic_count: totalTopics,
        completed_topics: completedByModule.get(mod.id) || 0,
      }
    })
  },
}
