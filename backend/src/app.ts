import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { config } from './config.js'
import { healthRoutes } from './routes/health.js'
import { examRoutes } from './routes/exam.js'
import { progressRoutes } from './routes/progress.js'
import { contentRoutes } from './routes/content.js'
import { sendError } from './lib/errors.js'
import { authRoutes } from './routes/auth.js'
import { adminRoutes } from './routes/admin.js'

/**
 * Fastify app'ni yig'adi (plugins + routes + error handler).
 *
 * Bitta manba ikkala ish rejimida ishlatiladi:
 *  - Standart server: index.ts `app.listen()` chaqiradi
 *  - Vercel serverless: api/[...all].ts `app.server.emit('request', req, res)`
 *
 * Izoh: @fastify/rate-limit in-memory store ishlatadi — serverless'da
 * har bir cold start / instance uchun alohida bo'ladi (distributed emas).
 */
export async function buildApp() {
  const app = Fastify({
    logger: config.server.nodeEnv !== 'test',
  })

  // ─── Plugins ──────────────────────────────────────────────────
  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
    errorResponseBuilder: () => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: "So'rovlar chegarasi oshib ketdi. Iltimos, birozdan so'ng urinib ko'ring.",
      },
    }),
  })

  // ─── Routes ──────────────────────────────────────────────────
  await app.register(healthRoutes)
  await app.register(authRoutes)
  await app.register(examRoutes)
  await app.register(progressRoutes)
  await app.register(contentRoutes)
  await app.register(adminRoutes)

  // ─── Global Error Handler ──────────────────────────────────────
  app.setErrorHandler((error: unknown, _request, reply) => {
    const err = error as Record<string, unknown>

    // Fastify validation errors
    if (err.validation && Array.isArray(err.validation)) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: "So'rov ma'lumotlari noto'g'ri",
          details: err.validation.map((v: Record<string, unknown>) => ({
            field: v.instancePath as string,
            message: v.message as string,
          })),
        },
      })
    }

    // Rate limit errors
    if (err.statusCode === 429) {
      return reply.status(429).send({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: "So'rovlar chegarasi oshib ketdi.",
        },
      })
    }

    // Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: "So'rov ma'lumotlari noto'g'ri",
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
      })
    }

    sendError(reply, error)
  })

  return app
}
