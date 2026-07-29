import { monitoring } from '../../lib/monitoring'

export function trackLessonStarted(lessonId: string, day: number | null, level: string | null): void {
  monitoring.trackEvent('lesson_started', {
    lessonId,
    day: day ?? null,
    level: level ?? null,
    timestamp: Date.now(),
  })
}

export function trackLessonAbandoned(
  lessonId: string,
  day: number | null,
  level: string | null,
  currentSection: number,
  currentTab: string,
  timeSpentSec: number,
): void {
  monitoring.trackEvent('lesson_abandoned', {
    lessonId,
    day: day ?? null,
    level: level ?? null,
    currentSection,
    currentTab,
    timeSpentSec,
    timestamp: Date.now(),
  })
}
