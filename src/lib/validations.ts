import { z } from 'zod'

// ── Enums ───────────────────────────────────────────────────────────────────

export const WordLevelEnum = z.enum(['A1', 'A2', 'B1', 'B2'])

export const RatingEnum = z.enum(['bildim', 'qiynaldim', 'bilmadim', 'yodladim'])

export const GrammarStatusEnum = z.enum(['not-started', 'practice', 'mastered'])

// ── Writing Submission ──────────────────────────────────────────────────────

export const WritingSubmissionSchema = z.object({
  userId: z.string().uuid(),
  day: z.number().int().min(1).max(365),
  prompt: z.string().min(1).max(2000),
  essay: z.string().min(1).max(10000),
  wordCount: z.number().int().min(1).max(5000),
  feedback: z.string().max(5000).optional(),
  avgScore: z.number().min(0).max(100),
  xpEarned: z.number().int().min(0).max(500),
})

export type WritingSubmissionInput = z.infer<typeof WritingSubmissionSchema>

// ── Vocabulary Word ─────────────────────────────────────────────────────────

export const VocabularyWordSchema = z.object({
  english: z.string().min(1).max(200).trim(),
  uzbek: z.string().min(1).max(200).trim(),
  example: z.string().max(500).optional(),
  phonetic: z.string().max(100).optional(),
  level: WordLevelEnum.default('A1'),
  box: z.number().int().min(0).max(6),
})

export type VocabularyWordInput = z.infer<typeof VocabularyWordSchema>

// ── Vocabulary Session ──────────────────────────────────────────────────────

export const VocabularySessionSchema = z.object({
  userId: z.string().uuid(),
  batchNumber: z.number().int().min(0).max(10),
  wordsJson: z.record(z.string(), RatingEnum),
  score: z.number().int().min(0).max(100),
  timeSpent: z.number().int().min(0).max(7200),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export type VocabularySessionInput = z.infer<typeof VocabularySessionSchema>

// ── Vocabulary Progress Upsert ──────────────────────────────────────────────

export const VocabularyProgressSchema = z.object({
  userId: z.string().uuid(),
  wordId: z.number().int().min(1),
  box: z.number().int().min(1).max(6),
  nextReview: z.string().min(1),
  correctCount: z.number().int().min(0).max(1000),
  wrongCount: z.number().int().min(0).max(1000),
  isLearned: z.boolean(),
})

export type VocabularyProgressInput = z.infer<typeof VocabularyProgressSchema>

// ── FSRS Word Push ──────────────────────────────────────────────────────────

export const FSRSWordInputSchema = z.object({
  english: z.string().min(1).max(200).trim(),
  rating: RatingEnum,
  uzbek: z.string().max(200).trim().optional(),
  example: z.string().max(500).optional(),
  level: z.string().max(10).optional(),
})

export type FSRSWordInput = z.infer<typeof FSRSWordInputSchema>

// ── Grammar Result ──────────────────────────────────────────────────────────

export const GrammarResultSchema = z.object({
  userId: z.string().uuid(),
  topicId: z.string().min(1).max(100),
  topicTitle: z.string().min(1).max(200),
  correctCount: z.number().int().min(0).max(100),
  total: z.number().int().min(1).max(100),
  xpEarned: z.number().int().min(0).max(200),
})

export type GrammarResultInput = z.infer<typeof GrammarResultSchema>

// ── Speaking Day Progress ───────────────────────────────────────────────────

export const SpeakingDayProgressSchema = z.object({
  userId: z.string().uuid(),
  day: z.number().int().min(1).max(365),
  completed: z.boolean(),
  bestSpeakScore: z.number().int().min(0).max(100).optional(),
  spokenSeconds: z.number().int().min(0).max(14400),
  completedAt: z.string().optional(),
  grammarScore: z.number().int().min(0).max(100).optional(),
  practicedLessonIds: z.array(z.string()).optional(),
})

export type SpeakingDayProgressInput = z.infer<typeof SpeakingDayProgressSchema>

// ── Speaking Chunk Grade ────────────────────────────────────────────────────

export const SpeakingChunkGradeSchema = z.object({
  userId: z.string().uuid(),
  chunkId: z.string().min(1).max(50),
  rating: RatingEnum,
})

export type SpeakingChunkGradeInput = z.infer<typeof SpeakingChunkGradeSchema>

// ── Speaking Chunk Enroll ───────────────────────────────────────────────────

export const SpeakingChunkEnrollSchema = z.object({
  userId: z.string().uuid(),
  chunkIds: z.array(z.string().min(1).max(50)).min(1).max(50),
})

export type SpeakingChunkEnrollInput = z.infer<typeof SpeakingChunkEnrollSchema>

// ── Grammar Progress Entry ──────────────────────────────────────────────────

export const GrammarProgressEntrySchema = z.object({
  lessonId: z.string().min(1).max(100),
  grammarPoint: z.string().min(1).max(200),
  level: z.string().min(1).max(10),
  status: GrammarStatusEnum,
  bestScore: z.number().int().min(0).max(100),
  practiceCount: z.number().int().min(1).max(1000),
  lastPracticedAt: z.string().optional(),
  usedInFreeMode: z.boolean(),
})

export type GrammarProgressEntryInput = z.infer<typeof GrammarProgressEntrySchema>

// ── XP Update ───────────────────────────────────────────────────────────────

export const XPUpdateSchema = z.object({
  amount: z.number().int().min(1).max(1000),
  source: z.string().min(1).max(50),
})

export type XPUpdateInput = z.infer<typeof XPUpdateSchema>

// ── Helper Functions ────────────────────────────────────────────────────────

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] }

export function validateWritingSubmission(
  input: unknown
): ValidationResult<WritingSubmissionInput> {
  const result = WritingSubmissionSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateVocabularyWord(
  input: unknown
): ValidationResult<VocabularyWordInput> {
  const result = VocabularyWordSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateGrammarResult(
  input: unknown
): ValidationResult<GrammarResultInput> {
  const result = GrammarResultSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateVocabularySession(
  input: unknown
): ValidationResult<VocabularySessionInput> {
  const result = VocabularySessionSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateSpeakingDayProgress(
  input: unknown
): ValidationResult<SpeakingDayProgressInput> {
  const result = SpeakingDayProgressSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateSpeakingChunkGrade(
  input: unknown
): ValidationResult<SpeakingChunkGradeInput> {
  const result = SpeakingChunkGradeSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}

export function validateGrammarProgressEntry(
  input: unknown
): ValidationResult<GrammarProgressEntryInput> {
  const result = GrammarProgressEntrySchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    ),
  }
}
