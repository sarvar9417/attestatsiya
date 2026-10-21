import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionStore, type AuthSession } from '../auth/sessionStore'
import { createGroupMock, listMyGroupMockRooms } from './groupMockApi'

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

  it('distinguishes network unavailability from an empty rooms list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(listMyGroupMockRooms()).rejects.toThrow('Internetni tekshiring.')
  })
})
