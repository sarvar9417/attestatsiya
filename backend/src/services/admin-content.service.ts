import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError, NotFoundError } from '../lib/errors.js'
import type {
  AdminContentStatus,
  CreateAdminModuleInput,
  SaveAdminQuestionInput,
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
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) {
    throw new AppError('Rolni tekshirishda xatolik', 500, 'ADMIN_ROLE_CHECK_ERROR')
  }

  if (!profile || (profile.role !== 'editor' && profile.role !== 'admin')) {
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
    side: String.fromCharCode(97 + index),
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

  async listQuestions(status: AdminContentStatus | undefined, userToken: string) {
    await requireStaff(userToken)

    let query = supabase
      .from('questions')
      .select('id, stem_md, format, cognitive, difficulty, status, group_code, construct_id, subject_id, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw new AppError('Savollarni yuklashda xatolik', 500, 'ADMIN_QUERY_ERROR')
    return { items: data ?? [] }
  },

  async transitionQuestion(
    questionId: string,
    nextStatus: AdminContentStatus,
    userToken: string
  ) {
    const staff = await requireStaff(userToken)

    const { data: current, error: readError } = await supabase
      .from('questions')
      .select('id, status')
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

    const { data, error } = await supabase
      .from('questions')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', questionId)
      .select('id, status')
      .single()

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
    const construct = await resolveConstruct(input.construct_id)

    const { data: existing, error: existingError } = await supabase
      .from('questions')
      .select('id, status')
      .eq('id', questionId)
      .maybeSingle()
    if (existingError) throw new AppError('Savolni tekshirishda xatolik', 500, 'ADMIN_QUERY_ERROR')
    if (!existing) throw new NotFoundError('Savol topilmadi')

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
