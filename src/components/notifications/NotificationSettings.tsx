import { Bell, BellOff, Clock, Flame, BookOpen } from 'lucide-react'
import { useNotifications, requestNotificationPermission } from '../../hooks/useNotifications'

export default function NotificationSettings() {
  const { prefs, updatePrefs, permission } = useNotifications()

  const isGranted = permission === 'granted'

  const handlePermissionRequest = async () => {
    const granted = await requestNotificationPermission()
    if (!granted) {
      const { useToastStore } = await import('../../utils/toastStore')
      useToastStore.getState().toast(
        'Bildirishnomalarga ruxsat berilmadi. Brauzer sozlamalaridan yoqishingiz mumkin.',
        'warning',
      )
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <Bell size={18} className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">Bildirishnomalar</h3>
      </div>

      {/* Permission status */}
      {!isGranted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
          <BellOff size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 flex-1">
            Bildirishnomalar o'chirilgan. Kunlik eslatma va ogohlantirishlarni olish uchun ruxsat bering.
          </p>
          <button
            onClick={handlePermissionRequest}
            className="text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors flex-shrink-0"
          >
            Ruxsat berish
          </button>
        </div>
      )}

      <div className="space-y-3">
        {/* Daily Reminder */}
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 min-w-0">
            <Clock size={18} className="text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Kunlik eslatma</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Har kuni soat {prefs.dailyReminderTime} da eslatma olish</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {prefs.dailyReminder && isGranted && (
              <input
                type="time"
                value={prefs.dailyReminderTime}
                onChange={(e) => updatePrefs({ dailyReminderTime: e.target.value })}
                className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            )}
            <button
              role="switch"
              aria-checked={prefs.dailyReminder && isGranted}
              onClick={() => updatePrefs({ dailyReminder: !prefs.dailyReminder })}
              disabled={!isGranted}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                prefs.dailyReminder && isGranted
                  ? 'bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-600'
              } ${!isGranted ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  prefs.dailyReminder && isGranted ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </label>

        {/* Streak Warning */}
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 min-w-0">
            <Flame size={18} className="text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Streak ogohlantirish</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bugun dars qilmasangiz, streak xavf ostida ekani haqida xabar</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={prefs.streakWarning && isGranted}
            onClick={() => updatePrefs({ streakWarning: !prefs.streakWarning })}
            disabled={!isGranted}
            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
              prefs.streakWarning && isGranted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
            } ${!isGranted ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                prefs.streakWarning && isGranted ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </label>

        {/* Review Reminder */}
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen size={18} className="text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">So'z takrorlash eslatmasi</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Takrorlash vaqti kelgan so'zlar haqida xabar</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={prefs.reviewReminder && isGranted}
            onClick={() => updatePrefs({ reviewReminder: !prefs.reviewReminder })}
            disabled={!isGranted}
            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
              prefs.reviewReminder && isGranted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
            } ${!isGranted ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                prefs.reviewReminder && isGranted ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </label>
      </div>

      {isGranted && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Bildirishnomalar yoqilgan ✅
        </p>
      )}
    </div>
  )
}
