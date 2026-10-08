import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify from 'fastify'
import { adminRoutes } from '../admin.js'
import { getZodIssues, sendError } from '../../lib/errors.js'

const { mockGetReport } = vi.hoisted(() => ({
  mockGetReport: vi.fn(),
}))

vi.mock('../../services/content-coverage.service.js', () => ({
  contentCoverageService: {
    getReport: mockGetReport,
  },
}))

vi.mock('../../services/admin.service.js', () => ({
  adminService: {
    listAttempts: vi.fn(),
    getAttemptDetail: vi.fn(),
  },
}))

function buildTestApp() {
  const app = Fastify({ logger: false })
  app.setErrorHandler((error: unknown, _request, reply) => {
    const issues = getZodIssues(error)
    if (issues) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: "So'rov ma'lumotlari noto'g'ri",
          details: issues,
        },
      })
    }
    return sendError(reply, error)
  })
  return app
}

const TOKEN = 'admin-token'

const REPORT = {
  module_code: 'M01',
  generated_at: '2026-10-08T10:00:00.000Z',
  summary: {
    construct_count: 7,
    question_count: 570,
    published_count: 560,
    issue_question_count: 3,
    no_published_construct_count: 0,
    published_without_source_reference: 1,
    published_without_source_lesson: 1,
    published_without_key: 1,
    group_mismatch: 0,
    source_lesson_construct_mismatch: 0,
    outside_active_blueprint: 0,
  },
  constructs: [],
  question_issues: [],
}

describe('GET /api/admin/content-coverage', () => {
  let app: ReturnType<typeof Fastify>

  beforeEach(() => {
    mockGetReport.mockReset()
    app = buildTestApp()
  })

  afterEach(async () => {
    await app.close()
  })

  it('token bo‘lmasa 401 qaytaradi', async () => {
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/content-coverage?module_code=M01',
    })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('TOKEN_REQUIRED')
    expect(mockGetReport).not.toHaveBeenCalled()
  })

  it('module_code ni normalize qilib service reportini qaytaradi', async () => {
    mockGetReport.mockResolvedValue(REPORT)
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/content-coverage?module_code=m01',
      headers: { authorization: `Bearer ${TOKEN}` },
    })

    expect(response.statusCode).toBe(200)
    expect(mockGetReport).toHaveBeenCalledWith(TOKEN, 'M01')
    expect(JSON.parse(response.body).summary.question_count).toBe(570)
  })

  it('module codesiz global auditni qo‘llaydi', async () => {
    mockGetReport.mockResolvedValue({ ...REPORT, module_code: null })
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/content-coverage',
      headers: { authorization: `Bearer ${TOKEN}` },
    })

    expect(response.statusCode).toBe(200)
    expect(mockGetReport).toHaveBeenCalledWith(TOKEN, undefined)
  })

  it('noto‘g‘ri module_code uchun 400 qaytaradi', async () => {
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/content-coverage?module_code=AX',
      headers: { authorization: `Bearer ${TOKEN}` },
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).error.code).toBe('VALIDATION_ERROR')
    expect(mockGetReport).not.toHaveBeenCalled()
  })
})
