import { useState, useEffect, lazy, Suspense } from 'react'
import { SimpleLoadingSkeleton } from './components/ui/PageSkeleton'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { reportWebVitals } from './lib/performance'
import { updatePageMeta } from './lib/seo'
import { useStore } from './store/useStore'
import { useAuth } from './hooks/useAuth'
import { monitoring } from './lib/monitoring'
import Sidebar from './components/layout/Sidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import OfflineBanner from './components/layout/OfflineBanner'
import SyncIndicator from './components/ui/SyncIndicator'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Menu, X } from 'lucide-react'
import { I18nProvider, useI18n } from './i18n'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import NotificationInitializer from './components/notifications/NotificationInitializer'
import PwaInstallPrompt from './components/PwaInstallPrompt'
import SentryFeedback from './components/SentryFeedback'
import { LevelUpCelebration } from './components/ui/LevelUpCelebration'
import { XpBurstOverlay } from './components/ui/XpBurst'
import { useAppHydration } from './hooks/useAppHydration'
import { buildRoutes } from './routes/AppRoutes'

// ─── Lazy imports ─────────────────────────────────────────────────────────────

function lazyWithReload<T extends { default: React.ComponentType<unknown> }>(factory: () => Promise<T>) {
  return lazy(() =>
    factory().catch((err: unknown) => {
      import('./lib/errorService').then(({ captureError }) =>
        captureError(err, { type: 'chunk-load-failure', url: location.href })
      ).catch(() => {})
      const last = Number(sessionStorage.getItem('lastChunkReload') || 0)
      if (Date.now() - last > 10_000) {
        sessionStorage.setItem('lastChunkReload', String(Date.now()))
        window.location.reload()
        return new Promise<T>(() => {})
      }
      throw err
    })
  )
}

const lazyPages = {
  Auth: lazyWithReload(() => import('./pages/Auth')),
  Dashboard: lazyWithReload(() => import('./pages/Dashboard')),
  VocabHub: lazyWithReload(() => import('./pages/VocabHub')),
  LearnHub: lazyWithReload(() => import('./pages/LearnHub')),
  MockTest: lazyWithReload(() => import('./pages/MockTest')),
  MixedReview: lazyWithReload(() => import('./pages/MixedReview')),
  ActiveRecall: lazyWithReload(() => import('./pages/ActiveRecall')),
  Chat: lazyWithReload(() => import('./pages/Chat')),
  Listening: lazyWithReload(() => import('./pages/Listening')),
  Reading: lazyWithReload(() => import('./pages/Reading')),
  Writing: lazyWithReload(() => import('./pages/Writing')),
  SkillsPage: lazyWithReload(() => import('./pages/SkillsPage')),
  VocabBattle: lazyWithReload(() => import('./components/vocabulary/VocabBattle')),
  Profile: lazyWithReload(() => import('./pages/Profile')),
  GrammarReview: lazyWithReload(() => import('./pages/GrammarReview')),
  Conversation: lazyWithReload(() => import('./pages/Conversation')),
  Pronunciation: lazyWithReload(() => import('./pages/Pronunciation')),
  AiPractice: lazyWithReload(() => import('./pages/AiPractice')),
  ResetPassword: lazyWithReload(() => import('./pages/ResetPassword')),
  TandemPage: lazyWithReload(() => import('./pages/TandemPage')),
  InvitePage: lazyWithReload(() => import('./pages/InvitePage')),
  PhrasalVerbs: lazyWithReload(() => import('./pages/PhrasalVerbs')),
  Idioms: lazyWithReload(() => import('./pages/Idioms')),
  Confusable: lazyWithReload(() => import('./pages/Confusable')),
  PersonalVocabulary: lazyWithReload(() => import('./pages/PersonalVocabulary')),
  SpeakingPath: lazyWithReload(() => import('./pages/SpeakingPath')),
  Grammar: lazyWithReload(() => import('./pages/Grammar')),
  PlacementTest: lazyWithReload(() => import('./pages/PlacementTest')),
  NotFound: lazyWithReload(() => import('./pages/NotFound')),
  IeltsMockTest: lazyWithReload(() => import('./components/ielts/IeltsMockTest')),
  FilmHub: lazyWithReload(() => import('./pages/FilmHub')),
  FilmDetail: lazyWithReload(() => import('./pages/FilmDetail')),
  ThirtyDayChallenge: lazyWithReload(() => import('./pages/ThirtyDayChallenge')),
  WeeklyPlan: lazyWithReload(() => import('./pages/WeeklyPlan')),
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()
  const levelUpPending = useStore((s) => s.levelUpPending)
  const clearLevelUp = useStore((s) => s.clearLevelUp)
  const { t } = useI18n()
  const location = useLocation()

  useEffect(() => {
    monitoring.trackEvent('page.view', {
      path: location.pathname,
      search: location.search,
      timestamp: Date.now(),
    })
  }, [location.pathname, location.search])

  return (
    <>
      <OfflineBanner isOnline={isOnline} />
      <SyncIndicator />
      <PwaInstallPrompt />
      <SentryFeedback />
      <NotificationInitializer />
      {levelUpPending && (
        <LevelUpCelebration fromLevel={levelUpPending.from} toLevel={levelUpPending.to} xpEarned={500} onDismiss={clearLevelUp} />
      )}
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        {/* Skip to main content — accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
          Asosiy kontentga o'tish
        </a>
        {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main id="main-content" className="flex-1 overflow-y-auto flex flex-col mobile-safe-bottom scrollable">
          <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 lg:hidden min-h-[48px]">
            <button onClick={() => setMobileMenuOpen(v => !v)} className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={t('app.menuLabel')}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">EP</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">EnglishPath</span>
            </div>
            <div className="w-10" />
          </div>
          <Suspense fallback={<SimpleLoadingSkeleton />}>
            <div className="animate-page-enter">
              {buildRoutes(lazyPages)}
            </div>
          </Suspense>
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}

// ─── Auth-aware router ────────────────────────────────────────────────────────

function AppRouter() {
  const { session, loading } = useAuth()
  const onboardingComplete = useStore((s) => s.onboardingComplete)

  useAppHydration(session)

  if (loading) return <SimpleLoadingSkeleton />
  if (!session) return <lazyPages.Auth />
  if (!onboardingComplete) return <OnboardingFlow />
  return <AppShell />
}

// ─── Route meta updater (SEO + Web Vitals) ──────────────────────────────────

function RouteMetaUpdater() {
  const location = useLocation()
  const { t } = useI18n()

  useEffect(() => { reportWebVitals() }, [])

  useEffect(() => {
    const seoKeys: Record<string, keyof import('./i18n').TranslationStrings> = {
      '/': 'seo.dashboard', '/lesson': 'seo.lessons',
      '/vocabulary': 'seo.vocabulary', '/mock-test': 'seo.mockTest', '/tandem': 'seo.tandem',
      '/phrasal-verbs': 'seo.phrasalVerbs', '/idioms': 'seo.idioms',
      '/confusable-pairs': 'seo.confusablePairs', '/chat': 'seo.chat',
      '/conversation': 'seo.conversation', '/listening': 'seo.listening',
      '/speaking': 'seo.speaking', '/reading': 'seo.reading', '/writing': 'seo.writing',
      '/skills': 'seo.skills', '/profile': 'seo.profile', '/review': 'seo.review',
      '/pronunciation': 'seo.pronunciation',
    }
    const key = seoKeys[location.pathname]
    if (key) updatePageMeta(t(key), t('seo.desc'))
  }, [location.pathname, t])

  return null
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider>
        <RouteMetaUpdater />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
        <ToastContainer />
        <XpBurstOverlay />
      </I18nProvider>
    </BrowserRouter>
  )
}
