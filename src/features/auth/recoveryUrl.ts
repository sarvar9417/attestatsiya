/**
 * Supabase recovery redirectidan access tokenni oladi.
 *
 * Recovery token URL fragmentda bo'lishi shart. Query parametrdagi access
 * token ataylab qabul qilinmaydi: query URL server/proxy/referrer loglariga
 * tushishi mumkin.
 */
export function readRecoveryAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  if (params.get('type') !== 'recovery') return null

  return params.get('access_token')
}

/**
 * Recovery muvaffaqiyatli tugagach maxfiy fragmentni browser URL'idan
 * history navigation yoki reload chaqirmasdan olib tashlaydi.
 */
export function clearRecoveryParamsFromUrl(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  if (params.get('type') !== 'recovery') return

  const next = `${window.location.pathname}${window.location.search}`
  window.history.replaceState(window.history.state, '', next)
}
