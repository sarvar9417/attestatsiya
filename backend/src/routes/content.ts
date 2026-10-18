import type { FastifyInstance } from 'fastify'
import { contentService } from '../services/content.service.js'
import { moduleListSchema, moduleDetailSchema, lessonDetailSchema, lessonQuestionsSchema, checkAnswerSchema } from '../schemas/content.js'
import { sendError } from '../lib/errors.js'

export async function contentRoutes(app: FastifyInstance) {
  /**
   * GET /api/content/modules
   * List all published modules
   */
  app.get('/api/content/modules', async (req, reply) => {
    try {
      const { status, section } = moduleListSchema.querystring.parse(req.query)
      const result = await contentService.listModules(section, status)
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
   * Legacy immediate-feedback route is permanently disabled.
   * The same published question pool is used by official, server-scored exams;
   * returning correct_option_id here leaks exam keys without even requiring
   * an authenticated, completed attempt. Learn/test in /api/exam instead.
   */
  app.post('/api/content/questions/check', async (req, reply) => {
    checkAnswerSchema.body.parse(req.body)
    reply.header('Cache-Control', 'no-store')
    return reply.status(410).send({
      error: {
        code: 'DIRECT_KEY_CHECK_DISABLED',
        message: 'Savol javobi faqat serverda baholanadigan sinov yakunida ko‘rsatiladi.',
      },
    })
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
