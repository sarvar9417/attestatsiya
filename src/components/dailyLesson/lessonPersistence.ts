import { Answers } from './useLessonState'
import { monitoring } from '../../lib/monitoring'

const LOCAL_SESSION_PREFIX = 'lesson-session-'

interface LoadedExerciseState {
  answers: Answers
  submitted: boolean
  score: number
}

interface LoadedTestState {
  testAnswers: Record<number, string>
  testSubmitted: boolean
  testScore: number
  testResults: Record<number, boolean>
}

export function makeExerciseStorageKey(lessonId: string, sectionIdx: number): string {
  return `exercise-answers-${lessonId}-${sectionIdx}`
}

export function makeTestStorageKey(lessonId: string, sectionIdx: number): string {
  return `test-state-${lessonId}-${sectionIdx}`
}

export function saveExerciseStateToLS(
  lessonId: string,
  sectionIdx: number,
  answers: Answers,
  submitted: boolean,
  score: number,
): void {
  try {
    localStorage.setItem(
      makeExerciseStorageKey(lessonId, sectionIdx),
      JSON.stringify({ answers, submitted, score }),
    )
  } catch {
    monitoring.captureMessage('localStorage write failed (exercise state)', 'warn')
  }
}

export function loadExerciseStateFromLS(
  lessonId: string,
  sectionIdx: number,
): LoadedExerciseState | null {
  try {
    const saved = localStorage.getItem(makeExerciseStorageKey(lessonId, sectionIdx))
    if (saved) {
      const d = JSON.parse(saved)
      if (d?.answers && Object.keys(d.answers).length > 0) {
        return { answers: d.answers, submitted: !!d.submitted, score: d.score ?? 0 }
      }
    }
  } catch {
    monitoring.captureMessage('Failed to parse localStorage exercise state', 'warn')
  }
  return null
}

export function removeExerciseStateFromLS(lessonId: string, sectionIdx: number): void {
  try {
    localStorage.removeItem(makeExerciseStorageKey(lessonId, sectionIdx))
  } catch {
    monitoring.captureMessage('Failed to remove exercise state from localStorage', 'warn')
  }
}

export function saveTestStateToLS(
  lessonId: string,
  sectionIdx: number,
  testAnswers: Record<number, string>,
  testSubmitted: boolean,
  testScore: number,
  testResults: Record<number, boolean>,
): void {
  try {
    localStorage.setItem(
      makeTestStorageKey(lessonId, sectionIdx),
      JSON.stringify({ testAnswers, testSubmitted, testScore, testResults }),
    )
  } catch {
    monitoring.captureMessage('localStorage write failed (test state)', 'warn')
  }
}

export function loadTestStateFromLS(
  lessonId: string,
  sectionIdx: number,
): LoadedTestState | null {
  try {
    const saved = localStorage.getItem(makeTestStorageKey(lessonId, sectionIdx))
    if (saved) {
      const d = JSON.parse(saved)
      if (d?.testAnswers && Object.keys(d.testAnswers).length > 0) {
        return {
          testAnswers: d.testAnswers,
          testSubmitted: !!d.testSubmitted,
          testScore: d.testScore ?? 0,
          testResults: d.testResults ?? {},
        }
      }
    }
  } catch {
    monitoring.captureMessage('Failed to parse localStorage test state', 'warn')
  }
  return null
}

export function removeTestStateFromLS(lessonId: string, sectionIdx: number): void {
  try {
    localStorage.removeItem(makeTestStorageKey(lessonId, sectionIdx))
  } catch {
    monitoring.captureMessage('Failed to remove test state from localStorage', 'warn')
  }
}

// ── Session cache ──

interface SessionPayload {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
}

interface LoadedSession {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  updatedAt: number
}

export function saveSessionLocal(lessonId: string, data: SessionPayload, updatedAt: number = Date.now()): void {
  try {
    localStorage.setItem(LOCAL_SESSION_PREFIX + lessonId, JSON.stringify({ ...data, updatedAt }))
  } catch {
    monitoring.captureMessage('saveSessionLocal failed', 'warn')
  }
}

export function loadSessionLocal(lessonId: string): LoadedSession | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_PREFIX + lessonId)
    if (!raw) return null
    const d = JSON.parse(raw)
    return {
      tab: d.tab ?? 'theory',
      currentSection: d.currentSection ?? 0,
      testSection: d.testSection ?? 0,
      completedSections: d.completedSections ?? {},
      completedTestSections: d.completedTestSections ?? {},
      updatedAt: d.updatedAt ?? 0,
    }
  } catch { return null }
}

export function clearSessionLocal(lessonId: string): void {
  try { localStorage.removeItem(LOCAL_SESSION_PREFIX + lessonId) } catch { /* ignore */ }
}
