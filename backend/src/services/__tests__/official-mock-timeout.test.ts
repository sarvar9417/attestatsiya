import { beforeEach, describe, expect, it, vi } from 'vitest'

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }))

vi.mock('../../lib/supabase.js', () => ({
  getAuthedClient: () => ({ rpc }),
}))
vi.mock('../../lib/resolveIds.js', () => ({
  resolveModuleUuid: vi.fn(),
  resolveLessonUuid: vi.fn(),
}))

import { examService } from '../exam.service.js'

describe('official mock API timeout safety', () => {
  beforeEach(() => rpc.mockReset())

  it('maps PostgreSQL statement_timeout to a bounded, safe 503 error', async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { code: '57014', message: 'canceling statement due to statement timeout' },
    })

    await expect(examService.start('mock', 'authenticated-jwt')).rejects.toMatchObject({
      code: 'EXAM_DB_TIMEOUT',
      statusCode: 503,
    })
    expect(rpc).toHaveBeenCalledWith('generate_official_mock')
  })

  it('preserves the actionable shortage classification', async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { code: 'P0001', message: 'official_mock_pool_insufficient' },
    })
    await expect(examService.start('mock', 'authenticated-jwt')).rejects.toMatchObject({
      code: 'OFFICIAL_MOCK_POOL_INSUFFICIENT',
      statusCode: 409,
    })
  })

  it('does not invent answer keys on success', async () => {
    const payload = {
      exam_id: '00000000-0000-4000-8000-000000000111',
      kind: 'mock',
      duration_sec: 7200,
      items: [],
    }
    rpc.mockResolvedValueOnce({ data: payload, error: null })
    await expect(examService.start('mock', 'authenticated-jwt')).resolves.toEqual(payload)
  })
})
