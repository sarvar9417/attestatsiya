import { z } from 'zod'
import { typedSupabase } from '../../lib/supabase'
import { examItemSchema, postgresUuidSchema } from '../exam/contracts'

const roomRef = z.object({ room_id: z.string().uuid(), code: z.string().regex(/^[A-F0-9]{8}$/) })
const member = z.object({
  user_id: z.string().uuid(),
  name: z.string(),
  score: z.number().int().nonnegative(),
  has_answered: z.boolean(),
})
const message = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  body: z.string(),
  created_at: z.string(),
})
const answerSummary = z.object({
  user_id: z.string().uuid(),
  name: z.string(),
  answer: z.unknown().nullable(),
  is_correct: z.boolean().nullable(),
})
const stateSchema = roomRef.extend({
  mode: z.enum(['spec', 'topics', 'manual']),
  status: z.enum(['lobby', 'question', 'reveal', 'finished']),
  is_host: z.boolean(),
  total_count: z.number().int().min(1).max(100),
  current_idx: z.number().int().min(1).max(100),
  members: z.array(member),
  messages: z.array(message),
  question: examItemSchema.nullable(),
  my_answer: z.unknown().nullable(),
  answered_count: z.number().int().nonnegative(),
  answers: z.array(answerSummary),
  correct_answer: z.record(z.string(), z.unknown()).nullable(),
  explanation_md: z.string().nullable(),
})
export type GroupMockState = z.infer<typeof stateSchema>
export type GroupMockQuestion = NonNullable<GroupMockState['question']>
export type GroupMockMember = z.infer<typeof member>

const bankQuestion = z.object({
  id: postgresUuidSchema,
  stem_md: z.string().min(1),
  format: z.enum(['Y1', 'Y2', 'Y3']),
  difficulty: z.number().int().min(1).max(5),
})
export type BankQuestion = z.infer<typeof bankQuestion>
export type GroupMockMode = 'spec' | 'topics' | 'manual'
export type GroupMockTopic = { lesson_id: string; count: number; difficulty: number }

const messages: Record<string, string> = {
  group_auth_required: 'Testga kirish uchun hisobingizga kiring.',
  group_not_found: 'Bu kod bilan xona topilmadi.',
  group_bad_code: 'Xona kodi 8 belgidan iborat bo‘lishi kerak.',
  group_not_member: 'Siz ushbu xonaning ishtirokchisi emassiz.',
  group_not_host: 'Bu amalni faqat tashkilotchi bajara oladi.',
  group_invalid_stage: 'Xona boshqa bosqichga o‘tgan. Holatni yangilang.',
  group_join_closed: 'Bu guruhli test boshlangan, yangi ishtirokchilar kiritilmaydi.',
  group_room_full: 'Xonada 40 nafardan ko‘p ishtirokchi bo‘lishi mumkin emas.',
  group_answer_closed: 'Savolning javob berish bosqichi yakunlandi.',
  group_already_answered: 'Siz bu savolga javob bergansiz.',
  group_invalid_answer: 'Javob formati noto‘g‘ri yoki to‘liq emas.',
  group_invalid_input: 'Test sozlamalarini tekshiring.',
  group_invalid_message: 'Xabar 1–500 belgidan iborat bo‘lishi kerak.',
  group_message_rate_limit: 'Keyingi xabar uchun 2 soniya kuting.',
  group_spec_pool_insufficient: 'Rasmiy spetsifikatsiyadagi kvota uchun savollar yetarli emas.',
  group_topic_pool_insufficient: 'Tanlangan mavzu va darajada savollar yetarli emas.',
  group_question_unavailable: 'Tanlangan savollardan biri nashr etilmagan yoki yaroqsiz.',
  group_too_many_rooms: 'Avval ochilgan guruhlaringizni yakunlang (maksimum 5 ta).',
  group_blueprint_unavailable: 'Faol rasmiy spetsifikatsiya topilmadi.',
  group_blueprint_invalid: 'Faol spetsifikatsiya kvotalari nomuvofiq.',
  group_lesson_unavailable: 'Tanlangan mavzu hozir mavjud emas.',
}

type RpcResult = { data: unknown; error: { message: string } | null }
type RpcCall = (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult>
const rpc = typedSupabase.rpc.bind(typedSupabase) as unknown as RpcCall

async function call(name: string, args: Record<string, unknown>): Promise<unknown> {
  const { data, error } = await rpc(name, args)
  if (error) {
    const code = /group_[a-z_]+/.exec(error.message)?.[0] ?? ''
    throw new Error(messages[code] ?? 'Guruhli test serveri javob bermadi. Qayta urinib ko‘ring.')
  }
  return data
}

export async function createGroupMock(mode: GroupMockMode, config: Record<string, unknown>) {
  return roomRef.parse(await call('group_mock_create', { p_mode: mode, p_config: config }))
}
export async function joinGroupMock(code: string) {
  return roomRef.parse(await call('group_mock_join', { p_code: code.toUpperCase().trim() }))
}
export async function getGroupMockState(roomId: string): Promise<GroupMockState> {
  return stateSchema.parse(await call('group_mock_state', { p_room: roomId }))
}
export async function startGroupMock(roomId: string) {
  await call('group_mock_start', { p_room: roomId })
}
export async function answerGroupMock(roomId: string, answer: Record<string, unknown>) {
  await call('group_mock_answer', { p_room: roomId, p_answer: answer })
}
export async function stepGroupMock(roomId: string, action: 'reveal' | 'next') {
  await call('group_mock_step', { p_room: roomId, p_action: action })
}
export async function messageGroupMock(roomId: string, body: string) {
  await call('group_mock_message', { p_room: roomId, p_body: body })
}
export async function listGroupBank(lessonId: string, search = ''): Promise<BankQuestion[]> {
  return z.array(bankQuestion).parse(await call('group_mock_bank', {
    p_lesson: lessonId, p_search: search.slice(0, 100), p_limit: 100,
  }))
}

/** Never reveal a group's correct answer or other learners' answers before
 * the server marks the current question as revealed. */
export function visibleGroupFeedback(state: GroupMockState) {
  if (state.status !== 'reveal' && state.status !== 'finished') return null
  return {
    correct_answer: state.correct_answer,
    explanation_md: state.explanation_md,
    answers: state.answers,
  }
}

export function correctGroupAnswerLabel(question: GroupMockQuestion, key: Record<string, unknown>): string {
  const lookup = new Map(question.options.map(option => [option.id, option.content_md]))
  if (question.format === 'Y1') {
    return lookup.get(String(key.correct_option_id ?? '')) ?? 'To‘g‘ri variant'
  }
  if (question.format === 'Y2') {
    const pairs = key.pairs
    if (!pairs || typeof pairs !== 'object' || Array.isArray(pairs)) return 'Moslik kaliti'
    return Object.entries(pairs as Record<string, unknown>)
      .map(([left, right]) => (lookup.get(left) ?? left) + ' → ' + (lookup.get(String(right)) ?? String(right)))
      .join('; ')
  }
  const order = key.order
  if (!Array.isArray(order)) return 'To‘g‘ri tartib'
  return order.map(id => lookup.get(String(id)) ?? String(id)).join(' → ')
}
