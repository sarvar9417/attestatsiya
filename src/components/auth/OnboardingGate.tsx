import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
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
 * qaytaradi va guard fail-open ishlaydi. Bu production login oqimini schema
 * cutoverdan oldin buzmaslik uchun ataylab qilingan.
 */
export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [state, setState] = useState<OnboardingState | null>(null)
  const [checking, setChecking] = useState(false)
  const [failed, setFailed] = useState(false)

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
          // Availability/read xatosi learnerni mahsulotdan butunlay bloklamaydi.
          setFailed(true)
        }
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [loading, user?.id, user?.role])

  if (loading || checking) return <SimpleLoadingSkeleton />
  if (!user || user.role !== 'user' || failed) return <>{children}</>

  if (state?.available && !state.completed) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/onboarding?returnTo=${returnTo}`} replace />
  }

  return <>{children}</>
}
