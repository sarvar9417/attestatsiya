// Mounts useNotifications at AppShell level so browser notifications
// (streak warning, review reminder, daily reminder) fire on app load,
// not just when the user visits the Profile settings page.
import { useEffect } from 'react'
import { useNotifications, sendBrowserNotification } from '../../hooks/useNotifications'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'

export default function NotificationInitializer() {
  // Call the hook so the side effects (streak warning, review reminder,
  // daily reminder) run when the authenticated app shell mounts.
  useNotifications()

  // ─── Tandem: kutilayotgan duellar va do'stlik takliflarini tekshirish ───
  useEffect(() => {
    const checkPendingTandemItems = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const userId = session.user.id

        // Kutilayotgan do'stlik takliflari
        const { count: pendingInvites } = await supabase
          .from('friendships')
          .select('*', { count: 'exact', head: true })
          .eq('friend_id', userId)
          .eq('status', 'pending')

        if (pendingInvites && pendingInvites > 0) {
          sendBrowserNotification('🤝 Do\'stlik taklifi', {
            body: `Sizda ${pendingInvites} ta kutilayotgan do'stlik taklifi bor`,
            url: '/tandem',
          })
        }

        // Kutilayotgan duellar (men opponentman, mening navbatim)
        const { count: pendingDuels } = await supabase
          .from('duels')
          .select('*', { count: 'exact', head: true })
          .eq('opponent', userId)
          .eq('status', 'opponent_turn')

        if (pendingDuels && pendingDuels > 0) {
          sendBrowserNotification('⚔️ Javob berilmagan duel', {
            body: `Sizni ${pendingDuels} ta duel kutmoqda! 24 soat ichida javob bering.`,
            url: '/tandem',
          })
        }

        // Duel natijalari store orqali UI da ko'rsatiladi
      } catch (e) {
        monitoring.captureMessage('Tandem notification check failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }

    // Check after 3 seconds (allow app to load fully)
    const timer = setTimeout(checkPendingTandemItems, 3_000)
    return () => clearTimeout(timer)
  }, [])

  return null
}
