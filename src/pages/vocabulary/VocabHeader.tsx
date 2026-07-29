import { useNavigate, useLocation } from 'react-router-dom'
import { BookMarked, CalendarDays, BarChart3, Download, RotateCcw, ChevronLeft } from 'lucide-react'
import { useI18n } from '../../i18n'

interface VocabHeaderProps {
  showCalendar: boolean
  showAnalytics: boolean
  setShowCalendar: (v: boolean) => void
  setShowAnalytics: (v: boolean) => void
  setShowTypingGame: (v: boolean) => void
  setShowSentenceGame: (v: boolean) => void
  setShowExportModal: (v: boolean) => void
  loadDailyData: () => void
}

export default function VocabHeader(props: VocabHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()
  const fromSkills = location.state?.from === '/skills'
  const {
    showCalendar, showAnalytics,
    setShowCalendar, setShowAnalytics,
    setShowTypingGame, setShowSentenceGame,
    setShowExportModal, loadDailyData,
  } = props

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {fromSkills && (
          <button onClick={() => navigate('/skills')} className="btn-ghost p-1.5 rounded-lg -ml-1.5" aria-label={t('vocabPage.backToSkills')}>
            <ChevronLeft size={16} />
          </button>
        )}
        <div className="w-8 h-8 bg-b1-100 rounded-lg flex items-center justify-center">
          <BookMarked size={16} className="text-b1-600" />
        </div>
        <h1 className="text-base sm:text-lg font-bold text-gray-900">{t('nav.vocabulary')}</h1>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setShowTypingGame(true)} className="btn-secondary p-2 rounded-lg" title={t('vocabPage.game')}>
          <span className="text-sm">🎮</span>
        </button>
        <button onClick={() => setShowSentenceGame(true)} className="btn-secondary p-2 rounded-lg" title={t('vocabPage.sentenceGame')}>
          <span className="text-sm">🗣️</span>
        </button>
        <button
          onClick={() => { setShowCalendar(!showCalendar); if (!showCalendar) setShowAnalytics(false) }}
          className={`btn-secondary p-2 rounded-lg ${showCalendar ? 'ring-2 ring-b1-500 border-b1-500' : ''}`}
          title={t('vocabPage.calendar')}
        >
          <CalendarDays size={15} />
        </button>
        <button
          onClick={() => { setShowAnalytics(!showAnalytics); if (!showAnalytics) setShowCalendar(false) }}
          className={`btn-secondary p-2 rounded-lg ${showAnalytics ? 'ring-2 ring-b1-500 border-b1-500' : ''}`}
          title={t('vocabPage.analytics')}
        >
          <BarChart3 size={15} />
        </button>
        <button onClick={() => setShowExportModal(true)} className="btn-secondary p-2 rounded-lg" title={t('vocabPage.export')}>
          <Download size={15} />
        </button>
        <button onClick={() => loadDailyData()} className="btn-secondary p-2 rounded-lg" title={t('vocabPage.refresh')}>
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  )
}
