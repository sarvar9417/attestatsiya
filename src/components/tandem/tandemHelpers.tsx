// ═══════════════════════════════════════════════════════════════════════════
// TandemDashboard uchun kichik komponentlar
// ═══════════════════════════════════════════════════════════════════════════

export function StatusDot({ lastActive }: { lastActive: string | null }) {
  if (lastActive) {
    const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / 86400000)
    if (daysSince < 1) return <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" title="Bugun faol" />
    if (daysSince < 3) return <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" title={`${daysSince} kun oldin`} />
    return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" title="Uzoq vaqt oldin" />
  }
  return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" title="Noma'lum" />
}

export function DaysRemaining({ weekStart }: { weekStart: string }) {
  const end = new Date(weekStart + 'T00:00:00Z')
  end.setUTCDate(end.getUTCDate() + 6)
  const diff = end.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(diff / 86400000))
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
      <svg className="lucide lucide-calendar" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span>{weekStart} - {daysLeft} kun qoldi</span>
    </div>
  )
}
