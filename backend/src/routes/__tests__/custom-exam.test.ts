import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify from 'fastify'
import { customExamRoutes } from '../custom-exam.js'

const { catalog, preview, start } = vi.hoisted(() => ({
  catalog: vi.fn(),
  preview: vi.fn(),
  start: vi.fn(),
}))
vi.mock('../../services/custom-exam.service.js', () => ({
  customExamService: { catalog, preview, start },
}))

const id = '00000000-0000-4000-8000-000000000001'
const input = {
  total_count: 3,
  topics: [{
    lesson_id: id,
    count: 3,
    difficulty_counts: [{ difficulty: 3, count: 3 }],
  }],
  formats: ['Y1'],
  exposure: 'all',
  mode: 'exam',
  duration_sec: 900,
}

describe('TASK-210 authenticated custom routes', () => {
  let app: ReturnType<typeof Fastify>
  beforeEach(async () => {
    vi.clearAllMocks()
    app = Fastify()
    await app.register(customExamRoutes)
    await app.ready()
  })
  afterEach(async () => { await app.close() })

  it('does not accept anonymous catalog, preview or start', async () => {
    for (const [method, url] of [
      ['GET', '/api/custom-tests/catalog'],
      ['POST', '/api/custom-tests/preflight'],
      ['POST', '/api/custom-tests/start'],
    ] as const) {
      const response = await app.inject({ method, url, ...(
        method === 'POST' ? { payload: input } : {}
      ) })
      expect(response.statusCode).toBe(401)
    }
    expect(catalog).not.toHaveBeenCalled()
    expect(preview).not.toHaveBeenCalled()
    expect(start).not.toHaveBeenCalled()
  })

  it('rejects malformed quotas without calling RPC', async () => {
    const response = await app.inject({
      method: 'POST', url: '/api/custom-tests/start',
      headers: { authorization: 'Bearer learner-1' },
      payload: { ...input, total_count: 100 },
    })
    expect(response.statusCode).toBe(400)
    expect(start).not.toHaveBeenCalled()
  })

  it('preflight is read-only and returns only safe aggregate counts', async () => {
    preview.mockResolvedValueOnce({
      ready: false, requested: 3, available: 1,
      gaps: [{ lesson_id: id, difficulty: 3, requested: 3, available: 1 }],
      slots: [{ lesson_id: id, difficulty: 3, requested: 3, available: 1 }],
    })
    const response = await app.inject({
      method: 'POST', url: '/api/custom-tests/preflight',
      headers: { authorization: 'Bearer learner-1' }, payload: input,
    })
    expect(response.statusCode).toBe(200)
    expect(preview).toHaveBeenCalledWith(expect.objectContaining({ total_count: 3 }), 'learner-1')
    expect(JSON.parse(response.body).gaps).toHaveLength(1)
    expect(JSON.stringify(JSON.parse(response.body))).not.toContain('correct_option_id')
    expect(start).not.toHaveBeenCalled()
  })

  it('starts a validated personal exam with full requested count', async () => {
    start.mockResolvedValueOnce({
      kind: 'custom', exam_id: id, duration_sec: 900,
      started_at: new Date().toISOString(), items: [{ order_idx: 1 }, { order_idx: 2 }, { order_idx: 3 }],
    })
    const response = await app.inject({
      method: 'POST', url: '/api/custom-tests/start',
      headers: { authorization: 'Bearer learner-1' }, payload: input,
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).items).toHaveLength(3)
    expect(start).toHaveBeenCalledWith(expect.objectContaining({ total_count: 3 }), 'learner-1')
  })
})
