import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogOut, Eye, EyeOff } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  user: 'Foydalanuvchi',
  editor: 'Muharrir',
  admin: 'Administrator',
}

export default function Profile() {
  const { user, displayName, updateProfile, updatePassword, signOut } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaved, setPwSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [saved])

  useEffect(() => {
    if (!pwSaved) return
    const timer = setTimeout(() => setPwSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [pwSaved])

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Ism kamida 2 ta belgidan iborat bo\'lishi kerak')
      return
    }
    setSaving(true)
    setError(null)
    setSaved(false)
    const { error: updateError } = await updateProfile(trimmed)
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    if (newPassword.length < 6) {
      setPwError('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Parollar mos kelmadi')
      return
    }
    setPwSaving(true)
    setPwSaved(false)
    const { error: updateError } = await updatePassword(newPassword)
    setPwSaving(false)
    if (updateError) {
      setPwError(updateError.message)
    } else {
      setPwSaved(true)
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profil</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600">
            {(displayName ?? user?.email ?? 'F').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {displayName || 'Ism kiritilmagan'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {ROLE_LABELS[user?.role ?? 'user'] ?? user?.role}
          </span>
        </div>

        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ism va familiya
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setSaved(false)
              }}
              placeholder="Ism familiyangiz"
              className="input"
              maxLength={100}
            />
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          {saved && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
              Ma'lumotlar saqlandi
            </div>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Parolni o'zgartirish</h2>
        <p className="text-sm text-gray-500 mb-4">Parol kamida 6 ta belgidan iborat bo'lishi shart</p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Yangi parol
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••"
                required
                minLength={6}
                autoComplete="new-password"
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
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parolni tasdiqlang
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
            />
          </div>
          {pwError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{pwError}</div>}
          {pwSaved && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
              Parol muvaffaqiyatli yangilandi
            </div>
          )}
          <button type="submit" disabled={pwSaving} className="btn-primary disabled:opacity-60">
            {pwSaving ? 'Saqlanmoqda...' : 'Parolni yangilash'}
          </button>
        </form>
      </div>
    </div>
  )
}
