import { type ReactNode } from 'react'

interface AdminGuardProps {
  userId?: string
  children: ReactNode
  loadRole?: never
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  // Demo mode: always allow access
  return <>{children}</>
}
