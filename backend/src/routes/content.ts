import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { specPracticeService } from '../services/spec-practice.service.js'
import { contentService } from '../services/content.service.js'
import { moduleListSchema, moduleDetailSchema, lessonDetailSchema, lessonQuestionsSchema, checkAnswerSchema } from '../schemas/content.js'
import { AppError, sendError } from '../lib/errors.js'

const specSectionCode = z.enum(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'KS', 'PM'])
const postgresUuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
const specParams = z.object({ code: specSectionCode }).strict()
const specAnswer = z.union([
  z.object({ option_id: postgresUuid }).strict(),
  z.object({ pairs: z.record(postgresUuid, postgresUuid) }).strict(),
  z.object({ order: z.array(postgresUuid).min(2).max(12) }).strict(),
])
function bearerToken(headers: { authorization?: string }) {
  const match = /^Bearer ([^\\s]+)$/i.exec(headers.authorization ?? '')
  if (!match) throw new AppError('Hisobga kirish talab qilinadi', 401, 'TOKEN_REQUIRED')
  return match[1]
}

export async function contentRoutes(app: FastifyInstance) {
  /** Specification 2026: main sections (NOT module/lesson-scoped tests). */
  app.get('/api/content/spec-practice/sections', async (req, reply) => {
    try {
      return reply.send(await specPracticeService.listSections(bearerToken(req.headers)))
    } catch (error) { return sendError(reply, error) }
  })

  /** Cursor pagination covers the WHOLE published bank without a 20/50 limit. */
  app.get('/api/content/spec-practice/:code/questions', async (req, reply) => {
    try {
      const { code } = specParams.parse(req.params)
      const { cursor } = z.object({ cursor: postgresUuid.optional() }).strict().parse(req.query)
      return reply.send(await specPracticeService.listQuestions(code, cursor, bearerToken(req.headers)))
    } catch (error) { return sendError(reply, error) }
  })

  /** An answer key may be revealed only AFTER an authenticated submitted answer. */
  app.post('/api/content/spec-practice/:code/answer', async (req, reply) => {
    reply.header('Cache-Control', 'no-store')
    try {
      const { code } = specParams.parse(req.params)
      const { question_id, answer } = z.object({
        question_id: postgresUuid,
        answer: specAnswer,
      }).strict().parse(req.body)
      return reply.send(await specPracticeService.checkAnswer(
        code, question_id, answer, bearerToken(req.headers),
      ))
    } catch (error) { return sendError(reply, error) }
  })

  /**
   * GET /api/content/modules
   * List all published modules
   */
  app.get('/api/content/modules', async (req, reply) => {
    try {
      const { section } = moduleListSchema.querystring.parse(req.query)
      const result = await contentService.listModules(section)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/content/modules/:id
   * Get module detail with lessons
   */
  app.get('/api/content/modules/:id', async (req, reply) => {
    try {
      const { id } = moduleDetailSchema.params.parse(req.params)
      const result = await contentService.getModule(id)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/content/lessons/:id
   * Get lesson detail with constructs and blocks
   */
  app.get('/api/content/lessons/:id', async (req, reply) => {
    try {
      const { id } = lessonDetailSchema.params.parse(req.params)
      const result = await contentService.getLesson(id)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/content/lessons/:id/topic-test-preflight
   * No answer keys or unpublished questions; never creates an exam attempt.
   */
  app.get('/api/content/lessons/:id/topic-test-preflight', async (req, reply) => {
    try {
      const { id } = lessonDetailSchema.params.parse(req.params)
      const result = await contentService.topicTestPreflight(id)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/content/lessons/:id/questions
   * Get published questions for a lesson (no keys)
   */
  app.get('/api/content/lessons/:id/questions', async (req, reply) => {
    try {
      const { id } = lessonQuestionsSchema.params.parse(req.params)
      const result = await contentService.listLessonQuestions(id)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * POST /api/content/questions/check
   * Retired: feedback must go through authenticated exam submit/review.
   * A question ID alone must never reveal answers from the shared exam bank.
   */
  app.post('/api/content/questions/check', async (req, reply) => {
    try {
      checkAnswerSchema.body.parse(req.body)
      reply.header('Cache-Control', 'no-store')
      throw new AppError('Javobni tekshirish uchun mavzu sinovini boshlang.', 410, 'PRACTICE_SESSION_REQUIRED')
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/content/constructs
   * List all constructs (competencies)
   */
  app.get('/api/content/constructs', async (req, reply) => {
    try {
      const { group_code } = req.query as { group_code?: string }
      const result = await contentService.listConstructs(group_code)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
