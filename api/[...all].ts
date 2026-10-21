import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildApp } from '../backend/src/app.js'
import { normalizeVercelApiRequestUrl } from '../backend/src/lib/normalizeVercelApiRequestUrl.js'

/**
 * Unified Vercel serverless entry.
 *
 * Frontend va backend bitta Vercel project ichida ishlaydi:
 * - frontend: /
 * - backend API: /api/*
 *
 * Fastify app cold-startda bir marta yaratiladi va instance davomida qayta ishlatiladi.
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
  // Vercel attaches its :path* rewrite capture as a query parameter. Strip
  // only verified platform metadata; keep strict backend query validation.
  req.url = normalizeVercelApiRequestUrl(req.url)
  const app = await getApp()
  app.server.emit('request', req, res)
}
