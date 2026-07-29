import { supabase } from '../lib/supabase'

export interface DictWord {
  word_id:       number
  english:       string
  uzbek:         string
  level:         string
  example:       string
  phonetic:      string
  box:           number | null
  is_learned:    boolean | null
  correct_count: number | null
  wrong_count:   number | null
  source:        'system' | 'user'
}

export interface DictSearchResult {
  words: DictWord[]
  total: number
}

async function attachProgress(
  words: { id: number }[],
  userId?: string,
): Promise<Map<number, { box: number; is_learned: boolean; correct_count: number; wrong_count: number }>> {
  const map = new Map()
  if (!userId || words.length === 0) return map
  const ids = words.map((w) => w.id)
  const chunkSize = 200
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    const { data: progress } = await supabase
      .from('vocabulary_progress')
      .select('word_id, box, is_learned, correct_count, wrong_count')
      .eq('user_id', userId)
      .in('word_id', chunk)
    if (progress) {
      for (const p of progress) map.set(p.word_id, p)
    }
  }
  return map
}

function toDictWord(
  w: { id: number; english: string; uzbek: string; level: string; example: string | null; phonetic: string | null },
  p?: { box: number; is_learned: boolean; correct_count: number; wrong_count: number },
  source: 'system' | 'user' = 'system',
): DictWord {
  return {
    word_id:       w.id,
    english:       w.english,
    uzbek:         w.uzbek,
    level:         w.level,
    example:       w.example ?? '',
    phonetic:      w.phonetic ?? '',
    box:           p?.box ?? null,
    is_learned:    p?.is_learned ?? null,
    correct_count: p?.correct_count ?? null,
    wrong_count:   p?.wrong_count ?? null,
    source,
  }
}

export async function fetchWordList(
  userId?: string,
  level?: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<DictSearchResult> {
  const [systemRes, userRes] = await Promise.all([
    fetchSystemWords(level, page, pageSize),
    userId ? fetchUserWords(userId, level) : Promise.resolve([]),
  ])

  const progressMap = await attachProgress(
    systemRes.words.map((w) => ({ id: w.word_id })),
    userId,
  )

  const system = systemRes.words.map((w) => toDictWord(
    { id: w.word_id, english: w.english, uzbek: w.uzbek, level: w.level, example: w.example, phonetic: w.phonetic },
    progressMap.get(w.word_id),
    'system',
  ))

  const words = [...system, ...userRes]
  return { words, total: systemRes.total }
}

async function fetchSystemWords(level?: string, page: number = 1, pageSize: number = 20): Promise<{ words: { word_id: number; english: string; uzbek: string; level: string; example: string; phonetic: string }[]; total: number }> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let q = supabase
    .from('words')
    .select('id, english, uzbek, level, example, phonetic', { count: 'exact' })
    .order('level')
    .order('english')
    .range(from, to)

  if (level) q = q.eq('level', level)

  const { data, count } = await q
  const words = (data ?? []).map((w) => ({
    word_id: w.id,
    english: w.english,
    uzbek: w.uzbek,
    level: w.level,
    example: w.example ?? '',
    phonetic: w.phonetic ?? '',
  }))
  return { words, total: count ?? words.length }
}

async function fetchUserWords(userId: string, level?: string): Promise<DictWord[]> {
  let q = supabase
    .from('user_words')
    .select('id, english, uzbek, level, example, phonetic')
    .eq('user_id', userId)
    .order('english')

  if (level) q = q.eq('level', level)

  const { data } = await q
  return (data ?? []).map((w) => toDictWord(
    { id: w.id, english: w.english, uzbek: w.uzbek, level: w.level, example: w.example, phonetic: w.phonetic },
    undefined,
    'user',
  ))
}

export async function searchDictionary(
  query: string,
  userId?: string,
  level?: string,
): Promise<DictSearchResult> {
  if (!query.trim()) return { words: [], total: 0 }

  const term = `%${query}%`

  const [systemRes, userRes] = await Promise.all([
    fetchSystemWordsSearch(term, level),
    userId ? fetchUserWordsSearch(userId, term, level) : Promise.resolve([]),
  ])

  const progressMap = await attachProgress(
    systemRes.words.map((w) => ({ id: w.word_id })),
    userId,
  )

  const system = systemRes.words.map((w) => toDictWord(
    { id: w.word_id, english: w.english, uzbek: w.uzbek, level: w.level, example: w.example, phonetic: w.phonetic },
    progressMap.get(w.word_id),
    'system',
  ))

  const words = [...system, ...userRes]
  return { words, total: words.length }
}

async function fetchSystemWordsSearch(term: string, level?: string): Promise<{ words: { word_id: number; english: string; uzbek: string; level: string; example: string; phonetic: string }[] }> {
  let q = supabase
    .from('words')
    .select('id, english, uzbek, level, example, phonetic')
    .or(`english.ilike.${term},uzbek.ilike.${term}`)
    .order('english')

  if (level) q = q.eq('level', level)

  const { data } = await q
  const words = (data ?? []).map((w) => ({
    word_id: w.id,
    english: w.english,
    uzbek: w.uzbek,
    level: w.level,
    example: w.example ?? '',
    phonetic: w.phonetic ?? '',
  }))
  return { words }
}

async function fetchUserWordsSearch(userId: string, term: string, level?: string): Promise<DictWord[]> {
  let q = supabase
    .from('user_words')
    .select('id, english, uzbek, level, example, phonetic')
    .eq('user_id', userId)
    .or(`english.ilike.${term},uzbek.ilike.${term}`)
    .order('english')

  if (level) q = q.eq('level', level)

  const { data } = await q
  return (data ?? []).map((w) => toDictWord(
    { id: w.id, english: w.english, uzbek: w.uzbek, level: w.level, example: w.example, phonetic: w.phonetic },
    undefined,
    'user',
  ))
}

export async function addUserWord(
  userId: string,
  word: { english: string; uzbek: string; level: string; example?: string; phonetic?: string },
): Promise<{ success: boolean; word?: DictWord; error?: string }> {
  const { data: existing } = await supabase
    .from('user_words')
    .select('id')
    .eq('user_id', userId)
    .eq('english', word.english.trim())
    .maybeSingle()

  if (existing) {
    return { success: false, error: `"${word.english}" allaqachon shaxsiy lug'atingizda mavjud` }
  }

  const { data, error } = await supabase
    .from('user_words')
    .insert({
      user_id: userId,
      english: word.english.trim(),
      uzbek: word.uzbek.trim(),
      level: word.level,
      example: word.example?.trim() ?? '',
      phonetic: word.phonetic?.trim() ?? '',
    })
    .select()
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Saqlashda xatolik" }
  }

  return {
    success: true,
    word: toDictWord(
      { id: data.id, english: data.english, uzbek: data.uzbek, level: data.level, example: data.example, phonetic: data.phonetic },
      undefined,
      'user',
    ),
  }
}

export async function deleteUserWord(
  userId: string,
  wordId: number,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('user_words')
    .delete()
    .eq('id', wordId)
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
