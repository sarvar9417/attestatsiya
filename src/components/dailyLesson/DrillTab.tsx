import { CheckCircle, Sparkles, Zap, Target, Trophy } from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../../data/dailyLessons'

type Answers = Record<number, string[]>
import ExerciseCard from './ExerciseCard'
import SectionProgressBar from './SectionProgressBar'
import SectionHeaderCard from './SectionHeaderCard'
import ExerciseResultsView from './ExerciseResultsView'
import TestSectionArea from './TestSectionArea'

interface DrillTabProps {
  // Lesson data
  lessonId: string
  exerciseSections: DailyLesson['exerciseSections']
  exercises: DailyLesson['exercises']
  testSections: DailyLesson['testSections']
  tests: DailyLesson['tests']

  // Derived state (computed in LessonView)
  section: { title: string; desc: string; color: string; icon: string; ids: number[] } | null | undefined
  sectionExercises: DailyExercise[]
  isLastSection: boolean
  currentSection: number
  sectionTotal: number
  shuffledTestOptionsMap: Map<number, string[]>

  // Exercise state
  submitted: boolean
  score: number
  answers: Answers
  aiResults: Record<number, boolean>
  isAiChecking: boolean
  completedSections: Record<number, number>
  sectionCelebration: 'idle' | 'visible' | 'fading'
  combo: number

  // Test state
  testSection: number
  testAnswers: Record<number, string>
  testSubmitted: boolean
  testScore: number
  testResults: Record<number, boolean>
  completedTestSections: Record<number, number>

  // Callbacks
  onJumpToSection: (idx: number) => void
  onSubmitSection: () => void
  onClearSection: () => void
  onNextSection: () => void
  onChangeAnswer: (exId: number, blankIdx: number, val: string) => void
  onJumpToTestSection: (idx: number) => void
  onSubmitTest: () => void
  onClearTest: () => void
  onTestAnswerChange: (id: number, value: string) => void
}

export default function DrillTab({
  lessonId,
  exerciseSections,
  exercises,
  testSections,
  tests,
  section,
  sectionExercises,
  isLastSection,
  currentSection,
  sectionTotal,
  shuffledTestOptionsMap,
  submitted,
  score,
  answers,
  aiResults,
  isAiChecking,
  completedSections,
  sectionCelebration,
  combo,
  testSection,
  testAnswers,
  testSubmitted,
  testScore,
  testResults,
  completedTestSections,
  onJumpToSection,
  onSubmitSection,
  onClearSection,
  onNextSection,
  onChangeAnswer,
  onJumpToTestSection,
  onSubmitTest,
  onClearTest,
  onTestAnswerChange,
}: DrillTabProps) {
  const totalCorrect = Object.values(completedSections).reduce((a, b) => a + b, 0)
  const totalExercises = exercises.length
  const sectionsDone = Object.keys(completedSections).length
  const sectionsTotal = exerciseSections.length

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-2 px-3">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Target size={12} className="text-primary-600" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Bosqich</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{sectionsDone}<span className="text-xs text-gray-400">/{sectionsTotal}</span></p>
        </div>
        <div className="card text-center py-2 px-3">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Trophy size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">To'g'ri</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{totalCorrect}<span className="text-xs text-gray-400">/{totalExercises}</span></p>
        </div>
        <div className="card text-center py-2 px-3">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap size={12} className="text-orange-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Combo</span>
          </div>
          <p className={`text-lg font-bold ${combo > 0 ? 'text-orange-500' : 'text-gray-300'}`}>{combo}x</p>
        </div>
      </div>

      {/* Exercise sections progress */}
      <div className="space-y-4">
        <SectionProgressBar
          sections={exerciseSections}
          completedSections={completedSections}
          currentSection={currentSection}
          onJumpToSection={onJumpToSection}
        />

        <SectionHeaderCard
          section={section}
          sectionIndex={currentSection}
          totalSections={sectionTotal}
          exerciseCount={sectionExercises.length}
        />

        {submitted ? (
          <ExerciseResultsView
            lessonId={lessonId}
            score={score}
            sectionExercises={sectionExercises}
            answers={answers}
            aiResults={aiResults}
            sectionTitle={section?.title ?? ''}
            sectionCelebration={sectionCelebration}
            isLastSection={isLastSection}
            onClear={onClearSection}
            onNext={onNextSection}
          />
        ) : (
          <>
            <div className="space-y-4">
              {sectionExercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  num={i + 1}
                  total={sectionExercises.length}
                  answers={answers[ex.id] ?? []}
                  onChange={(blankIdx, val) => onChangeAnswer(ex.id, blankIdx, val)}
                  submitted={false}
                  combo={combo}
                />
              ))}
            </div>
            <button
              onClick={onSubmitSection}
              disabled={isAiChecking}
              className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${isAiChecking ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isAiChecking ? (
                <><Sparkles size={18} className="animate-pulse" /> AI tekshirilmoqda...</>
              ) : (
                <><CheckCircle size={18} /> Tekshirish (+{sectionExercises.length * 10} XP)</>
              )}
            </button>
          </>
        )}

        {Object.keys(completedSections).length > 0 && (
          <div className="card bg-gray-50 border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Umumiy: {Object.values(completedSections).reduce((a, b) => a + b, 0)} / {exercises.length} ta to'g'ri
              {' · '}
              {exerciseSections.filter((_, i) => completedSections[i] !== undefined).length} / {exerciseSections.length} bosqich
            </p>
          </div>
        )}
      </div>

      {/* Test sections area */}
      <TestSectionArea
        lessonId={lessonId}
        testSections={testSections}
        tests={tests}
        testSection={testSection}
        testAnswers={testAnswers}
        testSubmitted={testSubmitted}
        testScore={testScore}
        testResults={testResults}
        completedTestSections={completedTestSections}
        shuffledTestOptionsMap={shuffledTestOptionsMap}
        onJumpToSection={onJumpToTestSection}
        onChangeAnswer={onTestAnswerChange}
        onSubmit={onSubmitTest}
        onClear={onClearTest}
      />
    </div>
  )
}
