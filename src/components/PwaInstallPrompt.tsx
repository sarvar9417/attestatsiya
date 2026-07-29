import { Download, X } from 'lucide-react'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { useI18n } from '../i18n'

/**
 * PWA install banner — appears when beforeinstallprompt fires
 * and the user hasn't dismissed or installed the app yet.
 */
export default function PwaInstallPrompt() {
  const { canInstall, isInstalled, promptInstall, dismiss } = usePwaInstall()
  const { t } = useI18n()

  if (!canInstall || isInstalled) return null

  const handleInstall = async () => {
    const accepted = await promptInstall()
    if (accepted) {
      // App installed successfully
    }
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[9998] sm:left-auto sm:right-4 sm:w-80 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">EP</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {t('pwa.installTitle')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              {t('pwa.installDesc')}
            </p>
          </div>

          <button
            onClick={dismiss}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
            aria-label={t('pwa.dismiss')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Download size={16} />
            {t('pwa.install')}
          </button>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {t('pwa.notNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
