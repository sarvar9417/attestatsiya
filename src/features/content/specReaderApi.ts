import { z } from 'zod'
import { api } from '../../lib/apiClient'
import type { SpecCode } from './specPracticeApi'

const uuid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
export const readerPageSizeSchema = z.union([z.literal(30), z.literal(50), z.literal(100)])
export type ReaderPageSize = z.infer<typeof readerPageSizeSchema>
export type ReaderMark = 'memorized' | 'review' | null
export type ReaderPosition = {
  page: number
  pageSize: ReaderPageSize
  search: string
  reviewOnly: boolean
}
const answer = z.union([
  z.object({ correct_option_id: uuid }),
  z.object({ pairs: z.record(z.string(), uuid) }),
  z.object({ order: z.array(uuid) }),
])
const option = z.object({
  id: uuid,
  side: z.string(),
  order_idx: z.number().int(),
  content_md: z.string(),
})
const question = z.object({
  id: uuid,
  group_code: z.string(),
  format: z.enum(['Y1', 'Y2', 'Y3']),
  stem_md: z.string(),
  options: z.array(option),
  correct_answer: answer,
  explanation_md: z.string(),
})
const page = z.object({
  questions: z.array(question),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: readerPageSizeSchema,
})
const state = z.object({
  page: z.number().int().positive(),
  page_size: readerPageSizeSchema,
  search: z.string(),
  review_only: z.boolean(),
  marks: z.record(z.string(), z.enum(['memorized', 'review'])),
})
export type ReaderQuestion = z.infer<typeof question>
export type ReaderPage = z.infer<typeof page>
export type ReaderState = z.infer<typeof state>

export async function getReaderPage(code: SpecCode, filters: ReaderPosition): Promise<ReaderPage> {
  const query = new URLSearchParams({
    page: String(filters.page),
    page_size: String(filters.pageSize),
    q: filters.search,
    review_only: String(filters.reviewOnly),
  })
  const result = await api.get<unknown>(`/api/content/spec-reader/${code}/page?${query}`)
  return page.parse(result)
}
export async function getReaderState(code: SpecCode): Promise<ReaderState> {
  const result = await api.get<unknown>(`/api/content/spec-reader/${code}/state`)
  return state.parse(result)
}
export async function saveReaderPosition(code: SpecCode, pos: ReaderPosition) {
  return api.put<unknown>(`/api/content/spec-reader/${code}/position`, {
    page: pos.page, page_size: pos.pageSize,
    search: pos.search, review_only: pos.reviewOnly,
  })
}
export async function changeReaderMark(code: SpecCode, questionId: string, mark: ReaderMark) {
  return api.put<unknown>(`/api/content/spec-reader/${code}/mark`, {
    question_id: questionId, mark,
  })
}
