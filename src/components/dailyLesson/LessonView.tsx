import { useState, useMemo, useEffect, useRef } from 'react'
import { Trophy, Star, RotateCcw, Check, ChevronLeft, ChevronRight, Target } from 'lucide-react'
import type { DailyLesson } from '../../data/dailyLessons'
import { getConfusablePairs } from './lessonHelpers'
import { useLessonState } from './useLessonState'
import ReadingSection from './ReadingSection'
import WritingSection from './WritingSection'
import ListeningSection from './ListeningSection'
import SpeakingSection from './SpeakingSection'
import ConfusableBanner from './ConfusableBanner'
import TheoryTab from './TheoryTab'
import DrillTab from './DrillTab'
import LessonHeader from './LessonHeader'
import LessonNavigation from './LessonNavigation'
import SelfAssessment from '../ui/SelfAssessment'
import MixedReview from './MixedReview'
import LessonCelebration from '../dashboard/LessonCelebration'
import type { Tab } from './LessonNavigation'

type Props = { lesson: DailyLesson; onBack: () => void }

type StepDef = { tab: Tab; label: string; icon: string }

export default function LessonView({ lesson: lessonProp, onBack }: Props) {
  const {
    lesson,
    tab,
    setTab,
    navigate,
    addXP,
    addLearnedWords,
    updateSkillProgress,
    section,
    sectionExercises,
    isLastSection,
    storyBeat,
    prevScore,
    allDone,
    currentLessonScore,
    shuffledTestOptionsMap,
    submitted,
    score,
    answers,
    aiResults,
    isAiChecking,
    completedSections,
    sectionCelebration,
    currentSection,
    combo,
    testSection,
    testAnswers,
    testSubmitted,
    testScore,
    testResults,
    completedTestSections,
    setTestAnswers,
    setVocabDone,
    setVocabPushedCount,
    handleJumpToSection,
    handleSubmitSection,
    handleClearSection,
    handleNextSection,
    handleChangeAnswer,
    handleJumpToTestSection,
    handleSubmitTest,
    handleClearTest,
  } = useLessonState(lessonProp)

  // ── Step-by-step flow ──────────────────────────────────────────────────
  const [showCelebration, setShowCelebration] = useState(false)
  const prevAllDoneRef = useRef(allDone)

  useEffect(() => {
    if (allDone && !prevAllDoneRef.current) {
      const timer = setTimeout(() => setShowCelebration(true), 300)
      return () => clearTimeout(timer)
    }
    prevAllDoneRef.current = allDone
  }, [allDone])

  const lessonSteps: StepDef[] = useMemo(() => {
    const steps: StepDef[] = [
      { tab: 'theory',    label: 'Nazariya',  icon: '📖' },
      { tab: 'drill',     label: 'Mashqlar',  icon: '⚡' },
    ]
    if (lesson.reading)  steps.push({ tab: 'reading' as Tab,  label: "O'qish",    icon: '📰' })
    steps.push({ tab: 'speaking' as Tab, label: 'Gapirish',   icon: '🎤' })
    steps.push({ tab: 'writing' as Tab,  label: 'Yozish',     icon: '✍️' })
    if (lesson.listening) steps.push({ tab: 'listening' as Tab, label: 'Tinglash',  icon: '🎧' })
    steps.push({ tab: 'mixed' as Tab,    label: 'Aralash',    icon: '🔀' })
    return steps
  }, [lesson.reading, lesson.listening])

  // Qaysi tablar tashrif buyurilgan
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(new Set(['theory']))

  // Hozirgi step index
  const currentStepIdx = lessonSteps.findIndex(s => s.tab === tab)

  // Drill bajarilganligi
  const allDrillDone = Object.keys(completedSections).length === lesson.exerciseSections.length
    && Object.keys(completedTestSections).length === lesson.testSections.length

  const handleTabChange = (newTab: Tab) => {
    setVisitedTabs(prev => new Set(prev).add(newTab))
    setTab(newTab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNextStep = () => {
    if (currentStepIdx < lessonSteps.length - 1) {
      handleTabChange(lessonSteps[currentStepIdx + 1].tab)
    }
  }

  const goPrevStep = () => {
    if (currentStepIdx > 0) {
      handleTabChange(lessonSteps[currentStepIdx - 1].tab)
    }
  }

  // Step status: 'completed' | 'current' | 'pending'
  const getStepStatus = (step: StepDef, idx: number): 'completed' | 'current' | 'pending' => {
    if (step.tab === tab) return 'current'
    if (step.tab === 'drill' && allDrillDone) return 'completed'
    if (visitedTabs.has(step.tab)) return 'completed'
    if (visitedTabs.has(lessonSteps[Math.max(0, idx - 1)]?.tab as Tab)) return 'pending'
    return 'pending'
  }

  const stepStatuses = lessonSteps.map((s, i) => getStepStatus(s, i))

  // ── Progress bar ──
  const completedCount = stepStatuses.filter(s => s === 'completed').length

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      <SelfAssessment lessonId={lesson.id} />

      <LessonHeader
        lesson={lesson}
        prevScore={prevScore}
        allDone={allDone}
        currentLessonScore={currentLessonScore}
        onBack={onBack}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          STEP PROGRESS BAR
      ════════════════════════════════════════════════════════════════════ */}
      {!allDone && (
        <div className="card bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-primary-500" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dars bosqichlari
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {completedCount}/{lessonSteps.length} bajarildi
            </span>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
            {lessonSteps.map((step, i) => {
              const status = stepStatuses[i]
              const isCurrent = status === 'current'
              const isCompleted = status === 'completed'
              return (
                <button
                  key={step.tab}
                  onClick={() => {
                    if (isCompleted || isCurrent) handleTabChange(step.tab)
                  }}
                  disabled={!isCompleted && !isCurrent}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${
                    isCurrent
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-300 dark:ring-primary-700'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  aria-label={`${step.label}${isCompleted ? ' (bajarildi)' : isCurrent ? ' (joriy)' : ' (kutilmoqda)'}`}
                >
                  {isCompleted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <Check size={10} />
                    </span>
                  ) : (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                      isCurrent ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {i + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step.icon}</span>
                  <span className="truncate max-w-[60px] sm:max-w-none">{step.label}</span>
                </button>
              )
            })}
          </div>

          {/* Thin progress line */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / lessonSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Pill-style tab bar */}
      <LessonNavigation lesson={lesson} tab={tab} onTabChange={handleTabChange} />

      {/* ── THEORY TAB ── */}
      {tab === 'theory' && (
        <div role="tabpanel" aria-label="Theory content">
          <TheoryTab
            lesson={lesson}
            storyBeat={storyBeat}
            navigate={navigate}
            addXP={addXP}
            onVocabDone={(pushedCount) => {
              setVocabDone(true)
              setVocabPushedCount(prev => Math.max(prev, pushedCount))
              if (pushedCount > 0) addLearnedWords(pushedCount)
            }}
          />
          {/* Navigation */}
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              <span>Mashqlarga o'tish</span> <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── DRILL TAB: Exercises ── */}
      {tab === 'drill' && (
        <div role="tabpanel" aria-label="Drill exercises">
          <DrillTab
            lessonId={lesson.id}
            exerciseSections={lesson.exerciseSections}
            exercises={lesson.exercises}
            testSections={lesson.testSections}
            tests={lesson.tests}
            section={section}
            sectionExercises={sectionExercises}
            isLastSection={isLastSection}
            currentSection={currentSection}
            sectionTotal={lesson.exerciseSections.length}
            shuffledTestOptionsMap={shuffledTestOptionsMap}
            submitted={submitted}
            score={score}
            answers={answers}
            aiResults={aiResults}
            isAiChecking={isAiChecking}
            completedSections={completedSections}
            sectionCelebration={sectionCelebration}
            combo={combo}
            testSection={testSection}
            testAnswers={testAnswers}
            testSubmitted={testSubmitted}
            testScore={testScore}
            testResults={testResults}
            completedTestSections={completedTestSections}
            onJumpToSection={handleJumpToSection}
            onSubmitSection={handleSubmitSection}
            onClearSection={handleClearSection}
            onNextSection={handleNextSection}
            onChangeAnswer={handleChangeAnswer}
            onJumpToTestSection={handleJumpToTestSection}
            onSubmitTest={handleSubmitTest}
            onClearTest={handleClearTest}
            onTestAnswerChange={(id, value) => setTestAnswers((prev) => ({ ...prev, [id]: value }))}
          />
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Nazariyaga qaytish
            </button>
            {allDrillDone && (
              <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
                <span>Keyingi bosqich</span> <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── READING TAB ── */}
      {tab === 'reading' && lesson.reading && (
        <div role="tabpanel" aria-label="Reading content" className="pt-2">
          <ReadingSection section={lesson.reading} addXP={addXP} />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Oldingi
            </button>
            <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── SPEAKING TAB ── */}
      {tab === 'speaking' && (
        <div role="tabpanel" aria-label="Speaking content" className="pt-2 space-y-4">
          <ConfusableBanner pairs={getConfusablePairs(lesson.vocabulary)} navigate={navigate} variant="speaking" />
          <SpeakingSection
            topic={lesson.title}
            level={lesson.level}
            addXP={addXP}
            onSkillProgress={(pct) => updateSkillProgress('todaySpeakingPct', pct)}
            formulas={lesson.formulas}
            rules={lesson.rules}
            vocabulary={lesson.vocabulary}
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Oldingi
            </button>
            <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── WRITING TAB ── */}
      {tab === 'writing' && (
        <div role="tabpanel" aria-label="Writing content" className="pt-2 space-y-4">
          <ConfusableBanner pairs={getConfusablePairs(lesson.vocabulary)} navigate={navigate} variant="writing" />
          <WritingSection
            section={lesson.writing}
            level={lesson.level}
            addXP={addXP}
            lesson={{ title: lesson.title, level: lesson.level, formulas: lesson.formulas, rules: lesson.rules, vocabulary: lesson.vocabulary }}
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Oldingi
            </button>
            <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── LISTENING TAB ── */}
      {tab === 'listening' && lesson.listening && (
        <div role="tabpanel" aria-label="Listening content" className="pt-2">
          <ListeningSection section={lesson.listening} addXP={addXP} />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Oldingi
            </button>
            <button onClick={goNextStep} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── MIXED REVIEW TAB ── */}
      {tab === 'mixed' && (
        <div role="tabpanel" aria-label="Mixed review" className="pt-2">
          <MixedReview lesson={lesson} addXP={addXP} />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button onClick={goPrevStep} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Oldingi
            </button>
          </div>
        </div>
      )}

      {/* ── LESSON COMPLETE SUMMARY ── */}
      {allDone && (
        <div className="bg-gradient-to-br from-emerald-50 to-primary-50 dark:from-emerald-900/20 dark:to-primary-900/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
              <Trophy size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-lg">Dars yakunlandi!</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Ajoyib natija! Davom eting.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary-600">{currentLessonScore ?? 0}%</p>
              <p className="text-xs text-gray-500 mt-1">Natija</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{lesson.exercises.length * 10}</p>
              <p className="text-xs text-gray-500 mt-1">XP olindi</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{lesson.vocabulary.length}</p>
              <p className="text-xs text-gray-500 mt-1">Yangi so'z</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="flex justify-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round((currentLessonScore ?? 0) / 20) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Yulduzlar</p>
            </div>
          </div>

          {/* ── POST-LESSON REFLECTION ── */}
          {(() => {
            const totalCorrectCount = Object.values(completedSections).reduce((a, b) => a + b, 0) + Object.values(completedTestSections).reduce((a, b) => a + b, 0)
            const totalExerciseCount = lesson.exercises.length + lesson.tests.length
            const wrongCount = totalExerciseCount - totalCorrectCount
            const mastery = currentLessonScore ?? 0

            const SKILL_COLORS: Record<string, { label: string; stroke: string }> = {
              primary: { label: 'text-primary-600 dark:text-primary-400', stroke: 'text-primary-500' },
              emerald: { label: 'text-emerald-600 dark:text-emerald-400', stroke: 'text-emerald-500' },
              rose:    { label: 'text-rose-600 dark:text-rose-400',       stroke: 'text-rose-500' },
              amber:   { label: 'text-amber-600 dark:text-amber-400',     stroke: 'text-amber-500' },
            }

            return (
              <div className="space-y-3">
                {/* Skill circles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Grammatika', score: mastery, color: 'primary' },
                    { label: "So'z boyligi", score: Math.min(100, mastery + 10), color: 'emerald' },
                    { label: 'Gapirish', score: Math.min(100, Math.round(mastery * 0.8)), color: 'rose' },
                    { label: 'Yozish', score: Math.min(100, Math.round(mastery * 0.85)), color: 'amber' },
                  ].map(skill => (
                    <div key={skill.label} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${SKILL_COLORS[skill.color]?.label ?? 'text-gray-600'}`}>
                        {skill.label}
                      </div>
                      <div className="relative w-14 h-14 mx-auto mb-1">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
                            strokeDasharray={`${skill.score} ${100 - skill.score}`}
                            strokeLinecap="round"
                            className={`${SKILL_COLORS[skill.color]?.stroke ?? 'text-gray-400'}`}
                            style={{ transition: 'stroke-dasharray 1s ease' }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-200">
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weak spots */}
                {wrongCount > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-amber-500" />
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        Zaif tomonlar
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {wrongCount} ta xato javobingiz bor. <strong>Mashqlar bo'limiga</strong> qaytib, xatolarni ko'rib chiqing yoki <strong>Grammar</strong> bo'limida mavzuni mustahkamlang.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleTabChange('drill')} className="btn-ghost text-xs py-1.5 px-3 border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                        Mashqlarga qaytish
                      </button>
                    </div>
                  </div>
                )}

                {/* What you learned */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                    ✅ Nima o'rgandingiz
                  </p>
                  <div className="space-y-1">
                    {lesson.formulas.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span><strong>{f.label}:</strong> {f.structure.split('\n')[0]}</span>
                      </div>
                    ))}
                    {lesson.rules.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{lesson.vocabulary.length} ta yangi so'z</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next steps */}
                <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight size={16} className="text-primary-500" />
                    <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
                      Keyingi qadamlar
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 font-bold shrink-0">1.</span>
                      <span>Keyingi darsni boshlang va yangi mavzuni o'rganing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 font-bold shrink-0">2.</span>
                      <span>Vocabulary bo'limida yangi so'zlarni SRS orqali takrorlang</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 font-bold shrink-0">3.</span>
                      <span>Speaking bo'limida amaliyot qiling</span>
                    </li>
                  </ul>
                </div>
              </div>
            )
          })()}

          <div className="flex gap-2 pt-2">
            <button onClick={() => { onBack(); setTimeout(() => window.scrollTo({ top: 0 }), 50) }} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Qaytadan o'qish
            </button>
            <button onClick={onBack} className="btn-ghost flex-1 flex items-center justify-center gap-2">
              Boshqa darslar
            </button>
          </div>
        </div>
      )}

      {/* Lesson completion celebration */}
      <LessonCelebration
        show={showCelebration}
        lessonTitle={lesson.title}
        score={currentLessonScore ?? 0}
        xpEarned={lesson.exercises.length * 10}
        newWords={lesson.vocabulary.length}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  )
}
