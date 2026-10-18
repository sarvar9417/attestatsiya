import type { CustomExamConfig } from '../custom-test/customTestApi'
import type { Json } from '../../lib/database.types'
import type {
  DueReviewItem,
  ExamHistoryResponse,
  ExamResultDetail,
  ExamReviewItem,
  ExamSession,
  FinishExamResponse,
  SubmitAnswerResponse,
} from './contracts'

export interface SubmitAnswerInput {
  examId: string
  examKind: ExamSession['kind']
  questionId: string
  answer: Json
  timeSpentSec: number
}

export type ExamKind = 'mock' | 'bolim' | 'mavzu' | 'mashq' | 'diagnostika' | 'takrorlash' | 'zaif' | 'pedagogik_15'

/**
 * Mavzu testi uchun boshlashdan oldin ko'rsatiladigan ma'lumot:
 * dars pool'idagi savollar soni (≤20) va umumiy vaqt (savol × 2 daqiqa).
 */
export interface TopicTestPreview {
  questionCount: number
  durationSec: number
  /** True only when the server verified the full blueprint, not merely sample count. */
  ready: boolean
  available: number
  reason: 'ready' | 'pool_insufficient' | 'objective_gap' | 'blueprint_missing' | 'blueprint_invalid'
  criticalObjectiveGaps: string[]
  missingRequiredObjectives: string[]
}

export interface ExamGateway {
  startMockExam(): Promise<ExamSession>
  startCustomExam?(config: CustomExamConfig): Promise<ExamSession>
  startModuleExam(moduleId: string): Promise<ExamSession>
  startTopicExam(lessonId: string): Promise<ExamSession>
  /** Server-calculated diagnostic/adaptive/review/weak-area sessionini boshlaydi. */
  startFocusedExam?(
    kind: 'diagnostika' | 'mashq' | 'takrorlash' | 'zaif' | 'pedagogik_15',
    lessonId?: string
  ): Promise<ExamSession>
  /** Intro ekranda vaqt cheklovini ko'rsatish uchun (mavzu testi). */
  previewTopicTest?(lessonId: string): Promise<TopicTestPreview | null>
  submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResponse>
  finishExam(examId: string): Promise<FinishExamResponse>
  getReview(examId: string): Promise<ExamReviewItem[]>
  getResult(examId: string): Promise<ExamResultDetail>
  getHistory(page?: number, pageSize?: number): Promise<ExamHistoryResponse>
  getDueReviews(): Promise<DueReviewItem[]>
}
