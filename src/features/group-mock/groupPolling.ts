/**
 * Coalesce overlapping room-state reads by room ID. Polling every 2.5s must
 * not start a new network request when the previous one is still in flight.
 * A new request may run immediately after success/failure; no stale caching.
 */
export function coalesceRoomRequests<T>(
  read: (roomId: string) => Promise<T>,
): (roomId: string) => Promise<T> {
  const pending = new Map<string, Promise<T>>()
  return (roomId) => {
    const existing = pending.get(roomId)
    if (existing) return existing
    const request = read(roomId).finally(() => {
      if (pending.get(roomId) === request) pending.delete(roomId)
    })
    pending.set(roomId, request)
    return request
  }
}
