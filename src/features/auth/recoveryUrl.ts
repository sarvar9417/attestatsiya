const RECOVERY_QUERY_KEYS = [
  'access_token',
  'refresh_token',
  'expires_in',
  'expires_at',
  'token_type',
  'type',
] as const

/**
 * Supabase recovery redirectidan access tokenni oladi.
 *
 * Asosiy production oqim hash fragmentdan foydalanadi. Query varianti ham
 * qo'llab-quvvatlanadi, chunki ayrim redirect/proxy qatlamlari fragmentni
 * query ko'rinishida yetkazishi mumkin. Faqat type=recovery qabul qilinadi.
 */
export function readRecoveryAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  if (hashParams.get('type') === 'recovery') {
    const token = hashParams.get('access_token')
    if (token) return token
  }

  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('type') === 'recovery') {
    const token = searchParams.get('access_token')
    if (token) return token
  }

  return null
}

/**
 * Recovery muvaffaqiyatli tugagach maxfiy tokenlarni browser URL'idan
 * history navigation yoki reload chaqirmasdan olib tashlaydi.
 */
export function clearRecoveryParamsFromUrl(): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  let changed = false

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''))
  if (hashParams.get('type') === 'recovery') {
    url.hash = ''
    changed = true
  }

  if (url.searchParams.get('type') === 'recovery') {
    for (const key of RECOVERY_QUERY_KEYS) {
      url.searchParams.delete(key)
    }
    changed = true
  }

  if (!changed) return

  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', next)
}
