const TZ_OFFSET = 5 * 3600_000

export function getTodayTashkent(): string {
  const d = new Date(Date.now() + TZ_OFFSET)
  return d.toISOString().split('T')[0]
}

export function addDaysTashkent(days: number): string {
  const today = getTodayTashkent()
  const d = new Date(today + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}
