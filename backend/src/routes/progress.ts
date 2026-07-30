import type { FastifyInstance } from 'fastify'
import { progressService } from '../services/progress.service.js'
import { syncProgressSchema } from '../schemas/progress.js'
import { sendError, AppError } from '../lib/errors.js'
import { supabase } from '../lib/supabase.js'

/**
 * Extract the Supabase auth token from the Authorization header.
 */
function getToken(req: { headers: { authorization?: string } }): string | null {
  return req.headers.authorization?.replace('Bearer ', '') ?? null
}

/**
 * Verify the Supabase auth token and return the user.
 * Throws AppError if the token is invalid.
 */
async function requireAuth(req: { headers: { authorization?: string } }) {
  const token = getToken(req)
  if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) throw new AppError('Yaroqsiz token', 401, 'INVALID_TOKEN')

  return { user, token }
}

export async function progressRoutes(app: FastifyInstance) {
  /**
   * POST /api/progress/sync
   * Sync client-side progress to server
   */
  app.post('/api/progress/sync', async (req, reply) => {
    const input = syncProgressSchema.body.parse(req.body)

    try {
      const { user, token } = await requireAuth(req)
      const result = await progressService.sync(user.id, token, input)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/progress/modules
   * Get module progress for the authenticated user
   */
  app.get('/api/progress/modules', async (req, reply) => {
    try {
      const { user } = await requireAuth(req)
      const result = await progressService.getModuleProgress(user.id)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
