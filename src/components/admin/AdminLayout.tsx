import { NavLink, Routes, Route } from 'react-router-dom'
import { LayoutDashboard, BookOpen, FileQuestion, History, ArrowLeft } from 'lucide-react'
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <NavLink to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3">
            <ArrowLeft size={14} /> Asosiy sayt
          </NavLink>
          <h1 className="font-bold text-sm">Admin panel</h1>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
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
