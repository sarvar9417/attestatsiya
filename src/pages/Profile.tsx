import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const ROLE_LABELS: Record<string, string> = {
  user: 'Foydalanuvchi',
  editor: 'Muharrir',
  admin: 'Administrator',
}

function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  return parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
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

  const profileName = displayName || user?.email || 'Foydalanuvchi'
  const roleLabel = ROLE_LABELS[user?.role ?? 'user'] ?? user?.role

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            Hisob
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Profil
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Shaxsiy ma’lumotlar va hisob xavfsizligini boshqaring.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900/70 dark:bg-gray-900 dark:text-red-300 dark:hover:bg-red-950/30 sm:self-auto"
        >
          <LogOut size={16} aria-hidden="true" />
          Chiqish
        </button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 px-5 py-6 text-white sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/20">
              {initials(profileName)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold">{profileName}</h2>
            </div>
            <span className="inline-flex self-start rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 sm:self-auto">
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleNameSubmit}
            className="border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6 lg:border-b-0 lg:border-r"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                <UserRound size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                  Shaxsiy ma’lumot
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Dashboard va profil bloklarida ko‘rinadigan ism.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="profile-name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                {error}
              </div>
            )}

            {saved && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2 size={16} aria-hidden="true" />
                Ma'lumotlar saqlandi
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                  Hisob holati
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Session va rol server orqali boshqariladi.
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-3">
              <ProfileMeta label="Email" value={user?.email ?? '—'} />
              <ProfileMeta label="Rol" value={roleLabel ?? '—'} />
              <ProfileMeta label="User ID" value={user?.id ?? '—'} mono />
            </dl>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
            <KeyRound size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Parolni o‘zgartirish
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-5 grid gap-4 lg:grid-cols-2"
          noValidate
        >
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
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
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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

          {pwError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 lg:col-span-2"
            >
              {pwError}
            </div>
          )}

          {pwSaved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 lg:col-span-2">
              <CheckCircle2 size={16} aria-hidden="true" />
              Parol muvaffaqiyatli yangilandi
            </div>
          )}

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={pwSaving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pwSaving ? 'Saqlanmoqda...' : 'Parolni yangilash'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ProfileMeta({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-3 dark:bg-gray-800/70">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd
        className={`mt-1 truncate text-xs font-semibold text-gray-800 dark:text-gray-100 ${
          mono ? 'font-mono' : ''
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  )
}
