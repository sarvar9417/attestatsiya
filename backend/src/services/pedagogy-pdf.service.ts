import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError } from '../lib/errors.js'
import type { StagePedagogyPdfQuestion } from '../schemas/admin-content.js'

export interface PedagogyPdfListFilters {
  page: number
  page_size: number
  status?: 'verified' | 'accepted_general' | 'rejected' | 'needs_review'
  source_year?: number
  unlinked_only?: boolean
}

/** Private, staff-only source review inbox; never a learner question source. */
export const pedagogyPdfService = {
  async stageQuestion(token: string, candidateId: string, input: StagePedagogyPdfQuestion) {
    const { data: auth, error: authError } = await supabase.auth.getUser(token)
    if (authError || !auth.user) throw new AuthError()
    const { data: profile, error: roleError } = await supabase.from('profiles')
      .select('role,is_blocked').eq('id',auth.user.id).maybeSingle()
    if (roleError) throw new AppError('Tahrir huquqi tekshirilmadi',500,'ROLE_CHECK_ERROR')
    if (!profile || profile.is_blocked || !['admin','editor'].includes(profile.role)) {
      throw new ForbiddenError('Savol tayyorlash uchun faol tahririyat huquqi kerak')
    }
    const { data, error } = await supabase.rpc('stage_verified_pdf_pedagogy_question',{
      p_candidate_id:candidateId,
      p_actor_id:auth.user.id,
      p_stem:input.stem_md,
      p_options:input.options,
      p_correct_index:input.correct_index,
      p_explanation:input.explanation_md,
    })
    if (error?.message?.includes('PEDAGOGY_PDF_')) {
      throw new AppError('Manba mustaqil tekshirilmagan yoki javob variantlari sifati talabga mos emas',409,'PDF_SOURCE_OR_OPTIONS_INVALID')
    }
    if (error || typeof data !== 'string') {
      throw new AppError('PDF asosidagi savolni yaratib bo‘lmadi',500,'PDF_AUTHORING_FAILED')
    }
    const { error: auditError } = await supabase.from('audit_log').insert({
      actor_id:auth.user.id,
      action:'pedagogy_pdf.review_question_staged',
      entity:'questions',
      entity_id:data,
      diff:{source_candidate_id:candidateId,status:'review'},
    })
    if (auditError) {
      // Successful DB transaction cannot be undone by a secondary log failure.
      // Operational traces must still remain visible to staff.
    }
    return { id:data, status:'review' as const }
  },

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
