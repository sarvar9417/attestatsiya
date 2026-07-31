import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SESSION_EXPIRED_EVENT } from '../../features/auth/sessionStore'

/**
 * apiClient refresh muvaffaqiyatsiz bo'lganda SESSION_EXPIRED_EVENT
 * yuboradi; shu hodisa orqali foydalanuvchi /auth?expired=1 ga
 * yo'naltiriladi.
 */
export default function SessionExpiredHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleSessionExpired = () => {
      if (location.pathname.startsWith('/auth') || location.pathname === '/reset-password') return
      navigate('/auth?expired=1', { replace: true })
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [navigate, location.pathname])

  return null
}
