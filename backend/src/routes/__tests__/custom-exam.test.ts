import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify from 'fastify'
import { customExamRoutes } from '../custom-exam.js'

const { catalog, preview, start, active, analysis, list, create, update, remove } = vi.hoisted(() => ({
  catalog: vi.fn(),
  preview: vi.fn(),
  start: vi.fn(),
  active: vi.fn(),
  analysis: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))
vi.mock('../../services/custom-exam.service.js', () => ({
  customExamService: { catalog, preview, start, active, analysis },
}))
vi.mock('../../services/custom-preset.service.js', () => ({
  customPresetService: { list, create, update, remove },
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
      ['GET', '/api/custom-tests/active'],
      ['GET', `/api/custom-tests/${id}/analysis`],
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

  it('resume and analytics are token-scoped and return no answers or keys', async () => {
    active.mockResolvedValueOnce(null)
    const resumed = await app.inject({
      method: 'GET', url: '/api/custom-tests/active',
      headers: { authorization: 'Bearer learner-1' },
    })
    expect(resumed.statusCode).toBe(200)
    expect(active).toHaveBeenCalledWith('learner-1')

    analysis.mockResolvedValueOnce({
      exam_id: id, total: 2, answered: 1, correct: 1,
      by_lesson: [], by_difficulty: [], by_format: [],
    })
    const result = await app.inject({
      method: 'GET', url: `/api/custom-tests/${id}/analysis`,
      headers: { authorization: 'Bearer learner-1' },
    })
    expect(result.statusCode).toBe(200)
    expect(analysis).toHaveBeenCalledWith(id, 'learner-1')
    expect(result.body).not.toContain('correct_option_id')

    const invalid = await app.inject({
      method: 'GET', url: '/api/custom-tests/not-uuid/analysis',
      headers: { authorization: 'Bearer learner-1' },
    })
    expect(invalid.statusCode).toBe(400)
  })

  it('private preset endpoints require authentication', async () => {
    for (const [method, url] of [
      ['GET', '/api/custom-tests/presets'],
      ['POST', '/api/custom-tests/presets'],
      ['PATCH', `/api/custom-tests/presets/${id}`],
      ['DELETE', `/api/custom-tests/presets/${id}`],
    ] as const) {
      const response = await app.inject({ method, url, ...(
        method === 'POST' || method === 'PATCH' ? { payload: { name: 'Test', config: input } } : {}
      ) })
      expect(response.statusCode).toBe(401)
    }
  })

  it('preset CRUD validates names and calls user-scoped service', async () => {
    const record = {
      id, name: 'My Test', config: input,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    list.mockResolvedValueOnce([record])
    const read = await app.inject({ method: 'GET', url: '/api/custom-tests/presets',
      headers: { authorization: 'Bearer learner-1' } })
    expect(read.statusCode).toBe(200)
    expect(list).toHaveBeenCalledWith('learner-1')

    const invalidName = await app.inject({ method: 'POST', url: '/api/custom-tests/presets',
      headers: { authorization: 'Bearer learner-1' },
      payload: { name: ' a ', config: input } })
    expect(invalidName.statusCode).toBe(400)
    expect(create).not.toHaveBeenCalled()

    create.mockResolvedValueOnce(record)
    const saved = await app.inject({ method: 'POST', url: '/api/custom-tests/presets',
      headers: { authorization: 'Bearer learner-1' }, payload: { name: 'My Test', config: input } })
    expect(saved.statusCode).toBe(201)
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Test' }), 'learner-1')

    update.mockResolvedValueOnce({ ...record, name: 'Renamed' })
    const changed = await app.inject({ method: 'PATCH', url: `/api/custom-tests/presets/${id}`,
      headers: { authorization: 'Bearer learner-1' }, payload: { name: 'Renamed' } })
    expect(changed.statusCode).toBe(200)
    expect(update).toHaveBeenCalledWith(id, { name: 'Renamed' }, 'learner-1')

    remove.mockResolvedValueOnce({ deleted: true })
    const deleted = await app.inject({ method: 'DELETE', url: `/api/custom-tests/presets/${id}`,
      headers: { authorization: 'Bearer learner-1' } })
    expect(deleted.statusCode).toBe(200)
    expect(remove).toHaveBeenCalledWith(id, 'learner-1')
  })

  it('preset patch rejects invalid ids and empty patches', async () => {
    const badId = await app.inject({ method: 'PATCH', url: '/api/custom-tests/presets/not-uuid',
      headers: { authorization: 'Bearer learner-1' }, payload: { name: 'Okay' } })
    expect(badId.statusCode).toBe(400)
    const empty = await app.inject({ method: 'PATCH', url: `/api/custom-tests/presets/${id}`,
      headers: { authorization: 'Bearer learner-1' }, payload: {} })
    expect(empty.statusCode).toBe(400)
    expect(update).not.toHaveBeenCalled()
  })
})
