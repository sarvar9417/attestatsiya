/**
 * Backend API Gateway
 *
 * Implements ExamGateway interface using the Fastify backend API.
 * ExamRunner barcha exam trafigini shu gateway orqali backend
 * serverga yuboradi (to'g'ridan-to'g'ri Supabase RPC ishlatilmaydi).
 *
 * Benefits:
 * - Server-authoritative timer & validation
 * - Additional rate limiting & audit logging
 * - Future: analytics, caching, webhooks
 */

import { z } from 'zod'
import type { CustomExamConfig } from '../custom-test/customTestApi'
import { sessionStore } from '../auth/sessionStore'
import { api, ApiError, isNetworkError } from '../../lib/apiClient'
import {
  examSessionSchema,
  examReviewResponseSchema,
  examHistoryResponseSchema,
  examResultDetailSchema,
  dueReviewResponseSchema,
  finishExamResponseSchema,
  submitAnswerResponseSchema,
  type DueReviewItem,
  type ExamHistoryResponse,
  type ExamResultDetail,
  type ExamReviewItem,
  type ExamSession,
  type FinishExamResponse,
  type SubmitAnswerResponse,
} from './contracts'
import type { SubmitAnswerInput, ExamGateway, TopicTestPreview } from './examGateway'
import type { AXBChapter } from '../axb/chapters'
import { getTopicTestPreflight } from '../content/contentApi'
import {
  enqueuePendingAnswer,
  listPendingAnswers,
  removePendingAnswer,
  acknowledgePendingAnswer,
  flushPendingAnswers,
  type FlushPendingAnswersResult,
} from './offlineAnswerQueue'

/**
 * Parse and validate backend API response using Zod schema.
 */
function parseResponse<T>(
  schema: z.ZodType<T>,
  payload: unknown,
  operation: string
): T {
  const parsed = schema.safeParse(payload)
  if (parsed.success) return parsed.data

  const issues = parsed.error.issues
    .map(i => `${i.path.join('.')}: ${i.message}`)
    .join('; ')
  // eslint-disable-next-line no-console
  console.error(`[backendGateway] Invalid response for ${operation}:`, issues)
  throw new Error(`Server javobi xavfsizlik tekshiruvidan o‘tmadi: ${issues}`)
}

async function sendAnswerToServer(
  input: SubmitAnswerInput
): Promise<SubmitAnswerResponse> {
  const data = await api.post<unknown>('/api/exam/submit', {
    exam_id: input.examId,
    question_id: input.questionId,
    answer: input.answer,
    time_spent_sec: input.timeSpentSec,
  })

  return parseResponse(submitAnswerResponseSchema, data, 'submit_answer')
}

const offlineFlushes = new Map<string, Promise<FlushPendingAnswersResult>>()

/** Coalesce reconnects per account and exam; never finish another exam's queue. */
export function flushOfflineAnswers(examId?: string): Promise<FlushPendingAnswersResult> {
  const key = `${sessionStore.get()?.user.id ?? ''}:${examId ?? '*'}`
  const existing = offlineFlushes.get(key)
  if (existing) return existing
  const promise = flushPendingAnswers(sendAnswerToServer, examId).finally(() => {
    offlineFlushes.delete(key)
  })
  offlineFlushes.set(key, promise)
  return promise
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void flushOfflineAnswers().catch(() => { /* Preserve the queue if storage is unavailable. */ })
  })
}

export const axbChaptersSchema = z.array(z.object({
  chapter_no: z.number().int().min(1).max(19),
  total_pdf: z.literal(30),
  published_count: z.number().int().nonnegative().max(30),
  review_count: z.number().int().nonnegative().max(30),
}).strict().refine(row => row.published_count + row.review_count <= row.total_pdf, {
  message: 'Bobdagi nashr/tekshiruv savollari umumiy sondan oshdi',
})).length(19).superRefine((rows, ctx) => {
  const found = new Set<number>()
  for (const [index, row] of rows.entries()) {
    if (found.has(row.chapter_no)) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'chapter_no'],
        message: 'Takrorlangan AXB bobi',
      })
    }
    found.add(row.chapter_no)
  }
  for (let chapter = 1; chapter <= 19; chapter++) {
    if (!found.has(chapter)) {
      ctx.addIssue({ code: 'custom', message: `AXB ${chapter}-bob mavjud emas` })
    }
  }
})

export const backendGateway: ExamGateway = {
  getPendingAnswer(examId, questionId) {
    return listPendingAnswers().find(item => item.examId === examId && item.questionId === questionId)?.answer
  },
  queueMockAnswer(input) {
    if (input.examKind !== 'mock') throw new Error('Faqat mock sinovda avtomatik saqlanadi.')
    const ownerId = sessionStore.get()?.user.id
    if (!ownerId) throw new Error('Javobni saqlash uchun hisobga kiring.')
    enqueuePendingAnswer(input, ownerId)
  },
  async flushQueuedAnswers(examId) {
    const state = await flushOfflineAnswers(examId)
    return { remaining: state.remaining }
  },
  async startCustomExam(config: CustomExamConfig): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/custom-tests/start', config)
    return parseResponse(examSessionSchema, data, 'start_custom')
  },

  async getAxborotChapters(): Promise<AXBChapter[]> {
    const data = await api.get<unknown>('/api/exam/axb/chapters')
    return parseResponse(axbChaptersSchema, data, 'axb_chapters')
  },
  async startAxborotChapter(chapter: number, count: number): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/exam/axb/start', {
      chapter_no: chapter, question_count: count,
    })
    return parseResponse(examSessionSchema, data, 'axb_chapter_start')
  },

  async startMockExam(): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/exam/start', { kind: 'mock' })
    return parseResponse(examSessionSchema, data, 'start_mock')
  },

  async startModuleExam(moduleCode: string): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/exam/start', {
      kind: 'bolim',
      module_id: moduleCode, // backend resolves code → UUID
    })
    return parseResponse(examSessionSchema, data, 'start_module')
  },

  async startTopicExam(subtopicCode: string): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/exam/start', {
      kind: 'mavzu',
      lesson_id: subtopicCode, // backend resolves code → UUID
    })
    return parseResponse(examSessionSchema, data, 'start_topic')
  },

  async startFocusedExam(
    kind: 'diagnostika' | 'mashq' | 'takrorlash' | 'zaif' | 'pedagogik_15',
    lessonId?: string
  ): Promise<ExamSession> {
    const data = await api.post<unknown>('/api/exam/start', {
      kind,
      ...(lessonId ? { lesson_id: lessonId } : {}),
    })
    return parseResponse(examSessionSchema, data, `start_${kind}`)
  },

  async previewTopicTest(lessonId: string): Promise<TopicTestPreview | null> {
    try {
      const status = await getTopicTestPreflight(lessonId)
      return {
        questionCount: status.required,
        durationSec: status.duration_sec,
        ready: status.ready,
        available: status.available,
        reason: status.reason,
        criticalObjectiveGaps: status.critical_objective_gaps,
        missingRequiredObjectives: status.missing_required_objectives,
      }
    } catch {
      // A failed readiness request must never be interpreted as available.
      return null
    }
  },

  async submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResponse> {
    const ownerId = sessionStore.get()?.user.id
    const pending = listPendingAnswers().find(item =>
      item.examId === input.examId && item.questionId === input.questionId)
    const firstAttempt = input.examKind === 'mock' ? input : (pending ?? input)
    try {
      const response = await sendAnswerToServer(firstAttempt)
      if (ownerId) {
        if (pending && input.examKind === 'mock') acknowledgePendingAnswer(pending, ownerId)
        else removePendingAnswer(input.examId, input.questionId, ownerId)
      }
      return response
    } catch (error) {
      if (isNetworkError(error) && ownerId) {
        // Auth token yoki answer key saqlanmaydi — faqat user answer payload.
        // Mock: oxirgi tanlov; qolgan turlar: birinchi offline javob.
        enqueuePendingAnswer(firstAttempt, ownerId)
        throw new ApiError('Internet uzildi. Javob shu qurilmada saqlandi; ulanish tiklangach qayta yuboriladi.', 0, 'NETWORK_ERROR')
      }
      throw error
    }
  },

  async finishExam(examId: string): Promise<FinishExamResponse> {
    const ownerId = sessionStore.get()?.user.id
    const pending = await flushOfflineAnswers(examId)
    if (sessionStore.get()?.user.id !== ownerId) {
      throw new ApiError('Hisob o‘zgardi. Sahifani qayta oching.', 409, 'SESSION_CHANGED')
    }
    if (pending.remaining > 0) {
      throw new ApiError('Javoblar hali serverga saqlanmadi. Internetga ulanib, yakunlashni qayta bosing.', 409, 'PENDING_ANSWERS')
    }
    const data = await api.post<unknown>('/api/exam/finish', { exam_id: examId })
    return parseResponse(finishExamResponseSchema, data, 'finish_exam')
  },

  async getReview(examId: string): Promise<ExamReviewItem[]> {
    const data = await api.get<unknown>(`/api/exam/${examId}/review`)
    return parseResponse(examReviewResponseSchema, data, 'exam_review')
  },

  async getResult(examId: string): Promise<ExamResultDetail> {
    const data = await api.get<unknown>(`/api/exam/${examId}/result`)
    return parseResponse(examResultDetailSchema, data, 'exam_result_detail')
  },

  async getHistory(page = 1, pageSize = 20): Promise<ExamHistoryResponse> {
    const data = await api.get<unknown>(
      `/api/exam/history?page=${page}&page_size=${pageSize}`
    )
    return parseResponse(examHistoryResponseSchema, data, 'exam_history')
  },

  async getDueReviews(): Promise<DueReviewItem[]> {
    const data = await api.get<unknown>('/api/exam/due-reviews')
    return parseResponse(dueReviewResponseSchema, data, 'due_reviews')
  },
}
