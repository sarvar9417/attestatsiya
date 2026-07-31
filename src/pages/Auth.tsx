import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MailCheck, RefreshCw, X, Eye, EyeOff } from 'lucide-react'
import type { ApiError } from '../lib/apiClient'

type Tab = 'login' | 'signup'
type SignupState = 'form' | 'sent' | 'resent'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_COOLDOWN = 60

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirm?: string
}

function errorCode(error: Error | null): string | null {
  return error instanceof Error && 'code' in error ? (error as ApiError).code : null
}

/** Faqat ichki yo'llarga ruxsat beriladi (open redirect oldini olish). */
function sanitizeReturnTo(raw: string | null): string {
  if (!raw) return '/'
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'
}

export default function Auth() {
  const { user, signIn, signUp, resetPassword, resendConfirmation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'))
  const expired = searchParams.get('expired') === '1'

  const [showExpiredBanner, setShowExpiredBanner] = useState(expired)

  const [tab, setTab] = useState<Tab>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [signupState, setSignupState] = useState<SignupState>('form')
  const [signedUpEmail, setSignedUpEmail] = useState('')
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  // Resend cooldown interval'ni unmount'da tozalash uchun
  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!expired) return
    setShowExpiredBanner(true)
    navigate(location.pathname, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (resendIntervalRef.current !== null) {
        clearInterval(resendIntervalRef.current)
      }
    }
  }, [])

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
    setFieldErrors({})
    setSignupState('form')
    setUnconfirmedEmail(null)
  }

  function startResendCooldown() {
    setResendCooldown(RESEND_COOLDOWN)
    if (resendIntervalRef.current !== null) {
      clearInterval(resendIntervalRef.current)
    }
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (resendIntervalRef.current === interval) {
            resendIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    resendIntervalRef.current = interval
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      errors.email = 'Email kiritilishi shart'
    } else if (!EMAIL_RE.test(trimmedEmail)) {
      errors.email = 'Email formati noto\'g\'ri'
    }
    if (!password) {
      errors.password = 'Parol kiritilishi shart'
    } else if (password.length < 6) {
      errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
    }
    if (tab === 'signup') {
      if (name.trim().length < 2) {
        errors.name = 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'
      }
      if (confirmPassword !== password) {
        errors.confirm = 'Parollar mos kelmadi'
      }
    }
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setError(null)
    const trimmedEmail = email.trim()

    if (tab === 'login') {
      const { error: loginError } = await signIn(trimmedEmail, password)
      if (loginError) {
        if (errorCode(loginError) === 'EMAIL_NOT_CONFIRMED') {
          setUnconfirmedEmail(trimmedEmail)
          startResendCooldown()
        } else {
          setError(loginError.message)
        }
        setLoading(false)
        return
      }
      navigate(returnTo, { replace: true })
      return
    }

    const { error: signUpError } = await signUp(trimmedEmail, password, name.trim())
    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSignupState('sent')
      setSignedUpEmail(trimmedEmail)
      startResendCooldown()
    }
    setLoading(false)
  }

  async function handleResend() {
    if (resendCooldown > 0 || loading) return
    setError(null)
    const targetEmail = unconfirmedEmail ?? signedUpEmail
    const { error: resendError } = await resendConfirmation(targetEmail)
    if (resendError) {
      setError(resendError.message)
      return
    }
    if (unconfirmedEmail === null) {
      setSignupState('resent')
    }
    startResendCooldown()
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)
    const trimmedResetEmail = resetEmail.trim()
    if (!EMAIL_RE.test(trimmedResetEmail)) {
      setResetError('Email formati noto\'g\'ri')
      setResetLoading(false)
      return
    }
    const { error: resetError } = await resetPassword(trimmedResetEmail)
    if (resetError) setResetError(resetError.message)
    else setResetSent(true)
    setResetLoading(false)
  }

  if (user) {
    return <Navigate to={returnTo} replace />
  }

  const pendingEmail = unconfirmedEmail ?? (signupState !== 'form' ? signedUpEmail : null)
  const showConfirmScreen = pendingEmail !== null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attestatsiya</h1>
          <p className="text-gray-500 text-sm mt-1">Informatika attestatsiyasiga tayyorgarlik</p>
        </div>

        <div className="card shadow-xl">
          {returnTo !== '/' && !expired && (
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl text-sm text-primary-700 dark:text-primary-400 mb-4">
              Bu sahifa uchun tizimga kirish kerak. Kirgach, avtomatik qaytib borasiz.
            </div>
          )}

          {showExpiredBanner && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 mb-4">
              Session muddati tugadi. Iltimos, qayta kiring.
            </div>
          )}

          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            {(['login', 'signup'] as Tab[]).map((tabItem) => (
              <button
                key={tabItem}
                onClick={() => switchTab(tabItem)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === tabItem
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tabItem === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>

          {showConfirmScreen ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <MailCheck size={40} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {signupState === 'resent' && unconfirmedEmail === null ? 'Qayta yuborildi' : 'Email tasdiqlash'}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {unconfirmedEmail !== null
                  ? `${unconfirmedEmail} manzili hali tasdiqlanmagan. Tasdiqlash xatini tekshiring yoki qayta yuboring.`
                  : `${signedUpEmail} manziliga tasdiqlash xati yuborildi.`}
              </p>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">{error}</div>
              )}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary-200 text-primary-700 font-medium text-sm hover:bg-primary-50 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `${resendCooldown}s` : 'Qayta yuborish'}
              </button>
              {unconfirmedEmail !== null && (
                <button
                  onClick={() => setUnconfirmedEmail(null)}
                  className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                >
                  Kirishga qaytish
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ism</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ismingiz"
                    required
                    minLength={2}
                    autoComplete="name"
                    disabled={loading}
                    className="input"
                  />
                  {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoComplete={tab === 'login' ? 'username' : 'email'}
                  autoFocus
                  disabled={loading}
                  className="input"
                />
                {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parol</label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    minLength={6}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    disabled={loading}
                    className="input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setShowReset(true); setResetEmail(email); setResetSent(false); setResetError(null) }}
                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline mt-1.5"
                  >
                    Parolni unutdingizmi?
                  </button>
                )}
              </div>
              {tab === 'signup' && (
                <div>
                  <label htmlFor="auth-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parolni tasdiqlang</label>
                  <input
                    id="auth-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    disabled={loading}
                    className="input"
                  />
                  {fieldErrors.confirm && <p className="text-xs text-red-600 mt-1">{fieldErrors.confirm}</p>}
                </div>
              )}
              {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Yuklanmoqda...' : tab === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
              </button>
            </form>
          )}
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowReset(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative animate-slide-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReset(false)} className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Yopish">
              <X size={18} />
            </button>
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Parolni tiklash</h3>
              <p className="text-sm text-gray-500 mt-1">Email manzilingizni kiriting</p>
            </div>
            {resetSent ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Tiklash havolasi yuborildi</p>
                <button onClick={() => setShowReset(false)} className="btn-primary w-full mt-5">Yopish</button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  aria-label="Tiklash emaili"
                  className="input"
                  autoFocus
                />
                {resetError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{resetError}</div>}
                <button type="submit" disabled={resetLoading} className="btn-primary w-full disabled:opacity-60">
                  {resetLoading ? 'Yuklanmoqda...' : 'Yuborish'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
