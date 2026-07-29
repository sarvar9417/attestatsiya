// ═══════════════════════════════════════════════════════════════════════════
// speakingOSService.ts — Speaking OS service (30_days.md arxitekturasi)
// ═══════════════════════════════════════════════════════════════════════════
//
// 6 jadval bilan ishlash uchun typed CRUD operatsiyalari:
//   - topics          → kontent (umumiy, faqat o'qish)
//   - sentence_cards  → SRS jumlalar decki
//   - vocab_cards     → SRS so'zlar decki
//   - user_facts      → Life Memory
//   - conversation_sessions → AI suhbat tarixi
//   - user_weak_points     → Adaptive tracking
//
// Pattern: supabase.from() + db helper orqali to'liq typed
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'

// ─────────────────────────────────────────────────────────────────────────────
// TOPICS (umumiy kontent — faqat o'qish)
// ─────────────────────────────────────────────────────────────────────────────

/** Barcha topic'larni olish (day_number bo'yicha) */
export async function getAllTopics() {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('day_number')
  return { data, error }
}

/** Bitta topic ni olish */
export async function getTopic(topicId: string) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('id', topicId)
    .maybeSingle()
  return { data, error }
}

/** Kun raqami bo'yicha topic olish */
export async function getTopicByDay(dayNumber: number) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('day_number', dayNumber)
    .maybeSingle()
  return { data, error }
}

// ─────────────────────────────────────────────────────────────────────────────
// SENTENCE CARDS (SRS jumla decki)
// ─────────────────────────────────────────────────────────────────────────────

/** Yangi sentence card qo'shish */
export async function insertSentenceCard(card: {
  topic_id: string
  front_uz: string
  back_en: string
  audio_url?: string | null
  review_direction?: string
  user_id: string
}) {
  const { data, error } = await supabase
    .from('sentence_cards')
    .insert(card)
    .select()
    .single()
  return { data, error }
}

/** Bir nechta sentence card qo'sish (batch) */
export async function insertSentenceCards(cards: Array<{
  topic_id: string
  front_uz: string
  back_en: string
  audio_url?: string | null
  review_direction?: string
  user_id: string
}>) {
  const { data, error } = await supabase
    .from('sentence_cards')
    .insert(cards)
    .select()
  return { data, error }
}

/** Due bo'lgan sentence cardlarni olish (warm-up) */
export async function getDueSentenceCards(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('sentence_cards')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_date', new Date().toISOString().split('T')[0])
    .order('next_review_date')
    .limit(limit)
  return { data, error }
}

/** Topic bo'yicha barcha sentence cardlarni olish */
export async function getSentenceCardsByTopic(userId: string, topicId: string) {
  const { data, error } = await supabase
    .from('sentence_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .order('created_at')
  return { data, error }
}

// ─────────────────────────────────────────────────────────────────────────────
// VOCAB CARDS (SRS so'z decki)
// ─────────────────────────────────────────────────────────────────────────────

/** Yangi vocab card qo'shish */
export async function insertVocabCard(card: {
  topic_id: string
  word: string
  meaning_uz: string
  example_en: string
  audio_url?: string | null
  review_direction?: string
  user_id: string
}) {
  const { data, error } = await supabase
    .from('vocab_cards')
    .insert(card)
    .select()
    .single()
  return { data, error }
}

/** Bir nechta vocab card qo'shish (batch) */
export async function insertVocabCards(cards: Array<{
  topic_id: string
  word: string
  meaning_uz: string
  example_en: string
  audio_url?: string | null
  review_direction?: string
  user_id: string
}>) {
  const { data, error } = await supabase
    .from('vocab_cards')
    .insert(cards)
    .select()
  return { data, error }
}

/** Due bo'lgan vocab cardlarni olish */
export async function getDueVocabCards(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('vocab_cards')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_date', new Date().toISOString().split('T')[0])
    .order('next_review_date')
    .limit(limit)
  return { data, error }
}

/** Topic bo'yicha barcha vocab cardlarni olish */
export async function getVocabCardsByTopic(userId: string, topicId: string) {
  const { data, error } = await supabase
    .from('vocab_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .order('created_at')
  return { data, error }
}

// ─────────────────────────────────────────────────────────────────────────────
// SRS RATING (SM-2 algoritmini serverda ishga tushirish)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sentence yoki vocab kartani baholash (SM-2).
 * @param cardId - karta ID
 * @param rating - 0=again, 1=hard, 2=good, 3=easy
 * @param deckType - 'sentence' yoki 'vocab'
 */
export async function rateCard(
  cardId: string,
  rating: number,
  deckType: 'sentence' | 'vocab'
) {
  const { data, error } = await supabase.rpc('rate_speaking_os_card', {
    p_card_id: cardId,
    p_rating: rating,
    p_deck_type: deckType,
  })
  return { data: data as {
    new_ease: number
    new_interval: number
    new_repetitions: number
    next_review_date: string
  } | null, error }
}

/** Due cardlar sonini olish (warm-up uchun) */
export async function getDueCount(userId: string) {
  const { data, error } = await supabase.rpc('get_speaking_os_due_count', {
    p_user_id: userId,
  })
  return { data: data as {
    sentence_due: number
    vocab_due: number
    total_due: number
  } | null, error }
}

/** Ikkala deckdan due bo'lganlarni birlashtirib olish (warm-up) */
export async function getWarmUpCards(userId: string, limit = 20) {
  const [sentenceRes, vocabRes] = await Promise.all([
    getDueSentenceCards(userId, limit),
    getDueVocabCards(userId, limit),
  ])

  const cards = [
    ...(sentenceRes.data ?? []).map(c => ({ ...c, deck_type: 'sentence' as const })),
    ...(vocabRes.data ?? []).map(c => ({ ...c, deck_type: 'vocab' as const })),
  ]

  // Aralashtirish (shuffle)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards.slice(0, limit)
}

// ─────────────────────────────────────────────────────────────────────────────
// USER FACTS (Life Memory)
// ─────────────────────────────────────────────────────────────────────────────

/** Yangi fakt qo'shish */
export async function insertUserFact(fact: {
  user_id: string
  fact_key: string
  fact_value: string
  learned_from_session_id?: string | null
}) {
  const { data, error } = await supabase
    .from('user_facts')
    .insert(fact)
    .select()
    .single()
  return { data, error }
}

/** Foydalanuvchining barcha faktlarini olish */
export async function getUserFacts(userId: string) {
  const { data, error } = await supabase
    .from('user_facts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

/** Faktni yangilash */
export async function updateUserFact(factId: string, updates: {
  fact_value?: string
  learned_from_session_id?: string | null
}) {
  const { data, error } = await supabase
    .from('user_facts')
    .update(updates)
    .eq('id', factId)
    .select()
    .single()
  return { data, error }
}

/** Faktni o'chirish */
export async function deleteUserFact(factId: string) {
  const { error } = await supabase
    .from('user_facts')
    .delete()
    .eq('id', factId)
  return { error }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION SESSIONS (AI suhbat tarixi)
// ─────────────────────────────────────────────────────────────────────────────

/** Yangi suhbat sessiyasini saqlash */
export async function insertConversationSession(session: {
  user_id: string
  topic_id: string
  transcript?: unknown[]
  feedback?: unknown | null
  weak_grammar_points?: string[] | null
}) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .insert({
      user_id: session.user_id,
      topic_id: session.topic_id,
      transcript: db.toJson(session.transcript ?? []),
      feedback: session.feedback ? db.toJson(session.feedback) : null,
      weak_grammar_points: session.weak_grammar_points ?? null,
    })
    .select()
    .single()
  return { data, error }
}

/** Foydalanuvchining barcha sessiyalarini olish */
export async function getUserSessions(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

/** Topic bo'yicha sessiyalarni olish */
export async function getSessionsByTopic(userId: string, topicId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false })
  return { data, error }
}

/** Sessiyaga feedback qo'shish */
export async function updateSessionFeedback(
  sessionId: string,
  feedback: unknown,
  weakPoints: string[]
) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .update({
      feedback: db.toJson(feedback),
      weak_grammar_points: weakPoints,
    })
    .eq('id', sessionId)
    .select()
    .single()
  return { data, error }
}

// ─────────────────────────────────────────────────────────────────────────────
// USER WEAK POINTS (Adaptive tracking)
// ─────────────────────────────────────────────────────────────────────────────

/** Zaif nuqtani qo'shish yoki error_count ni oshirish (atomik RPC orqali) */
export async function upsertWeakPoint(userId: string, grammarPoint: string) {
  const { data, error } = await supabase.rpc('upsert_weak_point', {
    p_user_id: userId,
    p_grammar_point: grammarPoint,
  })
  return { data, error }
}

/** Bir nechta zaif nuqtalarni birdaniga qo'shish (atomik RPC orqali) */
export async function upsertWeakPoints(userId: string, grammarPoints: string[]) {
  const { data, error } = await supabase.rpc('upsert_weak_points_batch', {
    p_user_id: userId,
    p_grammar_points: grammarPoints,
  })
  return { data, error }
}

/** Foydalanuvchining zaif nuqtalarini olish (error_count bo'yicha kamayish) */
export async function getUserWeakPoints(userId: string) {
  const { data, error } = await supabase
    .from('user_weak_points')
    .select('*')
    .eq('user_id', userId)
    .order('error_count', { ascending: false })
  return { data, error }
}

/** Zaif nuqtani o'chirish (foydalanuvchi uni o'zlashtirgan bo'lsa) */
export async function deleteWeakPoint(userId: string, grammarPoint: string) {
  const { error } = await supabase
    .from('user_weak_points')
    .delete()
    .eq('user_id', userId)
    .eq('grammar_point', grammarPoint)
  return { error }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI CONVERSATION HELPERS (System prompt qurish)
// ─────────────────────────────────────────────────────────────────────────────

/** AI system prompt qurish (30_days.md 4-bo'lim) */
export async function buildSystemPrompt(userId: string, topicId: string) {
  const [topicRes, factsRes, weakPointsRes] = await Promise.all([
    supabase.from('topics').select('*').eq('id', topicId).maybeSingle(),
    supabase.from('user_facts').select('*').eq('user_id', userId),
    supabase.from('user_weak_points').select('*').eq('user_id', userId),
  ])

  const topic = topicRes.data
  const facts = factsRes.data ?? []
  const weakPoints = weakPointsRes.data ?? []

  if (!topic) {
    return { systemPrompt: '', error: new Error('Topic not found') }
  }

  // Roleplay section
  const roleplayScript = topic.roleplay_script as {
    ai_role?: string
    user_role?: string
    skeleton?: Array<{ ai?: string; user_expected?: string }>
  } | null

  const roleplaySection = roleplayScript
    ? `NAMUNA DIALOG (shu oqimni loyihalashtir, so'zma-so'z takrorlama):
Sen: ${roleplayScript.ai_role ?? 'AI'}
Foydalanuvchi: ${roleplayScript.user_role ?? 'User'}
${(roleplayScript.skeleton ?? []).map(s =>
  s.ai
    ? `AI: "${s.ai}"`
    : `Foydalanuvchi kutilgan javob: "${s.user_expected}"`
).join('\n')}`
    : `VAZIYAT: ${topic.scenario_context ?? 'Kundalik muloqot'}`

  const factsText = facts.length > 0
    ? facts.map(f => `- ${f.fact_key}: ${f.fact_value}`).join('\n')
    : '- (Hali hech qanday shaxsiy ma\'lumot yo\'q)'

  const weakPointsText = weakPoints.length > 0
    ? weakPoints.map(wp => wp.grammar_point).join(', ')
    : '(Hali aniqlanmagan)'

  const systemPrompt = `Sen foydalanuvchining ingliz tili suhbat sherigisan.

BUGUNGI MAVZU: ${topic.title_en}
${roleplaySection}
DARAJA: ${topic.level}

FOYDALANUVCHI HAQIDA (tabiiy suhbatda foydalan, lekin har gapda emas):
${factsText}

FOYDALANUVCHINING ZAIF NUQTALARI (imkon bo'lsa shu grammatikani ishlatishga undab tur):
${weakPointsText}

QOIDALAR:
1. Faqat ingliz tilida, sodda va tabiiy tarzda javob ber.
2. Har javobda 1 ta savol qo'yib, suhbatni davom ettir.
3. Xato bo'lsa, avval tabiiy javob ber, keyin qavs ichida qisqa tuzatish:
   (Better: "I go" → "I went")
4. Foydalanuvchini kamida 15-20 so'zlik javob berishga undab tur.
5. Suhbat 8-10 almashinuvdan keyin tabiiy tugasin.`

  return { systemPrompt, error: null }
}

/** Suhbatdan faktlarni ajratib olish uchun prompt */
export function buildFactExtractionPrompt(transcript: unknown[]) {
  return `Quyidagi suhbatdan foydalanuvchi haqida yangi shaxsiy fakt bormi?
Agar bo'lsa JSON qaytar: {"key": "...", "value": "..."}
Agar yo'q bo'lsa: null
Suhbat: ${JSON.stringify(transcript)}`
}

/** Feedback generatsiyasi uchun prompt */
export function buildFeedbackPrompt(transcript: unknown[]) {
  return `Quyidagi suhbatni tahlil qil va JSON qaytar:
{
  "grammar_score": 1-5,
  "vocabulary_score": 1-5,
  "fluency_score": 1-5,
  "top_mistakes": [{"user_said": "...", "correction": "...", "rule": "..."}],
  "better_expressions": [{"basic": "...", "natural": "..."}],
  "weak_grammar_points": ["Present Perfect", ...]
}
Suhbat: ${JSON.stringify(transcript)}`
}
