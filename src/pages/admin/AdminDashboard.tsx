import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  History,
  Layers,
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      setLoading(true)
      setLoadError(null)

      const results = await Promise.all([
        typedSupabase.from('modules').select('*', { count: 'exact', head: true }),
        typedSupabase.from('questions').select('*', { count: 'exact', head: true }),
        typedSupabase.from('blueprints').select('*', { count: 'exact', head: true }),
        typedSupabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      if (cancelled) return

      const firstError = results.find(result => result.error)?.error
      if (firstError) {
        setLoadError('Admin statistikani yuklab bo‘lmadi.')
      }

      setStats({
        modules: results[0].count ?? 0,
        questions: results[1].count ?? 0,
        blueprints: results[2].count ?? 0,
        users: results[3].count ?? 0,
      })
      setLoading(false)
    }

    void loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    {
      label: 'Foydalanuvchilar',
      value: stats.users,
      icon: Users,
      tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      label: 'Savollar',
      value: stats.questions,
      icon: FileQuestion,
      tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      label: 'Modullar',
      value: stats.modules,
      icon: BookOpen,
      tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      label: 'Blueprintlar',
      value: stats.blueprints,
      icon: Layers,
      tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
    },
  ]

  const actions = [
    {
      to: '/admin/questions',
      title: 'Savollarni boshqarish',
      description: 'Yangi savol yaratish, review va publication holatlarini boshqarish.',
      icon: FileQuestion,
    },
    {
      to: '/admin/modules',
      title: 'Modullar va darslar',
      description: 'O‘quv modullari, mavzular va kontent holatini ko‘rish.',
      icon: BookOpen,
    },
    {
      to: '/admin/attempts',
      title: 'Sinov urinishlari',
      description: 'Foydalanuvchi urinishlari va server hisoblagan natijalarni tekshirish.',
      icon: History,
    },
  ]

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
            Boshqaruv markazi
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platforma kontenti, savollar va sinov faoliyatining joriy holati.
          </p>
        </div>

        <div className="inline-flex self-start items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 sm:self-auto">
          <ShieldCheck size={15} className="text-emerald-500" aria-hidden="true" />
          Admin access
        </div>
      </header>

      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
        >
          {loadError}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Admin statistikasi">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${card.tone}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                {loading ? '—' : card.value.toLocaleString('uz-UZ')}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                {loading ? 'Yuklanmoqda…' : 'Real database count'}
              </p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Tezkor boshqaruv
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Eng ko‘p ishlatiladigan admin bo‘limlariga to‘g‘ridan-to‘g‘ri o‘ting.
            </p>
          </div>

          <div className="space-y-3">
            {actions.map(action => {
              const Icon = action.icon
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 px-4 py-4 transition hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-400">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight
                    size={17}
                    className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-gray-600"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-950 dark:text-white">
              Kontent inventari
            </h2>
            <div className="mt-4 space-y-3">
              <InventoryRow label="Modullar" value={stats.modules} loading={loading} />
              <InventoryRow label="Savollar" value={stats.questions} loading={loading} />
              <InventoryRow label="Blueprintlar" value={stats.blueprints} loading={loading} />
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/25">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              Boshqaruv tamoyili
            </p>
            <p className="mt-2 text-xs leading-5 text-indigo-700/80 dark:text-indigo-300/80">
              Published kontentni joyida o‘zgartirish o‘rniga revision va review oqimidan foydalaning.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

function InventoryRow({
  label,
  value,
  loading,
}: {
  label: string
  value: number
  loading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-800/70">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        {loading ? '—' : value.toLocaleString('uz-UZ')}
      </span>
    </div>
  )
}
