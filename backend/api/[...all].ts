import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildApp } from '../src/app.js'

/**
 * Vercel serverless handler (catch-all).
 *
 * Vercel'da `api/[...all].ts` barcha /api/* so'rovlarni qabul qiladi va
 * Fastify app'ga `request` event'ini emit qiladi — serverless environment'da
 * `app.listen()` ishlamaydi (persistent port yo'q), shuning uchun shu pattern
 * ishlatiladi.
 *
 * Modul-level cache: har bir instance (cold start) uchun app bir marta
 * yig'iladi va qayta ishlatiladi.
 */
let appPromise: Promise<Awaited<ReturnType<typeof buildApp>>> | null = null

async function getApp() {
  if (!appPromise) {
    appPromise = buildApp().then(async app => {
      await app.ready()
      return app
    })
  }
  return appPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp()
  app.server.emit('request', req, res)
}
