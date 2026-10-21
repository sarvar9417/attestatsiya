import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionStore, type AuthSession } from '../auth/sessionStore'
import { createGroupMock, deleteGroupMockRoom, finishGroupMock, getGroupMockReport, listMyGroupMockRooms, pauseGroupMock, resumeGroupMock } from './groupMockApi'

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
