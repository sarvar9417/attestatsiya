import { createServiceClient, supabase } from '../lib/supabase.js'
import { AppError, NotFoundError } from '../lib/errors.js'

/**
 * 2026-yilgi spetsifikatsiya: yetti mutaxassislik mazmun sohasi,
 * kasb standarti va pedagogik mahorat (shu jumladan metodika).
 * M01–M16 learner modullari bilan aralashtirmang.
 */
export const SPEC_SECTIONS = [
  { code: 'S1', title: 'Axborot va raqamli savodxonlik asoslari' },
  { code: 'S2', title: 'Kompyuter tizimlari va dasturiy muhit' },
  { code: 'S3', title: 'Mantiqiy fikrlash va algoritmlash' },
  { code: 'S4', title: 'Dasturlash va ma’lumotlar bilan ishlash asoslari' },
  { code: 'S5', title: 'Grafika va veb-texnologiyalar' },
  { code: 'S6', title: 'Kompyuter tizimlari va tarmoqlari' },
  { code: 'S7', title: 'Axborot xavfsizligi va raqamli xizmatlar' },
  { code: 'KS', title: 'Kasb standarti' },
  { code: 'PM', title: 'Pedagogik mahorat' },
] as const

export type SpecSectionCode = (typeof SPEC_SECTIONS)[number]['code']

function sectionScope(code: SpecSectionCode) {
  return code === 'KS' ? { exact: 'KS' } : { prefix: code + '.%' }
}

function publishedQuestions(code: SpecSectionCode) {
  const query = supabase.from('questions').select(
    'id,group_code,format,stem_md,assets'
  ).eq('status', 'published')
  const scope = sectionScope(code)
  return 'exact' in scope
    ? query.eq('group_code', scope.exact)
    : query.like('group_code', scope.prefix)
}

async function requireUser(token: string) {
  const { data, error } = await createServiceClient().auth.getUser(token)
  if (error || !data.user) {
    throw new AppError('Sessiya muddati tugagan. Qayta kiring.', 401, 'UNAUTHORIZED')
  }
}

type SelectedAnswer =
  | { option_id: string }
  | { pairs: Record<string, string> }
  | { order: string[] }

type KeyPayload = {
  correct_option_id?: unknown
  pairs?: unknown
  order?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sameSet(a: string[], b: string[]) {
  return a.length === b.length &&
    new Set(a).size === a.length &&
    new Set(b).size === b.length &&
    a.every(id => b.includes(id))
}

export const specPracticeService = {
  async listSections(token: string) {
    await requireUser(token)
    return await Promise.all(SPEC_SECTIONS.map(async section => {
      const scope = sectionScope(section.code)
      const base = supabase.from('questions')
        .select('id', { count: 'exact', head: true }).eq('status', 'published')
      const { count, error } = 'exact' in scope
        ? await base.eq('group_code', scope.exact)
        : await base.like('group_code', scope.prefix)
      if (error || count === null) {
        throw new AppError('Bo‘lim testlari sonini yuklab bo‘lmadi', 503, 'SPEC_COUNT_FAILED')
      }
      return { ...section, count }
    }))
  },

  async listQuestions(code: SpecSectionCode, cursor: string | undefined, token: string) {
    await requireUser(token)
    const scope = sectionScope(code)
    const countBase = supabase.from('questions')
      .select('id', { count: 'exact', head: true }).eq('status', 'published')
    const countResult = 'exact' in scope
      ? await countBase.eq('group_code', scope.exact)
      : await countBase.like('group_code', scope.prefix)
    if (countResult.error) {
      throw new AppError('Bo‘lim testlari sonini tekshirib bo‘lmadi', 503, 'SPEC_COUNT_FAILED')
    }

    let query = publishedQuestions(code).order('id', { ascending: true }).limit(21)
    if (cursor) query = query.gt('id', cursor)
    const { data: rows, error } = await query
    if (error || !rows) {
      throw new AppError('Testlar yuklanmadi', 503, 'SPEC_QUESTIONS_FAILED')
    }
    const page = rows.slice(0, 20)
    const ids = page.map(q => q.id)
    if (!ids.length) return { questions: [], next_cursor: null, total: countResult.count ?? 0 }
    const { data: options, error: optionError } = await supabase
      .from('question_options')
      .select('id,question_id,side,order_idx,content_md')
      .in('question_id', ids)
      .order('order_idx', { ascending: true })
    if (optionError || !options) {
      throw new AppError('Test variantlari yuklanmadi', 503, 'SPEC_OPTIONS_FAILED')
    }
    const optionMap = new Map<string, typeof options>()
    for (const opt of options) {
      const current = optionMap.get(opt.question_id) ?? []
      current.push(opt)
      optionMap.set(opt.question_id, current)
    }
    return {
      questions: page.map(q => ({
        ...q,
        options: (optionMap.get(q.id) ?? []).map(o => ({
          id: o.id, side: o.side, order_idx: o.order_idx, content_md: o.content_md,
        })),
      })),
      next_cursor: rows.length > 20 ? page[page.length - 1].id : null,
      total: countResult.count ?? 0,
    }
  },

  async checkAnswer(code: SpecSectionCode, questionId: string, answer: SelectedAnswer, token: string) {
    await requireUser(token)
    // Never check draft/review/archived or an unrelated section's question.
    const scope = sectionScope(code)
    let questionQuery = supabase.from('questions')
      .select('id,format').eq('id', questionId).eq('status', 'published')
    questionQuery = 'exact' in scope
      ? questionQuery.eq('group_code', scope.exact)
      : questionQuery.like('group_code', scope.prefix)
    const { data: question, error: qError } = await questionQuery.maybeSingle()
    if (qError) throw new AppError('Savolni tekshirishda xato', 503, 'SPEC_CHECK_FAILED')
    if (!question) throw new NotFoundError('Ushbu bo‘limda tasdiqlangan savol topilmadi')

    const [keyResult, optionsResult] = await Promise.all([
      supabase.from('question_keys')
        .select('payload,explanation_md').eq('question_id', questionId).maybeSingle(),
      supabase.from('question_options')
        .select('id,side').eq('question_id', questionId),
    ])
    if (keyResult.error || optionsResult.error || !keyResult.data || !optionsResult.data) {
      throw new AppError('Javob kaliti vaqtincha mavjud emas', 503, 'SPEC_KEY_UNAVAILABLE')
    }
    const raw = keyResult.data.payload as unknown
    if (!isRecord(raw)) throw new AppError('Javob kaliti formati xato', 503, 'SPEC_KEY_INVALID')
    const key = raw as KeyPayload
    const options = optionsResult.data
    let correct = false
    let correctAnswer: SelectedAnswer

    if (question.format === 'Y1' && 'option_id' in answer) {
      const validIds = options.filter(o => o.side === 'a').map(o => o.id)
      if (!validIds.includes(answer.option_id)) {
        throw new AppError('Javob varianti ushbu savolga tegishli emas', 422, 'INVALID_ANSWER')
      }
      if (typeof key.correct_option_id !== 'string' || !validIds.includes(key.correct_option_id)) {
        throw new AppError('Savol kaliti xato', 503, 'SPEC_KEY_INVALID')
      }
      correct = answer.option_id === key.correct_option_id
      correctAnswer = { option_id: key.correct_option_id }
    } else if (question.format === 'Y2' && 'pairs' in answer) {
      const left = options.filter(o => o.side === 'a').map(o => o.id)
      const right = options.filter(o => o.side === 'b').map(o => o.id)
      if (!sameSet(Object.keys(answer.pairs), left) ||
          !sameSet(Object.values(answer.pairs), right)) {
        throw new AppError('Barcha juftliklarni bittadan tanlang', 422, 'INVALID_ANSWER')
      }
      if (!isRecord(key.pairs) ||
          !sameSet(Object.keys(key.pairs), left) ||
          !Object.values(key.pairs).every(v => typeof v === 'string') ||
          !sameSet(Object.values(key.pairs) as string[], right)) {
        throw new AppError('Juftliklar kaliti xato', 503, 'SPEC_KEY_INVALID')
      }
      const pairs = key.pairs as Record<string, string>
      correct = left.every(id => answer.pairs[id] === pairs[id])
      correctAnswer = { pairs }
    } else if (question.format === 'Y3' && 'order' in answer) {
      const ids = options.filter(o => o.side === 'a').map(o => o.id)
      if (!sameSet(answer.order, ids)) {
        throw new AppError('Barcha elementlarni takrorlamay tartiblang', 422, 'INVALID_ANSWER')
      }
      if (!Array.isArray(key.order) ||
          !key.order.every(v => typeof v === 'string') ||
          !sameSet(key.order as string[], ids)) {
        throw new AppError('Ketma-ketlik kaliti xato', 503, 'SPEC_KEY_INVALID')
      }
      const order = key.order as string[]
      correct = order.every((id, i) => id === answer.order[i])
      correctAnswer = { order }
    } else {
      throw new AppError('Javob formati savol turiga mos emas', 422, 'INVALID_ANSWER')
    }

    // Key and explanation are sent ONLY after a complete answer was submitted.
    // This is a study endpoint, unrelated to timed exam generation/review.
    return {
      correct,
      correct_answer: correctAnswer,
      explanation_md: keyResult.data.explanation_md ?? '',
    }
  },
}
