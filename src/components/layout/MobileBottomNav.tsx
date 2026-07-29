import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n'
import BottomSheet from '../ui/BottomSheet'
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  User,
  BarChart3,
  LayoutGrid,
  Mic,
  Users,
  BookText,
  MessageCircle,
  Film,
} from 'lucide-react'

const ROUTE_T_KEY: Record<string, keyof import('../../i18n').TranslationStrings> = {
  '/': 'bottomNav.home',
  '/lesson': 'bottomNav.lesson',
  '/vocabulary': 'bottomNav.vocab',
  '/profile': 'bottomNav.profile',
  '/speaking': 'bottomNav.speaking',
}

const RESOURCE_ITEMS = [
  { to: '/tandem',              icon: Users,         labelKey: 'nav.tandem' as const },
  { to: '/skills',              icon: BarChart3,     labelKey: 'nav.skills' as const },
  { to: '/personal-vocabulary', icon: BookMarked,    labelKey: 'nav.personalVocabulary' as const },
  { to: '/phrasal-verbs',       icon: BookText,      labelKey: 'nav.phrasalVerbs' as const },
  { to: '/idioms',              icon: MessageCircle, labelKey: 'nav.idioms' as const },
  { to: '/films',               icon: Film,          labelKey: 'nav.films' as const },
]

const NAV_ITEMS = [
  { to: '/',            icon: LayoutDashboard },
  { to: '/lesson',      icon: BookOpen },
  { to: '/speaking',    icon: Mic },
  { to: '/vocabulary',  icon: BookMarked },
  { to: '/profile',     icon: User },
]

export default function MobileBottomNav() {
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  const resourcesActive = RESOURCE_ITEMS.some((r) => isActive(r.to))

  return (
    <>
      <nav aria-label={t('bottomNav.home')} className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-bottom shadow-[0_-1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_-1px_6px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around h-14" role="tablist">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                aria-label={t(ROUTE_T_KEY[item.to] ?? item.to)}
                role="tab"
                aria-selected={active}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full pt-1 transition-colors
                  ${active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 active:text-gray-600 dark:active:text-gray-300'
                  }`}
              >
                {active && (
                  <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-b-full" />
                )}
                <span className="relative">
                  <Icon size={20} className={active ? 'stroke-[2.5]' : ''} />
                </span>
                <span className="text-xs font-semibold leading-tight">
                  {t(ROUTE_T_KEY[item.to] ?? item.to)}
                </span>
              </button>
            )
          })}

          {/* Resources button */}
          <button
            onClick={() => setResourcesOpen(true)}
            aria-label={t('nav.resources')}
            className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full pt-1 transition-colors
              ${resourcesActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500 active:text-gray-600 dark:active:text-gray-300'
              }`}
          >
            {resourcesActive && (
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-b-full" />
            )}
            <span className="relative">
              <LayoutGrid size={20} className={resourcesActive ? 'stroke-[2.5]' : ''} />
            </span>
            <span className="text-xs font-semibold leading-tight">
              {t('nav.resources')}
            </span>
          </button>
        </div>
      </nav>

      <BottomSheet open={resourcesOpen} onClose={() => setResourcesOpen(false)} title={t('nav.resources')}>
        <div className="py-2">
          {RESOURCE_ITEMS.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon
            return (
              <button
                key={item.to}
                onClick={() => { navigate(item.to); setResourcesOpen(false) }}
                aria-label={t(item.labelKey)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors
                  ${active
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 active:bg-gray-50 dark:active:bg-gray-800'
                  }`}
              >
                <Icon size={20} className={active ? 'stroke-[2.5]' : ''} />
                {t(item.labelKey)}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </>
  )
}
