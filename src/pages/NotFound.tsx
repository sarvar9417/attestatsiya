import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
      <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 select-none">404</div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('notFound.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('notFound.subtitle')}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm flex-1">
          <ArrowLeft size={16} /> {t('notFound.back')}
        </button>
        <button onClick={() => navigate('/')} className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm flex-1">
          <Home size={16} /> {t('notFound.home')}
        </button>
      </div>
      <div className="pt-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">{t('notFound.footer')}</p>
      </div>
    </div>
  )
}
