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
      message: 'So\'rovlar chegarasi oshib ketdi. Iltimos, birozdan so\'ng urinib ko\'ring.',
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
        message: 'So\'rov ma\'lumotlari noto\'g\'ri',
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
        message: 'So\'rovlar chegarasi oshib ketdi.',
      },
    })
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'So\'rov ma\'lumotlari noto\'g\'ri',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    })
  }

  sendError(reply, error)
})

// ─── Start ────────────────────────────────────────────────────
const start = async () => {
  try {
    await app.listen({ port: config.server.port, host: config.server.host })
    app.log.info(`
╔══════════════════════════════════════════════╗
║  🚀 Attestatsiya API Server                 ║
║  ─────────────────────────────               ║
║  Port:    ${String(config.server.port).padEnd(33)}║
║  Host:    ${config.server.host.padEnd(33)}║
║  Mode:    ${config.server.nodeEnv.padEnd(33)}║
║                                              ║
║  Endpoints:                                  ║
║  • GET  /api/health                          ║
║  • POST /api/auth/register                   ║
║  • POST /api/auth/login                      ║
║  • POST /api/auth/refresh                    ║
║  • POST /api/auth/logout                     ║
║  • POST /api/auth/reset-password             ║
║  • POST /api/auth/update-password            ║
║  • POST /api/auth/resend-confirmation        ║
║  • GET  /api/auth/me                         ║
║  • PATCH /api/auth/profile                   ║
║  • POST /api/exam/start                      ║
║  • POST /api/exam/submit                     ║
║  • POST /api/exam/finish                     ║
║  • GET  /api/exam/:id/review                 ║
║  • GET  /api/exam/due-reviews                ║
║  • POST /api/progress/sync                   ║
║  • GET  /api/progress/modules                ║
║  • GET  /api/content/modules                 ║
║  • GET  /api/content/modules/:id             ║
║  • GET  /api/content/lessons/:id             ║
║  • GET  /api/content/constructs              ║
║  • GET  /api/admin/attempts                   ║
║  • GET  /api/admin/attempts/:id               ║
╚══════════════════════════════════════════════╝
`)
  } catch (err) {
    console.error("❌ Server failed to start:", err)
    process.exit(1)
  }
}

start()
