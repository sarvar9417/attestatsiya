import { beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify from 'fastify'

const mocks = vi.hoisted(() => ({
  listSections: vi.fn(),
  listQuestions: vi.fn(),
  checkAnswer: vi.fn(),
}))

vi.mock('../../services/spec-practice.service.js', () => ({
  specPracticeService: mocks,
}))
vi.mock('../../services/content.service.js', () => ({
  contentService: {},
}))

import { contentRoutes } from '../content.js'

const qid = '00000000-0000-0000-0000-000000000001'
const optionId = '00000000-0000-0000-0000-000000000002'

describe('TASK-600: specification main-section study routes', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('requires authentication before section counts are returned', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const response = await app.inject({ method: 'GET', url: '/api/content/spec-practice/sections' })
    expect(response.statusCode).toBe(401)
    expect(mocks.listSections).not.toHaveBeenCalled()
    await app.close()
  })

  it('returns all canonical top-level specification groups', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    mocks.listSections.mockResolvedValue([
      { code: 'S1', title: 'Axborot', count: 1031 },
      { code: 'KS', title: 'Kasb standarti', count: 510 },
      { code: 'PM', title: 'Pedagogik mahorat', count: 927 },
    ])
    const response = await app.inject({
      method: 'GET', url: '/api/content/spec-practice/sections',
      headers: { authorization: 'Bearer valid-token' },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(3)
    expect(mocks.listSections).toHaveBeenCalledWith('valid-token')
    await app.close()
  })

  it('validates section and cursor; never queries an invalid section', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const response = await app.inject({
      method: 'GET',
      url: '/api/content/spec-practice/M05/questions?cursor=not-a-uuid',
      headers: { authorization: 'Bearer valid-token' },
    })
    expect(response.statusCode).toBe(400)
    expect(mocks.listQuestions).not.toHaveBeenCalled()
    await app.close()
  })

  it('checks only a submitted answer and returns its explanation', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    mocks.checkAnswer.mockResolvedValue({
      correct: false,
      correct_answer: { option_id: optionId },
      explanation_md: 'Izohli yechim',
    })
    const response = await app.inject({
      method: 'POST',
      url: '/api/content/spec-practice/S3/answer',
      headers: { authorization: 'Bearer valid-token' },
      payload: { question_id: qid, answer: { option_id: optionId } },
    })
    expect(response.statusCode).toBe(200)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.json().explanation_md).toBe('Izohli yechim')
    expect(mocks.checkAnswer).toHaveBeenCalledWith(
      'S3', qid, { option_id: optionId }, 'valid-token',
    )
    await app.close()
  })

  it('rejects missing or incomplete answer payloads', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const response = await app.inject({
      method: 'POST',
      url: '/api/content/spec-practice/S2/answer',
      headers: { authorization: 'Bearer valid-token' },
      payload: { question_id: qid, answer: {} },
    })
    expect(response.statusCode).toBe(400)
    expect(mocks.checkAnswer).not.toHaveBeenCalled()
    await app.close()
  })
})
