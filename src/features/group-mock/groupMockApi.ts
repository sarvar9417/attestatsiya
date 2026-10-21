import { z } from 'zod'
import { sessionStore } from '../auth/sessionStore'
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
  status: z.enum(['lobby', 'question', 'reveal', 'paused', 'finished']),
  paused_from_status: z.enum(['lobby', 'question', 'reveal']).nullable(),
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
const myRoomSchema = roomRef.extend({
  mode: z.enum(['spec', 'topics', 'manual']),
  status: z.enum(['lobby', 'question', 'reveal', 'paused', 'finished']),
  is_host: z.boolean(),
  total_count: z.number().int().min(1).max(100),
  current_idx: z.number().int().min(1).max(100),
  created_at: z.string().datetime({ offset: true }),
  member_count: z.number().int().nonnegative(),
})
export type GroupMockRoomSummary = z.infer<typeof myRoomSchema>
export type GroupMockQuestion = NonNullable<GroupMockState['question']>
export type GroupMockMember = z.infer<typeof member>

const bankQuestion = z.object({
  id: postgresUuidSchema,
  stem_md: z.string().min(1),
  format: z.enum(['Y1', 'Y2', 'Y3']),
  difficulty: z.number().int().min(1).max(5),
  options: z.array(z.object({
    id: postgresUuidSchema, side: z.enum(['a', 'b']), content_md: z.string(),
  })),
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
  group_host_cannot_leave: 'Tashkilotchi xonadan chiqish o‘rniga uni bekor qilishi mumkin.',
  group_report_unavailable: 'To‘liq hisobot faqat test yakunlangandan keyin ochiladi.',
}

// The platform authenticates through /api/auth and stores its JWT in sessionStore.
// A separate Supabase client has no knowledge of that session and sends the anon
// token instead. Call the PostgREST RPC with the actual authenticated JWT.
async function call(name: string, args: Record<string, unknown>): Promise<unknown> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  const token = sessionStore.get()?.access_token
  if (!token) throw new Error(messages.group_auth_required)
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Guruhli test serveri sozlanmagan. Administratorga xabar bering.')
  }

  let response: Response
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    })
  } catch {
    throw new Error('Guruhli test serveriga ulanib bo‘lmadi. Internetni tekshiring.')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const details = payload && typeof payload === 'object' ? payload as {
      message?: string; code?: string
    } : {}
    const code = /group_[a-z_]+/.exec(details.message ?? '')?.[0] ?? ''
    if (details.code === '57014') {
      throw new Error('Guruhli test uchun savollarni tayyorlash muddati tugadi. Qayta urinib ko‘ring yoki boshqa tanlovni sinang.')
    }
    if (response.status === 401 || response.status === 403 ||
      details.code === '42501' || details.code === 'PGRST301') {
      throw new Error('Guruhli testga kirish ruxsati tasdiqlanmadi. Hisobingizdan chiqib, qayta kiring.')
    }
    throw new Error(messages[code] ?? 'Guruhli test serveri javob bermadi. Qayta urinib ko‘ring.')
  }
  return payload
}

export async function listMyGroupMockRooms(): Promise<GroupMockRoomSummary[]> {
  return z.array(myRoomSchema).parse(await call('group_mock_my_rooms', { p_limit: 20 }))
}
export async function cancelGroupMockLobby(roomId: string): Promise<void> {
  await call('group_mock_cancel', { p_room: roomId })
}
export async function leaveGroupMockLobby(roomId: string): Promise<void> {
  await call('group_mock_leave', { p_room: roomId })
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

export async function pauseGroupMock(roomId: string): Promise<void> {
  await call('group_mock_pause', { p_room: roomId })
}
export async function resumeGroupMock(roomId: string): Promise<void> {
  await call('group_mock_resume', { p_room: roomId })
}

const reportAnswer = z.object({
  idx: z.number().int().positive(),
  answer: z.unknown().nullable(),
  is_correct: z.boolean().nullable(),
})
const reportParticipant = z.object({
  user_id: z.string().uuid(),
  name: z.string(),
  answered: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  incorrect: z.number().int().nonnegative(),
  unanswered: z.number().int().nonnegative(),
  score: z.number().int().nonnegative(),
  percentage: z.number(),
  answers: z.array(reportAnswer),
})
const reportQuestion = z.object({
  idx: z.number().int().positive(),
  stem_md: z.string(),
  format: z.enum(['Y1', 'Y2', 'Y3']),
  correct_answer: z.record(z.string(), z.unknown()),
  explanation_md: z.string(),
  answered: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  incorrect: z.number().int().nonnegative(),
  unanswered: z.number().int().nonnegative(),
})
const groupMockReportSchema = z.object({
  room_id: z.string().uuid(),
  code: z.string(),
  total_count: z.number().int().positive(),
  participant_count: z.number().int().nonnegative(),
  finished_at: z.string().nullable(),
  participants: z.array(reportParticipant),
  questions: z.array(reportQuestion),
})
export type GroupMockReport = z.infer<typeof groupMockReportSchema>

export async function getGroupMockReport(roomId: string): Promise<GroupMockReport> {
  return groupMockReportSchema.parse(await call('group_mock_report', { p_room: roomId }))
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
