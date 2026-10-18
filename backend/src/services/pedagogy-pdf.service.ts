import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError } from '../lib/errors.js'

export interface PedagogyPdfListFilters {
  page: number
  page_size: number
  status?: 'verified' | 'accepted_general' | 'rejected' | 'needs_review'
  source_year?: number
  unlinked_only?: boolean
}

/** Private, staff-only source review inbox; never a learner question source. */
export const pedagogyPdfService = {
  async list(token: string, filters: PedagogyPdfListFilters) {
    const { data: auth, error: authError } = await supabase.auth.getUser(token)
    if (authError || !auth.user) throw new AuthError()

    const { data: profile, error: roleError } = await supabase.from('profiles')
      .select('role, is_blocked').eq('id', auth.user.id).maybeSingle()
    if (roleError) throw new AppError('Ruxsat tekshirilmadi', 500, 'ROLE_CHECK_ERROR')
    if (!profile || profile.is_blocked ||
      (profile.role !== 'editor' && profile.role !== 'admin')) {
      throw new ForbiddenError('PDF manbalarni faqat vakolatli tahririyat ko‘ra oladi')
    }

    let request = supabase.from('pedagogy_pdf_source_candidates')
      .select(
        'id, source_file_name, source_year, source_sitting, page_no, source_question_no, ' +
        'raw_question_private, raw_answer_private, editorial_status, answer_key_status, ' +
        'historical_exam_claim_status, mapped_construct_id, attestation_bucket, ' +
        'linked_question_id, source_quality_flags, review_notes, reviewed_at',
        { count: 'exact' },
      )
      .order('source_year', { ascending: false })
      .order('page_no', { ascending: true })
      .order('source_question_no', { ascending: true })
      .order('id', { ascending: true })
    if (filters.status) request = request.eq('editorial_status', filters.status)
    if (filters.source_year) request = request.eq('source_year', filters.source_year)
    if (filters.unlinked_only) request = request.is('linked_question_id', null)

    const from = (filters.page - 1) * filters.page_size
    const { data, count, error } = await request.range(from, from + filters.page_size - 1)
    if (error) throw new AppError('PDF manbalarini yuklab bo‘lmadi', 500, 'PDF_SOURCE_QUERY_ERROR')

    return {
      items: data ?? [],
      total: count ?? 0,
      page: filters.page,
      page_size: filters.page_size,
      disclaimer: 'Private source candidates; source marks are not official exam evidence.',
    }
  },
}
