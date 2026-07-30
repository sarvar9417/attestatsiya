import { z } from 'zod'
import { monitoring } from '../../lib/monitoring'
import { typedSupabase } from '../../lib/supabase'
import { resolveModuleUuid, resolveLessonUuid } from '../../lib/resolveIds'
import type { Database, Json } from '../../lib/database.types'
import {
  examSessionSchema,
  finishExamResponseSchema,
  protectedSubmitAnswerResponseSchema,
  submitAnswerResponseSchema,
  type ExamSession,
  type FinishExamResponse,
  type SubmitAnswerResponse,
} from './contracts'

export interface SubmitAnswerInput {
  examId: string
  examKind: ExamSession['kind']
  questionId: string
  answer: Json
  timeSpentSec: number
}

export type ExamKind = 'mock' | 'bolim' | 'mavzu' | 'takrorlash' | 'zaif'

export interface ExamGateway {
  startMockExam(): Promise<ExamSession>
  startModuleExam(moduleId: string): Promise<ExamSession>
  startTopicExam(lessonId: string): Promise<ExamSession>
  submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResponse>
  finishExam(examId: string): Promise<FinishExamResponse>
}

export class ExamGatewayError extends Error {
  constructor(
    message: string,
    readonly code: 'insufficient-pool' | 'invalid-response' | 'request-failed'
  ) {
    super(message)
    this.name = 'ExamGatewayError'
  }
}

function requestError(message: string): ExamGatewayError {
  if (
    message.includes('savol_yetarli_emas') ||
    message.includes('savol_yoq')
  ) {
    return new ExamGatewayError(
      'Sinovni boshlash uchun savollar bazasi hali yetarli emas.',
      'insufficient-pool'
    )
  }

  return new ExamGatewayError(
    'Server bilan aloqa amalga oshmadi. Qayta urinib ko‘ring.',
    'request-failed'
  )
}

function parseResponse<T>(
  schema: z.ZodType<T>,
  payload: unknown,
  operation: string
): T {
  const parsed = schema.safeParse(payload)

  if (parsed.success) return parsed.data

  monitoring.captureException(new Error('Invalid exam RPC response'), {
    area: 'exam.gateway',
    operation,
    issues: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      code: issue.code,
    })),
  })

  throw new ExamGatewayError(
    'Server javobi xavfsizlik tekshiruvidan o‘tmadi.',
    'invalid-response'
  )
}

export const supabaseExamGateway: ExamGateway = {
  async startMockExam() {
    return startExam('mock')
  },

  async startModuleExam(moduleCode: string) {
    const moduleUuid = await resolveModuleUuid(moduleCode)
    if (!moduleUuid) {
      throw new ExamGatewayError(
        `"${moduleCode}" moduli topilmadi. Kontent bazasida mavjud emas.`,
        'insufficient-pool'
      )
    }
    return startExam('bolim', moduleUuid)
  },

  async startTopicExam(subtopicCode: string) {
    const lessonUuid = await resolveLessonUuid(subtopicCode)
    if (!lessonUuid) {
      throw new ExamGatewayError(
        `"${subtopicCode}" mavzusi topilmadi.`,
        'insufficient-pool'
      )
    }
    const { data, error } = await typedSupabase.rpc('generate_topic_test', {
      p_lesson_id: lessonUuid,
    })

    if (error) throw requestError(error.message)
    return parseResponse(examSessionSchema, data, 'generate_topic_test')
  },

  async submitAnswer({
    examId,
    examKind,
    questionId,
    answer,
    timeSpentSec,
  }) {
    const { data, error } = await typedSupabase.rpc('submit_answer', {
      p_exam_id: examId,
      p_question_id: questionId,
      p_answer: answer,
      p_time_spent: timeSpentSec,
    })

    if (error) throw requestError(error.message)
    const responseSchema =
      examKind === 'mock' || examKind === 'bolim'
        ? protectedSubmitAnswerResponseSchema
        : submitAnswerResponseSchema

    return parseResponse(responseSchema, data, 'submit_answer')
  },

  async finishExam(examId) {
    const { data, error } = await typedSupabase.rpc('finish_exam', {
      p_exam_id: examId,
    })

    if (error) throw requestError(error.message)
    return parseResponse(finishExamResponseSchema, data, 'finish_exam')
  },
}

async function startExam(
  kind: 'mock' | 'bolim',
  moduleId?: string
): Promise<ExamSession> {
  const args: Database['public']['Functions']['start_exam']['Args'] = {
    p_kind: kind,
  }
  if (moduleId) args.p_module_id = moduleId

  const { data, error } = await typedSupabase.rpc('start_exam', args)

  if (error) throw requestError(error.message)
  return parseResponse(examSessionSchema, data, 'start_exam')
}
