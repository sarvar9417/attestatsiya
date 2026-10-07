import { z } from 'zod'

// ─── Sync Progress ──────────────────────────────────────────────
export const syncProgressSchema = {
  body: z.object({
    topics: z.array(
      z.object({
        subtopic_code: z.string().min(1),
        completed: z.boolean(),
        correct_count: z.number().int().nonnegative(),
        total_count: z.number().int().positive(),
        last_score: z.number().int().min(0).max(100),
      })
    ).optional(),
    module_scores: z.array(
      z.object({
        module_code: z.string().min(1),
        exam_score: z.number().int().nonnegative(),
      })
    ).optional(),
  }),
}

export type SyncProgressInput = z.infer<typeof syncProgressSchema.body>

// ─── Due Reviews ────────────────────────────────────────────────
export interface DueReviewItem {
  construct_id: string
  title_uz: string
  group_code: string
  due_at: string | null
  accuracy: number
}

// ─── Module Progress ────────────────────────────────────────────
export interface ModuleProgressResponse {
  module_id: string
  module_code: string
  module_title: string
  exam_best_score: number | null
  completed_at: string | null
  unlocked_at: string
  topic_count: number
  completed_topics: number
}


// ─── Mastery / SRS ─────────────────────────────────────────────
export type MasteryStatus = 'learning' | 'provisional' | 'stable' | 'regressed'

export interface MasteryCognitiveStats {
  attempts: number
  correct: number
}

export interface MasteryItemResponse {
  construct_id: string
  code: string
  group_code: string
  title_uz: string
  mastery_status: MasteryStatus
  attempts: number
  correct: number
  accuracy_percent: number
  review_stage: number
  interval_days: number
  due_at: string | null
  last_seen_at: string | null
  independent_attempts: number
  guided_attempts: number
  retry_attempts: number
  cognitive: {
    bilish: MasteryCognitiveStats
    qollash: MasteryCognitiveStats
    mulohaza: MasteryCognitiveStats
  }
}

export interface MasterySummaryResponse {
  tracked: number
  learning: number
  provisional: number
  stable: number
  regressed: number
  due: number
}

export interface MasteryResponse {
  items: MasteryItemResponse[]
  summary: MasterySummaryResponse
}


// ─── Readiness / Next action ───────────────────────────────────
export type ReadinessConfidence = 'insufficient' | 'low' | 'medium' | 'high'
export type ReadinessNextActionKind = 'review' | 'weak' | 'diagnostic' | 'learn'

export interface ReadinessResponse {
  available: boolean
  readiness_percent: number | null
  confidence: ReadinessConfidence
  independent_evidence: number
  covered_blueprint_questions: number
  total_blueprint_questions: number
  coverage_percent: number
  due_reviews: number
  regressed_constructs: number
  next_action: {
    kind: ReadinessNextActionKind
    href: string
    label: string
    reason: string
  }
  unavailable_reason: 'mastery_schema_pending' | 'no_active_blueprint' | null
}
