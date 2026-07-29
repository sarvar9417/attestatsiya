// ═══════════════════════════════════════════════════════════════════════════
// duelService.ts — Async Duel CRUD
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { monitoring } from '../lib/monitoring'
import { sendBrowserNotification } from '../hooks/useNotifications'
import type { Duel, DuelMode, DuelQuestion, DuelResult } from '../types/tandem'
import type { DailyExercise } from '../data/dailyLessons'
import { fetchBattleQuestionsByMode } from './battleService'

// ─── Constants ───────────────────────────────────────────────────────────

const DUEL_EXPIRY_HOURS = 24
const QUESTIONS_PER_DUEL = 10

// ─── Helpers ─────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
//  ASYNC DUEL
// ═══════════════════════════════════════════════════════════════════════════

/** Duelni ID bo'yicha olish */
export async function getDuelById(duelId: string): Promise<Duel | null> {
  try {
    const { data, error } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single()
    if (error) throw error
    return db.cast<Duel>(data)
  } catch (e) {
    monitoring.captureMessage('getDuelById failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}

/** Yangi async duel yaratish */
export async function createDuel(
  opponentId: string | null,
  mode: DuelMode,
  level: string = 'B1'
): Promise<{ success: boolean; duel?: Duel; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const questionCount = mode === 'reading' ? 4 : QUESTIONS_PER_DUEL
  const { questions, passage } = await fetchBattleQuestionsByMode(level as 'A1' | 'A2' | 'B1' | 'B2', questionCount, mode)
  if (questions.length === 0) {
    return { success: false, error: 'Savollar topilmadi' }
  }

  const questionSet: DuelQuestion[] = questions.map(q => ({
    id: q.id,
    english: q.english,
    options: q.options,
    correct: q.correct,
    ...(passage ? { passage } : {}),
  }))

  const expiresAt = new Date(Date.now() + DUEL_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('duels')
    .insert({
      challenger: userId,
      opponent: opponentId,
      mode,
      status: 'pending',
      question_set: db.toJson(questionSet),
      challenger_score: null,
      opponent_score: null,
      is_bot: !opponentId,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('createDuel error: ' + error.message, 'error')
    return { success: false, error: 'Duel yaratishda xatolik' }
  }

  if (!opponentId) {
    await submitAIAnswer(data.id, questions.length)
  }

  return { success: true, duel: db.cast<Duel>(data) }
}

/**
 * Kunlik darsning multiple-choice mashqlarini duel savollariga aylantiradi.
 */
export function lessonExercisesToDuelQuestions(
  exercises: DailyExercise[],
  max: number = QUESTIONS_PER_DUEL,
): DuelQuestion[] {
  const out: DuelQuestion[] = []
  for (const ex of exercises) {
    if (ex.type !== 'multiple-choice') continue
    const correctIdx = ex.options.indexOf(ex.correct)
    if (correctIdx < 0) continue
    out.push({
      id: ex.id,
      english: ex.question,
      options: [...ex.options],
      correct: correctIdx,
    })
    if (out.length >= max) break
  }
  return out
}

/**
 * Dars duel'i yaratish — aynan tugatilgan darsning mashqlaridan.
 */
export async function createLessonDuel(
  opponentId: string | null,
  lessonId: string,
  lessonTitle: string,
  questions: DuelQuestion[],
): Promise<{ success: boolean; duel?: Duel; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }
  if (questions.length === 0) {
    return { success: false, error: 'Bu darsda duel uchun yetarli savol yo\'q' }
  }

  const expiresAt = new Date(Date.now() + DUEL_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('duels')
    .insert({
      challenger: userId,
      opponent: opponentId,
      mode: 'lesson',
      status: 'pending',
      question_set: db.toJson(questions),
      challenger_score: null,
      opponent_score: null,
      is_bot: !opponentId,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('createLessonDuel error: ' + error.message, 'error')
    return { success: false, error: 'Dars duel yaratishda xatolik' }
  }

  if (!opponentId) {
    await submitAIAnswer(data.id, questions.length)
  }

  return { success: true, duel: db.cast<Duel>(data) }
}

/** AI botning javobini hisoblash (savol soni asosida 70% aniqlik) */
async function submitAIAnswer(duelId: string, questionCount: number): Promise<void> {
  let correctCount = 0
  for (let i = 0; i < questionCount; i++) {
    if (Math.random() < 0.7) correctCount++
  }

  await supabase
    .from('duels')
    .update({ opponent_score: correctCount, status: 'done' })
    .eq('id', duelId)
    .then(({ error }) => {
      if (error) monitoring.captureMessage('submitAIAnswer error: ' + error.message, 'error')
    })
}

/** Duelga javob yozish (challenger o'ynaganida) */
export async function submitDuelAnswers(
  duelId: string,
  answers: { questionIndex: number; answerIndex: number }[]
): Promise<{ success: boolean; score?: number; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { data: duel, error: fetchError } = await supabase
    .from('duels')
    .select('*')
    .eq('id', duelId)
    .single()

  if (fetchError || !duel) {
    return { success: false, error: 'Duel topilmadi' }
  }

  const isChallenger = duel.challenger === userId
  if (!isChallenger && duel.opponent !== userId) {
    return { success: false, error: 'Bu duel sizga tegishli emas' }
  }

  if (isChallenger && duel.challenger_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }
  if (!isChallenger && duel.opponent_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }

  const questions = db.jsonFrom<DuelQuestion[]>(duel.question_set) ?? []
  let correctCount = 0
  for (const answer of answers) {
    const q = questions[answer.questionIndex]
    if (q && answer.answerIndex === q.correct) {
      correctCount++
    }
  }

  const isFriendDuel = !duel.is_bot && duel.opponent !== null
  const nextStatus = isChallenger && isFriendDuel ? 'opponent_turn' : 'done'

  const { error } = await supabase
    .from('duels')
    .update({
      status: nextStatus,
      ...(isChallenger ? { challenger_score: correctCount } : { opponent_score: correctCount }),
    })
    .eq('id', duelId)

  if (error) {
    monitoring.captureMessage('submitDuelAnswers error: ' + error.message, 'error')
    return { success: false, error: 'Javoblarni saqlashda xatolik' }
  }

  sendBrowserNotification('⚔️ Javoblaringiz saqlandi!', {
    body: isFriendDuel && isChallenger
      ? "Do'stingizning javobini kutish qoldi"
      : 'Duel yakunlandi — natijani tekshiring!',
    url: '/tandem',
  })

  // AI hakam bahosi (fire-and-forget)
  saveDuelVerdict(duelId, userId, duel.mode as DuelMode, correctCount, questions.length)
    .catch((e) => monitoring.captureMessage('saveDuelVerdict fire-and-forget failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))

  // XP Bonus
  const xpEarned = correctCount * 10
  import('../store/useStore').then(({ useStore }) => {
    useStore.getState().addXP(xpEarned)
  }).catch(() => {
    monitoring.captureMessage('submitDuelAnswers addXP import failed', 'warn')
    import('../utils/toastStore').then(({ useToastStore }) => {
      useToastStore.getState().toast('XP bonusni qo\'lda qo\'shing', 'warning', 4000)
    }).catch(() => {})
  })

  // Tandem juftlik total_xp ni oshirish
  try {
    const { data: pair } = await supabase
      .from('tandem_pairs')
      .select('id, total_xp')
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .maybeSingle()

    if (pair) {
      await supabase
        .from('tandem_pairs')
        .update({ total_xp: pair.total_xp + xpEarned })
        .eq('id', pair.id)
    }
  } catch (e) {
    monitoring.captureMessage('submitDuelAnswers total_xp update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }

  // Elo rating
  const isDuelDone = nextStatus === 'done' || !isChallenger
  const bothPlayed = isChallenger
    ? duel.opponent_score !== null
    : duel.challenger_score !== null
  if (isDuelDone && bothPlayed) {
    const oppName = duel.is_bot ? 'AI Bot' : 'Raqib'
    const totalMyScore = correctCount
    const totalTheirScore = isChallenger
      ? (duel.opponent_score ?? 0)
      : (duel.challenger_score ?? 0)
    import('./eloService').then(({ updateEloAfterDuel }) => {
      updateEloAfterDuel(userId, duel.opponent, totalMyScore, totalTheirScore, duelId, oppName)
    }).catch((e) => monitoring.captureMessage('submitDuelAnswers Elo import failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }

  return { success: true, score: correctCount }
}

/** Challenger o'ynaganidan keyin, opponentga notification */
export async function getOpponentPendingDuels(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .eq('opponent', userId)
    .eq('status', 'opponent_turn')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getPendingDuels error: ' + error.message, 'warn')
    return []
  }

  return db.cast<Duel[]>(data ?? [])
}

/** Faol duellar ro'yxati */
export async function getActiveDuels(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .or(`challenger.eq.${userId},opponent.eq.${userId}`)
    .in('status', ['pending', 'opponent_turn'])
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getActiveDuels error: ' + error.message, 'warn')
    return []
  }

  return db.cast<Duel[]>(data ?? [])
}

/** Tugagan duellar tarixi */
export async function getDuelHistory(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .or(`challenger.eq.${userId},opponent.eq.${userId}`)
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getDuelHistory error: ' + error.message, 'warn')
    return []
  }

  return db.cast<Duel[]>(data ?? [])
}

/** Duelni bekor qilish */
export async function cancelDuel(duelId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { error } = await supabase
    .from('duels')
    .update({ status: 'expired' })
    .eq('id', duelId)
    .eq('challenger', userId)

  if (error) {
    monitoring.captureMessage('cancelDuel error: ' + error.message, 'error')
    return { success: false, error: 'Bekor qilishda xatolik' }
  }

  return { success: true }
}

/** HotSeat natijasini saqlash (faqat mahalliy o'yinchi uchun) */
export async function saveHotSeatResult(
  playerScore: number,
  _questionsCount: number,
): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { error } = await supabase
      .from('duels')
      .insert({
        challenger: userId,
        opponent: null,
        mode: 'hotseat',
        status: 'done',
        question_set: [],
        challenger_score: playerScore,
        opponent_score: null,
        is_bot: true,
        expires_at: expiresAt,
      })
    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('saveHotSeatResult failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  AI HAKAM (Duel Verdict)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AI hakam bahosini generatsiya qiladi va duel_results ga saqlaydi.
 */
export async function saveDuelVerdict(
  duelId: string,
  userId: string,
  mode: DuelMode,
  score: number,
  totalQuestions: number
): Promise<{ success: boolean; result?: DuelResult; error?: string }> {
  try {
    const { generateDuelVerdict } = await import('../lib/claude')

    const modeMap: Record<string, string> = {
      vocab: 'vocabulary matching, word definitions',
      grammar: 'grammar structure, sentence formation',
      reading: 'reading comprehension, inference',
      speaking: 'spoken fluency, pronunciation',
      hotseat: 'hotseat rapid-fire mixed questions',
    }
    const questionSummary = modeMap[mode] ?? 'mixed vocabulary and grammar'

    const verdict = await generateDuelVerdict('B1', mode, totalQuestions, score, questionSummary)

    const { data, error } = await supabase
      .from('duel_results')
      .upsert({
        duel_id: duelId,
        user_id: userId,
        grammar_score: verdict.grammar_score,
        vocab_score: verdict.vocab_score,
        topic_score: verdict.topic_score,
        feedback: verdict.feedback,
      }, { onConflict: 'duel_id,user_id' })
      .select()
      .single()

    if (error) {
      monitoring.captureMessage('saveDuelVerdict error: ' + error.message, 'warn')
      return { success: false, error: 'Baholashda xatolik' }
    }

    return { success: true, result: data as DuelResult }
  } catch (e) {
    monitoring.captureMessage('saveDuelVerdict failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { success: false, error: 'AI hakam xatosi' }
  }
}

/**
 * Speaking duel uchun AI baholash + natijalarni saqlash.
 */
export async function submitSpeakingDuelAnswer(
  duelId: string,
  prompt: string,
  transcript: string,
  level: string = 'B1'
): Promise<{ success: boolean; score?: number; feedback?: string; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { data: duel, error: fetchError } = await supabase
    .from('duels')
    .select('*')
    .eq('id', duelId)
    .single()

  if (fetchError || !duel) {
    return { success: false, error: 'Duel topilmadi' }
  }

  const isChallenger = duel.challenger === userId
  if (!isChallenger && duel.opponent !== userId) {
    return { success: false, error: 'Bu duel sizga tegishli emas' }
  }

  if (isChallenger && duel.challenger_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }
  if (!isChallenger && duel.opponent_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }

  try {
    let fluencyScore = 5
    let grammarScore = 5
    let vocabScore = 5
    let feedbackText = ''

    if (!transcript || transcript.trim().length < 3) {
      fluencyScore = 0; grammarScore = 0; vocabScore = 0
      feedbackText = "Hech narsa eshitilmadi. Iltimos, yana urinib ko'ring."
    } else {
      try {
        const { evaluateSpeech } = await import('../lib/claude')
        const evalPromise = new Promise<{ fluency: number; grammar: number; vocab: number; feedback: string }>(
          (resolve) => {
            let full = ''
            const scores = { fluency: 5, grammar: 5, vocab: 5, feedback: '' }
            evaluateSpeech(
              prompt, transcript, level,
              (token) => { full += token },
              () => {
                const fluMatch = full.match(/FLUENCY:\s*(\d+)/i)
                const graMatch = full.match(/GRAMMAR:\s*(\d+)/i)
                const vocMatch = full.match(/VOCABULARY:\s*(\d+)/i)
                const fb = full.split('FEEDBACK:')[1]?.trim() ?? ''
                scores.fluency = fluMatch ? Math.max(0, Math.min(10, parseInt(fluMatch[1], 10))) : 5
                scores.grammar = graMatch ? Math.max(0, Math.min(10, parseInt(graMatch[1], 10))) : 5
                scores.vocab = vocMatch ? Math.max(0, Math.min(10, parseInt(vocMatch[1], 10))) : 5
                scores.feedback = fb.slice(0, 500)
                resolve(scores)
              },
              () => resolve(scores)
            )
          }
        )
        const result = await evalPromise
        fluencyScore = result.fluency; grammarScore = result.grammar; vocabScore = result.vocab; feedbackText = result.feedback
      } catch {
        const wordCount = transcript.split(/\s+/).filter(Boolean).length
        fluencyScore = Math.max(1, Math.min(10, Math.round(wordCount / 10)))
        grammarScore = Math.max(1, Math.min(10, 6))
        vocabScore = Math.max(1, Math.min(10, Math.round(wordCount / 15)))
        feedbackText = "AI baholashda xatolik. Taxminiy ball hisoblandi."
      }
    }

    const avgScore = Math.round((fluencyScore + grammarScore + vocabScore) / 3)

    const isFriendDuel = !duel.is_bot && duel.opponent !== null
    const nextStatus = isChallenger && isFriendDuel ? 'opponent_turn' : 'done'

    const { error } = await supabase
      .from('duels')
      .update({
        status: nextStatus,
        ...(isChallenger ? { challenger_score: avgScore } : { opponent_score: avgScore }),
      })
      .eq('id', duelId)

    if (error) {
      monitoring.captureMessage('submitSpeakingDuelAnswer error: ' + error.message, 'error')
      return { success: false, error: 'Natijani saqlashda xatolik' }
    }

    if (feedbackText) {
      try {
        await supabase
          .from('duel_results')
          .upsert({
            duel_id: duelId, user_id: userId,
            grammar_score: grammarScore, vocab_score: vocabScore,
            topic_score: fluencyScore, feedback: feedbackText.slice(0, 2000),
          }, { onConflict: 'duel_id,user_id' })
      } catch (e) {
        monitoring.captureMessage('submitSpeakingDuelAnswer duel_results save failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }

    // XP bonus
    const xpEarned = avgScore * 15
    import('../store/useStore').then(({ useStore }) => {
      useStore.getState().addXP(xpEarned)
    }).catch(() => {})

    // Elo rating
    if (nextStatus === 'done') {
      const oppId = duel.opponent ?? null
      const oppName = duel.is_bot ? 'AI Bot' : 'Raqib'
      const totalMyScore = avgScore
      const totalTheirScore = isChallenger
        ? (duel.opponent_score ?? 5)
        : (duel.challenger_score ?? 5)
      import('./eloService').then(({ updateEloAfterDuel }) => {
        updateEloAfterDuel(userId, oppId, totalMyScore, totalTheirScore, duelId, oppName)
      }).catch((e) => monitoring.captureMessage('submitSpeakingDuelAnswer Elo failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
    }

    sendBrowserNotification('🎤 Speaking duelingiz baholandi!', {
      body: `${avgScore}/10 — natijani tekshiring!`,
      url: '/tandem',
    })

    return { success: true, score: avgScore, feedback: feedbackText }
  } catch (e) {
    monitoring.captureMessage('submitSpeakingDuelAnswer failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return { success: false, error: 'Speaking duelda xatolik' }
  }
}
