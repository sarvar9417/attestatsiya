import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify'
import { contentRoutes } from '../content.js'
import { sendError } from '../../lib/errors.js'

const { mockFrom, mockRpc } = vi.hoisted(() => ({ mockFrom: vi.fn(), mockRpc: vi.fn() }))
vi.mock('../../lib/supabase.js', () => ({ supabase: { from: mockFrom, rpc: mockRpc } }))
vi.mock('../../lib/resolveIds.js', () => ({
  resolveModuleUuid: async (id: string) => id,
  resolveLessonUuid: async (id: string) => id,
}))

type Row = Record<string, unknown>
let rows: Record<string, Row[]>
let failingTable: string | null
const moduleId = '10000000-0000-4000-8000-000000000001'
const lessonId = '10000000-0000-4000-8000-000000000002'

// Execute query predicates against fixtures, rather than returning the same
// row regardless of whether the service actually filters publication status.
function query(table: string) {
  let selected = [...(rows[table] ?? [])]
  const result = () => ({ data: selected, error: failingTable === table ? { message: 'unavailable' } : null })
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn((key: string, value: unknown) => { selected = selected.filter(row => row[key] === value); return chain }),
    in: vi.fn((key: string, values: unknown[]) => { selected = selected.filter(row => values.includes(row[key])); return chain }),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(async () => ({ ...result(), data: selected[0] ?? null })),
    maybeSingle: vi.fn(async () => ({ ...result(), data: selected[0] ?? null })),
    then: (resolve: (value: ReturnType<typeof result>) => unknown) => Promise.resolve(result()).then(resolve),
  }
  return chain
}

describe('public content publication boundary', () => {
  let app: ReturnType<typeof Fastify>
  beforeEach(async () => {
    vi.clearAllMocks()
    failingTable = null
    rows = {
      modules: [{ id: moduleId, code: 'M01', status: 'published', title_uz: 'Published module' }],
      lessons: [{ id: lessonId, module_id: moduleId, status: 'published', title_uz: 'Published lesson', body_mdx: 'Source-backed theory' }],
      questions: [], lesson_constructs: [], constructs: [],
    }
    mockFrom.mockImplementation(query)
    app = Fastify()
    app.setErrorHandler((error: unknown, _req: FastifyRequest, reply: FastifyReply) => sendError(reply, error))
    await app.register(contentRoutes)
    await app.ready()
  })
  afterEach(async () => { await app.close() })

  it('serves published lessons and published module details', async () => {
    const lesson = await app.inject(`/api/content/lessons/${lessonId}`)
    expect(lesson.statusCode).toBe(200)
    expect(lesson.json().body_mdx).toBe('Source-backed theory')
    const module = await app.inject(`/api/content/modules/${moduleId}`)
    expect(module.statusCode).toBe(200)
    expect(module.json().lessons).toHaveLength(1)
  })

  it.each(['draft', 'archived'])('rejects a public %s module listing filter', async status => {
    rows.modules[0].status = status
    const response = await app.inject(`/api/content/modules?status=${status}`)
    expect(response.statusCode).toBe(400)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it.each(['draft', 'review', 'archived'])('never returns %s lesson text by direct UUID', async status => {
    rows.lessons[0].status = status
    rows.lessons[0].body_mdx = 'PRIVATE REVIEW TEXT'
    const response = await app.inject(`/api/content/lessons/${lessonId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body).not.toContain('PRIVATE REVIEW TEXT')
  })

  it.each(['draft', 'archived'])('hides %s modules and their published children', async status => {
    rows.modules[0].status = status
    for (const url of [`/api/content/modules/${moduleId}`, `/api/content/lessons/${lessonId}`, `/api/content/lessons/${lessonId}/questions`, `/api/content/lessons/${lessonId}/topic-test-preflight`]) {
      const response = await app.inject(url)
      expect(response.statusCode, url).toBe(404)
    }
    expect(mockRpc).not.toHaveBeenCalled()
  })

  it('does not enumerate questions or run preflight for an unpublished lesson', async () => {
    rows.lessons[0].status = 'review'
    for (const suffix of ['questions', 'topic-test-preflight']) {
      expect((await app.inject(`/api/content/lessons/${lessonId}/${suffix}`)).statusCode).toBe(404)
    }
    expect(mockFrom).not.toHaveBeenCalledWith('questions')
    expect(mockRpc).not.toHaveBeenCalled()
  })

  it('does not disguise a failed publication lookup as successful content', async () => {
    failingTable = 'lessons'
    const response = await app.inject(`/api/content/lessons/${lessonId}`)
    expect(response.statusCode).toBe(503)
    expect(response.body).not.toContain('Source-backed theory')
  })

  it.each([undefined, 'Bearer learner-token'])('retires sessionless answer lookup without reading any key (%s)', async authorization => {
    rows.questions = [{ id: lessonId, status: 'published', group_code: 'S1.INFO' }]
    const response = await app.inject({
      method: 'POST', url: '/api/content/questions/check',
      headers: authorization ? { authorization } : {},
      payload: { question_id: lessonId, option_id: moduleId },
    })
    expect(response.statusCode).toBe(410)
    expect(response.json().error.code).toBe('PRACTICE_SESSION_REQUIRED')
    expect(mockFrom).not.toHaveBeenCalled()
    expect(response.body).not.toContain('correct_option_id')
  })
})
