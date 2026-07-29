/**
 * Smart merge strategiyalari — Supabase ↔ Dexie sync conflict larini
 * "last-write-wins" emas, balki data type'ga mos mantiq bilan birlashtiradi.
 *
 * Umumiy prinsiplar:
 * - Counter/XP → max (hech qachon yo'qotmaymiz)
 * - Progress → max per section/field
 * - SRS box → max (yuqori box = yuqori mastery)
 * - Session position → latest timestamp
 * - State JSON → object merge + max counters
 */

// ═══════════════════════════════════════════════════════════════════════════
//  Merge strategiyalari — har xil ma'lumot turlari uchun
// ═══════════════════════════════════════════════════════════════════════════

/** Ikki sondan kattasini oladi */
export function mergeMax(local: number, remote: number): number {
  return Math.max(local, remote)
}

/** Ikki sondan kichigini oladi */
export function mergeMin(local: number, remote: number): number {
  return Math.min(local, remote)
}

/** Timestamp bo'yicha eng yangisini oladi */
export function mergeByTimestamp<T>(
  local: T,
  remote: T,
  localTs: number,
  remoteTs: number,
): T {
  return remoteTs >= localTs ? remote : local
}

/** Ikki sonni qo'shib yuboradi (accumulative) */
export function mergeSum(local: number, remote: number): number {
  return local + remote
}

/** Ikki ob'ektni chuqur birlashtiradi — nested key lar bo'yicha */
export function mergeObjects<T extends Record<string, unknown>>(
  local: T,
  remote: T,
  numericKeys: string[] = [],
  booleanKeys: string[] = [],
): T {
  const result = { ...local, ...remote }
  for (const key of numericKeys) {
    const hasLocal = typeof local[key] === 'number'
    const hasRemote = typeof remote[key] === 'number'
    if (hasLocal || hasRemote) {
      const lv = hasLocal ? (local[key] as number) : 0
      const rv = hasRemote ? (remote[key] as number) : 0
      ;(result as Record<string, unknown>)[key] = Math.max(lv, rv)
    }
  }
  for (const key of booleanKeys) {
    if (key in local || key in remote) {
      (result as Record<string, unknown>)[key] = Boolean(local[key] || remote[key])
    }
  }
  return result
}

/** Ikki section map ni birlashtiradi — har section uchun max progress */
export function mergeSectionProgress(
  local: Record<number, number>,
  remote: Record<number, number>,
): Record<number, number> {
  const merged: Record<number, number> = { ...local }
  for (const [k, v] of Object.entries(remote)) {
    const sectionIdx = Number(k)
    merged[sectionIdx] = Math.max(merged[sectionIdx] ?? 0, v)
  }
  return merged
}

/** Ikki string array ni union qiladi */
export function mergeArrayUnion<T>(local: T[], remote: T[]): T[] {
  return [...new Set([...local, ...remote])]
}

/** Ikki Record<string, number> ni bir xil key lar uchun max olib birlashtiradi */
export function mergeRecordMax(
  local: Record<string, number>,
  remote: Record<string, number>,
): Record<string, number> {
  const merged: Record<string, number> = { ...local }
  for (const [k, v] of Object.entries(remote)) {
    merged[k] = Math.max(merged[k] ?? 0, v)
  }
  return merged
}

// ═══════════════════════════════════════════════════════════════════════════
//  Data type'ga xos merge funksiyalari
// ═══════════════════════════════════════════════════════════════════════════

export interface UserStateMergeInput {
  local: Record<string, unknown>
  remote: Record<string, unknown>
}

const USER_STATE_NUMERIC_KEYS = [
  'totalXP', 'streak', 'totalWordsLearned', 'todayMinutes', 'todayXP',
  'todayGrammarPct', 'todayVocabPct', 'todayListeningPct', 'todayReadingPct',
  'todaySpeakingPct', 'todayWritingPct', 'todayPhrasesPct',
  'dailyGoalMinutes', 'currentDay', 'currentWeek',
]

const USER_STATE_BOOLEAN_KEYS = [
  'onboardingComplete', 'notificationsEnabled',
]

/**
 * User state (JSON object) ni aqlli merge qiladi:
 * - Yangi key lar remote dan qo'shiladi
 * - Numeric field lar → max
 * - Boolean field lar → true agar birorta true bo'lsa
 * - Qolgan field lar → remote wins (latest)
 */
export function mergeUserState(input: UserStateMergeInput): Record<string, unknown> {
  return mergeObjects(input.local, input.remote, USER_STATE_NUMERIC_KEYS, USER_STATE_BOOLEAN_KEYS)
}

export interface LessonProgressMergeInput {
  localScore: number
  remoteScore: number
  localCorrectCount: number
  remoteCorrectCount: number
  localTotalExercises: number
  remoteTotalExercises: number
  localXpEarned: number
  remoteXpEarned: number
  localCompletedAt: number
  remoteCompletedAt: number
}

export interface LessonProgressMergeOutput {
  score: number
  correctCount: number
  totalExercises: number
  xpEarned: number
  completedAt: number
}

/**
 * Lesson progress ni merge: score/correct/xp → max, completedAt → latest
 */
export function mergeLessonProgress(input: LessonProgressMergeInput): LessonProgressMergeOutput {
  return {
    score: mergeMax(input.localScore, input.remoteScore),
    correctCount: mergeMax(input.localCorrectCount, input.remoteCorrectCount),
    totalExercises: mergeMax(input.localTotalExercises, input.remoteTotalExercises),
    xpEarned: mergeMax(input.localXpEarned, input.remoteXpEarned),
    completedAt: mergeMax(input.localCompletedAt, input.remoteCompletedAt),
  }
}

export interface VocabProgressMergeInput {
  localBox: number
  remoteBox: number
  localCorrectCount: number
  remoteCorrectCount: number
  localWrongCount: number
  remoteWrongCount: number
  localIsLearned?: boolean
  remoteIsLearned?: boolean
}

export interface VocabProgressMergeOutput {
  box: number
  correctCount: number
  wrongCount: number
  isLearned: boolean
}

/**
 * Vocabulary progress merge:
 * - box (SRS darajasi) → max
 * - correct_count → max
 * - wrong_count → max
 * - is_learned → OR (agar birorta device o'rgangan desa, o'rgangan)
 */
export function mergeVocabProgress(input: VocabProgressMergeInput): VocabProgressMergeOutput {
  return {
    box: mergeMax(input.localBox, input.remoteBox),
    correctCount: mergeMax(input.localCorrectCount, input.remoteCorrectCount),
    wrongCount: mergeMax(input.localWrongCount, input.remoteWrongCount),
    isLearned: Boolean(input.localIsLearned || input.remoteIsLearned),
  }
}

export interface DailyProgressMergeInput {
  localMinutes: number
  remoteMinutes: number
  localXp: number
  remoteXp: number
  localGrammarPct: number
  remoteGrammarPct: number
  localVocabPct: number
  remoteVocabPct: number
  localListeningPct: number
  remoteListeningPct: number
  localWritingPct: number
  remoteWritingPct: number
  localStreak: number
  remoteStreak: number
}

export interface DailyProgressMergeOutput {
  totalMinutes: number
  xpEarned: number
  grammarPct: number
  vocabPct: number
  listeningPct: number
  writingPct: number
  streak: number
}

/**
 * Daily progress merge: barcha field lar → max
 */
export function mergeDailyProgress(input: DailyProgressMergeInput): DailyProgressMergeOutput {
  return {
    totalMinutes: mergeMax(input.localMinutes, input.remoteMinutes),
    xpEarned: mergeMax(input.localXp, input.remoteXp),
    grammarPct: mergeMax(input.localGrammarPct, input.remoteGrammarPct),
    vocabPct: mergeMax(input.localVocabPct, input.remoteVocabPct),
    listeningPct: mergeMax(input.localListeningPct, input.remoteListeningPct),
    writingPct: mergeMax(input.localWritingPct, input.remoteWritingPct),
    streak: mergeMax(input.localStreak, input.remoteStreak),
  }
}

export interface LessonSessionMergeInput {
  localTab: string
  remoteTab: string
  localCurrentSection: number
  remoteCurrentSection: number
  localTestSection: number
  remoteTestSection: number
  localCompletedSections: Record<number, number>
  remoteCompletedSections: Record<number, number>
  localCompletedTestSections: Record<number, number>
  remoteCompletedTestSections: Record<number, number>
  localUpdatedAt: number
  remoteUpdatedAt: number
}

export interface LessonSessionMergeOutput {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  updatedAt: number
}

/**
 * Lesson session merge:
 * - completedSections / completedTestSections → section lar bo'yicha max
 * - tab / currentSection → latest timestamp
 * - updatedAt → max
 */
export function mergeLessonSession(input: LessonSessionMergeInput): LessonSessionMergeOutput {
  const { local, remote } = {
    local: { tab: input.localTab, section: input.localCurrentSection, testSection: input.localTestSection, ts: input.localUpdatedAt },
    remote: { tab: input.remoteTab, section: input.remoteCurrentSection, testSection: input.remoteTestSection, ts: input.remoteUpdatedAt },
  }

  const latest = remote.ts > local.ts ? remote : local

  return {
    tab: latest.tab,
    currentSection: latest.section,
    testSection: latest.testSection,
    completedSections: mergeSectionProgress(input.localCompletedSections, input.remoteCompletedSections),
    completedTestSections: mergeSectionProgress(input.localCompletedTestSections, input.remoteCompletedTestSections),
    updatedAt: mergeMax(input.localUpdatedAt, input.remoteUpdatedAt),
  }
}

/**
 * Supabase upsert dan oldin smart merge qilish uchun helper.
 * Agar local da mavjud bo'lgan qiymat remote dan yuqori bo'lsa, remote ni
 * yangilamasdan o'tkazib yuboradi (yoki local ni remote ga yozadi).
 */
export function shouldSkipUpsertForScore(
  localScore: number | null | undefined,
  remoteScore: number | undefined,
): boolean {
  if (remoteScore === undefined) return false
  if (localScore === null || localScore === undefined) return false
  return localScore >= remoteScore
}
