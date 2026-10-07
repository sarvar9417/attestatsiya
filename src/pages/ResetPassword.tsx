import { useEffect, useState } from 'react'
import { CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { session, updatePassword } = useAuth()
  const navigate = useNavigate()

  const hasRecoveryToken =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.hash.slice(1)).has('access_token')

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/'), 3000)
    return () => clearTimeout(timer)
  }, [success, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      return
    }

    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) setError(updateError.message)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f8fc] px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-7 text-center shadow-xl dark:border-emerald-900/60 dark:bg-gray-900">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 size={26} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-950 dark:text-white">
            Parol yangilandi
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Parolingiz muvaffaqiyatli yangilandi. Bosh sahifaga o‘tilmoqda...
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Bosh sahifaga o‘tish
          </button>
        </div>
      </div>
    )
  }

  if (!hasRecoveryToken && !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f8fc] px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
            <ShieldCheck size={25} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-950 dark:text-white">
            Parolni tiklash
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Parolni yangilash uchun email orqali kelgan tiklash havolasini oching
            yoki tizimga kiring.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Kirish sahifasiga o‘tish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-10 dark:bg-gray-950 sm:grid sm:place-items-center">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <KeyRound size={21} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            Yangi parol kiriting
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hisobingiz uchun yangi xavfsiz parol belgilang.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="rp-password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Yangi parol
              </label>
              <div className="relative">
                <input
                  id="rp-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={loading}
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={
                    showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'
                  }
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff size={17} aria-hidden="true" />
                  ) : (
                    <Eye size={17} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="rp-confirm"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Parolni tasdiqlang
              </label>
              <input
                id="rp-confirm"
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
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Yuklanmoqda...' : 'Saqlash'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
