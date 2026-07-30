import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, User,
  ChevronLeft, ChevronRight,
  Sun, Moon, Monitor, Shield,
} from 'lucide-react'
import { cycleTheme, getThemePreference } from '../../utils/theme'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/learn', icon: <BookOpen size={20} />, label: 'O\'rganish' },
  { to: '/profile', icon: <User size={20} />, label: 'Profil' },
]

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const [themePref, setThemePref] = useState(getThemePreference())

  const handleCycleTheme = () => {
    cycleTheme()
    setThemePref(getThemePreference())
  }

  const content = (
    <>
      <div className="flex items-center px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="ml-2.5">
            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">Attestatsiya</p>
            <p className="text-xs text-gray-400">2026</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleCycleTheme}
        className="flex items-center justify-center py-2 border-t border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors gap-2 text-xs font-medium"
      >
        {themePref === 'light' && <Sun size={14} />}
        {themePref === 'dark' && <Moon size={14} />}
        {themePref === 'system' && <Monitor size={14} />}
        {!collapsed && <span>{themePref === 'light' ? 'Yorug\'' : themePref === 'dark' ? 'Qorong\'i' : 'Tizim'}</span>}
      </button>

      <button
        onClick={() => setCollapsed(c => !c)}
        className="hidden lg:flex items-center justify-center py-3 border-t border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </>
  )

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-full
          transition-[width] duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-16' : 'w-60'}`}
      >
        {content}
      </aside>

      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out shadow-2xl will-change-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '280px' }}
      >
        {content}
      </aside>
    </>
  )
}
