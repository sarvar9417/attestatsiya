import type { FastifyInstance } from 'fastify'
import { contentService } from '../services/content.service.js'
import { moduleListSchema, moduleDetailSchema, lessonDetailSchema, lessonQuestionsSchema, checkAnswerSchema } from '../schemas/content.js'
import { AppError, sendError } from '../lib/errors.js'

export async function contentRoutes(app: FastifyInstance) {
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
