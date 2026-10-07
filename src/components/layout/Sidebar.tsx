import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  History,
  LayoutDashboard,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cycleTheme, getThemePreference } from '../../utils/theme'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    icon: <LayoutDashboard size={18} aria-hidden="true" />,
    label: 'Bosh sahifa',
    end: true,
  },
  {
    to: '/learn',
    icon: <BookOpen size={18} aria-hidden="true" />,
    label: 'O‘rganish',
  },
  {
    to: '/exam',
    icon: <ClipboardCheck size={18} aria-hidden="true" />,
    label: 'Mock test',
  },
  {
    to: '/history',
    icon: <BarChart3 size={18} aria-hidden="true" />,
    label: 'Natijalar tarixi',
  },
  {
    to: '/review',
    icon: <History size={18} aria-hidden="true" />,
    label: 'Xatolarni qayta ishlash',
  },
]

const ROLE_LABELS = {
  user: 'O‘qituvchi',
  editor: 'Muharrir',
  admin: 'Administrator',
} as const

function initials(value: string | null): string {
  if (!value) return 'U'
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  return parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean
  onClose?: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [themePref, setThemePref] = useState(getThemePreference())
  const { displayName, user } = useAuth()

  const profileName = displayName?.trim() || user?.email || 'Foydalanuvchi'
  const profileRole = user?.role ? ROLE_LABELS[user.role] : 'O‘qituvchi'

  const handleCycleTheme = () => {
    cycleTheme()
    setThemePref(getThemePreference())
  }

  const content = (
    <>
      <div
        className={`flex items-center border-b border-gray-100 px-5 py-5 dark:border-gray-800 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm shadow-indigo-600/20">
          A
        </div>
        {!collapsed && (
          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-gray-950 dark:text-gray-100">
              Attestatsiya
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">Informatika · 2026</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {!collapsed && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Asosiy
          </p>
        )}

        <div className="space-y-1.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                [
                  'group flex min-h-11 items-center rounded-xl text-sm font-semibold transition-colors',
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ].join(' ')
              }
              title={collapsed ? item.label : undefined}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
                  collapsed ? '' : 'bg-gray-100/80 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700'
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="space-y-2 border-t border-gray-100 p-4 dark:border-gray-800">
        <button
          type="button"
          onClick={handleCycleTheme}
          className={`flex min-h-10 w-full items-center rounded-xl text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-indigo-300 ${
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          }`}
          aria-label="Rang mavzusini almashtirish"
          title={collapsed ? 'Rang mavzusini almashtirish' : undefined}
        >
          {themePref === 'light' && <Sun size={16} aria-hidden="true" />}
          {themePref === 'dark' && <Moon size={16} aria-hidden="true" />}
          {themePref === 'system' && <Monitor size={16} aria-hidden="true" />}
          {!collapsed && (
            <span>
              {themePref === 'light'
                ? 'Yorug‘'
                : themePref === 'dark'
                  ? 'Qorong‘i'
                  : 'Tizim'}
            </span>
          )}
        </button>

        <NavLink
          to="/profile"
          onClick={() => onClose?.()}
          className={({ isActive }) =>
            [
              'flex items-center rounded-xl bg-gray-50 transition hover:bg-indigo-50 dark:bg-gray-800/80 dark:hover:bg-indigo-950/50',
              collapsed ? 'justify-center p-2' : 'gap-3 p-2.5',
              isActive ? 'ring-1 ring-indigo-200 dark:ring-indigo-800' : '',
            ].join(' ')
          }
          title={collapsed ? 'Profil' : undefined}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {initials(displayName)}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                {profileName}
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-gray-400">
                {profileRole}
              </span>
            </span>
          )}
        </NavLink>

        <button
          type="button"
          onClick={() => setCollapsed(value => !value)}
          className="hidden min-h-9 w-full items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-indigo-300 lg:flex"
          aria-label={collapsed ? 'Yon panelni kengaytirish' : 'Yon panelni yig‘ish'}
        >
          {collapsed ? (
            <ChevronRight size={17} aria-hidden="true" />
          ) : (
            <ChevronLeft size={17} aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside
        className={`hidden h-full shrink-0 flex-col border-r border-gray-100 bg-white transition-[width] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:flex ${
          collapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        {content}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out will-change-transform dark:bg-gray-900 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  )
}
