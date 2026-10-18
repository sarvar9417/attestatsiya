import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError, NotFoundError } from '../lib/errors.js'
import type {
  AdminContentStatus,
  CreateAdminModuleInput,
  SaveAdminQuestionInput,
  SavePedguliEditorialReview,
} from '../schemas/admin-content.js'

type StaffRole = 'editor' | 'admin'

interface StaffIdentity {
  id: string
  role: StaffRole
}

async function requireStaff(userToken: string): Promise<StaffIdentity> {
  const { data, error } = await supabase.auth.getUser(userToken)
  if (error || !data.user) throw new AuthError()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_blocked')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) {
    throw new AppError('Rolni tekshirishda xatolik', 500, 'ADMIN_ROLE_CHECK_ERROR')
  }

  if (!profile || profile.is_blocked === true || (profile.role !== 'editor' && profile.role !== 'admin')) {
    throw new ForbiddenError('Bu amal uchun muharrir yoki admin huquqi kerak')
  }

  return { id: data.user.id, role: profile.role }
}

async function writeAudit(
  actorId: string,
  action: string,
  entity: string,
  entityId: string | null,
  diff: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId,
    diff,
  })

  // Audit failure must be visible to operators, but must not turn an already
  // completed mutation into a false client-side failure.
  if (error) return
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’'ʻʼ\u02bb\u02bc]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

async function resolveConstruct(constructId: string) {
  const { data, error } = await supabase
    .from('constructs')
    .select('id, subject_id, group_code')
    .eq('id', constructId)
    .maybeSingle()

  if (error) throw new AppError('Konstruktni tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
  if (!data) throw new NotFoundError('Konstrukt topilmadi')
  return data
}

async function replaceQuestionOptionsAndKey(
  questionId: string,
  input: SaveAdminQuestionInput
): Promise<void> {
  const { error: keyDeleteError } = await supabase
    .from('question_keys')
    .delete()
    .eq('question_id', questionId)
  if (keyDeleteError) {
    throw new AppError('Eski javob kalitini tozalashda xatolik', 500, 'ADMIN_SAVE_ERROR')
  }

  const { error: optionDeleteError } = await supabase
    .from('question_options')
    .delete()
    .eq('question_id', questionId)
  if (optionDeleteError) {
    throw new AppError('Eski variantlarni tozalashda xatolik', 500, 'ADMIN_SAVE_ERROR')
  }

  if (input.format !== 'Y1') return

  const options = input.options ?? []
  const correctIndex = input.correct_index
  if (options.length !== 4 || correctIndex === undefined) {
    throw new AppError('Y1 savol konfiguratsiyasi to‘liq emas', 400, 'VALIDATION_ERROR')
  }

  const rows = options.map((option, index) => ({
    question_id: questionId,
    content_md: option.content_md.trim(),
    order_idx: index,
    // Y1 is one group of four options, all on side 'a'. a/b/c/d are NOT sides.
    side: 'a',
  }))

  const { data: inserted, error: optionError } = await supabase
    .from('question_options')
    .insert(rows)
    .select('id, order_idx')

  if (optionError || !inserted) {
    throw new AppError('Javob variantlarini saqlashda xatolik', 500, 'ADMIN_SAVE_ERROR')
  }

  const correctOption = inserted.find(option => option.order_idx === correctIndex)
  if (!correctOption) {
    throw new AppError('To‘g‘ri variant topilmadi', 500, 'ADMIN_SAVE_ERROR')
  }

  const { error: keyError } = await supabase.from('question_keys').insert({
    question_id: questionId,
    payload: { correct_option_id: correctOption.id },
    explanation_md: input.explanation_md.trim(),
  })

  if (keyError) {
    throw new AppError('Javob kalitini saqlashda xatolik', 500, 'ADMIN_SAVE_ERROR')
  }
}

const STATUS_TRANSITIONS: Record<AdminContentStatus, AdminContentStatus[]> = {
  draft: ['review'],
  review: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
}

export const adminContentService = {
  async dashboard(userToken: string) {
    const staff = await requireStaff(userToken)

    const [modules, questions, blueprints] = await Promise.all([
      supabase.from('modules').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('blueprints').select('*', { count: 'exact', head: true }),
    ])

    const firstError = modules.error ?? questions.error ?? blueprints.error
    if (firstError) throw new AppError('Admin statistikasi yuklanmadi', 500, 'ADMIN_QUERY_ERROR')

    let users: number | null = null
    if (staff.role === 'admin') {
      const result = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      if (result.error) throw new AppError('Foydalanuvchilar soni yuklanmadi', 500, 'ADMIN_QUERY_ERROR')
      users = result.count ?? 0
    }

    return {
      role: staff.role,
      modules: modules.count ?? 0,
      questions: questions.count ?? 0,
      blueprints: blueprints.count ?? 0,
      users,
    }
  },

  async listModules(userToken: string) {
    await requireStaff(userToken)

    const [modulesResult, lessonsResult, subjectsResult] = await Promise.all([
      supabase.from('modules').select('*').order('order_idx'),
      supabase.from('lessons').select('id, module_id, title_uz, est_minutes, order_idx, slug, status').order('order_idx'),
      supabase.from('subjects').select('id, code, name_uz').order('code'),
    ])

    const firstError = modulesResult.error ?? lessonsResult.error ?? subjectsResult.error
    if (firstError) throw new AppError('Modullarni yuklashda xatolik', 500, 'ADMIN_QUERY_ERROR')

    return {
      modules: modulesResult.data ?? [],
      lessons: lessonsResult.data ?? [],
      subjects: subjectsResult.data ?? [],
    }
  },

  async createModule(input: CreateAdminModuleInput, userToken: string) {
    const staff = await requireStaff(userToken)

    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('id')
      .eq('id', input.subject_id)
      .maybeSingle()
    if (subjectError) throw new AppError('Fanni tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!subject) throw new NotFoundError('Fan topilmadi')

    const { data: lastModule, error: orderError } = await supabase
      .from('modules')
      .select('order_idx')
      .order('order_idx', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (orderError) throw new AppError('Modul tartibini aniqlashda xatolik', 500, 'ADMIN_QUERY_ERROR')

    const normalizedCode = input.code?.trim().toUpperCase() || null
    const slug = slugify(normalizedCode || input.title_uz)
    if (!slug) throw new AppError('Modul uchun yaroqli slug hosil bo‘lmadi', 400, 'VALIDATION_ERROR')

    const { data, error } = await supabase
      .from('modules')
      .insert({
        code: normalizedCode,
        title_uz: input.title_uz.trim(),
        summary_uz: input.summary_uz?.trim() || null,
        slug,
        subject_id: input.subject_id,
        order_idx: (lastModule?.order_idx ?? 0) + 1,
        status: 'draft',
      })
      .select('*')
      .single()

    if (error || !data) {
      throw new AppError(error?.message || 'Modul yaratilmadi', 400, 'ADMIN_SAVE_ERROR')
    }

    await writeAudit(staff.id, 'module.create', 'modules', data.id, {
      code: data.code,
      title_uz: data.title_uz,
      status: data.status,
    })

    return data
  },

  async listQuestions(
    status: AdminContentStatus | undefined, userToken: string,
    source?: 'pedguli' | 'pedagogy_pdf', page = 1, pageSize = 25,
    groupCode?: 'KS' | 'PM.GEN' | 'PM.MET', search?: string,
  ) {
    await requireStaff(userToken)

    let query = supabase
      .from('questions')
      .select('id, stem_md, format, cognitive, difficulty, status, group_code, construct_id, subject_id, source_reference, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })

    if (status) query = query.eq('status', status)
    if (source === 'pedguli') query = query.like('source_reference', 'authored:pedguli-%')
    if (source === 'pedagogy_pdf') query = query.like('source_reference', 'authored:pedagogy-pdf-corpus:%')
    if (groupCode) query = query.eq('group_code', groupCode)
    if (search?.trim()) {
      // PostgREST parameterizes ilike(); escape wildcard metacharacters so
      // the literal text search cannot silently become an unbounded scan.
      const escaped = search.trim().replace(/[\\%_]/g, '\\$&')
      query = query.ilike('stem_md', `%${escaped}%`)
    }
    const offset = (page - 1) * pageSize
    const { data, count, error } = await query.range(offset, offset + pageSize - 1)
    if (error) throw new AppError('Savollarni yuklashda xatolik', 500, 'ADMIN_QUERY_ERROR')

    const items = data ?? []
    const professionalIds = items
      .filter(item => ['KS', 'PM.GEN', 'PM.MET'].includes(item.group_code))
      .map(item => item.id)
    let queued = new Map<string, string | null>()
    if (professionalIds.length) {
      const { data: candidates, error: queueError } = await supabase
        .from('pedagogy_revision_queue')
        .select('source_question_id, revision_question_id')
        .in('source_question_id', professionalIds)
      if (queueError) throw new AppError('Pedagogika sifat navbati ochilmadi', 500, 'ADMIN_QUERY_ERROR')
      queued = new Map((candidates ?? []).map(c => [c.source_question_id, c.revision_question_id]))
    }
    return {
      items: items.map(item => ({
        ...item,
        length_bias_flag: queued.has(item.id),
        revision_question_id: queued.get(item.id) ?? null,
      })),
      total: count ?? 0, page, page_size: pageSize,
    }
  },

  async stagePedagogyRevision(questionId: string, userToken: string) {
    const staff = await requireStaff(userToken)
    if (staff.role !== 'admin') {
      throw new ForbiddenError('Yangi tahrir yaratish uchun administrator kerak')
    }
    const { data, error } = await supabase.rpc('stage_pedagogy_revision', {
      p_source_question_id: questionId,
      p_actor_id: staff.id,
    })
    if (error?.message?.includes('PEDAGOGY_REVISION_NOT_QUEUED')) {
      throw new AppError('Ushbu savol sifat navbatida yo‘q', 409, 'REVISION_NOT_QUEUED')
    }
    if (error || typeof data !== 'string') {
      throw new AppError('Savolning yangi tahriri yaratilmagan', 500, 'REVISION_STAGE_ERROR')
    }
    await writeAudit(staff.id, 'pedagogy.revision_staged', 'questions', data, {
      source_question_id: questionId,
      status: 'review',
    })
    return { id: data, status: 'review' as const }
  },

  async getPedguliEditorialReview(questionId: string, userToken: string) {
    await requireStaff(userToken)
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, status, source_reference, group_code')
      .eq('id', questionId).maybeSingle()
    if (questionError) throw new AppError('Savolni olishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!question) throw new NotFoundError('Savol topilmadi')
    if (!(['KS','PM.GEN','PM.MET'].includes(question.group_code) ||
      question.source_reference?.startsWith('authored:pedguli-') ||
      question.source_reference?.startsWith('authored:pedagogy-pdf-corpus:'))) {
      throw new AppError('Bu tekshiruv pedagogika va kasb standarti savollari uchun', 400, 'INVALID_EDITORIAL_SOURCE')
    }
    const { data, error } = await supabase.from('question_editorial_checks')
      .select('question_id, reviewer_id, reviewed_at, answer_verified, reference_verified, wording_verified, original_authorship_verified, reviewer_notes')
      .eq('question_id', questionId).maybeSingle()
    if (error) throw new AppError('Tahririy tekshiruvni yuklab bo‘lmadi', 500, 'ADMIN_QUERY_ERROR')
    return { question_id: questionId, status: question.status, checks: data ?? null }
  },

  async savePedguliEditorialReview(
    questionId: string,
    input: SavePedguliEditorialReview,
    userToken: string
  ) {
    const staff = await requireStaff(userToken)
    if (staff.role !== 'admin') {
      throw new ForbiddenError('Tekshiruvni faqat administrator tasdiqlashi mumkin')
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, status, source_reference, group_code')
      .eq('id', questionId).maybeSingle()
    if (questionError) throw new AppError('Savolni olishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!question) throw new NotFoundError('Savol topilmadi')
    if (question.status !== 'review' || !(
      ['KS','PM.GEN','PM.MET'].includes(question.group_code) ||
      question.source_reference?.startsWith('authored:pedguli-') ||
      question.source_reference?.startsWith('authored:pedagogy-pdf-corpus:'))) {
      throw new AppError('Faqat Review holatidagi pedagogika savolini tasdiqlash mumkin', 409, 'INVALID_EDITORIAL_STATUS')
    }

    const { data, error } = await supabase.from('question_editorial_checks')
      .upsert({
        question_id: questionId,
        reviewer_id: staff.id,
        answer_verified: input.answer_verified,
        reference_verified: input.reference_verified,
        wording_verified: input.wording_verified,
        original_authorship_verified: input.original_authorship_verified,
        reviewer_notes: input.reviewer_notes,
      }, { onConflict: 'question_id' })
      .select('question_id, reviewer_id, reviewed_at, answer_verified, reference_verified, wording_verified, original_authorship_verified, reviewer_notes')
      .single()

    if (error || !data) {
      throw new AppError('Tahririy tekshiruv saqlanmadi', 500, 'EDITORIAL_SAVE_ERROR')
    }
    await writeAudit(staff.id, 'question.editorial_review', 'questions', questionId, {
      answer_verified: input.answer_verified,
      reference_verified: input.reference_verified,
      wording_verified: input.wording_verified,
      original_authorship_verified: input.original_authorship_verified,
      // Do not place potentially sensitive/private review notes in audit log.
    })
    return data
  },

  async transitionQuestion(
    questionId: string,
    nextStatus: AdminContentStatus,
    userToken: string
  ) {
    const staff = await requireStaff(userToken)

    const { data: current, error: readError } = await supabase
      .from('questions')
      .select('id, status, author_id, source_reference, construct_id, group_code')
      .eq('id', questionId)
      .maybeSingle()
    if (readError) throw new AppError('Savol holatini olishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!current) throw new NotFoundError('Savol topilmadi')

    const allowed = STATUS_TRANSITIONS[current.status as AdminContentStatus] ?? []
    if (!allowed.includes(nextStatus)) {
      throw new AppError(
        `${current.status} → ${nextStatus} o‘tishiga ruxsat yo‘q`,
        409,
        'INVALID_STATUS_TRANSITION'
      )
    }

    if (nextStatus === 'published') {
      if (staff.role !== 'admin') {
        throw new ForbiddenError('Savolni nashr qilish uchun admin huquqi kerak')
      }
      if (current.author_id && current.author_id === staff.id) {
        throw new ForbiddenError('Muallif o‘z savolini nashr qila olmaydi')
      }
      if (!current.construct_id || !current.source_reference?.trim()) {
        throw new AppError(
          'Nashr qilish uchun konstrukt va manba ko‘rsatilgan bo‘lishi kerak',
          409,
          'PUBLISH_REQUIREMENTS_FAILED'
        )
      }

      const { data: key, error: keyError } = await supabase
        .from('question_keys')
        .select('question_id')
        .eq('question_id', questionId)
        .maybeSingle()
      if (keyError) {
        throw new AppError('Javob kalitini tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
      }
      if (!key) {
        throw new AppError(
          'Nashr qilish uchun javob kaliti mavjud bo‘lishi kerak',
          409,
          'PUBLISH_REQUIREMENTS_FAILED'
        )
      }
    }

    if (nextStatus === 'published' && (['KS','PM.GEN','PM.MET'].includes((current as {group_code?:string}).group_code ?? '') ||
      current.source_reference?.startsWith('authored:pedguli-') ||
      current.source_reference?.startsWith('authored:pedagogy-pdf-corpus:'))) {
      const { data: approval, error: approvalError } = await supabase
        .from('question_editorial_checks')
        .select('answer_verified, reference_verified, wording_verified, original_authorship_verified')
        .eq('question_id', questionId).maybeSingle()
      if (approvalError) throw new AppError('Tahririy tekshiruvni olishda xatolik', 500, 'ADMIN_QUERY_ERROR')
      if (!approval || !approval.answer_verified || !approval.reference_verified ||
          !approval.wording_verified || !approval.original_authorship_verified) {
        throw new AppError('Nashrdan oldin javob, manba, matn va mualliflikni tekshiring', 409, 'EDITORIAL_APPROVAL_REQUIRED')
      }
      // DB fingerprint trigger checks that no question text/key changed after review.
    }

    // A revision must not be published separately from archival of its
    // original; otherwise both near-identical copies would enter exam pools.
    if (nextStatus === 'published' &&
        current.source_reference?.startsWith('revision:pedagogy:')) {
      const { data, error } = await supabase.rpc('publish_pedagogy_revision', {
        p_revision_question_id: questionId,
        p_actor_id: staff.id,
      })
      if (error?.message?.includes('PEDAGOGY_')) {
        throw new AppError('Mustaqil ekspert tekshiruvi yoki variantlar sifati yakunlanmagan', 409, 'EDITORIAL_APPROVAL_REQUIRED')
      }
      if (error || !data) throw new AppError('Yangi tahrir nashr etilmadi', 500, 'REVISION_PUBLISH_ERROR')
      await writeAudit(staff.id, 'pedagogy.revision_published', 'questions', questionId, {
        archived_source_question_id: (data as {archived_source_question_id?:string}).archived_source_question_id,
      })
      return { id: questionId, status: 'published' as const }
    }

    const { data, error } = await supabase
      .from('questions')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', questionId)
      .select('id, status')
      .single()

    if (error?.message?.includes('PEDGULI_EDITORIAL_APPROVAL_REQUIRED') ||
        error?.message?.includes('PEDAGOGY_EDITORIAL_APPROVAL_REQUIRED') ||
        error?.message?.includes('PEDAGOGY_Y1_DISTRACTOR_REVIEW_REQUIRED')) {
      throw new AppError('Tasdiq eskirgan yoki yetarli emas. Savolni qayta tekshiring', 409, 'EDITORIAL_APPROVAL_REQUIRED')
    }
    if (error || !data) throw new AppError('Savol holati yangilanmadi', 500, 'ADMIN_SAVE_ERROR')

    await writeAudit(staff.id, 'question.status_change', 'questions', questionId, {
      from: current.status,
      to: nextStatus,
    })

    return data
  },

  async questionEditorMeta(userToken: string) {
    await requireStaff(userToken)

    const [constructResult, subjectResult] = await Promise.all([
      supabase
        .from('constructs')
        .select('id, code, title_uz, subject_id, group_code')
        .order('code'),
      supabase.from('subjects').select('id, code, name_uz').order('code'),
    ])

    const firstError = constructResult.error ?? subjectResult.error
    if (firstError) throw new AppError('Savol formasi ma’lumotlari yuklanmadi', 500, 'ADMIN_QUERY_ERROR')

    return {
      constructs: constructResult.data ?? [],
      subjects: subjectResult.data ?? [],
    }
  },

  async questionEditor(questionId: string, userToken: string) {
    await requireStaff(userToken)

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', questionId)
      .maybeSingle()
    if (questionError) throw new AppError('Savolni tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!question) throw new NotFoundError('Savol topilmadi')

    const [optionResult, keyResult] = await Promise.all([
      supabase
        .from('question_options')
        .select('id, content_md, order_idx')
        .eq('question_id', questionId)
        .order('order_idx'),
      supabase
        .from('question_keys')
        .select('payload, explanation_md')
        .eq('question_id', questionId)
        .maybeSingle(),
    ])

    const firstError = optionResult.error ?? keyResult.error
    if (firstError) throw new AppError('Savol konfiguratsiyasi yuklanmadi', 500, 'ADMIN_QUERY_ERROR')

    const payload = keyResult.data?.payload as { correct_option_id?: string } | null
    const options = optionResult.data ?? []
    const correctIndex = options.findIndex(option => option.id === payload?.correct_option_id)

    return {
      options: options.map(option => ({
        id: option.id,
        content_md: option.content_md,
        order_idx: option.order_idx,
      })),
      correct_index: correctIndex >= 0 ? correctIndex : null,
      explanation_md: keyResult.data?.explanation_md ?? '',
    }
  },

  async createQuestion(input: SaveAdminQuestionInput, userToken: string) {
    const staff = await requireStaff(userToken)
    const construct = await resolveConstruct(input.construct_id)

    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        stem_md: input.stem_md.trim(),
        format: input.format,
        cognitive: input.cognitive,
        difficulty: input.difficulty,
        status: 'draft',
        construct_id: construct.id,
        subject_id: construct.subject_id,
        group_code: construct.group_code,
        author_id: staff.id,
      })
      .select('id')
      .single()

    if (error || !question) {
      throw new AppError(error?.message || 'Savol yaratilmadi', 400, 'ADMIN_SAVE_ERROR')
    }

    await replaceQuestionOptionsAndKey(question.id, input)
    await writeAudit(staff.id, 'question.create', 'questions', question.id, {
      format: input.format,
      construct_id: construct.id,
    })

    return { id: question.id }
  },

  async updateQuestion(questionId: string, input: SaveAdminQuestionInput, userToken: string) {
    const staff = await requireStaff(userToken)

    const { data: existing, error: existingError } = await supabase
      .from('questions')
      .select('id, status')
      .eq('id', questionId)
      .maybeSingle()
    if (existingError) throw new AppError('Savolni tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!existing) throw new NotFoundError('Savol topilmadi')
    if (existing.status === 'published') {
      throw new AppError(
        'Published savol joyida tahrirlanmaydi; avval arxivlab yangi draft yarating',
        409,
        'PUBLISHED_IMMUTABLE'
      )
    }

    const construct = await resolveConstruct(input.construct_id)

    const { error } = await supabase
      .from('questions')
      .update({
        stem_md: input.stem_md.trim(),
        format: input.format,
        cognitive: input.cognitive,
        difficulty: input.difficulty,
        construct_id: construct.id,
        subject_id: construct.subject_id,
        group_code: construct.group_code,
        updated_at: new Date().toISOString(),
      })
      .eq('id', questionId)

    if (error) throw new AppError('Savol yangilanmadi', 500, 'ADMIN_SAVE_ERROR')

    await replaceQuestionOptionsAndKey(questionId, input)
    await writeAudit(staff.id, 'question.update', 'questions', questionId, {
      status: existing.status,
      format: input.format,
      construct_id: construct.id,
    })

    return { id: questionId }
  },
}
