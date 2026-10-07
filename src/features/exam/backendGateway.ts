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
import { api, isNetworkError } from '../../lib/apiClient'
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
import { getLessonQuestions } from '../content/contentApi'
import {
  enqueuePendingAnswer,
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

let offlineFlushInFlight: Promise<FlushPendingAnswersResult> | null = null

/**
 * Public helper for app bootstrap/tests. Parallel reconnect events bitta flush
 * promise'ga birlashtiriladi; shu sabab duplicate burst yuborilmaydi.
 */
export function flushOfflineAnswers(): Promise<FlushPendingAnswersResult> {
  if (!offlineFlushInFlight) {
    offlineFlushInFlight = flushPendingAnswers(sendAnswerToServer).finally(() => {
      offlineFlushInFlight = null
    })
  }
  return offlineFlushInFlight
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void flushOfflineAnswers()
  })
}

export const backendGateway: ExamGateway = {
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

  async previewTopicTest(lessonId: string): Promise<TopicTestPreview | null> {
    try {
      const questions = await getLessonQuestions(lessonId)
      if (questions.length === 0) return null
      // Server RPC bilan bir xil qoida: dars pool'idan max 20 ta,
      // umumiy vaqt = savollar soni × 2 daqiqa.
      const count = Math.min(questions.length, 20)
      return { questionCount: count, durationSec: count * 120 }
    } catch {
      return null
    }
  },

  async submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResponse> {
    try {
      return await sendAnswerToServer(input)
    } catch (error) {
      if (isNetworkError(error)) {
        // Auth token yoki answer key saqlanmaydi — faqat user answer payload.
        // Bir savol uchun birinchi offline urinish immutable saqlanadi.
        enqueuePendingAnswer(input)
      }
      throw error
    }
  },

  async finishExam(examId: string): Promise<FinishExamResponse> {
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
