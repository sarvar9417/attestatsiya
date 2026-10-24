import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn() }))
vi.mock('../../lib/supabase.js', () => ({
  createServiceClient: () => ({ auth: { getUser: mocks.getUser } }),
  supabase: { from: mocks.from },
}))
import { specReaderService } from '../spec-reader.service.js'

const qid = '11111111-1111-4111-8111-111111111111'
const aid = '22222222-2222-4222-8222-222222222222'
const bid = '33333333-3333-4333-8333-333333333333'

describe('TASK-601: reader page server scope and keys', () => {
  let filters: Array<[string, string]>
  let selections: string[]
  let offset: [number, number] | null

  beforeEach(() => {
    vi.resetAllMocks()
    filters = []
    selections = []
    offset = null
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'learner-a' } }, error: null })
    mocks.from.mockImplementation((table: string) => {
      if (table === 'questions') {
        return { select: (columns: string) => {
          selections.push(columns)
          const chain = {
            eq(field: string, value: string) { filters.push([field, value]); return chain },
            like(field: string, value: string) { filters.push([field, value]); return chain },
            ilike(field: string, value: string) { filters.push([field, value]); return chain },
            order(_field: string) { return chain },
            range(a: number, b: number) {
              offset = [a,b]
              return Promise.resolve({
                data: [{ id: qid, group_code: 'S3.ALG', format: 'Y1', stem_md: 'Savol matni' }],
                count: 65, error: null,
              })
            },
          }
          return chain
        } }
      }
      if (table === 'question_options') {
        const chain = {
          in(_field: string, _ids: string[]) { return chain },
          order(_field: string) {
            return Promise.resolve({ data: [
              { id: aid, question_id: qid, side: 'a', order_idx: 1, content_md: 'A' },
              { id: bid, question_id: qid, side: 'a', order_idx: 2, content_md: 'B' },
            ], error: null })
          },
        }
        return { select: () => chain }
      }
      if (table === 'question_keys') {
        const chain = {
          in(_field: string, _ids: string[]) {
            return Promise.resolve({ data: [{
              question_id: qid, payload: { correct_option_id: bid },
              explanation_md: 'Javob izohi',
            }], error: null })
          },
        }
        return { select: () => chain }
      }
      throw new Error('Unexpected table ' + table)
    })
  })

  it('loads visible answers and explanations for published questions in the requested top-level section', async () => {
    const page = await specReaderService.getPage('S3', {
      page: 2, pageSize: 30, search: 'Python', reviewOnly: false,
    }, 'valid-token')
    expect(offset).toEqual([30,59])
    expect(page.total).toBe(65)
    expect(page.questions[0].correct_answer).toEqual({ correct_option_id: bid })
    expect(page.questions[0].explanation_md).toBe('Javob izohi')
    expect(filters).toContainEqual(['status', 'published'])
    expect(filters).toContainEqual(['group_code', 'S3.%'])
    expect(filters).toContainEqual(['stem_md', '%Python%'])
  })

  it('filters bookmarked reviews by authenticated user, never another user', async () => {
    await specReaderService.getPage('S3', {
      page: 1, pageSize: 100, search: '', reviewOnly: true,
    }, 'valid-token')
    expect(selections[0]).toContain('user_spec_question_marks!inner')
    expect(filters).toContainEqual(['user_spec_question_marks.user_id', 'learner-a'])
    expect(filters).toContainEqual(['user_spec_question_marks.mark', 'review'])
    expect(offset).toEqual([0,99])
  })

  it('rejects a missing session before any source-table reads', async () => {
    mocks.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })
    await expect(specReaderService.getPage('S1', {
      page: 1, pageSize: 30, search: '', reviewOnly: false,
    }, 'invalid')).rejects.toMatchObject({ statusCode: 401 })
    expect(mocks.from).not.toHaveBeenCalled()
  })
})
