import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'
import { useTandemStore } from '../store/tandemSlice'
import {
  ChevronRight,
} from 'lucide-react'
import AiInsightsWidget from '../components/dashboard/AiInsightsWidget'
import TandemCard from '../components/dashboard/TandemCard'
import ConfusablePairsCard from '../components/dashboard/ConfusablePairsCard'
import { ReviewOverview } from './GrammarReview'
import GrammarSrsCard from '../components/dashboard/GrammarSrsCard'
import StreakWarning from '../components/notifications/StreakWarning'
import ReviewReminder from '../components/notifications/ReviewReminder'
import WeakSpotsWidget from '../components/dashboard/WeakSpotsWidget'
import AdaptivePlan from '../components/dashboard/AdaptivePlan'
import ProgressMap from '../components/dashboard/ProgressMap'
import TopBar from '../components/dashboard/TopBar'
import TodayProgress from '../components/dashboard/TodayProgress'
import LessonProgressCard from '../components/dashboard/LessonProgressCard'
import DailyIdiomCard from '../components/dashboard/DailyIdiomCard'
import StartLessonButton from '../components/dashboard/StartLessonButton'
import SpeakingPathCard from '../components/dashboard/SpeakingPathCard'
import CefrProgressCard from '../components/dashboard/CefrProgressCard'
import StoryBeatCard from '../components/dashboard/StoryBeatCard'
import SectionLabel from '../components/dashboard/SectionLabel'
import CollapsibleSection from '../components/dashboard/CollapsibleSection'
import MotivationalWidget from '../components/dashboard/MotivationalWidget'
import StreakCelebration from '../components/dashboard/StreakCelebration'
import VocabDashboardWidget from '../components/personalVocabulary/VocabDashboardWidget'
import type { QuickWeakSpot } from '../services/analyticsService'

export default function Dashboard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { fetchAndSetLessons, personalWords, personalWordsFetched } = useStore()
  const handleWeakSpotsLoaded = useCallback((_spots: QuickWeakSpot[]) => {}, [])
  const { pendingOpponentDuels, loadDuels } = useTandemStore()
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  const streak = useStore((s) => s.streak)

  useEffect(() => {
    fetchAndSetLessons()
    loadDuels()
  }, [fetchAndSetLessons, loadDuels])

  // Show streak celebration on mount if streak hit a milestone
  useEffect(() => {
    if (streak >= 3 && streak % 3 === 0) {
      const timer = setTimeout(() => setShowStreakCelebration(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <div className="flex-1 overflow-y-auto scrollbar-hide mobile-safe-bottom">
        <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {/* Motivational greeting + stats */}
          <MotivationalWidget />

          {/* Pending duel banner */}
          {pendingOpponentDuels.length > 0 && (
            <button
              onClick={() => navigate('/tandem')}
              aria-label={t('dashboard.duelTitle', { count: pendingOpponentDuels.length })}
              className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 border border-rose-200 dark:border-rose-800/50 text-left hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚔️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-rose-800 dark:text-rose-200">
                  {t('dashboard.duelTitle', { count: pendingOpponentDuels.length })}
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  {t('dashboard.duelSubtitle')}
                </p>
              </div>
              <span className="text-sm text-rose-600 dark:text-rose-400 font-semibold group-hover:gap-1.5 transition-all flex items-center gap-0.5 flex-shrink-0">
                {t('dashboard.duelButton')} <ChevronRight size={15} />
              </span>
            </button>
          )}

          {/* Bildirishnomalar — faqat kerak bo'lganda ko'rinadi */}
          <CollapsibleSection title="Streak Warning" defaultExpanded={false}>
            <StreakWarning />
          </CollapsibleSection>
          <CollapsibleSection title="Review Reminder" defaultExpanded={false}>
            <ReviewReminder />
          </CollapsibleSection>

          {/* ── Tab bar ── */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab('today')}
              aria-label={t('dashboard.tabToday')}
              aria-pressed={activeTab === 'today'}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📖 {t('dashboard.tabToday')}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              aria-label={t('dashboard.tabAll')}
              aria-pressed={activeTab === 'all'}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📋 {t('dashboard.tabAll')}
            </button>
          </div>

          {activeTab === 'today' ? (
            <>
              {/* ── Bugungi dars — asosiy ── */}
              <StartLessonButton />
              <SpeakingPathCard />
              <CollapsibleSection title={t('dashboard.skillProgressTitle')} alwaysExpanded>
                <TodayProgress />
              </CollapsibleSection>
              <CefrProgressCard />
              <SectionLabel>{t('dashboard.sectionToday')}</SectionLabel>
              <LessonProgressCard />
              <CollapsibleSection title={t('dashboard.sectionReviewOverview')}>
                <ReviewOverview />
              </CollapsibleSection>
              <CollapsibleSection title={t('dashboard.sectionGrammarSrs')}>
                <GrammarSrsCard />
              </CollapsibleSection>
              {personalWordsFetched && (
                <CollapsibleSection title="Shaxsiy lug'at">
                  <VocabDashboardWidget words={personalWords} />
                </CollapsibleSection>
              )}
            </>
          ) : (
            <>
              {/* ── Barchasi — to'liq dashboard ── */}
              <StartLessonButton />
              <SpeakingPathCard />
              <CollapsibleSection title={t('dashboard.skillProgressTitle')} alwaysExpanded>
                <TodayProgress />
              </CollapsibleSection>
              <CefrProgressCard />
              <SectionLabel>{t('dashboard.sectionToday')}</SectionLabel>
              <LessonProgressCard />
              <CollapsibleSection title={t('dashboard.sectionReviewOverview')}>
                <ReviewOverview />
              </CollapsibleSection>
              <CollapsibleSection title={t('dashboard.sectionGrammarSrs')}>
                <GrammarSrsCard />
              </CollapsibleSection>
              <SectionLabel>{t('dashboard.sectionRecommended')}</SectionLabel>
              <CollapsibleSection title="Weak Spots">
                <WeakSpotsWidget onSpotsLoaded={handleWeakSpotsLoaded} />
              </CollapsibleSection>
              <CollapsibleSection title="Adaptive Plan">
                <AdaptivePlan />
              </CollapsibleSection>
              <CollapsibleSection title="AI Insights">
                <AiInsightsWidget />
              </CollapsibleSection>
              <CollapsibleSection title="Tandem Partner">
                <TandemCard />
              </CollapsibleSection>
              <DailyIdiomCard />
              <CollapsibleSection title="Confusable Pairs">
                <ConfusablePairsCard />
              </CollapsibleSection>
              <StoryBeatCard />
              <CollapsibleSection title="Progress Map">
                <ProgressMap />
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>

      {/* Streak celebration modal */}
      <StreakCelebration
        show={showStreakCelebration}
        streak={streak}
        onClose={() => setShowStreakCelebration(false)}
      />
    </div>
  )
}
