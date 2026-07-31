import { useState, useEffect, lazy, Suspense } from 'react'
import { SimpleLoadingSkeleton } from './components/ui/PageSkeleton'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { reportWebVitals } from './lib/performance'
import { useAuth } from './hooks/useAuth'
import { monitoring } from './lib/monitoring'
import { supabaseInitError } from './lib/supabase'
import Sidebar from './components/layout/Sidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import OfflineBanner from './components/layout/OfflineBanner'
import { Menu, X } from 'lucide-react'
import ErrorBoundary from './components/ErrorBoundary'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import AdminLayout from './components/admin/AdminLayout'
import AdminGuard from './components/auth/AdminGuard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import SessionExpiredHandler from './components/auth/SessionExpiredHandler'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import LearningPage from './pages/LearningPage'
import ModulePage from './pages/ModulePage'
import DashboardPage from './pages/DashboardPage'
import ExamPage from './pages/ExamPage'
import ExamDemoPage from './pages/ExamDemoPage'

const NotFound = lazy(() => import('./pages/NotFound'))

function ConfigErrorScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Konfiguratsiya xatosi</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ilova ishga tushirishda quyidagi muammo yuz berdi:
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-300 font-mono">
            {supabaseInitError}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">Iltimos, quyidagi qadamlarni bajaring:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Vercel dashboard'ga kiring</li>
            <li>Project Settings &gt; Environment Variables bo'limiga o'ting</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">VITE_SUPABASE_URL</code> va <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> ni qo'shing</li>
            <li>Deployni qayta ishga tushiring</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

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
      <SessionExpiredHandler />
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
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/learn" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
                <Route path="/learn/:moduleId" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
                <Route path="/exam" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
                <Route path="/exam/:kind" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
                <Route path="/exam/:kind/:moduleId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
                <Route path="/exam-demo" element={<ExamDemoPage />} />
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
  const { loading } = useAuth()

  if (loading) return <SimpleLoadingSkeleton />

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  )
}

function RouteMetaUpdater() {
  useEffect(() => { reportWebVitals() }, [])
  return null
}

export default function App() {
  if (supabaseInitError) {
    return <ConfigErrorScreen />
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteMetaUpdater />
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
