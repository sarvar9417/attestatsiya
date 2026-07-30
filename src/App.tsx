import { useState, useEffect, lazy, Suspense } from 'react'
import { SimpleLoadingSkeleton } from './components/ui/PageSkeleton'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { reportWebVitals } from './lib/performance'
import { useAuth } from './hooks/useAuth'
import { monitoring } from './lib/monitoring'
import { setApiAuthToken } from './lib/apiClient'
import Sidebar from './components/layout/Sidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import OfflineBanner from './components/layout/OfflineBanner'
import { Menu, X } from 'lucide-react'
import ErrorBoundary from './components/ErrorBoundary'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import AdminLayout from './components/admin/AdminLayout'
import AdminGuard from './components/auth/AdminGuard'
import LearningPage from './pages/LearningPage'
import ModulePage from './pages/ModulePage'
import DashboardPage from './pages/DashboardPage'
import ExamPage from './pages/ExamPage'
import ExamDemoPage from './pages/ExamDemoPage'
import TopicExamPage from './pages/TopicExamPage'

const Auth = lazy(() => import('./pages/Auth'))
const NotFound = lazy(() => import('./pages/NotFound'))

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()
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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
          Asosiy kontentga o'tish
        </a>
        {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main id="main-content" className="flex-1 overflow-y-auto flex flex-col mobile-safe-bottom scrollable">
          <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 lg:hidden min-h-[48px]">
            <button onClick={() => setMobileMenuOpen(v => !v)} className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menyu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">Attestatsiya</span>
            <div className="w-10" />
          </div>
          <Suspense fallback={<SimpleLoadingSkeleton />}>
            <div className="animate-page-enter">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/learn" element={<LearningPage />} />
                <Route path="/learn/:moduleId" element={<ModulePage />} />
                <Route path="/exam" element={<ExamPage />} />
                <Route path="/exam/:kind" element={<ExamPage />} />
                <Route path="/exam/:kind/:moduleId" element={<ExamPage />} />
                <Route path="/exam-demo" element={<ExamDemoPage />} />
                <Route path="/exam/topic/:moduleId/:subtopicId" element={<TopicExamPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}

function AppRouter() {
  const { session, loading } = useAuth()

  // Sync auth token to API client
  useEffect(() => {
    setApiAuthToken(session?.access_token ?? null)
  }, [session])

  if (loading) return <SimpleLoadingSkeleton />
  if (!session) return <Suspense fallback={<SimpleLoadingSkeleton />}><Auth /></Suspense>

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminGuard userId={session.user.id}>
            <AdminLayout />
          </AdminGuard>
        }
      />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  )
}

function RouteMetaUpdater() {
  useEffect(() => { reportWebVitals() }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteMetaUpdater />
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
