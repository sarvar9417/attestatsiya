import { day1 } from './day1'
import { day2 } from './day2'
import { getChallengeDayFromDB } from '../../services/challengeDayService'

export const STATIC_DAYS = [
  day1,
  day2,
]

export const TOTAL_CHALLENGE_DAYS = 30

export function getStaticDay(day: number) {
  return STATIC_DAYS.find(d => d.day === day) ?? null
}

export async function getChallengeDay(day: number) {
  // Try Supabase with a 5-second timeout — agar Supabase javob bermasa static data ga o'tadi
  const staticDay = getStaticDay(day)
  const fromDB = await Promise.race([
    getChallengeDayFromDB(day),
    new Promise<null>(resolve => setTimeout(() => resolve(null), 5000)),
  ])
  if (fromDB && staticDay) {
    // Merge static sentenceBank categories into DB data (so new categories appear)
    const staticCategories = staticDay.sentenceBank?.categories ?? []
    const dbCategories = fromDB.sentenceBank?.categories ?? []
    const dbCategoryNames = new Set(dbCategories.map(c => c.category))
    const mergedCategories = [
      ...dbCategories,
      ...staticCategories.filter(c => !dbCategoryNames.has(c.category)),
    ]
    fromDB.sentenceBank = {
      categories: mergedCategories,
      all: fromDB.sentenceBank?.all,
    }
    // structuredTranscript ni static day dan olamiz (DB da structured_transcript bo'lmasligi mumkin)
    if (!fromDB.structuredTranscript && staticDay.structuredTranscript) {
      fromDB.structuredTranscript = staticDay.structuredTranscript
    }
    return fromDB
  }
  if (fromDB) return fromDB
  return staticDay
}

export { getChallengeDayFromDB } from '../../services/challengeDayService'

export type { ChallengeDay, SentenceBank, SentenceCategory, ChallengeVocab, LessonHighlight, HighlightItem, HighlightPhrase, LegacyPhrase, ChallengeExercise, RoleplayExercise, ChallengeQuiz, ChallengeSpeaking, ChallengeReview, ChallengeVideo, Timestamp, DialogueLine, TranscriptSection, TranscriptLine, Phrase } from './types'
