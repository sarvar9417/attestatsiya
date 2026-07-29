import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DailyLesson, DailyExercise } from '../../data/dailyLessons'
import type {
  ReadingSection as ReadingSectionType,
  WritingSection as WritingSectionType,
  ListeningSection as ListeningSectionType,
} from '../../data/dailyLessons'
import { useStore } from '../../store/useStore'
import { checkAnswer, getExerciseContext, getCorrectText } from './helpers'
import { checkDailyExerciseAnswers } from '../../lib/claude'
import type { DailyExerciseCheckItem } from '../../lib/claude'
import { getStoryBeat } from '../../data/narrative/storyline'
import { scheduleReview } from '../../lib/grammarSrs'
import { GRAMMAR_TOPICS } from '../../data/grammar'
import { monitoring } from '../../lib/monitoring'
import {
  pushLessonProgress,
  pushTestProgress,
  getLessonProgress,
  loadLessonSessionFromDB,
  saveExerciseAnswersToDB,
  saveViewedTabsToDB,
  loadViewedTabsFromDB,
  loadExerciseAnswersFromDB,
  fetchSingleLessonSkill,
  clearExerciseAnswersFromDB,
  type LoadedExerciseAnswer,
} from '../../services/lessonService'
import { resolveSectionItems } from './lessonHelpers'
import type { Tab } from './LessonNavigation'
import {
  saveExerciseStateToLS,
  loadExerciseStateFromLS,
  removeExerciseStateFromLS,
  saveTestStateToLS,
  loadTestStateFromLS,
  removeTestStateFromLS,
} from './lessonPersistence'
import { trackLessonStarted, trackLessonAbandoned } from './lessonAnalytics'

export type Answers = Record<number, string[]>

export function useLessonState(lessonProp: DailyLesson) {
  const [skillsData, setSkillsData] = useState<
    Record<string, { reading?: ReadingSectionType; writing?: WritingSectionType; listening?: ListeningSectionType }>
  >({})
  const skills = skillsData[lessonProp.id] || {}
  const lesson = {
    ...lessonProp,
    ...skills,
  } as DailyLesson & {
    reading?: ReadingSectionType
    writing?: WritingSectionType
    listening?: ListeningSectionType
  }

  useEffect(() => {
    fetchSingleLessonSkill(lessonProp.id)
      .then((skill) => {
        if (skill) setSkillsData({ [lessonProp.id]: skill })
      })
      .catch(() => {
        monitoring.captureMessage('Failed to fetch lesson skill from DB', 'warn')
      })
  }, [])

  const addXP = useStore((s) => s.addXP)
  const addLearnedWords = useStore((s) => s.addLearnedWords)
  const updateSkillProgress = useStore((s) => s.updateSkillProgress)
  const setLessonProgress = useStore((s) => s.setLessonProgress)
  const saveLessonSession = useStore((s) => s.saveLessonSession)
  const clearLessonSession = useStore((s) => s.clearLessonSession)
  const lessonSessions = useStore((s) => s.lessonSessions)
  const loseHeart = useStore((s) => s.loseHeart)
  const savedSession = lessonSessions[lesson.id]

  const navigate = useNavigate()

  // ── Tab ──
  const [tab, setTab] = useState<Tab>((savedSession?.tab as Tab) ?? 'theory')

  // ── Exercise sections state ──
  const [currentSection, setCurrentSection] = useState(savedSession?.currentSection ?? 0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>(
    savedSession?.completedSections ?? {},
  )
  const [prevScore, setPrevScore] = useState<number | null>(null)
  const rewardedSectionsRef = useRef<Set<string>>(new Set())
  const [aiResults, setAiResults] = useState<Record<number, boolean>>({})
  const [isAiChecking, setIsAiChecking] = useState(false)
  const [sectionCelebration, setSectionCelebration] = useState<'idle' | 'visible' | 'fading'>('idle')
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [combo, setCombo] = useState(0)

  // ── Test state ──
  const [testSection, setTestSection] = useState(savedSession?.testSection ?? 0)
  const [, setTestShuffleKey] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [completedTestSections, setCompletedTestSections] = useState<Record<number, number>>(
    savedSession?.completedTestSections ?? {},
  )
  const rewardedTestSectionsRef = useRef<Set<number>>(new Set())

  // ── Vocab state ──
  const [vocabDone, setVocabDone] = useState(savedSession?.vocabDone ?? false)
  const [vocabPushedCount, setVocabPushedCount] = useState(savedSession?.vocabPushedCount ?? 0)

  // ── DB / hydration ──
  const dbAnswersRef = useRef<LoadedExerciseAnswer[]>([])
  const [, setViewedTabs] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // ── Timers / refs ──
  const exerciseDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const testDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const prevTabRef = useRef(tab)
  const prevExerciseStateRef = useRef({ answers, submitted, score })
  const prevTestStateRef = useRef({ testAnswers, testSubmitted, testScore, testResults })

  // ── Analytics refs ──
  const lessonStartRef = useRef(Date.now())
  const lessonDoneRef = useRef(false)
  const lessonProgressRef = useRef<{ section: number; tab: Tab }>({ section: 0, tab: 'theory' })

  // ── Derived values ──
  const section = lesson.exerciseSections[currentSection]
  const allLessonExercises = useMemo(
    () => [
      ...lesson.exercises,
      ...(lesson.specialCases?.flatMap((sc) => sc.drills) ?? []),
    ],
    [lesson.exercises, lesson.specialCases],
  )
  const sectionExercises = useMemo(
    () =>
      resolveSectionItems(lesson.exerciseSections, currentSection, allLessonExercises, lesson.exercises),
    [allLessonExercises, currentSection, lesson.exerciseSections, lesson.exercises],
  )
  const isLastSection = currentSection === lesson.exerciseSections.length - 1
  const storyBeat = lesson.day ? getStoryBeat(lesson.day) : null
  const allExercisesDone = Object.keys(completedSections).length === lesson.exerciseSections.length
  const allTestsDone = Object.keys(completedTestSections).length === lesson.testSections.length
  const allDone = allExercisesDone && allTestsDone && vocabDone

  const testStarted = lesson.tests.length > 0 && Object.keys(completedTestSections).length > 0
  const totalExerciseCount = lesson.exercises.length + (testStarted ? lesson.tests.length : 0)
  const totalCorrectCount =
    Object.values(completedSections).reduce((a, b) => a + b, 0) +
    Object.values(completedTestSections).reduce((a, b) => a + b, 0)
  const currentLessonScore =
    totalExerciseCount > 0 ? Math.round((totalCorrectCount / totalExerciseCount) * 100) : null

  const shuffledTestOptionsMap = useMemo(() => {
    const map = new Map<number, string[]>()
    const sec = lesson.testSections[testSection]
    if (!sec) return map
    const tests = lesson.tests.filter(
      (t): t is Extract<DailyExercise, { type: 'multiple-choice' }> =>
        sec.ids.includes(t.id) && t.type === 'multiple-choice',
    )
    for (const t of tests) {
      const opts = [...t.options]
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[opts[i], opts[j]] = [opts[j], opts[i]]
      }
      map.set(t.id, opts)
    }
    return map
  }, [lesson.tests, lesson.testSections, testSection])

  const exerciseStorageKey = `exercise-answers-${lesson.id}-${currentSection}`
  const testStorageKey = `test-state-${lesson.id}-${testSection}`

  // ── Analytics: lesson_started / lesson_abandoned ──
  useEffect(() => {
    lessonDoneRef.current = allDone
    lessonProgressRef.current = { section: currentSection, tab }
  }, [allDone, currentSection, tab])

  useEffect(() => {
    lessonStartRef.current = Date.now()
    lessonDoneRef.current = false
    trackLessonStarted(lesson.id, lesson.day ?? null, lesson.level ?? null)
    return () => {
      if (!lessonDoneRef.current) {
        trackLessonAbandoned(
          lesson.id,
          lesson.day ?? null,
          lesson.level ?? null,
          lessonProgressRef.current.section,
          lessonProgressRef.current.tab,
          Math.round((Date.now() - lessonStartRef.current) / 1000),
        )
      }
    }
  }, [lesson.id, lesson.day, lesson.level])

  // ── Load prev progress ──
  useEffect(() => {
    getLessonProgress(lesson.id).then((p) => {
      if (p !== null) setPrevScore(p)
    })
  }, [lesson.id])

  // ── Hydrate from DB ──
  useEffect(() => {
    Promise.all([
      loadLessonSessionFromDB(lesson.id),
      loadExerciseAnswersFromDB(lesson.id),
      loadViewedTabsFromDB(lesson.id),
    ])
      .then(([remote, dbAnswers, tabs]) => {
        dbAnswersRef.current = dbAnswers
        let resolvedSection = savedSession?.currentSection ?? 0
        let resolvedTestSection = savedSession?.testSection ?? 0
        let resolvedCompletedSections: Record<number, number> =
          savedSession?.completedSections ?? {}
        let resolvedCompletedTestSections: Record<number, number> =
          savedSession?.completedTestSections ?? {}

        if (remote) {
          const mergedCompleted = { ...resolvedCompletedSections }
          for (const [k, v] of Object.entries(remote.completedSections)) {
            mergedCompleted[Number(k)] = Math.max(mergedCompleted[Number(k)] ?? 0, v as number)
          }
          const mergedTestCompleted = { ...resolvedCompletedTestSections }
          for (const [k, v] of Object.entries(remote.completedTestSections)) {
            mergedTestCompleted[Number(k)] = Math.max(mergedTestCompleted[Number(k)] ?? 0, v as number)
          }
          const localUpdated = savedSession?.updatedAt ?? 0
          if (remote.updatedAt > localUpdated) {
            setTab(remote.tab as Tab)
            setCurrentSection(remote.currentSection)
            setTestSection(remote.testSection)
            resolvedSection = remote.currentSection
            resolvedTestSection = remote.testSection
            if (remote.vocabDone) setVocabDone(true)
          }
          setCompletedSections(mergedCompleted)
          setCompletedTestSections(mergedTestCompleted)
          resolvedCompletedSections = mergedCompleted
          resolvedCompletedTestSections = mergedTestCompleted
        }

        const currentSectionDbEx = dbAnswers.filter(
          (a) => a.sectionIndex === resolvedSection && a.sectionType === 'exercise',
        )
        const currentSectionDbTest = dbAnswers.filter(
          (a) => a.sectionIndex === resolvedTestSection && a.sectionType === 'test',
        )

        if (currentSectionDbEx.length > 0) {
          const exMap: Answers = {}
          for (const a of currentSectionDbEx) exMap[a.exerciseId] = a.answer
          setAnswers(exMap)
          if (resolvedSection in resolvedCompletedSections) {
            setSubmitted(true)
            setScore(resolvedCompletedSections[resolvedSection] ?? 0)
          }
        } else {
          try {
            const saved = localStorage.getItem(`exercise-answers-${lesson.id}-${resolvedSection}`)
            if (saved) {
              const data = JSON.parse(saved)
              if (data.answers) setAnswers(data.answers)
              if (data.submitted != null) setSubmitted(data.submitted)
              if (data.score != null) setScore(data.score)
            }
          } catch {
            monitoring.captureMessage('Failed to parse localStorage exercise state', 'warn')
          }
        }

        if (currentSectionDbTest.length > 0) {
          const tMap: Record<number, string> = {}
          const tRes: Record<number, boolean> = {}
          for (const a of currentSectionDbTest) {
            tMap[a.exerciseId] = a.answer[0] ?? ''
            tRes[a.exerciseId] = a.isCorrect
          }
          setTestAnswers(tMap)
          if (resolvedTestSection in resolvedCompletedTestSections) {
            setTestResults(tRes)
            setTestSubmitted(true)
            setTestScore(resolvedCompletedTestSections[resolvedTestSection] ?? 0)
          }
        } else {
          try {
            const saved = localStorage.getItem(`test-state-${lesson.id}-${resolvedTestSection}`)
            if (saved) {
              const data = JSON.parse(saved)
              if (data.testAnswers) setTestAnswers(data.testAnswers)
              if (data.testSubmitted != null) setTestSubmitted(data.testSubmitted)
              if (data.testScore != null) setTestScore(data.testScore)
              if (data.testResults) setTestResults(data.testResults)
            }
          } catch {
            monitoring.captureMessage('Failed to parse localStorage test state', 'warn')
          }
        }

        // Hydrate all sections from DB → localStorage
        const exBySection = new Map<number, Answers>()
        for (const a of dbAnswers.filter((a) => a.sectionType === 'exercise')) {
          if (!exBySection.has(a.sectionIndex)) exBySection.set(a.sectionIndex, {})
          exBySection.get(a.sectionIndex)![a.exerciseId] = a.answer
        }
        for (const [idx, ansMap] of exBySection) {
          const key = `exercise-answers-${lesson.id}-${idx}`
          const existing = localStorage.getItem(key)
          if (existing) {
            try {
              const d = JSON.parse(existing)
              if (d?.answers && Object.keys(d.answers).length > 0) continue
            } catch {
              monitoring.captureMessage('Failed to parse existing localStorage exercise data', 'warn')
            }
          }
          try {
            localStorage.setItem(
              key,
              JSON.stringify({
                answers: ansMap,
                submitted: idx in resolvedCompletedSections,
                score: resolvedCompletedSections[idx] ?? 0,
              }),
            )
          } catch {
            monitoring.captureMessage('Failed to save exercise state to localStorage', 'warn')
          }
        }

        const tsBySection = new Map<number, Record<number, string>>()
        const tsResBySection = new Map<number, Record<number, boolean>>()
        for (const a of dbAnswers.filter((a) => a.sectionType === 'test')) {
          if (!tsBySection.has(a.sectionIndex)) {
            tsBySection.set(a.sectionIndex, {})
            tsResBySection.set(a.sectionIndex, {})
          }
          tsBySection.get(a.sectionIndex)![a.exerciseId] = a.answer[0] ?? ''
          tsResBySection.get(a.sectionIndex)![a.exerciseId] = a.isCorrect
        }
        for (const [idx, tMap] of tsBySection) {
          const key = `test-state-${lesson.id}-${idx}`
          const existing = localStorage.getItem(key)
          if (existing) {
            try {
              const d = JSON.parse(existing)
              if (d?.testAnswers && Object.keys(d.testAnswers).length > 0) continue
            } catch {
              monitoring.captureMessage('Failed to parse existing localStorage test data', 'warn')
            }
          }
          try {
            localStorage.setItem(
              key,
              JSON.stringify({
                testAnswers: tMap,
                testSubmitted: idx in resolvedCompletedTestSections,
                testScore: resolvedCompletedTestSections[idx] ?? 0,
                testResults: tsResBySection.get(idx) ?? {},
              }),
            )
          } catch {
            monitoring.captureMessage('Failed to save test state to localStorage', 'warn')
          }
        }

        if (tabs.length > 0) setViewedTabs(tabs)
      })
      .catch(() => {
        monitoring.captureMessage('Failed to load lesson data from DB', 'warn')
      })
      .finally(() => {
        setHydrated(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  // ── Tab change → save to DB ──
  useEffect(() => {
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab
      setViewedTabs((prev) => {
        const newViewed = prev.includes(tab) ? prev : [...prev, tab]
        saveViewedTabsToDB(lesson.id, newViewed)
        return newViewed
      })
    }
  }, [tab, lesson.id])

  // ── Grammar topic ID lookup — daily lesson ID → grammar topic ID ──
  const grammarTopicId = useMemo(() => {
    // Manual mapping for daily lesson IDs that differ from grammar topic IDs
    const LESSON_TO_GRAMMAR_TOPIC: Record<string, string> = {
      'can-cant': 'can-cannot',
      'simple-present': 'present-simple-i-you-we-they',
      'simple-past': 'past-simple',
      'simple-future': 'future-forms',
      'there-is-are': 'there-is-there-are',
      'modal-verbs': 'modal-verbs-a2',
      'articles': 'articles-a2',
      'present-perfect': 'present-perfect-a2',
      'relative-clauses-b1': 'relative-clauses',
      'phrasal-verbs-b1': 'phrasal-verbs',
      'wishes-regrets': 'wish-if-only',
      'advanced-relative-clauses-b1plus': 'advanced-relative-clauses',
    }
    const grammarTopicIds = new Set(GRAMMAR_TOPICS.map(t => t.id))
    const mapped = LESSON_TO_GRAMMAR_TOPIC[lesson.id] ?? lesson.id
    return grammarTopicIds.has(mapped) ? mapped : null
  }, [lesson.id])

  // ── All done → clear session + schedule grammar SRS review ──
  useEffect(() => {
    if (allDone) {
      clearLessonSession(lesson.id)
      if (grammarTopicId && currentLessonScore !== null) {
        scheduleReview(grammarTopicId, currentLessonScore)
      }
    }
  }, [allDone, lesson.id, clearLessonSession, grammarTopicId, currentLessonScore])

  // ── Save session periodically ──
  useEffect(() => {
    if (!hydrated || allDone) return
    saveLessonSession(lesson.id, {
      tab,
      currentSection,
      testSection,
      completedSections,
      completedTestSections,
      vocabDone,
      vocabPushedCount,
      updatedAt: Date.now(),
    })
  }, [
    hydrated,
    tab,
    currentSection,
    testSection,
    completedSections,
    completedTestSections,
    vocabDone,
    vocabPushedCount,
    allDone,
    lesson.id,
    saveLessonSession,
  ])

  // ── Exercise state persistence ──
  useEffect(() => {
    const cur = { answers, submitted, score }
    if (JSON.stringify(cur) === JSON.stringify(prevExerciseStateRef.current)) return
    prevExerciseStateRef.current = cur
    saveExerciseStateToLS(lesson.id, currentSection, answers, submitted, score)
    if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
    if (!submitted && sectionExercises.length > 0) {
      const payloads = sectionExercises
        .filter((ex) => (answers[ex.id] ?? []).some((a) => a.trim()))
        .map((ex) => ({
          exerciseId: ex.id,
          exerciseType: ex.type,
          answer: answers[ex.id] ?? [],
          isCorrect: false,
        }))
      if (payloads.length > 0) {
        exerciseDBSaveTimerRef.current = setTimeout(() => {
          saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
        }, 2000)
      }
    }
  }, [answers, submitted, score, exerciseStorageKey, currentSection, lesson.id, sectionExercises])

  // ── Test state persistence ──
  useEffect(() => {
    const cur = { testAnswers, testSubmitted, testScore, testResults }
    if (JSON.stringify(cur) === JSON.stringify(prevTestStateRef.current)) return
    prevTestStateRef.current = cur
    saveTestStateToLS(lesson.id, testSection, testAnswers, testSubmitted, testScore, testResults)
    if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
    if (!testSubmitted && Object.keys(testAnswers).length > 0) {
      testDBSaveTimerRef.current = setTimeout(() => {
        const sec = lesson.testSections[testSection]
        if (!sec) return
        const sectionTests = resolveSectionItems(lesson.testSections, testSection, lesson.tests, lesson.tests)
        const payloads = sectionTests
          .filter((t) => testAnswers[t.id])
          .map((t) => ({
            exerciseId: t.id,
            exerciseType: t.type,
            answer: [testAnswers[t.id]],
            isCorrect: false,
          }))
        if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, testSection, 'test', payloads)
      }, 1000)
    }
  }, [
    testAnswers,
    testSubmitted,
    testScore,
    testResults,
    testStorageKey,
    testSection,
    lesson.id,
    lesson.testSections,
    lesson.tests,
  ])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
      if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current)
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const scrollToTop = () => {
    clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        monitoring.captureMessage('Failed to scroll to top', 'warn')
      }
    }, 50)
  }

  // ── Load section state (localStorage → DB fallback) ──
  const loadExerciseSectionState = (idx: number): { answers: Answers; submitted: boolean; score: number } => {
    const fromLS = loadExerciseStateFromLS(lesson.id, idx)
    if (fromLS) return fromLS
    const rows = dbAnswersRef.current.filter(
      (a) => a.sectionIndex === idx && a.sectionType === 'exercise',
    )
    if (rows.length > 0) {
      const ans: Answers = {}
      for (const a of rows) ans[a.exerciseId] = a.answer
      return {
        answers: ans,
        submitted: idx in completedSections,
        score: completedSections[idx] ?? 0,
      }
    }
    return { answers: {}, submitted: false, score: 0 }
  }

  const loadTestSectionState = (idx: number): {
    testAnswers: Record<number, string>
    testSubmitted: boolean
    testScore: number
    testResults: Record<number, boolean>
  } => {
    const fromLS = loadTestStateFromLS(lesson.id, idx)
    if (fromLS) return fromLS
    const rows = dbAnswersRef.current.filter(
      (a) => a.sectionIndex === idx && a.sectionType === 'test',
    )
    if (rows.length > 0) {
      const ta: Record<number, string> = {}
      const tr: Record<number, boolean> = {}
      for (const a of rows) {
        ta[a.exerciseId] = a.answer[0] ?? ''
        tr[a.exerciseId] = a.isCorrect
      }
      return {
        testAnswers: ta,
        testSubmitted: idx in completedTestSections,
        testScore: completedTestSections[idx] ?? 0,
        testResults: tr,
      }
    }
    return { testAnswers: {}, testSubmitted: false, testScore: 0, testResults: {} }
  }

  const handleSubmitSection = async () => {
    setIsAiChecking(true)
    let correct = 0
    const answerPayloads: {
      exerciseId: number
      exerciseType: string
      answer: string[]
      isCorrect: boolean
    }[] = []
    const wrongItems: DailyExerciseCheckItem[] = []

    for (const ex of sectionExercises) {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      else {
        const context = getExerciseContext(ex)
        let correctStr = getCorrectText(ex)
        let userAnsStr = ''
        if (ex.type === 'fill-blank' || ex.type === 'passage') {
          userAnsStr = userAns.join(' / ')
        } else if (ex.type === 'fill-table') {
          correctStr = ex.rows.map((r) => `${r.adj}: comp=${r.comp}, sup=${r.sup}`).join('; ')
          userAnsStr = ex.rows
            .map((r, idx) => `${r.adj}: comp=${userAns[idx * 2] || '—'}, sup=${userAns[idx * 2 + 1] || '—'}`)
            .join('; ')
        } else {
          userAnsStr = userAns[0] ?? ''
        }
        wrongItems.push({
          id: ex.id,
          context,
          correct: correctStr,
          userAnswer: userAnsStr,
          type: ex.type,
        })
      }
      answerPayloads.push({
        exerciseId: ex.id,
        exerciseType: ex.type,
        answer: userAns,
        isCorrect: ok,
      })
    }

    try {
      const newAiResults: Record<number, boolean> = {}
      if (wrongItems.length > 0) {
        loseHeart()
        try {
          const aiResultsList = await checkDailyExerciseAnswers(wrongItems)
          for (let i = 0; i < wrongItems.length; i++) {
            if (aiResultsList[i]) {
              const exId = wrongItems[i].id
              newAiResults[exId] = true
              correct++
              const payload = answerPayloads.find((p) => p.exerciseId === exId)
              if (payload) payload.isCorrect = true
            }
          }
        } catch {
          monitoring.captureMessage('AI check failed, using deterministic results', 'warn')
        }
      }

      setAiResults(newAiResults)
      setScore(correct)
      setSubmitted(true)
      setCombo((prev) => correct > 0 ? prev + correct : 0)
      setCompletedSections((prev) => ({ ...prev, [currentSection]: correct }))
      const sectionKey = `${currentSection}`
      if (!rewardedSectionsRef.current.has(sectionKey)) {
        rewardedSectionsRef.current.add(sectionKey)
        addXP(correct * 10)
      }
      saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', answerPayloads)

      if (correct === sectionExercises.length && correct > 0) {
        setSectionCelebration('visible')
        if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current)
        celebrationTimerRef.current = setTimeout(() => {
          setSectionCelebration('fading')
          setTimeout(() => {
            setSectionCelebration('idle')
            if (!isLastSection) handleNextSection()
          }, 300)
        }, 3000)
      }
    } finally {
      setIsAiChecking(false)
    }

    const updatedSections = { ...completedSections, [currentSection]: correct }
    const exerciseCorrect = Object.values(updatedSections).reduce((a, b) => a + b, 0)
    const testStartedInner = lesson.tests.length > 0 && Object.keys(completedTestSections).length > 0
    const testCorrectInner = testStartedInner
      ? Object.values(completedTestSections).reduce((a, b) => a + b, 0)
      : 0
    const testTotalInner = testStartedInner ? lesson.tests.length : 0
    const combinedCorrect = exerciseCorrect + testCorrectInner
    const combinedMax = lesson.exercises.length + testTotalInner
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)

    if (isLastSection) {
      updateSkillProgress('todayGrammarPct', combinedPct)
      pushLessonProgress(lesson.id, exerciseCorrect, lesson.exercises.length).catch(() => {
        monitoring.captureMessage('pushLessonProgress failed (non-critical)', 'warn')
      })
    }
  }

  const handleNextSection = () => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current)
      celebrationTimerRef.current = undefined
    }
    setSectionCelebration('idle')
    if (exerciseDBSaveTimerRef.current) {
      clearTimeout(exerciseDBSaveTimerRef.current)
      exerciseDBSaveTimerRef.current = undefined
    }
    const payloads = sectionExercises
      .filter((ex) => (answers[ex.id] ?? []).some((a) => a.trim()))
      .map((ex) => ({
        exerciseId: ex.id,
        exerciseType: ex.type,
        answer: answers[ex.id] ?? [],
        isCorrect: false,
      }))
    if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
    const nextIdx = currentSection + 1
    const st = loadExerciseSectionState(nextIdx)
    setAnswers(st.answers)
    setSubmitted(st.submitted)
    setScore(st.score)
    setCombo(0)
    setAiResults({})
    setCurrentSection(nextIdx)
    scrollToTop()
  }

  const handleClearSection = () => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current)
      celebrationTimerRef.current = undefined
    }
    setSectionCelebration('idle')
    if (exerciseDBSaveTimerRef.current) {
      clearTimeout(exerciseDBSaveTimerRef.current)
      exerciseDBSaveTimerRef.current = undefined
    }
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setAiResults({})
    removeExerciseStateFromLS(lesson.id, currentSection)
    clearExerciseAnswersFromDB(lesson.id, currentSection, 'exercise')
  }

  const handleJumpToSection = (idx: number) => {
    if (idx === currentSection) return
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current)
      celebrationTimerRef.current = undefined
    }
    setSectionCelebration('idle')
    if (exerciseDBSaveTimerRef.current) {
      clearTimeout(exerciseDBSaveTimerRef.current)
      exerciseDBSaveTimerRef.current = undefined
    }
    const payloads = sectionExercises
      .filter((ex) => (answers[ex.id] ?? []).some((a) => a.trim()))
      .map((ex) => ({
        exerciseId: ex.id,
        exerciseType: ex.type,
        answer: answers[ex.id] ?? [],
        isCorrect: false,
      }))
    if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
    const st = loadExerciseSectionState(idx)
    setAnswers(st.answers)
    setSubmitted(st.submitted)
    setScore(st.score)
    setAiResults({})
    setCurrentSection(idx)
    scrollToTop()
  }

  const handleSubmitTest = () => {
    const sec = lesson.testSections[testSection]
    if (!sec) return
    const sectionTests = resolveSectionItems(lesson.testSections, testSection, lesson.tests, lesson.tests)
    let correct = 0
    const results: Record<number, boolean> = {}
    const answerPayloads: {
      exerciseId: number
      exerciseType: string
      answer: string[]
      isCorrect: boolean
    }[] = []
    for (const t of sectionTests) {
      const ans = testAnswers[t.id] || ''
      const ok = checkAnswer(t, [ans])
      results[t.id] = ok
      if (ok) correct++
      answerPayloads.push({ exerciseId: t.id, exerciseType: t.type, answer: [ans], isCorrect: ok })
    }
    setTestScore(correct)
    setTestResults(results)
    setTestSubmitted(true)
    const newCompleted = { ...completedTestSections, [testSection]: correct }
    setCompletedTestSections(newCompleted)
    if (!rewardedTestSectionsRef.current.has(testSection)) {
      rewardedTestSectionsRef.current.add(testSection)
      addXP(correct * 10)
    }
    saveExerciseAnswersToDB(lesson.id, testSection, 'test', answerPayloads)
    pushTestProgress(lesson.id, sec.title, correct, sectionTests.length).catch(() => {
      monitoring.captureMessage('pushTestProgress failed (non-critical)', 'warn')
    })
    const testCorrectAll = Object.values(newCompleted).reduce((a, b) => a + b, 0)
    const exerciseCorrectAll = Object.values(completedSections).reduce((a, b) => a + b, 0)
    const combinedCorrect = testCorrectAll + exerciseCorrectAll
    const combinedMax = lesson.exercises.length + lesson.tests.length
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)
    if (Object.keys(newCompleted).length === lesson.testSections.length) {
      updateSkillProgress('todayGrammarPct', combinedPct)
      pushTestProgress(lesson.id, '__all__', testCorrectAll, lesson.tests.length).catch(() => {
        monitoring.captureMessage('pushTestProgress (all) failed (non-critical)', 'warn')
      })
      pushLessonProgress(lesson.id, combinedCorrect, combinedMax).catch(() => {
        monitoring.captureMessage('pushLessonProgress (final) failed (non-critical)', 'warn')
      })
    }
  }

  const handleClearTest = () => {
    if (testDBSaveTimerRef.current) {
      clearTimeout(testDBSaveTimerRef.current)
      testDBSaveTimerRef.current = undefined
    }
    setTestAnswers({})
    setTestSubmitted(false)
    setTestScore(0)
    setTestResults({})
    setTestShuffleKey((k) => k + 1)
    removeTestStateFromLS(lesson.id, testSection)
    clearExerciseAnswersFromDB(lesson.id, testSection, 'test')
  }

  const handleJumpToTestSection = (idx: number) => {
    if (idx === testSection) return
    if (testDBSaveTimerRef.current) {
      clearTimeout(testDBSaveTimerRef.current)
      testDBSaveTimerRef.current = undefined
    }
    const curSec = lesson.testSections[testSection]
    if (curSec) {
      const payloads = lesson.tests
        .filter((t) => curSec.ids.includes(t.id) && testAnswers[t.id])
        .map((t) => ({
          exerciseId: t.id,
          exerciseType: t.type,
          answer: [testAnswers[t.id]],
          isCorrect: !!testResults[t.id],
        }))
      if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, testSection, 'test', payloads)
    }
    const st = loadTestSectionState(idx)
    setTestAnswers(st.testAnswers)
    setTestSubmitted(st.testSubmitted)
    setTestScore(st.testScore)
    setTestResults(st.testResults)
    setTestSection(idx)
    scrollToTop()
  }

  // ═══════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════

  return {
    // Lesson data
    lesson,

    // Navigation
    tab,
    setTab,
    navigate,

    // Store actions
    addXP,
    addLearnedWords,
    updateSkillProgress,

    // Derived
    section,
    sectionExercises,
    isLastSection,
    storyBeat,
    prevScore,
    allDone,
    currentLessonScore,
    shuffledTestOptionsMap,
    vocabPushedCount,

    // Exercise state
    submitted,
    score,
    answers,
    aiResults,
    isAiChecking,
    completedSections,
    sectionCelebration,
    currentSection,
    combo,

    // Test state
    testSection,
    testAnswers,
    testSubmitted,
    testScore,
    testResults,
    completedTestSections,

    // Setters (for callbacks passed to children)
    setTestAnswers,
    setVocabDone,
    setVocabPushedCount,

    // Handlers
    handleJumpToSection,
    handleSubmitSection,
    handleClearSection,
    handleNextSection,
    handleChangeAnswer,
    handleJumpToTestSection,
    handleSubmitTest,
    handleClearTest,
  }
}
