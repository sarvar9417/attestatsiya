import type { FastifyInstance } from 'fastify'
import { customExamConfigSchema } from '../schemas/custom-exam.js'
import { customExamService } from '../services/custom-exam.service.js'
import { customPresetService } from '../services/custom-preset.service.js'
import { createCustomPresetSchema, patchCustomPresetSchema, customPresetIdSchema } from '../schemas/custom-preset.js'
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
    try {
      return reply.send(await customPresetService.list(requireToken(request)))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/api/custom-tests/presets', async (request, reply) => {
    try {
      const token = requireToken(request)
      const input = createCustomPresetSchema.parse(request.body)
      return reply.status(201).send(await customPresetService.create(input, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.patch('/api/custom-tests/presets/:id', async (request, reply) => {
    try {
      const token = requireToken(request)
      const { id } = customPresetIdSchema.parse(request.params)
      const patch = patchCustomPresetSchema.parse(request.body)
      return reply.send(await customPresetService.update(id, patch, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.delete('/api/custom-tests/presets/:id', async (request, reply) => {
    try {
      const token = requireToken(request)
      const { id } = customPresetIdSchema.parse(request.params)
      return reply.send(await customPresetService.remove(id, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
