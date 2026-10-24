import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getUser: vi.fn(),
}))

vi.mock('../../lib/supabase.js', () => ({
  createServiceClient: () => ({ auth: { getUser: mocks.getUser } }),
  supabase: { from: mocks.from },
}))

import { specPracticeService } from '../spec-practice.service.js'

const id = (n: number) => '11111111-1111-4111-8111-' + n.toString(16).padStart(12, '0')
const rows = Array.from({ length: 42 }, (_, i) => ({
  id: id(i + 1),
  group_code: i % 2 === 0 ? 'S3.NUM' : 'S3.LOGIC',
  format: 'Y1',
  stem_md: 'Savol ' + (i + 1),
}))
const options = rows.flatMap(row => Array.from({ length: 4 }, (_, i) => ({
  id: id(1000 + rows.indexOf(row) * 4 + i),
  question_id: row.id,
  side: 'a',
  order_idx: i,
  content_md: 'Variant ' + i,
})))

describe('TASK-600: cursor pagination covers entire main specification section', () => {
  let filters: Array<[string, string]>
  let queried: string[]

  beforeEach(() => {
    vi.resetAllMocks()
    filters = []
    queried = []
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'learner' } }, error: null })

    mocks.from.mockImplementation((table: string) => {
      queried.push(table)
      if (table === 'questions') {
        return {
          select: (_columns: string, config?: { head?: boolean }) => {
            if (config?.head) {
              const q = {
                eq(k: string, value: string) { filters.push([k, value]); return q },
                like(k: string, value: string) { filters.push([k, value]); return q },
                then(resolve: (result: { count: number; error: null }) => unknown) {
                  return Promise.resolve({ count: 42, error: null }).then(resolve)
                },
              }
              return q
            }
            let cursor: string | undefined
            let n = 100
            const q = {
              eq(k: string, value: string) { filters.push([k, value]); return q },
              like(k: string, value: string) { filters.push([k, value]); return q },
              order(_field: string, _opts: { ascending: boolean }) { return q },
              limit(value: number) { n = value; return q },
              gt(_field: string, value: string) { cursor = value; return q },
              then(resolve: (result: { data: typeof rows; error: null }) => unknown) {
                const data = rows.filter(row => !cursor || row.id > cursor).slice(0, n)
                return Promise.resolve({ data, error: null }).then(resolve)
              },
            }
            return q
          },
        }
      }
      if (table === 'question_options') {
        let ids: string[] = []
        const q = {
          in(_field: string, selected: string[]) { ids = selected; return q },
          order(_field: string, _opts: { ascending: boolean }) { return q },
          then(resolve: (result: { data: typeof options; error: null }) => unknown) {
            return Promise.resolve({
              data: options.filter(option => ids.includes(option.question_id)), error: null,
            }).then(resolve)
          },
        }
        return { select: () => q }
      }
      throw new Error('Unexpected table queried: ' + table)
    })
  })

  it('loads 42 unique questions across 3 pages without a 20/50 ceiling or answer keys', async () => {
    const page1 = await specPracticeService.listQuestions('S3', undefined, 'valid')
    expect(page1.questions).toHaveLength(20)
    expect(page1.next_cursor).toBe(id(20))
    expect(page1.total).toBe(42)

    const page2 = await specPracticeService.listQuestions('S3', page1.next_cursor!, 'valid')
    expect(page2.questions).toHaveLength(20)
    expect(page2.next_cursor).toBe(id(40))

    const page3 = await specPracticeService.listQuestions('S3', page2.next_cursor!, 'valid')
    expect(page3.questions).toHaveLength(2)
    expect(page3.next_cursor).toBeNull()

    const all = [...page1.questions, ...page2.questions, ...page3.questions]
    expect(new Set(all.map(q => q.id)).size).toBe(42)
    expect(all.every(q => q.options.length === 4)).toBe(true)
    expect(all.every(q => !('payload' in q) && !('explanation_md' in q))).toBe(true)
    expect(all.every(q => q.assets.length === 0)).toBe(true)
    expect(queried).not.toContain('question_keys')
    expect(filters).toContainEqual(['status', 'published'])
    expect(filters).toContainEqual(['group_code', 'S3.%'])
  })

  it('requires a real user before any question-bank query', async () => {
    mocks.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })
    await expect(specPracticeService.listQuestions('S3', undefined, 'bad')).rejects.toMatchObject({
      statusCode: 401,
    })
    expect(mocks.from).not.toHaveBeenCalled()
  })
})
