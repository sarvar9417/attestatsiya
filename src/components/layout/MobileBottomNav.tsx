import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, User } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Asosiy' },
  { to: '/learn', icon: BookOpen, label: 'O\'rganish' },
  { to: '/profile', icon: User, label: 'Profil' },
]

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full pt-1 transition-colors
                ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {active && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-b-full" />}
              <Icon size={20} className={active ? 'stroke-[2.5]' : ''} />
              <span className="text-xs font-semibold leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
