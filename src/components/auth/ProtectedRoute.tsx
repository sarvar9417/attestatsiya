import { type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Login talab qilinadigan route'lar uchun himoya: session bo'lmasa
 * /auth?returnTo=<joriy manzil> ga yo'naltiradi; login'dan keyin
 * foydalanuvchi o'zi kelgan sahifaga qaytariladi.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading || user) return
    const returnTo = encodeURIComponent(location.pathname + location.search)
    navigate(`/auth?returnTo=${returnTo}`, { replace: true })
  }, [loading, user, navigate, location.pathname, location.search])

  if (loading || !user) return null

  return <>{children}</>
}
