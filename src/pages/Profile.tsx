import { useAuth } from '../hooks/useAuth'
import { LogOut } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profil</h1>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600">
            {user?.email?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.email}</h2>
            <p className="text-sm text-gray-500">Foydalanuvchi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
