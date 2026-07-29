import { Suspense, lazy } from 'react'
import { BookText, RotateCcw, CheckCircle, ArrowRight, CalendarDays, BarChart3, Download, Search, Filter } from 'lucide-react'
import { useI18n } from '../i18n'
import { DictionarySkeleton } from '../components/ui/PageSkeleton'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useStore } from '../store/useStore'
import { getBatchPhrases } from '../store/phrasesStore'
import PhraseProgress from '../components/phrases/PhraseProgress'
import PhraseCalendar from '../components/phrases/PhraseCalendar'
import PhraseTypingGame from '../components/phrases/PhraseTypingGame'
import PhraseScrambleGame from '../components/phrases/PhraseScrambleGame'
import PhraseRow from '../components/phrases/PhraseRow'
import PhraseExportModal from '../components/phrases/PhraseExportModal'
import PhraseFlashCardRenderer from '../components/phrases/PhraseFlashCardRenderer'
import PhraseTest from '../components/phrases/PhraseTest'
import { PHRASE_BATCH_SIZE } from '../utils/phraseConfig'
import { getTodayTashkent } from '../utils/tashkentDate'
import { usePhraseData } from '../hooks/usePhraseData'
const PhraseAnalytics = lazy(() => import('../components/phrases/PhraseAnalytics'))

export default function Phrases() {
  const { streak } = useStore()
  const d = usePhraseData()

  if (d.loading) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <DictionarySkeleton />
      </div>
    )
  }

  if (d.dailyPhrases.length === 0) return <EmptyState d={d} />
  if (d.viewMode === 'complete') return <CompleteView d={d} />
  if (d.viewMode === 'flashcard' && d.currentPhrase) return <FlashcardView d={d} />
  if (d.viewMode === 'test' && d.currentPhrase) return <TestView d={d} />
  if (d.viewMode === 'game') return <GameView d={d} />
  if (d.showScrambleGame) return <ScrambleOverlay d={d} />
  if (d.showTypingGame) return <TypingOverlay d={d} />
  return <CatalogView d={d} streak={streak} />
}

function EmptyState({ d }: { d: ReturnType<typeof usePhraseData> }) {
  const { t } = useI18n()
  const hasPhrasesInDB = d.levelStats.some((s) => s.total > 0)
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <PhraseProgress stats={d.levelStats} totalLearned={d.totalLearned} totalPhrases={d.levelStats.reduce((a, s) => a + s.total, 0)} dueCount={d.dueCount} streak={useStore.getState().streak} />
      <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
        {hasPhrasesInDB ? (
          <>
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('phrases.emptyTitleToday')}</h2>
            <p className="text-sm text-gray-500 max-w-xs">{t('phrases.emptyDescToday')}</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-2">📚</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('phrases.emptyTitleEmpty')}</h2>
            <p className="text-sm text-gray-500 max-w-xs">{t('phrases.emptyDescEmpty')}</p>
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">npx tsx scripts/seed-phrases.ts</code>
          </>
        )}
        <button onClick={() => d.loadDailyData()} className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
          <RotateCcw size={20} /> {t('phrases.emptyRefresh')}
        </button>
      </div>
    </div>
  )
}

function CompleteView({ d }: { d: ReturnType<typeof usePhraseData> }) {
  const { t } = useI18n()
  const pct = d.batchPhrases.length > 0 ? Math.round((d.correctCount / d.batchPhrases.length) * 100) : 0
  const isReviewMode = d.currentBatch === 0
  const isLastBatch = isReviewMode || d.currentBatch >= 3
  return (
    <div className="p-3 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {isReviewMode ? t('phrases.completeTitleReview') : isLastBatch ? t('phrases.completeTitleDone') : t('phrases.completeTitleBatch', { batch: String(d.currentBatch) })}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {t('phrases.completeDesc', { total: String(d.batchPhrases.length), correct: String(d.correctCount) })}
      </p>
      <div className="flex items-center gap-3 mb-8">
        <div className="card text-center px-4 sm:px-8 py-4">
          <p className="text-2xl sm:text-3xl font-bold text-b1-600">{pct}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('phrases.completeCorrect')}</p>
        </div>
        <div className="card text-center px-4 sm:px-8 py-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary-600">{d.correctCount * 5}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('phrases.completeXP')}</p>
        </div>
      </div>
      {isLastBatch ? (
        <button onClick={d.handleBatchComplete} className="btn-primary flex items-center gap-2">
          <CheckCircle size={16} /> {t('phrases.completeFinish')}
        </button>
      ) : (
        <button onClick={() => d.selectBatch(d.currentBatch + 1)} className="btn-primary flex items-center gap-2">
          {t('phrases.completeNextBatch')} <ArrowRight size={16} className="inline" />
        </button>
      )}
    </div>
  )
}

function FlashcardView({ d }: { d: ReturnType<typeof usePhraseData> }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={d.goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.flashcardExit')}</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">{d.currentIdx + 1} / {d.batchPhrases.length}</span>
          <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-b1-500 rounded-full transition-all duration-300" style={{ width: `${((d.currentIdx + 1) / d.batchPhrases.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <PhraseFlashCardRenderer
        phrase={d.currentPhrase}
        onRate={async (phraseId, rating) => {
          d.handleRating(phraseId, rating)
          d.updateSkillProgress('todayPhrasesPct', Math.round(((d.currentIdx + 1) / Math.max(d.batchPhrases.length, 1)) * 100))
        }}
        onAdvance={async () => {
          if (d.currentIdx + 1 >= d.batchPhrases.length) {
            const { supabase } = await import('../lib/supabase')
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user?.id) {
              const tk = getTodayTashkent().split('-').map(Number)
              void tk
            }
            d.finishBatch()
          } else {
            d.nextPhrase()
          }
        }}
      />
    </div>
  )
}

function TestView({ d }: { d: ReturnType<typeof usePhraseData> }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={d.goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.testExit')}</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">{d.currentIdx + 1} / {d.batchPhrases.length}</span>
          <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-b1-500 rounded-full transition-all duration-300" style={{ width: `${((d.currentIdx + 1) / d.batchPhrases.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <PhraseTest phrase={d.currentPhrase} allPhrases={d.dailyPhrases} onAnswer={d.handleTestAnswer} />
      <button onClick={d.handleTestAdvance} className="w-full mt-4 py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2">
        {t('phrases.testNext')} <ArrowRight size={16} />
      </button>
    </div>
  )
}

function GameView({ d }: { d: ReturnType<typeof usePhraseData> }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={d.goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.gameExit')}</button>
        <span className="text-sm font-medium text-gray-500">{t('phrases.batchLabel', { num: String(d.currentBatch) })}</span>
      </div>
      <PhraseScrambleGame phrases={d.batchPhrases} onComplete={d.handleGameComplete} onClose={d.goToCatalog} />
    </div>
  )
}

function ScrambleOverlay({ d }: { d: ReturnType<typeof usePhraseData> }) {
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <PhraseScrambleGame
        phrases={d.dailyPhrases}
        onComplete={(score) => { d.addXP(score * 3); d.setShowScrambleGame(false); d.loadDailyData() }}
        onClose={() => d.setShowScrambleGame(false)}
      />
    </div>
  )
}

function TypingOverlay({ d }: { d: ReturnType<typeof usePhraseData> }) {
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <PhraseTypingGame onClose={() => d.setShowTypingGame(false)} />
    </div>
  )
}

function CatalogView({ d, streak }: { d: ReturnType<typeof usePhraseData>; streak: number }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-b1-100 dark:bg-b1-900/40 rounded-lg flex items-center justify-center">
            <BookText size={16} className="text-b1-600 dark:text-b1-400" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{t('phrases.title')}</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => d.setShowTypingGame(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipTyping')}><span className="text-sm">⌨️</span></button>
          <button onClick={() => d.setShowScrambleGame(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipScramble')}><span className="text-sm">🧩</span></button>
          <button onClick={() => { d.setShowCalendar(!d.showCalendar); if (d.showCalendar) d.setSelectedDate(getTodayTashkent()) }} className={`btn-secondary p-2 rounded-lg ${d.showCalendar ? 'ring-2 ring-b1-500 border-b1-500' : ''}`} title={t('phrases.tooltipCalendar')}><CalendarDays size={15} /></button>
          <button onClick={() => { d.setShowAnalytics(!d.showAnalytics); if (!d.showAnalytics) d.setShowCalendar(false) }} className={`btn-secondary p-2 rounded-lg ${d.showAnalytics ? 'ring-2 ring-b1-500 border-b1-500' : ''}`} title={t('phrases.tooltipAnalytics')}><BarChart3 size={15} /></button>
          <button onClick={() => d.setShowExportModal(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipExport')}><Download size={15} /></button>
          <button onClick={() => d.loadDailyData()} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipRefresh')}><RotateCcw size={15} /></button>
        </div>
      </div>

      <PhraseProgress stats={d.levelStats} totalLearned={d.totalLearned} totalPhrases={d.levelStats.reduce((a, s) => a + s.total, 0)} dueCount={d.dueCount} streak={streak} />

      {d.showAnalytics ? (
        <div className="mt-4">
          <Suspense fallback={<div className="flex flex-col gap-3 py-8"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
            <PhraseAnalytics userId={d.userId!} sessions={d.monthSessions} levelCounts={d.levelCounts} />
          </Suspense>
        </div>
      ) : d.showCalendar ? (
        <div className="mt-4">
          <PhraseCalendar
            sessions={d.monthSessions}
            selectedDate={d.selectedDate}
            onDateSelect={d.setSelectedDate}
            onContinue={() => { d.setShowCalendar(false); d.selectBatch(1); setTimeout(() => d.enterStudyMode('flashcard'), 0) }}
            onClose={() => { const today = getTodayTashkent(); d.setShowCalendar(false); d.setSelectedDate(today); d.loadDailyData(today) }}
          />
        </div>
      ) : (
        <>
          {d.reviewPhrases.length > 0 && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 px-3 py-2">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400">{t('phrases.reviewDue', { count: String(d.reviewPhrases.length) })}</p>
              <button onClick={() => { d.selectReview(); setTimeout(() => d.enterStudyMode('flashcard'), 0) }} className="shrink-0 px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-all">{t('phrases.reviewStart')}</button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3].map((batchNum) => {
              const batchSlice = getBatchPhrases(d.dailyPhrases, batchNum)
              const batchIds = batchSlice.map(p => p.phrase_id)
              const startNum = batchIds.length > 0 ? Math.min(...batchIds) : 0
              const endNum = batchIds.length > 0 ? Math.max(...batchIds) : 0
              const isCurrent = d.currentBatch === batchNum
              return (
                <button key={batchNum} onClick={() => d.selectBatch(batchNum)} disabled={batchSlice.length === 0} className={`card py-3 text-center transition-all ${isCurrent ? 'ring-2 ring-b1-500 border-b1-500' : ''} ${batchSlice.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  <p className={`text-sm font-bold ${isCurrent ? 'text-b1-600' : 'text-gray-700'}`}>{t('phrases.batchLabel', { num: String(batchNum) })}</p>
                  <p className="text-xs text-gray-400">{t('phrases.batchRange', { start: String(startNum), end: String(endNum) })}</p>
                  <p className="text-xs font-medium text-b1-500 mt-0.5">
                    {t('phrases.batchReviewLabel', { count: String(batchSlice.filter(p => !p.is_new && !p.is_learned).length) })}
                    {batchSlice.filter(p => p.is_learned).length > 0 && <> · {t('phrases.batchLearnedLabel', { count: String(batchSlice.filter(p => p.is_learned).length) })}</>}
                  </p>
                </button>
              )
            })}
          </div>

          {d.batchPhrases.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('phrases.batchLabel', { num: String(d.currentBatch) })} · {d.batchPhrases.length} ta gap
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { mode: 'flashcard' as const, label: t('phrases.modeFlashcard'), icon: '🃏', desc: t('phrases.modeFlashcardDesc') },
                  { mode: 'test' as const, label: t('phrases.modeTest'), icon: '📝', desc: t('phrases.modeTestDesc') },
                  { mode: 'game' as const, label: t('phrases.modeGame'), icon: '🧩', desc: t('phrases.modeGameDesc') },
                ]).map((phase) => (
                  <button key={phase.mode} onClick={() => d.enterStudyMode(phase.mode)} className="card py-4 text-center hover:shadow-sm hover:border-b1-200 transition-all">
                    <span className="text-2xl">{phase.icon}</span>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{phase.label}</p>
                    <p className="text-xs text-gray-400">{phase.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={d.filterText} onChange={e => d.setFilterText(e.target.value)} placeholder={t('phrases.searchPlaceholder')} aria-label={t('phrases.searchPlaceholder')} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-b1-500 focus:border-b1-500 outline-none transition-all" />
              </div>
              <button onClick={() => d.setShowFilters(!d.showFilters)} aria-label="Filtrlar" className={`p-2 rounded-xl border transition-all ${d.showFilters || d.filterLevel.size > 0 || d.filterMastery !== 'all' ? 'border-b1-300 bg-b1-50 text-b1-600 dark:bg-b1-900/30 dark:text-b1-400' : 'border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <Filter size={16} />
              </button>
            </div>

            {d.showFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                  <button key={lvl} onClick={() => { const next = new Set(d.filterLevel); if (next.has(lvl)) next.delete(lvl); else next.add(lvl); d.setFilterLevel(next) }} className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${d.filterLevel.has(lvl) ? (lvl === 'A1' ? 'bg-gray-200 border-gray-400 text-gray-700' : lvl === 'A2' ? 'bg-primary-100 border-primary-400 text-primary-700' : lvl === 'B1' ? 'bg-b1-100 border-b1-400 text-b1-700' : 'bg-b2-100 border-b2-400 text-b2-700') : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{lvl}</button>
                ))}
                <span className="text-xs text-gray-300 dark:text-gray-600">|</span>
                {([
                  { key: 'all' as const, label: t('phrases.filterAll') },
                  { key: 'new' as const, label: t('phrases.filterNew') },
                  { key: 'learning' as const, label: t('phrases.filterLearning') },
                  { key: 'learned' as const, label: t('phrases.filterLearned') },
                ]).map(({ key, label }) => (
                  <button key={key} onClick={() => d.setFilterMastery(key)} className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${d.filterMastery === key ? 'border-b1-400 bg-b1-50 text-b1-700 dark:bg-b1-900/30 dark:text-b1-400' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{label}</button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{d.filteredBatchPhrases.length} / {d.batchPhrases.length} {t('common.words')}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{t('phrases.statsNew', { count: String(d.batchPhrases.filter(p => p.is_new).length) })}</span>
                {d.batchPhrases.filter(p => !p.is_new && !p.is_learned).length > 0 && <span>· {t('phrases.statsReview', { count: String(d.batchPhrases.filter(p => !p.is_new && !p.is_learned).length) })}</span>}
                {d.batchPhrases.filter(p => p.is_learned).length > 0 && <span>· {t('phrases.statsLearned', { count: String(d.batchPhrases.filter(p => p.is_learned).length) })}</span>}
              </div>
            </div>
            {d.filteredBatchPhrases.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">{t('phrases.noResults')}</p>
                <button onClick={() => { d.setFilterText(''); d.setFilterLevel(new Set()); d.setFilterMastery('all') }} aria-label={t('phrases.filterClear')} className="mt-2 text-xs text-b1-500 font-semibold hover:underline">{t('phrases.filterClear')}</button>
              </div>
            ) : (
              d.filteredBatchPhrases.map((p) => (
                <PhraseRow key={p.phrase_id} phrase={p} globalIndex={(d.currentBatch - 1) * PHRASE_BATCH_SIZE + d.batchPhrases.indexOf(p) + 1} onRate={d.handleRating} />
              ))
            )}
          </div>
        </>
      )}

      <PhraseExportModal phrases={[...d.dailyPhrases, ...d.reviewPhrases]} open={d.showExportModal} onClose={() => d.setShowExportModal(false)} />
    </div>
  )
}
