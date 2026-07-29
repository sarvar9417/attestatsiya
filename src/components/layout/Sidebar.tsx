import React, { useState, useSyncExternalStore } from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useTandemStore } from '../../store/tandemSlice'
import { useI18n } from '../../i18n'
import LanguageSwitcher from '../../components/ui/LanguageSwitcher'
import { usePwaInstall } from '../../hooks/usePwaInstall'
import {
  LayoutDashboard, BookOpen, BookMarked,
  ClipboardList, MessageSquare, BarChart3,
  ChevronLeft, ChevronRight, ChevronDown, Zap, Flame,
  Trophy, Sun, Moon, Monitor, X, User, Users,
  BookText, MessageCircle, Mic, Brain, BookmarkCheck,
  Download, Film, CalendarRange,
} from 'lucide-react'
import { cycleTheme, getThemePreference, subscribeToTheme } from '../../utils/theme'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',              icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/lesson',        icon: <BookOpen size={20} />,        label: 'Darslar' },
  { to: '/weekly-plan',   icon: <CalendarRange size={20} />,   label: 'Haftalik reja' },
  { to: '/speaking-path', icon: <Mic size={20} />,             label: 'Speaking' },
  { to: '/vocabulary',    icon: <BookMarked size={20} />,      label: "Lug'at & Iboralar" },
  { to: '/personal-vocabulary', icon: <BookmarkCheck size={20} />, label: "Shaxsiy Lug'atim" },
  { to: '/mock-test',     icon: <ClipboardList size={20} />,   label: 'Mock Test' },
  { to: '/chat',          icon: <MessageSquare size={20} />,   label: 'AI Tutor' },
  { to: '/profile',       icon: <User size={20} />,            label: 'Profil' },
]

const RESOURCES_SUBITEMS: NavItem[] = [
  { to: '/tandem',        icon: <Users size={20} />,           label: 'Tandem' },
  { to: '/skills',        icon: <BarChart3 size={20} />,       label: "Ko'nikmalar" },
  { to: '/phrasal-verbs', icon: <BookText size={20} />,        label: 'Phrasal Verbs' },
  { to: '/idioms',        icon: <MessageCircle size={20} />,   label: 'Idioms' },
  { to: '/confusable-pairs', icon: <Brain size={20} />,       label: 'Confusable Pairs' },
  { to: '/films',         icon: <Film size={20} />,            label: 'Film Vocabulary' },
]

const LEVEL_COLORS: Record<string, string> = {
  'A2+': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  'B1':  'bg-b1-100 dark:bg-b1-900/40 text-b1-700 dark:text-b1-300',
  'B1+': 'bg-b1-100 dark:bg-b1-900/40 text-b1-800 dark:text-b1-300',
  'B2':  'bg-b2-100 dark:bg-b2-900/40 text-b2-700 dark:text-b2-300',
}

// Map route paths to i18n keys for nav labels
const ROUTE_T_KEY: Record<string, keyof import('../../i18n').TranslationStrings> = {
  '/': 'nav.dashboard',
  '/lesson': 'nav.lessons',
  '/weekly-plan': 'nav.weeklyPlan',
  '/speaking-path': 'nav.speakingPath',
  '/vocabulary': 'nav.vocabulary',
  '/personal-vocabulary': 'nav.personalVocabulary',
  '/mock-test': 'nav.mockTest',
  '/chat': 'nav.aiTutor',
  '/profile': 'nav.profile',
  '/tandem': 'nav.tandem',
  '/skills': 'nav.skills',
  '/phrasal-verbs': 'nav.phrasalVerbs',
  '/idioms': 'nav.idioms',
  '/confusable-pairs': 'nav.confusablePairs',
  '/films': 'nav.films',
}

export default React.memo(function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const themePref = useSyncExternalStore(subscribeToTheme, getThemePreference)
  const { userName, totalXP, streak, currentLevel, currentDay, targetDate } = useStore()
  const pendingDuelCount = useTandemStore((s) => s.pendingOpponentDuels.length)
  const { t } = useI18n()
  const { canInstall, promptInstall, isInstalled } = usePwaInstall()

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(targetDate).getTime() - Date.now()) / 86400000
  ))

  const xpToNextLevel = 1000
  const xpProgress = (totalXP % xpToNextLevel) / xpToNextLevel * 100

  const handleNav = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-full
          transition-[width] duration-300 ease-in-out flex-shrink-0 will-change-[width]
          ${collapsed ? 'w-16' : 'w-60'}`}
      >
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">EP</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">EnglishPath</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{t('sidebar.levelRange')}</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate max-w-[110px]">
                {userName || t('sidebar.userFallback')}
              </p>
              <span className={`badge text-xs mt-0.5 ${LEVEL_COLORS[currentLevel] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {currentLevel}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                <span className="text-xs font-bold">{streak}</span>
              </div>
              <div className="flex items-center gap-1 text-b2-600">
                <Trophy size={14} />
                <span className="text-xs font-bold">{totalXP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-gradient-to-r from-primary-500 to-b2-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{t('sidebar.xpProgress', { current: totalXP % xpToNextLevel, total: xpToNextLevel })}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={handleNav}
            aria-label={t(ROUTE_T_KEY[item.to] ?? item.to)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? t(ROUTE_T_KEY[item.to] ?? item.to) : undefined}
          >
            <span className="relative">
              {item.icon}
              {item.to === '/tandem' && pendingDuelCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {pendingDuelCount > 9 ? '9+' : pendingDuelCount}
                </span>
              )}
            </span>
            {!collapsed && (
              <span className="flex items-center gap-1.5">
                {t(ROUTE_T_KEY[item.to] ?? item.to)}
                {item.to === '/tandem' && pendingDuelCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {pendingDuelCount}
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}

        {/* Resources sub-menu */}
        <div>
          <button
            onClick={() => setResourcesOpen((o) => !o)}
            className={`sidebar-link ${resourcesOpen ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? t('nav.resources') : undefined}
            aria-label={t('sidebar.resourcesAria')}
          >
            <BookText size={20} />
            {!collapsed && (
              <span className="flex items-center justify-between flex-1 min-w-0">
                <span>{t('nav.resources')}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${resourcesOpen ? 'rotate-0' : '-rotate-90'}`}
                />
              </span>
            )}
          </button>

          {resourcesOpen && (
             <div className={`space-y-0.5 ${collapsed ? 'hidden' : 'mt-0.5 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800'}`}>
               {RESOURCES_SUBITEMS.map((item) => (
                 <NavLink
                   key={item.to}
                   to={item.to}
                   end={item.to === '/'}
                   onClick={handleNav}
                   aria-label={t(ROUTE_T_KEY[item.to] ?? item.to)}
                   className={({ isActive }) =>
                     `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                   }
                   title={collapsed ? t(ROUTE_T_KEY[item.to] ?? item.to) : undefined}
                 >
                   <span className="relative">
                     {item.icon}
                     {item.to === '/tandem' && pendingDuelCount > 0 && (
                       <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                         {pendingDuelCount > 9 ? '9+' : pendingDuelCount}
                       </span>
                     )}
                   </span>
                   {!collapsed && (
                     <span className="flex items-center gap-1.5">
                       {t(ROUTE_T_KEY[item.to] ?? item.to)}
                       {item.to === '/tandem' && pendingDuelCount > 0 && (
                         <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                           {pendingDuelCount}
                         </span>
                       )}
                     </span>
                   )}
                 </NavLink>
               ))}
             </div>
           )}
         </div>

         {/* PWA Install button - only show when not installed and can be installed */}
         {!isInstalled && canInstall && (
           <button
             onClick={() => promptInstall()}
             className={`sidebar-link ${collapsed ? 'justify-center px-2' : ''}`}
             title={collapsed ? t('pwa.installTitle') : undefined}
           >
             <Download size={20} />
             {!collapsed && (
               <span className="flex items-center gap-1.5">
                 {t('pwa.installTitle')}
               </span>
             )}
           </button>
         )}
       </nav>

      {/* Stats footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-primary-500" />
              <span>{t('sidebar.dayCount', { day: currentDay })}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500">{t('sidebar.daysLeft', { days: daysLeft })}</span>
          </div>
          <div className="progress-bar mt-1.5">
            <div
              className="progress-fill bg-primary-500"
              style={{ width: `${(currentDay / 126) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Language Switcher */}
      <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800">
        <LanguageSwitcher collapsed={collapsed} />
      </div>

      {/* Theme toggle — desktop only */}
      <button
        onClick={cycleTheme}
        className="hidden lg:flex items-center justify-center py-2 border-t border-gray-100 dark:border-gray-800
          text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors gap-2 text-xs font-medium"
        title={themePref === 'light' ? t('sidebar.themeLight') : themePref === 'dark' ? t('sidebar.themeDark') : t('sidebar.themeSystem')}
      >
        {themePref === 'light' && <Sun size={14} />}
        {themePref === 'dark' && <Moon size={14} />}
        {themePref === 'system' && <Monitor size={14} />}
        <span>
          {themePref === 'light' && t('sidebar.themeLight')}
          {themePref === 'dark' && t('sidebar.themeDark')}
          {themePref === 'system' && t('sidebar.themeSystem')}
        </span>
      </button>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        className="hidden lg:flex items-center justify-center py-3 border-t border-gray-100 dark:border-gray-800
          text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out shadow-2xl will-change-transform safe-area-top
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '280px' }}
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">EnglishPath</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('sidebar.levelRange')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('sidebar.closeMenu')}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate max-w-[160px]">
                {userName || t('sidebar.userFallback')}
              </p>
              <span className={`badge text-xs mt-0.5 ${LEVEL_COLORS[currentLevel] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {currentLevel}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                <span className="text-xs font-bold">{streak}</span>
              </div>
              <div className="flex items-center gap-1 text-b2-600">
                <Trophy size={14} />
                <span className="text-xs font-bold">{totalXP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-gradient-to-r from-primary-500 to-b2-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{t('sidebar.xpProgress', { current: totalXP % xpToNextLevel, total: xpToNextLevel })}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNav}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="relative">
                {item.icon}
                {item.to === '/tandem' && pendingDuelCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {pendingDuelCount > 9 ? '9+' : pendingDuelCount}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                {t(ROUTE_T_KEY[item.to] ?? item.to)}
                {item.to === '/tandem' && pendingDuelCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {pendingDuelCount}
                  </span>
                )}
              </span>
            </NavLink>
          ))}

          {/* Resources sub-menu — mobile drawer */}
          <div>
            <button
              onClick={() => setResourcesOpen((o) => !o)}
              className={`sidebar-link ${resourcesOpen ? 'active' : ''}`}
              aria-label={t('sidebar.resourcesAria')}
            >
              <BookText size={20} />
              <span className="flex items-center justify-between flex-1 min-w-0">
                <span>{t('nav.resources')}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${resourcesOpen ? 'rotate-0' : '-rotate-90'}`}
                />
              </span>
            </button>

            {resourcesOpen && (
               <div className="mt-0.5 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800 space-y-0.5">
                 {RESOURCES_SUBITEMS.map((item) => (
                   <NavLink
                     key={item.to}
                     to={item.to}
                     end={item.to === '/'}
                     onClick={handleNav}
                     aria-label={t(ROUTE_T_KEY[item.to] ?? item.to)}
                     className={({ isActive }) =>
                       `sidebar-link ${isActive ? 'active' : ''}`
                     }
                   >
                     <span className="relative">
                       {item.icon}
                       {item.to === '/tandem' && pendingDuelCount > 0 && (
                         <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                           {pendingDuelCount > 9 ? '9+' : pendingDuelCount}
                         </span>
                       )}
                     </span>
                     <span className="flex items-center gap-1.5">
                       {t(ROUTE_T_KEY[item.to] ?? item.to)}
                       {item.to === '/tandem' && pendingDuelCount > 0 && (
                         <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                           {pendingDuelCount}
                         </span>
                       )}
                     </span>
                   </NavLink>
                 ))}
               </div>
             )}
           </div>

           {/* PWA Install button - mobile drawer */}
           {!isInstalled && canInstall && (
             <button
               onClick={() => promptInstall()}
               className="sidebar-link"
             >
               <Download size={20} />
               <span className="flex items-center gap-1.5">
                 {t('pwa.installTitle')}
               </span>
             </button>
           )}
         </nav>

        {/* Stats footer */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-primary-500" />
              <span>{t('sidebar.dayCount', { day: currentDay })}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500">{t('sidebar.daysLeft', { days: daysLeft })}</span>
          </div>
          <div className="progress-bar mt-1.5">
            <div
              className="progress-fill bg-primary-500"
              style={{ width: `${(currentDay / 126) * 100}%` }}
            />
          </div>

          {/* Language Switcher — mobile */}
          <div className="mt-2">
            <LanguageSwitcher />
          </div>

          {/* Theme toggle — mobile */}
          <button
            onClick={cycleTheme}
            className="flex items-center justify-center gap-2 w-full mt-2 py-2 rounded-xl
              text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors text-xs font-medium"
          >
            {themePref === 'light' && <Sun size={14} />}
            {themePref === 'dark' && <Moon size={14} />}
            {themePref === 'system' && <Monitor size={14} />}
            <span>
              {themePref === 'light' && t('sidebar.themeLight')}
              {themePref === 'dark' && t('sidebar.themeDark')}
              {themePref === 'system' && t('sidebar.themeSystem')}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
})
