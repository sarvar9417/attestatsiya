import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface AdminGuardProps {
  children: ReactNode
}

const ROLE_LABELS: Record<string, string> = {
  user: 'Foydalanuvchi',
  editor: 'Muharrir',
  admin: 'Administrator',
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6 text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ruxsat yo'q</h1>
          <p className="text-sm text-gray-500">Admin panelga kirish uchun avval tizimga kiring.</p>
          <Link to="/auth" className="btn-primary inline-block">
            Kirish
          </Link>
        </div>
      </div>
    )
  }

  if (user.role !== 'admin' && user.role !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border p-6 text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ruxsat yo'q</h1>
          <p className="text-sm text-gray-500">
            Sizning rolingiz ({ROLE_LABELS[user.role] ?? user.role}) admin panelga kirishga ruxsat
            bermaydi.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Bosh sahifa
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
