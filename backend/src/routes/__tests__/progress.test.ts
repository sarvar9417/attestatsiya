import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import { progressRoutes } from '../progress.js'
import { sendError } from '../../lib/errors.js'

const { mockGetUser, mockGetMastery, mockGetReadiness } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetMastery: vi.fn(),
  mockGetReadiness: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn(),
  })),
}))

vi.mock('../../services/progress.service.js', () => ({
  progressService: {
    sync: vi.fn(),
    getModuleProgress: vi.fn(),
    getMastery: mockGetMastery,
    getReadiness: mockGetReadiness,
  },
}))

function setupGlobalErrorHandler(app: ReturnType<typeof Fastify>) {
  app.setErrorHandler((error: unknown, _request: FastifyRequest, reply: FastifyReply) => {
    return sendError(reply, error)
  })
}

describe('Progress Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'learner@example.invalid' } },
      error: null,
    })
    mockGetMastery.mockResolvedValue({
      items: [],
      summary: {
        tracked: 0,
        learning: 0,
        provisional: 0,
        stable: 0,
        regressed: 0,
        due: 0,
      },
    })
    mockGetReadiness.mockResolvedValue({
      available: true,
      readiness_percent: 68,
      confidence: 'medium',
      independent_evidence: 214,
      covered_blueprint_questions: 42,
      total_blueprint_questions: 50,
      coverage_percent: 84,
      due_reviews: 0,
      regressed_constructs: 0,
      next_action: {
        kind: 'learn',
        href: '/learn',
        label: 'O‘rganishni davom ettirish',
        reason: 'Navbatdagi mavzu bilan blueprint qamrovini kengaytiring.',
      },
      unavailable_reason: null,
    })

    app = Fastify({ logger: false })
    setupGlobalErrorHandler(app)
    await app.register(progressRoutes)
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('GET /api/progress/readiness returns 401 without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/progress/readiness',
    })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('TOKEN_REQUIRED')
    expect(mockGetReadiness).not.toHaveBeenCalled()
  })

  it('GET /api/progress/readiness returns learner-scoped estimate', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/progress/readiness',
      headers: { authorization: 'Bearer token-abc' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toMatchObject({
      readiness_percent: 68,
      confidence: 'medium',
      independent_evidence: 214,
    })
    expect(mockGetReadiness).toHaveBeenCalledWith('user-1')
  })

  it('GET /api/progress/mastery returns 401 without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/progress/mastery',
    })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('TOKEN_REQUIRED')
    expect(mockGetMastery).not.toHaveBeenCalled()
  })

  it('GET /api/progress/mastery returns authenticated learner snapshot', async () => {
    mockGetMastery.mockResolvedValue({
      items: [
        {
          construct_id: '00000000-0000-4000-8000-000000000011',
          code: 'M01.01.C01',
          group_code: 'S1.INFO',
          title_uz: 'Axborot hajmi',
          mastery_status: 'provisional',
          attempts: 2,
          correct: 2,
          accuracy_percent: 100,
          review_stage: 2,
          interval_days: 3,
          due_at: '2026-10-10T08:00:00.000Z',
          last_seen_at: '2026-10-07T08:00:00.000Z',
          independent_attempts: 2,
          guided_attempts: 0,
          retry_attempts: 0,
          cognitive: {
            bilish: { attempts: 1, correct: 1 },
            qollash: { attempts: 1, correct: 1 },
            mulohaza: { attempts: 0, correct: 0 },
          },
        },
      ],
      summary: {
        tracked: 1,
        learning: 0,
        provisional: 1,
        stable: 0,
        regressed: 0,
        due: 0,
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/progress/mastery',
      headers: { authorization: 'Bearer token-abc' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).summary.provisional).toBe(1)
    expect(mockGetMastery).toHaveBeenCalledWith('user-1')
  })

  it('GET /api/progress/mastery returns 401 for invalid token', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid token' },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/progress/mastery',
      headers: { authorization: 'Bearer bad-token' },
    })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('INVALID_TOKEN')
    expect(mockGetMastery).not.toHaveBeenCalled()
  })
})
