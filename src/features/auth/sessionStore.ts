/**
 * Session Store — auth session localStorage'da saqlanadi.
 *
 * Supabase-js browser'da ishlatilmaydi; session backend /api/auth orqali
 * olinadi va shu yerda saqlanadi. Boshqa tab'lar 'storage' event orqali
 * sinxronlashtiriladi.
 */

export type UserRole = 'user' | 'editor' | 'admin'

export interface AuthUser {
  id: string
  email: string
  display_name: string | null
  role: UserRole
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at: number
  user: AuthUser
}

const STORAGE_KEY = 'attestatsiya.session.v1'

type Listener = (session: AuthSession | null) => void

let currentSession: AuthSession | null = null
const listeners = new Set<Listener>()

function parseStored(raw: string | null): AuthSession | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (
      typeof parsed.access_token !== 'string' ||
      typeof parsed.refresh_token !== 'string' ||
      typeof parsed.expires_at !== 'number' ||
      !parsed.user ||
      typeof parsed.user.id !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function loadInitial(): AuthSession | null {
  if (typeof window === 'undefined') return null
  // Muddati o'tgan session ham yuklanadi: useAuth mount'da refresh_token
  // bilan silent refresh qiladi. Shu yerda tashlab yuborilsa refresh_token
  // yo'qoladi va foydalanuvchi keraksiz login sahifasiga tushadi.
  return parseStored(window.localStorage.getItem(STORAGE_KEY))
}

currentSession = loadInitial()

function notify() {
  listeners.forEach(listener => listener(currentSession))
}

export function isExpired(session: AuthSession): boolean {
  return Date.now() >= session.expires_at - 60_000
}

export const SESSION_EXPIRED_EVENT = 'attestatsiya:session-expired'

/**
 * Refresh muvaffaqiyatsiz bo'lganda global hodisa yuboradi; App qatlami
 * foydalanuvchini /auth?expired=1 ga yo'naltiradi.
 */
export function emitSessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

export const sessionStore = {
  get(): AuthSession | null {
    return currentSession
  },

  set(session: AuthSession | null) {
    currentSession = session
    if (session === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }
    notify()
  },

  updateUser(user: AuthUser) {
    if (!currentSession) return
    currentSession = { ...currentSession, user }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession))
    notify()
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  clear() {
    this.set(null)
  },
}

// Boshqa tab'da o'zgarishlarni sinxronlash
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    currentSession = parseStored(event.newValue)
    notify()
  })
}
