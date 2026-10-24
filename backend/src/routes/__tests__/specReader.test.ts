import { beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify from 'fastify'

const reader = vi.hoisted(() => ({
  getPage: vi.fn(), getState: vi.fn(), setMark: vi.fn(), savePosition: vi.fn(),
}))
vi.mock('../../services/spec-reader.service.js', () => ({
  specReaderService: reader,
}))
vi.mock('../../services/spec-practice.service.js', () => ({
  specPracticeService: {},
}))
vi.mock('../../services/content.service.js', () => ({
  contentService: {},
}))
import { contentRoutes } from '../content.js'

const id = '11111111-1111-4111-8111-111111111111'
describe('TASK-601: protected specification reader routes', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    reader.getPage.mockResolvedValue({ questions: [], total: 0, page: 1, page_size: 30 })
    reader.getState.mockResolvedValue({ page: 1, page_size: 30, search: '', review_only: false, marks: {} })
    reader.setMark.mockResolvedValue({ question_id: id, mark: 'review' })
    reader.savePosition.mockResolvedValue({ saved: true })
  })

  it('does not allow unauthenticated reader access', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const response = await app.inject({ method: 'GET', url: '/api/content/spec-reader/S3/page' })
    expect(response.statusCode).toBe(401)
    expect(reader.getPage).not.toHaveBeenCalled()
    await app.close()
  })

  it('passes bounded page filters, including review-only search, to the service', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const response = await app.inject({
      method: 'GET',
      url: '/api/content/spec-reader/S3/page?page=2&page_size=100&q=Python&review_only=true',
      headers: { authorization: 'Bearer valid-token' },
    })
    expect(response.statusCode).toBe(200)
    expect(response.headers['cache-control']).toContain('no-store')
    expect(reader.getPage).toHaveBeenCalledWith('S3', {
      page: 2, pageSize: 100, search: 'Python', reviewOnly: true,
    }, 'valid-token')
    await app.close()
  })

  it('rejects invalid section, page size and oversized search', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    for (const url of [
      '/api/content/spec-reader/M01/page',
      '/api/content/spec-reader/S3/page?page_size=200',
      '/api/content/spec-reader/S3/page?q=' + 'a'.repeat(81),
      '/api/content/spec-reader/S3/page?page=-1',
    ]) {
      const response = await app.inject({
        method: 'GET', url, headers: { authorization: 'Bearer valid-token' },
      })
      expect(response.statusCode).toBe(400)
    }
    expect(reader.getPage).not.toHaveBeenCalled()
    await app.close()
  })

  it('rejects cross-format marks and accepts strictly validated saves', async () => {
    const app = Fastify()
    await app.register(contentRoutes)
    const reject = await app.inject({
      method: 'PUT', url: '/api/content/spec-reader/S3/mark',
      headers: { authorization: 'Bearer valid-token' },
      payload: { question_id: id, mark: 'published' },
    })
    expect(reject.statusCode).toBe(400)
    expect(reader.setMark).not.toHaveBeenCalled()
    const ok = await app.inject({
      method: 'PUT', url: '/api/content/spec-reader/S3/mark',
      headers: { authorization: 'Bearer valid-token' },
      payload: { question_id: id, mark: 'review' },
    })
    expect(ok.statusCode).toBe(200)
    expect(reader.setMark).toHaveBeenCalledWith('S3', id, 'review', 'valid-token')
    const pos = await app.inject({
      method: 'PUT', url: '/api/content/spec-reader/KS/position',
      headers: { authorization: 'Bearer valid-token' },
      payload: { page: 5, page_size: 50, search: 'for', review_only: false },
    })
    expect(pos.statusCode).toBe(200)
    expect(reader.savePosition).toHaveBeenCalledWith('KS', {
      page: 5, pageSize: 50, search: 'for', reviewOnly: false,
    }, 'valid-token')
    await app.close()
  })
})
