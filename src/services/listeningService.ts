import { LISTENING_LESSONS } from '../data/listeningLessons'
import type { ListeningLesson } from '../data/listeningLessons'
import { todayDate, fetchContent, saveScore } from './contentService'

/** Save listening exercise result to Supabase */
export async function saveListeningResult(params: {
  userId:       string
  lessonId:     string
  lessonTitle:  string
  fillCorrect:  number
  fillTotal:    number
  tfCorrect:    number
  tfTotal:      number
  summaryDone:  boolean
  xpEarned:     number
  playCount:    number
}) {
  const { userId, lessonId, lessonTitle, fillCorrect, fillTotal, tfCorrect, tfTotal, summaryDone, xpEarned, playCount } = params
  const total = fillTotal + tfTotal + 1
  const correct = fillCorrect + tfCorrect + (summaryDone ? 1 : 0)
  const score = total > 0 ? Math.round((correct / total) * 100) : 0

  await saveScore('listening_progress', ['user_id', 'date', 'lesson_id'], {
    user_id:       userId,
    date:          todayDate(),
    lesson_id:     lessonId,
    lesson_title:  lessonTitle,
    score,
    fill_correct:  fillCorrect,
    fill_total:    fillTotal,
    tf_correct:    tfCorrect,
    tf_total:      tfTotal,
    summary_done:  summaryDone,
    xp_earned:     xpEarned,
    play_count:    playCount,
    completed_at:  new Date().toISOString(),
  })
}

export async function fetchListeningLessons(): Promise<ListeningLesson[]> {
  return fetchContent<ListeningLesson>('listening_lessons', LISTENING_LESSONS)
}
