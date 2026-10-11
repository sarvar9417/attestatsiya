import Fastify from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminRoutes } from '../admin.js'
import { getZodIssues, sendError } from '../../lib/errors.js'

const mocks = vi.hoisted(() => ({
  dashboard: vi.fn(),
  listModules: vi.fn(),
  createModule: vi.fn(),
  listQuestions: vi.fn(),
  transitionQuestion: vi.fn(),
  questionEditorMeta: vi.fn(),
  questionEditor: vi.fn(),
  createQuestion: vi.fn(),
  updateQuestion: vi.fn(),
}))

vi.mock('../../services/admin-content.service.js', () => ({
  adminContentService: mocks,
}))

vi.mock('../../services/content-coverage.service.js', () => ({
  contentCoverageService: { getReport: vi.fn() },
}))

vi.mock('../../services/question-bank-import.service.js', () => ({
  questionBankImportService: { importBatch: vi.fn() },
}))

vi.mock('../../services/admin.service.js', () => ({
  adminService: {
    listAttempts: vi.fn(),
    getAttemptDetail: vi.fn(),
  },
}))

function makeApp() {
  const app = Fastify({ logger: false })
  app.setErrorHandler((error: unknown, _request, reply) => {
    const zodIssues = getZodIssues(error)
    if (zodIssues) {
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'Validation error' },
      })
    }
    return sendError(reply, error)
  })
  return app
}

describe('admin CMS backend boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dashboard token bo‘lmasa 401 qaytaradi', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/api/admin/dashboard' })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('TOKEN_REQUIRED')
    expect(mocks.dashboard).not.toHaveBeenCalled()
    await app.close()
  })

  it('dashboard session tokenini servicega uzatadi', async () => {
    mocks.dashboard.mockResolvedValue({
      role: 'admin',
      modules: 16,
      questions: 100,
      blueprints: 1,
      users: 3,
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard',
      headers: { authorization: 'Bearer admin-token' },
    })

    expect(response.statusCode).toBe(200)
    expect(mocks.dashboard).toHaveBeenCalledWith('admin-token')
    await app.close()
  })

  it('module yaratish body sini validatsiya qilib servicega uzatadi', async () => {
    mocks.createModule.mockResolvedValue({
      id: '33333333-3333-4333-8333-333333333333',
      code: 'M17',
      title_uz: 'Yangi modul',
      summary_uz: null,
      order_idx: 17,
      slug: 'm17',
      status: 'draft',
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const body = {
      code: 'M17',
      title_uz: 'Yangi modul',
      subject_id: '22222222-2222-4222-8222-222222222222',
    }
    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/modules',
      headers: { authorization: 'Bearer admin-token' },
      payload: body,
    })

    expect(response.statusCode).toBe(201)
    expect(mocks.createModule).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'M17', title_uz: 'Yangi modul' }),
      'admin-token',
    )
    await app.close()
  })

  it('Y1 savolda 4 variant bo‘lmasa 400 qaytaradi', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/questions',
      headers: { authorization: 'Bearer admin-token' },
      payload: {
        stem_md: 'Savol?',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 1,
        construct_id: '11111111-1111-4111-8111-111111111111',
        options: [{ content_md: 'A' }],
        correct_index: 0,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(mocks.createQuestion).not.toHaveBeenCalled()
    await app.close()
  })

  it('status transition authenticated backend orqali bajariladi', async () => {
    mocks.transitionQuestion.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      status: 'review',
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'PATCH',
      url: '/api/admin/questions/11111111-1111-4111-8111-111111111111/status',
      headers: { authorization: 'Bearer editor-token' },
      payload: { status: 'review' },
    })

    expect(response.statusCode).toBe(200)
    expect(mocks.transitionQuestion).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'review',
      'editor-token',
    )
    await app.close()
  })
})
