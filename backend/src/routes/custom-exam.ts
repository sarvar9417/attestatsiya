import type { FastifyInstance } from 'fastify'
import { customExamConfigSchema } from '../schemas/custom-exam.js'
import { customExamService } from '../services/custom-exam.service.js'
import { presetPayloadSchema, presetUpdateSchema, presetIdSchema } from '../schemas/custom-presets.js'
import { customPresetService } from '../services/custom-presets.service.js'
import { sendError, AppError } from '../lib/errors.js'

function requireToken(request: { headers: { authorization?: string } }): string {
  const auth = request.headers.authorization
  if (!auth?.startsWith('Bearer ') || auth.slice(7).length === 0) {
    throw new AppError('Avtorizatsiya kerak', 401, 'TOKEN_REQUIRED')
  }
  return auth.slice(7)
}

export async function customExamRoutes(app: FastifyInstance) {
  app.get('/api/custom-tests/catalog', async (request, reply) => {
    try {
      return reply.send(await customExamService.catalog(requireToken(request)))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/api/custom-tests/preflight', async (request, reply) => {
    try {
      const config = customExamConfigSchema.parse(request.body)
      return reply.send(await customExamService.preview(config, requireToken(request)))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/api/custom-tests/start', async (request, reply) => {
    try {
      const config = customExamConfigSchema.parse(request.body)
      return reply.send(await customExamService.start(config, requireToken(request)))
    } catch (error) {
      return sendError(reply, error)
    }
  })
  app.get('/api/custom-tests/presets', async (request, reply) => {
    try { return reply.send(await customPresetService.list(requireToken(request))) }
    catch (error) { return sendError(reply,error) }
  })
  app.post('/api/custom-tests/presets', async (request, reply) => {
    try {
      const input=presetPayloadSchema.parse(request.body)
      return reply.status(201).send(await customPresetService.create(requireToken(request),input))
    } catch(error) { return sendError(reply,error) }
  })
  app.patch('/api/custom-tests/presets/:id', async (request, reply) => {
    try {
      const {id}=presetIdSchema.parse(request.params)
      const input=presetUpdateSchema.parse(request.body)
      return reply.send(await customPresetService.update(requireToken(request),id,input))
    } catch(error) { return sendError(reply,error) }
  })
  app.delete('/api/custom-tests/presets/:id', async (request, reply) => {
    try {
      const {id}=presetIdSchema.parse(request.params)
      return reply.send(await customPresetService.remove(requireToken(request),id))
    } catch(error) { return sendError(reply,error) }
  })

}
