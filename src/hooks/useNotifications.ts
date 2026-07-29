import { useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '../store/useStore'
import { getTodayTashkent } from '../utils/tashkentDate'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NotificationPreferences {
  dailyReminder: boolean       // Kunlik eslatma (18:00 da)
  streakWarning: boolean       // Streak ogohlantirish
  reviewReminder: boolean      // So'z takrorlash eslatmasi
  dailyReminderTime: string    // "HH:mm" format
}

const DEFAULT_PREFS: NotificationPreferences = {
  dailyReminder: false,
  streakWarning: true,
  reviewReminder: true,
  dailyReminderTime: '18:00',
}

const STORAGE_KEY = 'notification-preferences'

// ─── Persistence ────────────────────────────────────────────────────────────

function loadPrefs(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS
  } catch (e) {
    monitoring.captureMessage('loadPrefs (notifications) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return DEFAULT_PREFS
  }
}

function savePrefs(prefs: NotificationPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

// ─── Browser Notification helper ────────────────────────────────────────────

export function sendBrowserNotification(
  title: string,
  options?: { body?: string; url?: string; icon?: string }
) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    const notif = new Notification(title, {
      body: options?.body,
      icon: options?.icon || '/favicon.svg',
      tag: 'englishpath',
      data: { url: options?.url || '/' },
    })

    // Auto-close after 10 seconds
    setTimeout(() => notif.close(), 10_000)
  } catch (e) {
    monitoring.captureMessage('Browser notification send failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
}

// ─── Request permission ─────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false

  try {
    const result = await Notification.requestPermission()
    return result === 'granted'
  } catch (e) {
    monitoring.captureMessage('requestNotificationPermission failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useNotifications() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(loadPrefs)
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  )
  const dailyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const warnedTodayRef = useRef(false)

  // Listen for permission changes
  useEffect(() => {
    if (!('Notification' in window)) return
    setPermission(Notification.permission)
  }, [])

  // ─── Update prefs ─────────────────────────────────────────────────────────

  const updatePrefs = useCallback((partial: Partial<NotificationPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial }
      savePrefs(next)
      return next
    })
  }, [])

  // ─── Daily reminder scheduler ─────────────────────────────────────────────

  useEffect(() => {
    // Clear existing timer
    if (dailyTimerRef.current) {
      clearInterval(dailyTimerRef.current)
      dailyTimerRef.current = null
    }

    if (!prefs.dailyReminder || permission !== 'granted') return

    // Check every 60 seconds if the target time has arrived
    dailyTimerRef.current = setInterval(() => {
      const currentHour = new Date().getHours()
      const currentMin = new Date().getMinutes()
      const [targetH, targetM] = prefs.dailyReminderTime.split(':').map(Number)

      if (currentHour === targetH && currentMin === targetM) {
        const store = useStore.getState()
        sendBrowserNotification('EnglishPath — Kunlik eslatma 📚', {
          body: `Bugun ${store.todayMinutes} daqiqa mashq qildingiz. Kunlik maqsad: ${store.dailyGoalMinutes} daqiqa!`,
          url: '/',
        })
      }
    }, 60_000)

    return () => {
      if (dailyTimerRef.current) clearInterval(dailyTimerRef.current)
    }
  }, [prefs.dailyReminder, prefs.dailyReminderTime, permission])

  // ─── Streak warning (check on mount) ──────────────────────────────────────

  useEffect(() => {
    if (!prefs.streakWarning || permission !== 'granted') return
    if (warnedTodayRef.current) return

    const store = useStore.getState()
    const today = getTodayTashkent()

    // If lastActiveDate is not today and not yesterday, streak is at risk
    if (store.lastActiveDate && store.lastActiveDate !== today) {
      const yesterday = new Date(today + 'T00:00:00Z')
      yesterday.setUTCDate(yesterday.getUTCDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (store.lastActiveDate === yesterdayStr && store.streak > 0) {
        // User was active yesterday but not today yet — gentle reminder
        warnedTodayRef.current = true
        setTimeout(() => {
          sendBrowserNotification('🔥 Streakingizni davom ettiring!', {
            body: `Bugun hali dars qilmadingiz. ${store.streak + 1} kunlik streakga bir qadam qoldi!`,
            url: '/daily-lesson',
          })
        }, 5_000) // 5 seconds after load
      } else if (store.lastActiveDate !== yesterdayStr && store.streak > 0) {
        // Streak is about to break or already broken
        warnedTodayRef.current = true
        setTimeout(() => {
          sendBrowserNotification('⚠️ Streak xavf ostida!', {
            body: `${store.streak} kunlik streak'ingizni yo'qotmaslik uchun bugun dars qiling!`,
            url: '/daily-lesson',
          })
        }, 5_000)
      }
    }
  }, [prefs.streakWarning, permission])

  // ─── Review reminder (check on mount) ─────────────────────────────────────

  useEffect(() => {
    if (!prefs.reviewReminder || permission !== 'granted') return

    const checkDueWords = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const today = getTodayTashkent()
        const { count } = await supabase
          .from('vocabulary_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .lte('next_review', today)
          .not('is_learned', 'eq', true)

        if (count && count > 0) {
          // Show in-app toast
          const { useToastStore } = await import('../utils/toastStore')
          useToastStore.getState().toast(
            `📝 ${count} ta so'z takrorlash vaqti keldi!`,
            'info',
            6000,
          )

          // Also browser notification if not on the vocabulary page
          setTimeout(() => {
            sendBrowserNotification('📝 So\'z takrorlash vaqti', {
              body: `${count} ta so'z takrorlanmagan. Bugun ko'rib chiqing!`,
              url: '/vocabulary',
            })
          }, 3_000)
        }
      } catch (e) {
        monitoring.captureMessage('Review reminder check failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }

    // Check after 2 seconds (allow page to load first)
    const timer = setTimeout(checkDueWords, 2_000)
    return () => clearTimeout(timer)
  }, [prefs.reviewReminder, permission])

  return {
    prefs,
    updatePrefs,
    permission,
    requestPermission: requestNotificationPermission,
  }
}
