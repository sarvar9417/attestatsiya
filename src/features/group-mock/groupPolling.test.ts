import { describe, it, expect, vi } from 'vitest'
import { coalesceRoomRequests } from './groupPolling'

describe('group mock coalesced polling', () => {
  it('shares a slow request across multiple polls in the same room', async () => {
    let resolve!: (value: number) => void
    const read = vi.fn(() => new Promise<number>((done) => { resolve = done }))
    const get = coalesceRoomRequests(read)
    const first = get('room-one')
    const second = get('room-one')
    expect(first).toBe(second)
    expect(read).toHaveBeenCalledTimes(1)
    resolve(42)
    expect(await Promise.all([first, second])).toEqual([42, 42])
    read.mockResolvedValueOnce(43)
    expect(await get('room-one')).toBe(43)
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('allows different rooms to load independently', async () => {
    const read = vi.fn(async (room: string) => room + '-state')
    const get = coalesceRoomRequests(read)
    expect(await Promise.all([get('a'), get('b')])).toEqual(['a-state', 'b-state'])
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('retries a room after a network error', async () => {
    const read = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('connected')
    const get = coalesceRoomRequests<string>(read)
    await expect(get('a')).rejects.toThrow('offline')
    await expect(get('a')).resolves.toBe('connected')
    expect(read).toHaveBeenCalledTimes(2)
  })
})
