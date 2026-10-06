import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Database,
  FileQuestion,
  History,
  Layers,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { typedSupabase } from '../../lib/supabase'

interface AdminStats {
  modules: number
  questions: number
  blueprints: number
  users: number
}

const EMPTY_STATS: AdminStats = {
  modules: 0,
  questions: 0,
  blueprints: 0,
  users: 0,
}

function formatCount(value: number): string {
  return String(value).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ')
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadStats() {
      setLoading(true)
      setErrorMessage(null)

      const results = await Promise.all([
        typedSupabase.from('modules').select('*', { count: 'exact', head: true }),
        typedSupabase.from('questions').select('*', { count: 'exact', head: true }),
        typedSupabase.from('blueprints').select('*', { count: 'exact', head: true }),
        typedSupabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      if (!active) return

      const firstError = results.find(result => result.error)?.error
      if (firstError) {
        setErrorMessage(
          firstError.message || 'Admin statistikasi yuklanmadi. Qayta urinib ko‘ring.',
        )
        setLoading(false)
        return
      }

      const [modules, questions, blueprints, users] = results
      setStats({
        modules: modules.count ?? 0,
        questions: questions.count ?? 0,
        blueprints: blueprints.count ?? 0,
        users: users.count ?? 0,
      })
      setLoading(false)
    }

    void loadStats()

    return () => {
      active = false
    }
  }, [reloadKey])

  const cards = [
    {
      label: 'Foydalanuvchilar',
      value: stats.users,
      icon: Users,
      tone: 'indigo',
    },
    {
      label: 'Savollar',
      value: stats.questions,
      icon: FileQuestion,
      tone: 'blue',
    },
    {
      label: 'Modullar',
      value: stats.modules,
      icon: BookOpen,
      tone: 'emerald',
    },
    {
      label: 'Blueprintlar',
      value: stats.blueprints,
      icon: Layers,
      tone: 'violet',
    },
  ] as const

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              Admin
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={13} aria-hidden="true" />
              Boshqaruv paneli
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platformadagi asosiy kontent va foydalanuvchi obyektlari holati.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReloadKey(value => value + 1)}
          disabled={loading}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
            aria-hidden="true"
          />
          Yangilash
        </button>
      </header>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setReloadKey(value => value + 1)}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Qayta urinish
          </button>
        </div>
      )}

      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Admin ko‘rsatkichlari"
      >
        {cards.map(card => (
          <AdminMetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<card.icon size={18} />}
            tone={card.tone}
            loading={loading}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Tezkor boshqaruv
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Eng ko‘p ishlatiladigan admin bo‘limlariga o‘ting.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <QuickAction
                to="/admin/questions"
                title="Savollarni boshqarish"
                description="Savollar ro‘yxati, holati va tahrirlash oqimi."
                icon={<FileQuestion size={19} />}
              />
              <QuickAction
                to="/admin/modules"
                title="Modullarni boshqarish"
                description="O‘quv modullari va ularning metadata holati."
                icon={<BookOpen size={19} />}
              />
              <QuickAction
                to="/admin/attempts"
                title="Sinov urinishlari"
                description="Learner urinishlari va server hisoblagan natijalar."
                icon={<History size={19} />}
              />
              <QuickAction
                to="/"
                title="Asosiy platforma"
                description="Learner interfeysiga xavfsiz qaytish."
                icon={<ArrowRight size={19} />}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                <Database size={19} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
                  Ma’lumotlar manbai
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Yuqoridagi raqamlar Supabase jadvallaridan real vaqtga yaqin
                  count so‘rovlari orqali olinadi. Ushbu sahifada sun’iy analytics
                  yoki taxminiy foizlar ko‘rsatilmaydi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
              Kontent inventari
            </h2>
            <div className="mt-4 space-y-3">
              <InventoryRow label="Modullar" value={stats.modules} />
              <InventoryRow label="Savollar" value={stats.questions} />
              <InventoryRow label="Blueprintlar" value={stats.blueprints} />
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900/70 dark:bg-indigo-950/25">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-300">
              <ShieldCheck size={19} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-gray-950 dark:text-white">
              Xavfsiz admin oqimi
            </h2>
            <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Admin sahifalariga kirish mavjud AdminGuard orqali nazorat qilinadi.
              Ushbu redesign permission modelini o‘zgartirmaydi.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

type Tone = 'indigo' | 'blue' | 'emerald' | 'violet'

const TONES: Record<Tone, string> = {
  indigo:
    'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
  emerald:
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
  violet:
    'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
}

function AdminMetricCard({
  label,
  value,
  icon,
  tone,
  loading,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: Tone
  loading: boolean
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className={`grid h-8 w-8 place-items-center rounded-xl ${TONES[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
        {loading ? '—' : formatCount(value)}
      </p>
      <p className="mt-1 text-[11px] text-gray-400">
        {loading ? 'Yuklanmoqda…' : 'Bazadagi joriy son'}
      </p>
    </div>
  )
}

function QuickAction({
  to,
  title,
  description,
  icon,
}: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-gray-400">
          {description}
        </span>
      </span>
      <ArrowRight
        size={16}
        className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
        aria-hidden="true"
      />
    </Link>
  )
}

function InventoryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-3.5 py-3 dark:bg-gray-800/70">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {formatCount(value)}
      </span>
    </div>
  )
}
