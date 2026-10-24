import { createServiceClient, supabase } from '../lib/supabase.js'
import { AppError, NotFoundError } from '../lib/errors.js'
import type { SpecSectionCode } from './spec-practice.service.js'

export type ReaderPageSize = 30 | 50 | 100
export type ReaderMark = 'memorized' | 'review' | null

async function readerUser(token: string) {
  const { data, error } = await createServiceClient().auth.getUser(token)
  if (error || !data.user) throw new AppError('Kirish talab qilinadi', 401, 'UNAUTHORIZED')
  return data.user.id
}

function scopeQuery<T extends { eq: (field: string, value: string) => T; like: (field: string, pattern: string) => T }>(
  query: T, code: SpecSectionCode,
) {
  return code === 'KS' ? query.eq('group_code', 'KS') : query.like('group_code', code + '.%')
}

function withSearch<T extends { ilike: (field: string, pattern: string) => T }>(query: T, search: string): T {
  const normalized = search.trim()
  if (!normalized) return query
  // Escape PostgREST/SQL wildcard characters; search is literal text.
  return query.ilike('stem_md', '%' + normalized.replace(/[\\%_]/g, '\\$&') + '%')
}

export const specReaderService = {
  async getPage(
    code: SpecSectionCode,
    params: { page: number; pageSize: ReaderPageSize; search: string; reviewOnly: boolean },
    token: string,
  ) {
    const userId = await readerUser(token)
    const start = (params.page - 1) * params.pageSize
    if (!Number.isSafeInteger(start) || start > 200000) {
      throw new AppError('Sahifa chegaradan tashqarida', 422, 'BAD_PAGE')
    }
    const columns: string = params.reviewOnly
      ? 'id,group_code,format,stem_md,user_spec_question_marks!inner(mark,user_id)'
      : 'id,group_code,format,stem_md'
    let query = scopeQuery(supabase.from('questions')
      .select(columns, { count: 'exact' }).eq('status', 'published'), code)
    query = withSearch(query, params.search)
    if (params.reviewOnly) {
      query = query.eq('user_spec_question_marks.user_id', userId)
        .eq('user_spec_question_marks.mark', 'review')
    }
    const { data, count, error } = await query.order('id', { ascending: true })
      .range(start, start + params.pageSize - 1)
    if (error || !data) throw new AppError('O‘qish sahifasi yuklanmadi', 503, 'READER_PAGE_FAILED')

    const rows = data as unknown as Array<{ id: string; group_code: string; format: string; stem_md: string }>
    const ids = rows.map(row => row.id)
    if (ids.length === 0) return { questions: [], total: count ?? 0, page: params.page, page_size: params.pageSize }

    const [optionsResult, keysResult] = await Promise.all([
      supabase.from('question_options').select('id,question_id,side,order_idx,content_md')
        .in('question_id', ids).order('order_idx', { ascending: true }),
      supabase.from('question_keys').select('question_id,payload,explanation_md')
        .in('question_id', ids),
    ])
    if (optionsResult.error || keysResult.error || !optionsResult.data || !keysResult.data) {
      throw new AppError('Javoblar yoki izohlar yuklanmadi', 503, 'READER_KEY_FAILED')
    }

    const byQuestion = new Map<string, typeof optionsResult.data>()
    for (const opt of optionsResult.data) {
      const list = byQuestion.get(opt.question_id) ?? []
      list.push(opt)
      byQuestion.set(opt.question_id, list)
    }
    const keyByQuestion = new Map(keysResult.data.map(k => [k.question_id, k]))
    // Never show a published question with a missing answer key or explanation.
    if (rows.some(q => !keyByQuestion.has(q.id))) {
      throw new AppError('Bir savolning javob kaliti yetishmayapti', 503, 'READER_KEY_MISSING')
    }
    return {
      questions: rows.map(q => ({
        id: q.id, group_code: q.group_code, format: q.format, stem_md: q.stem_md,
        options: (byQuestion.get(q.id) ?? []).map(o => ({
          id: o.id, side: o.side, order_idx: o.order_idx, content_md: o.content_md,
        })),
        correct_answer: keyByQuestion.get(q.id)!.payload,
        explanation_md: keyByQuestion.get(q.id)!.explanation_md ?? '',
      })),
      total: count ?? 0, page: params.page, page_size: params.pageSize,
    }
  },

  async getState(code: SpecSectionCode, token: string) {
    const userId = await readerUser(token)
    const { data: position, error: positionError } = await supabase
      .from('user_spec_read_positions').select('page_number,page_size,search_text,review_only')
      .eq('user_id', userId).eq('section_code', code).maybeSingle()
    if (positionError) throw new AppError('O‘qish holati yuklanmadi', 503, 'READER_STATE_FAILED')

    const marks: Record<string, 'memorized' | 'review'> = {}
    for (let start = 0; start < 10000; start += 1000) {
      const { data, error } = await supabase.from('user_spec_question_marks')
        .select('question_id,mark').eq('user_id', userId).eq('section_code', code)
        .order('question_id', { ascending: true }).range(start, start + 999)
      if (error || !data) throw new AppError('Belgilangan savollar yuklanmadi', 503, 'READER_MARKS_FAILED')
      for (const row of data) {
        if (row.mark === 'memorized' || row.mark === 'review') marks[row.question_id] = row.mark
      }
      if (data.length < 1000) break
    }
    return {
      page: position?.page_number ?? 1,
      page_size: position?.page_size ?? 30,
      search: position?.search_text ?? '',
      review_only: position?.review_only ?? false,
      marks,
    }
  },

  async setMark(code: SpecSectionCode, questionId: string, mark: ReaderMark, token: string) {
    const userId = await readerUser(token)
    let lookup = supabase.from('questions').select('id')
      .eq('id', questionId).eq('status', 'published')
    lookup = code === 'KS' ? lookup.eq('group_code', 'KS') : lookup.like('group_code', code + '.%')
    const { data: exists, error: questionError } = await lookup.maybeSingle()
    if (questionError) throw new AppError('Savolni tekshirib bo‘lmadi', 503, 'READER_MARK_FAILED')
    if (!exists) throw new NotFoundError('Ushbu bo‘limning nashr qilingan savoli topilmadi')
    if (mark === null) {
      const { error } = await supabase.from('user_spec_question_marks').delete()
        .eq('user_id', userId).eq('question_id', questionId)
      if (error) throw new AppError('Belgi o‘chirilmadi', 503, 'READER_MARK_FAILED')
    } else {
      const { error } = await supabase.from('user_spec_question_marks').upsert({
        user_id: userId, question_id: questionId, section_code: code,
        mark, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,question_id' })
      if (error) throw new AppError('Belgi saqlanmadi', 503, 'READER_MARK_FAILED')
    }
    return { question_id: questionId, mark }
  },

  async savePosition(
    code: SpecSectionCode,
    position: { page: number; pageSize: ReaderPageSize; search: string; reviewOnly: boolean },
    token: string,
  ) {
    const userId = await readerUser(token)
    const { error } = await supabase.from('user_spec_read_positions').upsert({
      user_id: userId,
      section_code: code,
      page_number: position.page,
      page_size: position.pageSize,
      search_text: position.search,
      review_only: position.reviewOnly,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,section_code' })
    if (error) throw new AppError('O‘qish joyi saqlanmadi', 503, 'READER_POSITION_FAILED')
    return { saved: true }
  },
}
