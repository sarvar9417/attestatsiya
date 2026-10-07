import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { authClient, type OnboardingState } from '../../features/auth/authClient'
import { useAuth } from '../../hooks/useAuth'
import { SimpleLoadingSkeleton } from '../ui/PageSkeleton'

interface OnboardingGateProps {
  children: ReactNode
}

/**
 * Learner onboarding guard.
 *
 * Migration productionga hali qo'llanmagan bo'lsa endpoint available=false
 * qaytaradi va faqat shu explicit compatibility holatida guard fail-open ishlaydi.
 * Oddiy network/server xatosi majburiy onboardingni yashirin chetlab o'tkazmaydi.
 */
export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [state, setState] = useState<OnboardingState | null>(null)
  const [checking, setChecking] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true

    if (loading || !user || user.role !== 'user') {
      setState(null)
      setChecking(false)
      setFailed(false)
      return () => {
        active = false
      }
    }

    setChecking(true)
    setFailed(false)

    void authClient
      .getOnboarding()
      .then((next) => {
        if (active) setState(next)
      })
      .catch(() => {
        if (active) {
          setFailed(true)
        }
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [loading, retryKey, user])

  if (loading || checking) return <SimpleLoadingSkeleton />
  if (!user || user.role !== 'user') return <>{children}</>

  if (failed) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <section
          role="alert"
          className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900/60 dark:bg-gray-900"
        >
          <h1 className="text-lg font-semibold text-gray-950 dark:text-white">
            Onboarding holatini tekshirib bo‘lmadi
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Tarmoq yoki server vaqtincha ishlamayapti. Majburiy boshlang‘ich sozlashni
            chetlab o‘tmaslik uchun qayta tekshirish kerak.
          </p>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Qayta urinish
          </button>
        </section>
      </main>
    )
  }

  if (state?.available && !state.completed) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/onboarding?returnTo=${returnTo}`} replace />
  }

  return <>{children}</>
}
