import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { session, updatePassword } = useAuth()
  const navigate = useNavigate()

  // Recovery link borligi: /reset-password#access_token=...
  const hasRecoveryToken =
    typeof window !== 'undefined' && new URLSearchParams(window.location.hash.slice(1)).has('access_token')

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parol yangilandi</h1>
        <p className="text-gray-500 mb-6">Parolingiz muvaffaqiyatli yangilandi. Bosh sahifaga o'tilmoqda...</p>
        <button onClick={() => navigate('/')} className="btn-primary">Bosh sahifaga o'tish</button>
      </div>
    )
  }

  if (!hasRecoveryToken && !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parolni tiklash</h1>
        <p className="text-gray-500 mb-6">
          Parolni yangilash uchun email orqali kelgan tiklash havolasini oching yoki tizimga kiring.
        </p>
        <Link to="/auth" className="btn-primary">Kirish sahifasiga o'tish</Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md card shadow-xl">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Yangi parol kiriting</h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="rp-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="rp-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>
    </div>
  )
}
