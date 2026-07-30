import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { typedSupabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { SimpleLoadingSkeleton } from '../ui/PageSkeleton'

type StaffRole = 'editor' | 'admin'
type RoleLoader = (userId: string) => Promise<string | null>

interface AdminGuardProps {
  userId?: string
  children: ReactNode
  loadRole?: RoleLoader
}

async function loadProfileRole(userId: string): Promise<string | null> {
  const { data, error } = await typedSupabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return typeof data?.role === 'string' ? data.role : null
}

const STAFF_ROLES = new Set<StaffRole>(['editor', 'admin'])

export default function AdminGuard({
  userId,
  children,
  loadRole = loadProfileRole,
}: AdminGuardProps) {
  const [access, setAccess] = useState<'loading' | 'allowed' | 'denied'>(
    userId ? 'loading' : 'denied'
  )

  useEffect(() => {
    if (!userId) {
      setAccess('denied')
      return
    }

    let active = true

    loadRole(userId)
      .then((role) => {
        if (!active) return
        setAccess(STAFF_ROLES.has(role as StaffRole) ? 'allowed' : 'denied')
      })
      .catch((error: unknown) => {
        if (!active) return
        monitoring.captureException(
          error instanceof Error ? error : new Error(String(error)),
          { area: 'auth.admin-guard' }
        )
        setAccess('denied')
      })

    return () => {
      active = false
    }
  }, [loadRole, userId])

  if (access === 'loading') return <SimpleLoadingSkeleton />
  if (access === 'allowed') return children

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <ShieldAlert
          size={40}
          className="mx-auto mb-4 text-red-600"
          aria-hidden="true"
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Kirish taqiqlangan
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Bu bo‘lim faqat tasdiqlangan kontent xodimlari uchun.
        </p>
        <Link to="/" className="btn-primary inline-flex mt-6">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  )
}
