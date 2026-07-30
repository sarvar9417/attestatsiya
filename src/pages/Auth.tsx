import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { MailCheck, RefreshCw, X } from 'lucide-react'

type Tab = 'login' | 'signup'
type SignupState = 'form' | 'sent' | 'resent'

export default function Auth() {
  const { signIn, signUp, resetPassword, resendConfirmation } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupState, setSignupState] = useState<SignupState>('form')
  const [signedUpEmail, setSignedUpEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
    setSignupState('form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (tab === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      const { error } = await signUp(email, password, name.trim())
      if (error) {
        setError(error.message)
      } else {
        setSignupState('sent')
        setSignedUpEmail(email)
        setResendCooldown(60)
        const interval = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) { clearInterval(interval); return 0 }
            return prev - 1
          })
        }, 1000)
      }
    }
    setLoading(false)
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setError(null)
    const { error } = await resendConfirmation(signedUpEmail)
    if (error) setError(error.message)
    else setSignupState('resent')
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)
    const { error } = await resetPassword(resetEmail.trim())
    if (error) setResetError(error.message)
    else setResetSent(true)
    setResetLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attestatsiya</h1>
          <p className="text-gray-500 text-sm mt-1">Informatika attestatsiyasiga tayyorgarlik</p>
        </div>

        <div className="card shadow-xl">
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

          {tab === 'signup' && signupState !== 'form' ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <MailCheck size={40} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {signupState === 'resent' ? "Qayta yuborildi" : "Email tasdiqlash"}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {signedUpEmail} manziliga tasdiqlash xati yuborildi.
              </p>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">{error}</div>
              )}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary-200 text-primary-700 font-medium text-sm hover:bg-primary-50 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `${resendCooldown}s` : "Qayta yuborish"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ism</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ismingiz" required minLength={2} className="input" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parol</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required minLength={6} className="input" />
                {tab === 'login' && (
                  <button type="button" onClick={() => { setShowReset(true); setResetEmail(email); setResetSent(false); setResetError(null) }}
                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline mt-1.5">
                    Parolni unutdingizmi?
                  </button>
                )}
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Yuklanmoqda..." : tab === 'login' ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            </form>
          )}
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowReset(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative animate-slide-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReset(false)} className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="email@example.com" required className="input" autoFocus />
                {resetError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{resetError}</div>}
                <button type="submit" disabled={resetLoading} className="btn-primary w-full disabled:opacity-60">
                  {resetLoading ? "Yuklanmoqda..." : "Yuborish"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
