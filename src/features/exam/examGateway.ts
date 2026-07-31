import type { Json } from '../../lib/database.types'
import type {
  DueReviewItem,
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

export type ExamKind = 'mock' | 'bolim' | 'mavzu' | 'takrorlash' | 'zaif'

/**
 * Mavzu testi uchun boshlashdan oldin ko'rsatiladigan ma'lumot:
 * dars pool'idagi savollar soni (≤20) va umumiy vaqt (savol × 2 daqiqa).
 */
export interface TopicTestPreview {
  questionCount: number
  durationSec: number
}

export interface ExamGateway {
  startMockExam(): Promise<ExamSession>
  startModuleExam(moduleId: string): Promise<ExamSession>
  startTopicExam(lessonId: string): Promise<ExamSession>
  /** Intro ekranda vaqt cheklovini ko'rsatish uchun (mavzu testi). */
  previewTopicTest?(lessonId: string): Promise<TopicTestPreview | null>
  submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResponse>
  finishExam(examId: string): Promise<FinishExamResponse>
  getReview(examId: string): Promise<ExamReviewItem[]>
  getDueReviews(): Promise<DueReviewItem[]>
}
