import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { addDaysTashkent, getTodayTashkent } from '../utils/tashkentDate'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import { createDefaultFSRSState, computeNextReviewFSRS } from '../lib/srs'
import type { PersonalWord, AddWordDTO, UpdateWordDTO, VocabRating, PartOfSpeech, PersonalVocabularyImportResult, PersonalVocabSession } from '../types/personalVocabulary'

// ═══════════════════════════════════════════════════════════════════════════
// Personal Vocabulary Service
// ═══════════════════════════════════════════════════════════════════════════

// 'guest' (yoki bo'sh) userId — auth.users'ga FK + RLS uchun yaroqsiz.
// Mutatsiyalardan oldin tekshiramiz: jim FK xatosi o'rniga aniq xabar.
function requireAuthedUser(userId: string): void {
  if (!userId || userId === 'guest') {
    useToastStore.getState().toast('Iltimos, avval tizimga kiring', 'error')
    throw new Error('Not authenticated')
  }
}

// ─── CRUD Operations ──────────────────────────────────────────────────────

async function checkDuplicateWord(userId: string, english: string): Promise<boolean> {
  const { data } = await supabase
    .from('personal_vocabulary')
    .select('id')
    .eq('user_id', userId)
    .ilike('english', english.trim())
    .maybeSingle()
  return !!data
}

export async function addPersonalWordToDB(
  userId: string,
  wordData: AddWordDTO
): Promise<PersonalWord> {
  requireAuthedUser(userId)

  if (await checkDuplicateWord(userId, wordData.english)) {
    useToastStore.getState().toast("Bu so'z allaqachon qo'shilgan", 'warning')
    throw new Error('Duplicate word')
  }

  const now = new Date().toISOString()
  const defaultFSRS = createDefaultFSRSState()

  const { data, error } = await supabase
    .from('personal_vocabulary')
    .insert({
      user_id: userId,
      english: wordData.english,
      uzbek: wordData.uzbek,
      phonetic: wordData.phonetic || null,
      example: wordData.example || null,
      example_uzbek: wordData.example_uzbek || null,
      category: wordData.category || 'custom',
      level: wordData.level || 'A2',
      source: wordData.source || 'manual',
      ai_suggested_translation: wordData.ai_suggested_translation || null,
      box: 1,
      next_review: addDaysTashkent(1),
      is_learned: false,
      correct_count: 0,
      wrong_count: 0,
      fsrs_stability: defaultFSRS.stability,
      fsrs_difficulty: defaultFSRS.difficulty,
      fsrs_reps: 0,
      fsrs_lapses: 0,
      created_at: now,
      updated_at: now,
      part_of_speech: wordData.part_of_speech || null,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('addPersonalWordToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'z qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  if (!data) throw new Error('No data returned')
  return data as PersonalWord
}

export async function updatePersonalWordInDB(
  userId: string,
  wordId: number,
  updates: UpdateWordDTO
): Promise<void> {
  requireAuthedUser(userId)
  const payload: {
    updated_at: string
    english?: string
    uzbek?: string
    phonetic?: string | null
    example?: string | null
    example_uzbek?: string | null
    category?: string
    level?: string
    part_of_speech?: string | null
  } = { updated_at: new Date().toISOString() }
  if (updates.english !== undefined) payload.english = updates.english
  if (updates.uzbek !== undefined) payload.uzbek = updates.uzbek
  if (updates.phonetic !== undefined) payload.phonetic = updates.phonetic
  if (updates.example !== undefined) payload.example = updates.example
  if (updates.example_uzbek !== undefined) payload.example_uzbek = updates.example_uzbek
  if (updates.category !== undefined) payload.category = updates.category
  if (updates.level !== undefined) payload.level = updates.level
  if (updates.part_of_speech !== undefined) payload.part_of_speech = updates.part_of_speech

  const { error } = await supabase
    .from('personal_vocabulary')
    .update(payload)
    .eq('user_id', userId)
    .eq('id', wordId)

  if (error) {
    monitoring.captureMessage('updatePersonalWordInDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zni yangilashda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function deletePersonalWordFromDB(
  userId: string,
  wordId: number
): Promise<void> {
  requireAuthedUser(userId)
  const { error } = await supabase
    .from('personal_vocabulary')
    .delete()
    .eq('user_id', userId)
    .eq('id', wordId)

  if (error) {
    monitoring.captureMessage('deletePersonalWordFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zni o'chirishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function fetchPersonalWordsFromDB(userId: string): Promise<PersonalWord[]> {
  requireAuthedUser(userId)
  const { data, error } = await supabase
    .from('personal_vocabulary')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    monitoring.captureMessage('fetchPersonalWordsFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  return (data ?? []) as PersonalWord[]
}

export async function fetchWordsForReviewFromDB(userId: string): Promise<PersonalWord[]> {
  requireAuthedUser(userId)
  // Tashkent vaqti bilan (next_review ham Tashkent sanasi bilan o'rnatiladi) —
  // aks holda yarim tunda off-by-one bo'lardi.
  const today = getTodayTashkent()

  const { data, error } = await supabase
    .from('personal_vocabulary')
    .select('*')
    .eq('user_id', userId)
    .eq('is_learned', false)
    .lte('next_review', today)
    .order('next_review', { ascending: true })

  if (error) {
    monitoring.captureMessage('fetchWordsForReviewFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  return (data ?? []) as PersonalWord[]
}

export async function fetchPersonalVocabSessionsFromDB(
  userId: string,
  sinceDate: string
): Promise<PersonalVocabSession[]> {
  requireAuthedUser(userId)
  const { data, error } = await supabase
    .from('personal_vocabulary_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', sinceDate)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as PersonalVocabSession[]
}

export async function ratePersonalWordInDB(
  userId: string,
  wordId: number,
  rating: VocabRating
): Promise<PersonalWord> {
  requireAuthedUser(userId)
  // Compute FSRS client-side (our TypeScript algorithm)
  const { data: existing, error: fetchError } = await supabase
    .from('personal_vocabulary')
    .select('fsrs_stability, fsrs_difficulty, next_review, fsrs_reps, fsrs_lapses')
    .eq('user_id', userId)
    .eq('id', wordId)
    .single()

  let fsrsStability: number | undefined
  let fsrsDifficulty: number | undefined
  let fsrsReps: number | undefined
  let fsrsLapses: number | undefined

  if (!fetchError && existing) {
    const fsrsState = computeNextReviewFSRS(
      {
        stability: existing.fsrs_stability ?? 0,
        difficulty: existing.fsrs_difficulty ?? 5,
        due: existing.next_review,
        reps: existing.fsrs_reps ?? 0,
        lapses: existing.fsrs_lapses ?? 0,
      },
      rating
    )
    fsrsStability = fsrsState.state.stability
    fsrsDifficulty = fsrsState.state.difficulty
    fsrsReps = fsrsState.state.reps
    fsrsLapses = fsrsState.state.lapses
  }

  // Atomic RPC call with FSRS params — no race condition on box/score update
  const { data, error } = await supabase.rpc('rate_personal_vocab_word', {
    p_user_id: userId,
    p_word_id: wordId,
    p_rating: rating,
    p_fsrs_stability: fsrsStability ?? null,
    p_fsrs_difficulty: fsrsDifficulty ?? null,
    p_fsrs_reps: fsrsReps ?? null,
    p_fsrs_lapses: fsrsLapses ?? null,
  })

  if (error || !data) {
    monitoring.captureMessage('ratePersonalWordInDB error: ' + (error instanceof Error ? error.message : String(error ?? 'no data')), 'error')
    useToastStore.getState().toast("Baho saqlashda xatolik", 'error')
    throw error instanceof Error ? error : new Error('Rating failed')
  }

  return db.cast<PersonalWord>(data)
}

export async function ratePersonalWordsBatchInDB(
  userId: string,
  ratings: { id: number; rating: VocabRating }[]
): Promise<PersonalWord[]> {
  requireAuthedUser(userId)
  if (ratings.length === 0) return []

  const uniqueRatings = [...new Map(ratings.map((item) => [item.id, item])).values()]
  const ids = uniqueRatings.map((item) => item.id)
  const { data: existing, error: fetchError } = await supabase
    .from('personal_vocabulary')
    .select('id, fsrs_stability, fsrs_difficulty, next_review, fsrs_reps, fsrs_lapses')
    .eq('user_id', userId)
    .in('id', ids)

  if (fetchError) throw fetchError
  const existingById = new Map((existing ?? []).map((word) => [word.id, word]))
  const payload = uniqueRatings.map(({ id, rating }) => {
    const word = existingById.get(id)
    if (!word) throw new Error(`Word not found: ${id}`)
    const fsrs = computeNextReviewFSRS({
      stability: word.fsrs_stability ?? 0,
      difficulty: word.fsrs_difficulty ?? 5,
      due: word.next_review,
      reps: word.fsrs_reps ?? 0,
      lapses: word.fsrs_lapses ?? 0,
    }, rating)
    return {
      word_id: id,
      rating,
      fsrs_stability: fsrs.state.stability,
      fsrs_difficulty: fsrs.state.difficulty,
      fsrs_reps: fsrs.state.reps,
      fsrs_lapses: fsrs.state.lapses,
    }
  })

  const { data, error } = await supabase.rpc('rate_personal_vocab_words_batch', {
    p_user_id: userId,
    p_results: payload,
  })
  if (error) {
    monitoring.captureMessage(`ratePersonalWordsBatchInDB error: ${error.message ?? String(error)}`, 'error')
    useToastStore.getState().toast("Natijalarni saqlashda xatolik", 'error')
    throw error
  }
  return db.cast<PersonalWord[]>(data ?? [])
}

export async function batchAddPersonalWordsToDB(
  userId: string,
  wordsData: AddWordDTO[]
): Promise<PersonalVocabularyImportResult> {
  if (wordsData.length === 0) return { inserted: [], skipped: 0 }
  requireAuthedUser(userId)

  // Filter out duplicates: fetch existing words for this user
  const { data: existing } = await supabase
    .from('personal_vocabulary')
    .select('english')
    .eq('user_id', userId)
  const existingSet = new Set((existing ?? []).map(e => e.english.toLowerCase().trim()))
  const seen = new Set(existingSet)
  const uniqueWords = wordsData.filter((w) => {
    const normalized = w.english.toLowerCase().trim()
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
  const skipped = wordsData.length - uniqueWords.length

  if (uniqueWords.length === 0) {
    useToastStore.getState().toast("Barcha so'zlar allaqachon qo'shilgan", 'warning')
    return { inserted: [], skipped }
  }

  if (skipped > 0) {
    useToastStore.getState().toast(`${skipped} ta dublikat o'tkazib yuborildi`, 'warning')
  }

  const now = new Date().toISOString()
  const wordsToInsert = uniqueWords
  const defaultFSRS = createDefaultFSRSState()
  const rows = wordsToInsert.map((w) => ({
    user_id: userId,
    english: w.english,
    uzbek: w.uzbek,
    phonetic: w.phonetic || null,
    example: w.example || null,
    example_uzbek: w.example_uzbek || null,
    category: w.category || 'custom',
    level: w.level || 'A2',
    source: w.source || 'imported',
    ai_suggested_translation: w.ai_suggested_translation || null,
    box: 1,
    next_review: addDaysTashkent(1),
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    fsrs_stability: defaultFSRS.stability,
    fsrs_difficulty: defaultFSRS.difficulty,
    fsrs_reps: 0,
    fsrs_lapses: 0,
    created_at: now,
    updated_at: now,
    part_of_speech: w.part_of_speech || null,
  }))

  const { data, error } = await supabase
    .from('personal_vocabulary')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(rows as any)
    .select()

  if (error) {
    monitoring.captureMessage('batchAddPersonalWordsToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zlarni qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  return { inserted: (data ?? []) as PersonalWord[], skipped }
}

// ─── AI Translation Helper ────────────────────────────────────────────────

export async function generateAITranslation(
  word: string,
  context?: string
): Promise<{ uzbek: string; phonetic?: string; example?: string; example_uzbek?: string; level?: 'A1' | 'A2' | 'B1' | 'B2'; category?: string; part_of_speech?: string }> {
  try {
    const isCategorySelected = !!context
    const categoryContext = isCategorySelected ? ` related to "${context}"` : ''
    const exampleInstruction = isCategorySelected
      ? `The example sentence MUST be about "${context}". For example, if category is "Food", the sentence must describe food, cooking, eating, restaurants, or groceries. The word "${word}" must be used naturally within that ${context} scenario. DO NOT write a generic sentence that could apply to any category.`
      : 'Create a simple English sentence showing the word in context'
    const prompt = `You are an English-Uzbek dictionary assistant. Translate the English word "${word}"${categoryContext}.

Respond with ONLY a valid JSON object (no markdown, no extra text):
{
  "uzbek": "Uzbek translation",
  "phonetic": "IPA pronunciation if applicable",
  "example": "Example sentence in English using this word",
  "example_uzbek": "Uzbek translation of the example sentence",
  "level": "A1, A2, B1, or B2 based on word difficulty",
  "category": "one of: custom, grammar, travel, formal, ielts, business, food, health, education, social, work, shopping, relationships, environment, economy, culture, feelings, discussion, technology, communication",
  "part_of_speech": "noun, verb, adjective, adverb, preposition, conjunction, pronoun, interjection, or other"
}

Rules:
- uzbek: concise Uzbek translation (1-3 words max)
- phonetic: IPA notation like /ˈwɜːrd/ or empty string if not applicable
- example: ${exampleInstruction}
- example_uzbek: Natural Uzbek translation of the example sentence (grammatically correct, natural sounding)
- level: A1 (basic daily words like cat, go, big), A2 (elementary like comfortable, develop), B1 (intermediate like analyze, significant), B2 (advanced like ambivalent, pragmatic)
- category: most relevant category from the list
- part_of_speech: the grammatical role of the word
- Respond ONLY with the JSON object, nothing else`

    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`AI translation failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content?.[0]?.text ?? data.text ?? '{}'
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { uzbek: '' }
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      uzbek: parsed.uzbek || '',
      phonetic: parsed.phonetic || undefined,
      example: parsed.example || undefined,
      example_uzbek: parsed.example_uzbek || undefined,
      level: parsed.level || undefined,
      category: parsed.category || undefined,
      part_of_speech: parsed.part_of_speech || undefined,
    }
  } catch (e) {
    monitoring.captureMessage('generateAITranslation error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    import('../utils/toastStore').then(({ useToastStore }) => {
      useToastStore.getState().toast('AI tarjima yuklanmadi — qayta urinib ko\'ring', 'warning', 4000)
    }).catch(() => {})
    return { uzbek: '' }
  }
}

// ─── Batch Example Translation ────────────────────────────────────────────

/**
 * AI yordamida mavjud so'zlarning misol gaplarini o'zbekchaga tarjima qiladi.
 * Faqat `example` maydoni bor-u `example_uzbek` maydoni bo'lmagan so'zlar uchun.
 * Har bir so'z alohida AI chaqiruvida, lekin parallel ravishda (5 tadan) ishlanadi.
 */
export async function batchGenerateExampleUzbek(
  userId: string,
  words: PersonalWord[],
  onProgress?: (completed: number, total: number, currentWord: string) => void
): Promise<number> {
  const toTranslate = words.filter(w => w.example && !w.example_uzbek)
  if (toTranslate.length === 0) {
    useToastStore.getState().toast("Tarjima qilish uchun so'zlar topilmadi", 'info')
    return 0
  }

  let completed = 0
  const total = toTranslate.length
  const BATCH_SIZE = 5

  useToastStore.getState().toast(`${total} ta misol gap tarjima qilinmoqda...`, 'info', 4000)

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = toTranslate.slice(i, i + BATCH_SIZE)
    const promises = batch.map(async (word) => {
      try {
        const translation = await translateExampleSentence(word.english, word.example!, word.uzbek)
        if (translation) {
          await updatePersonalWordInDB(userId, word.id, { example_uzbek: translation })
          completed++
          onProgress?.(completed, total, word.english)
          return true
        }
      } catch (e) {
        monitoring.captureMessage(
          `translateExample failed for "${word.english}": ${e instanceof Error ? e.message : String(e)}`,
          'warn'
        )
      }
      return false
    })

    await Promise.allSettled(promises)
  }

  if (completed > 0) {
    useToastStore.getState().toast(`${completed} ta misol gap tarjima qilindi`, 'success')
  } else {
    useToastStore.getState().toast('Hech qanday tarjima amalga oshirilmadi', 'warning')
  }

  return completed
}

/**
 * Bitta misol gapni AI orqali o'zbekchaga tarjima qiladi.
 * Prompt juda aniq va ixcham — faqat tarjima qaytaradi.
 */
async function translateExampleSentence(
  word: string,
  example: string,
  uzbek: string
): Promise<string | null> {
  const prompt = `Translate this English sentence to natural Uzbek.

The word "${word}" means "${uzbek}" in Uzbek.

Sentence: "${example}"

Rules:
- Translate naturally, not word-by-word
- Keep the same meaning
- Use natural Uzbek grammar
- Respond with ONLY the Uzbek translation, nothing else`

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`AI translation failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text ?? data.text ?? ''
  const translation = content.replace(/^["']|["']$/g, '').trim()

  return translation || null
}

// ─── Import/Export ─────────────────────────────────────────────────────────

export function exportPersonalVocabulary(words: PersonalWord[]): string {
  const exportData = words.map((w) => ({
    english: w.english,
    uzbek: w.uzbek,
    phonetic: w.phonetic,
    example: w.example,
    example_uzbek: w.example_uzbek,
    part_of_speech: w.part_of_speech,
    category: w.category,
    level: w.level,
  }))
  return JSON.stringify(exportData, null, 2)
}

export function importPersonalVocabulary(jsonString: string): AddWordDTO[] {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) throw new Error('Invalid format')
    const categories = new Set([
      'custom', 'grammar', 'travel', 'formal', 'ielts', 'business', 'food',
      'health', 'education', 'social', 'work', 'shopping', 'relationships',
      'environment', 'economy', 'culture', 'feelings', 'discussion',
      'technology', 'communication',
    ])
    const levels = new Set(['A1', 'A2', 'B1', 'B2'])
    const partsOfSpeech = new Set([
      'noun', 'verb', 'adjective', 'adverb', 'preposition',
      'conjunction', 'pronoun', 'interjection', 'other',
    ])
    return data
      .map((item: Record<string, unknown>) => {
        const category = String(item.category || 'custom')
        const level = String(item.level || 'A2')
        const partOfSpeech = item.part_of_speech ? String(item.part_of_speech) : ''
        return {
          english: String(item.english || '').trim().slice(0, 200),
          uzbek: String(item.uzbek || '').trim().slice(0, 500),
          phonetic: item.phonetic ? String(item.phonetic).slice(0, 200) : undefined,
          example: item.example ? String(item.example).slice(0, 2000) : undefined,
          example_uzbek: item.example_uzbek ? String(item.example_uzbek).slice(0, 2000) : undefined,
          part_of_speech: partsOfSpeech.has(partOfSpeech) ? partOfSpeech as PartOfSpeech : undefined,
          category: categories.has(category) ? category as AddWordDTO['category'] : 'custom',
          level: levels.has(level) ? level as AddWordDTO['level'] : 'A2',
          source: 'imported' as const,
        }
      })
      // Bo'sh english/uzbek bo'lgan yozuvlarni o'tkazib yuboramiz
      .filter((w) => w.english.length > 0 && w.uzbek.length > 0)
  } catch (e) {
    monitoring.captureMessage('importPersonalVocabulary error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return []
  }
}
