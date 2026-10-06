import { NavLink, Route, Routes } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  History,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import ModulesPage from '../../pages/admin/ModulesPage'
import QuestionsPage from '../../pages/admin/QuestionsPage'
import AttemptsPage from '../../pages/admin/AttemptsPage'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/modules', icon: BookOpen, label: 'Modullar' },
  { to: '/admin/questions', icon: FileQuestion, label: 'Savollar' },
  { to: '/admin/attempts', icon: History, label: 'Sinov urinishlari' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f6f8fc] dark:bg-gray-950">
      <aside className="hidden w-[250px] shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:flex lg:flex-col">
        <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
              <ShieldCheck size={19} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-950 dark:text-white">
                Attestatsiya
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">Admin · 2026</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Boshqaruv
          </p>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ].join(' ')
              }
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-100/80 dark:bg-gray-800">
                <item.icon size={16} aria-hidden="true" />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <NavLink
            to="/"
            className="flex min-h-11 items-center gap-3 rounded-xl bg-gray-50 px-3 text-sm font-semibold text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Asosiy platforma
          </NavLink>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <NavLink
              to="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Sayt
            </NavLink>
            <span className="text-sm font-bold text-gray-950 dark:text-white">
              Admin
            </span>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
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
