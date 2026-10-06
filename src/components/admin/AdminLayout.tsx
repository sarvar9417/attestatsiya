import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  History,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import AttemptsPage from '../../pages/admin/AttemptsPage'
import ModulesPage from '../../pages/admin/ModulesPage'
import QuestionsPage from '../../pages/admin/QuestionsPage'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/modules', icon: BookOpen, label: 'Modullar' },
  { to: '/admin/questions', icon: FileQuestion, label: 'Savollar' },
  { to: '/admin/attempts', icon: History, label: 'Sinov urinishlari' },
]

function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-indigo-600 dark:hover:text-indigo-300"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Asosiy sayt
        </NavLink>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-950 dark:text-white">
              Admin panel
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              Attestatsiya · 2026
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          Boshqaruv
        </p>
        <div className="space-y-1.5">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ].join(' ')
              }
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gray-100/80 transition group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
                <item.icon size={17} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-100 p-4 dark:border-gray-800">
        <div className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-800/70">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Xavfsiz boshqaruv
          </p>
          <p className="mt-1 text-[10px] leading-4 text-gray-400">
            Published kontent va foydalanuvchi rollari server qoidalari bilan himoyalangan.
          </p>
        </div>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f6f8fc] dark:bg-gray-950">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Admin menyusini yopish"
        />
      )}

      <aside className="hidden h-screen w-[250px] shrink-0 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-0 lg:flex">
        <AdminNavigation />
      </aside>

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Admin menyusini yopish"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <AdminNavigation onNavigate={() => setMobileOpen(false)} />
      </aside>

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex min-h-14 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
            aria-label="Admin menyusini ochish"
          >
            <Menu size={19} aria-hidden="true" />
          </button>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Admin panel
          </span>
          <div className="w-10" aria-hidden="true" />
        </div>

        <div className="mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="modules" element={<ModulesPage />} />
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="attempts" element={<AttemptsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
