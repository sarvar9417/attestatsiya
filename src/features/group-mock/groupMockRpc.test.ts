import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionStore, type AuthSession } from '../auth/sessionStore'
import { createGroupMock, deleteGroupMockRoom, finishGroupMock, getGroupMockReport, getGroupMockState, GroupMockClientVersionError, listMyGroupMockRooms, pauseGroupMock, resumeGroupMock } from './groupMockApi'

const session: AuthSession = {
  access_token: 'test-user-jwt',
  refresh_token: 'test-refresh',
  expires_at: 4_000_000_000,
  user: {
    id: '93470000-0000-4000-8000-000000000001',
    email: 'test@example.invalid',
    display_name: 'Test',
    role: 'user',
  },
}

describe('group mock RPC authentication regression', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.invalid')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-public-key')
    vi.spyOn(sessionStore, 'get').mockReturnValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('passes the platform login JWT, not the anonymous key, for room listing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(listMyGroupMockRooms()).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'https://example.invalid/rest/v1/rpc/group_mock_my_rooms',
      expect.objectContaining({
        method: 'POST',
        headers: {
          apikey: 'test-public-key',
          Authorization: 'Bearer test-user-jwt',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_limit: 20 }),
      }),
    )
  })


  it('accepts pedagogy in both room lists and joined room state', async () => {
    const roomId = '93470000-0000-4000-8000-000000000002'
    const summary = {
      room_id: roomId, code: 'AABB1122', mode: 'pedagogy', status: 'lobby',
      is_host: false, total_count: 20, current_idx: 1,
      created_at: '2026-10-22T09:00:00Z', member_count: 2,
    }
    const state = {
      room_id: roomId, code: 'AABB1122', mode: 'pedagogy',
      status: 'lobby', paused_from_status: null, is_host: false,
      total_count: 20, current_idx: 1,
      duration_minutes: 30, deadline_at: null,
      members: [], messages: [], question: null, my_answer: null,
      answered_count: 0, answers: [], correct_answer: null, explanation_md: null,
    }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([summary]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(state), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(listMyGroupMockRooms()).resolves.toEqual([summary])
    await expect(getGroupMockState(roomId)).resolves.toEqual(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('explains an unsupported newer mode as a client update, not a network outage', async () => {
    const oldClientPayload = {
      room_id: '93470000-0000-4000-8000-000000000002',
      code: 'AABB1122', mode: 'newer_mode',
      status: 'lobby', paused_from_status: null, is_host: false,
      total_count: 20, current_idx: 1,
      members: [], messages: [], question: null, my_answer: null,
      answered_count: 0, answers: [], correct_answer: null, explanation_md: null,
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify(oldClientPayload), { status: 200 }),
    ))
    const error = await getGroupMockState(oldClientPayload.room_id).catch(value => value)
    expect(error).toBeInstanceOf(GroupMockClientVersionError)
    expect((error as Error).message).toMatch(/Sahifani yangilang/)
  })

  it('uses the same authenticated credentials when creating rooms', async () => {
    const room = {
      room_id: '93470000-0000-4000-8000-000000000002',
      code: 'A1B2C3D4',
    }
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(room), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(createGroupMock('spec', {})).resolves.toEqual(room)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/rest/v1/rpc/group_mock_create',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_mode: 'spec', p_config: {} }),
      }),
    )
  })

  it('authorizes host pause and resume actions with the platform JWT', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const room = '93470000-0000-4000-8000-000000000002'
    await pauseGroupMock(room)
    await resumeGroupMock(room)
    expect(fetchMock).toHaveBeenNthCalledWith(1,
      'https://example.invalid/rest/v1/rpc/group_mock_pause',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_room: room }),
      }))
    expect(fetchMock).toHaveBeenNthCalledWith(2,
      'https://example.invalid/rest/v1/rpc/group_mock_resume',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_room: room }),
      }))
  })

  it('loads a member-only finished report with per-person and per-question totals', async () => {
    const room = '93470000-0000-4000-8000-000000000002'
    const person = session.user.id
    const payload = {
      room_id: room, code: 'AABB1122', total_count: 1, participant_count: 1,
      finished_at: '2026-10-21T08:00:00Z',
      participants: [{
        user_id: person, name: 'Test', answered: 0, correct: 0, incorrect: 0,
        unanswered: 1, score: 0, percentage: 0,
        answers: [{ idx: 1, answer: null, is_correct: null }],
      }],
      questions: [{
        idx: 1, stem_md: 'Savol', format: 'Y1', options: [],
        correct_answer: { correct_option_id: '93470000-0000-4000-8000-000000000003' },
        explanation_md: 'Izoh bor', answered: 0, correct: 0, incorrect: 0, unanswered: 1,
      }],
    }
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)
    await expect(getGroupMockReport(room)).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/rest/v1/rpc/group_mock_report',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_room: room }),
      }),
    )
  })

  it('loads all 50 report questions with MD5-derived PostgreSQL UUID option IDs', async () => {
    // Real published group mocks include PostgreSQL UUIDs without RFC version
    // or variant bits. Zod .uuid() rejects these even though the database
    // accepts them. Report parsing must preserve the original IDs for keys.
    const storedOptionIds = [
      'b335a155-53e6-fefc-4878-f3ad9315a7ea',
      'ee50af7a-b106-03d3-1b63-ae6031eea547',
      '78fa8672-3abc-5a62-f9f6-c71a274cb78d',
    ]
    const room = '93470000-0000-4000-8000-000000000002'
    const questions = Array.from({ length: 50 }, (_, index) => {
      const id = storedOptionIds[index % storedOptionIds.length]
      const format = (['Y1', 'Y2', 'Y3'] as const)[index % 3]
      return {
        idx: index + 1,
        stem_md: 'Savol ' + (index + 1),
        format,
        options: [
          { id, side: 'a', content_md: 'Javob A' },
          { id: '93470000-0000-4000-8000-000000000003', side: format === 'Y2' ? 'b' : 'a', content_md: 'Javob B' },
        ],
        correct_answer: format === 'Y1'
          ? { correct_option_id: id }
          : format === 'Y2'
            ? { pairs: { [id]: '93470000-0000-4000-8000-000000000003' } }
            : { order: [id, '93470000-0000-4000-8000-000000000003'] },
        explanation_md: 'Izoh',
        answered: 0, correct: 0, incorrect: 0, unanswered: 1,
      }
    })
    const report = {
      room_id: room, code: 'AABB1122', total_count: 50, participant_count: 1,
      finished_at: '2026-10-21T08:00:00Z',
      participants: [{
        user_id: session.user.id, name: 'Ishtirokchi', answered: 0,
        correct: 0, incorrect: 0, unanswered: 50,
        score: 0, percentage: 0,
        answers: questions.map(question => ({
          idx: question.idx, answer: null, is_correct: null,
        })),
      }],
      questions,
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify(report), { status: 200 }),
    ))

    const parsed = await getGroupMockReport(room)
    expect(parsed.questions).toHaveLength(50)
    expect(parsed.questions[0].options[0].id).toBe(storedOptionIds[0])
    expect(parsed.questions[1].options[0].id).toBe(storedOptionIds[1])
    expect(parsed.questions[2].options[0].id).toBe(storedOptionIds[2])
    expect(parsed.questions[1].correct_answer.pairs).toEqual({
      [storedOptionIds[1]]: '93470000-0000-4000-8000-000000000003',
    })
  })

  it('rejects a malformed option ID in the final report', async () => {
    const report = {
      room_id: '93470000-0000-4000-8000-000000000002',
      code: 'AABB1122', total_count: 1, participant_count: 0,
      finished_at: '2026-10-21T08:00:00Z', participants: [],
      questions: [{
        idx: 1, stem_md: 'Savol', format: 'Y1',
        options: [{ id: 'not-a-postgresql-uuid', side: 'a', content_md: 'A' }],
        correct_answer: { correct_option_id: 'not-a-postgresql-uuid' },
        explanation_md: 'Izoh', answered: 0, correct: 0, incorrect: 0, unanswered: 0,
      }],
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify(report), { status: 200 }),
    ))
    await expect(getGroupMockReport(report.room_id)).rejects.toThrow('PostgreSQL UUID shakli noto‘g‘ri')
  })

  it('does not accept a report before the server finishes the test', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'P0001', message: 'group_report_unavailable',
    }), { status: 400 })))
    await expect(getGroupMockReport('93470000-0000-4000-8000-000000000002')).rejects.toThrow(
      'To‘liq hisobot faqat test yakunlangandan keyin ochiladi.',
    )
  })

  it('finishes early with the authenticated platform JWT', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const room = '93470000-0000-4000-8000-000000000002'
    await finishGroupMock(room)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/rest/v1/rpc/group_mock_finish',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_room: room }),
      }),
    )
  })

  it('passes the confirmation code to the server for irreversible deletion', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const room = '93470000-0000-4000-8000-000000000002'
    await deleteGroupMockRoom(room, 'AABB1122')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/rest/v1/rpc/group_mock_delete',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-user-jwt' }),
        body: JSON.stringify({ p_room: room, p_code: 'AABB1122' }),
      }),
    )
  })

  it('explains a rejected deletion code without hiding the server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'P0001', message: 'group_delete_code_mismatch',
    }), { status: 400 })))
    await expect(deleteGroupMockRoom('93470000-0000-4000-8000-000000000002', 'WRONG123'))
      .rejects.toThrow('Xona o‘chirilmadi.')
  })

  it('rejects missing login before any network call', async () => {
    vi.mocked(sessionStore.get).mockReturnValue(null)
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(listMyGroupMockRooms()).rejects.toThrow('Testga kirish uchun hisobingizga kiring.')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows a specific login problem instead of a generic server error on 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: '42501',
      message: 'permission denied for function group_mock_my_rooms',
    }), { status: 401 })))

    await expect(listMyGroupMockRooms()).rejects.toThrow(/Hisobingizdan chiqib, qayta kiring/)
  })

  it('keeps domain errors understandable without exposing the answer key', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'P0001', message: 'group_spec_pool_insufficient',
    }), { status: 400 })))

    await expect(createGroupMock('spec', {})).rejects.toThrow(
      'Rasmiy spetsifikatsiyadagi kvota uchun savollar yetarli emas.',
    )
  })

  it('surfaces PostgreSQL statement timeout as a useful error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: '57014', message: 'canceling statement due to statement timeout',
    }), { status: 500 })))

    await expect(createGroupMock('spec', {})).rejects.toThrow(
      'Guruhli test uchun savollarni tayyorlash muddati tugadi.',
    )
  })

  it('distinguishes network unavailability from an empty rooms list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(listMyGroupMockRooms()).rejects.toThrow('Internetni tekshiring.')
  })
})
