/**
 * UUID Resolver
 *
 * Maps contentTree codes (e.g. "M01", "M01.01") to database UUIDs.
 */
import { typedSupabase } from './supabase'
import { monitoring } from './monitoring'

type CacheEntry = { id: string; fetchedAt: number }
const CACHE_TTL = 600_000 // 10 min
const moduleCache = new Map<string, CacheEntry>()
const lessonCache = new Map<string, CacheEntry>()

function isFresh(entry: CacheEntry | undefined): entry is CacheEntry {
  return entry !== undefined && Date.now() - entry.fetchedAt < CACHE_TTL
}

/**
 * Resolve a module code (e.g. "M01") to its UUID in the `modules` table.
 */
export async function resolveModuleUuid(code: string): Promise<string | null> {
  const cached = moduleCache.get(code)
  if (isFresh(cached)) return cached.id

  const { data, error } = await typedSupabase
    .from('modules')
    .select('id')
    .eq('code', code)
    .maybeSingle()

  if (error || !data) {
    monitoring.captureMessage(
      `Module '${code}' not found: ${error?.message ?? 'no data'}`,
      'warn'
    )
    return null
  }

  moduleCache.set(code, { id: data.id, fetchedAt: Date.now() })
  return data.id
}

/**
 * Resolve a subtopic/lesson code (e.g. "M01.01") to its UUID in the `lessons` table.
 */
export async function resolveLessonUuid(subtopicCode: string): Promise<string | null> {
  const cached = lessonCache.get(subtopicCode)
  if (isFresh(cached)) return cached.id

  const baseSlug = subtopicCode.toLowerCase().replace('.', '-')

  // Strategy 1: exact slug match
  const { data: exact } = await typedSupabase
    .from('lessons')
    .select('id')
    .eq('slug', baseSlug)
    .maybeSingle()

  if (exact) {
    lessonCache.set(subtopicCode, { id: exact.id, fetchedAt: Date.now() })
    return exact.id
  }

  // Strategy 2: title_uz contains the subtopic code
  const { data: byCode } = await typedSupabase
    .from('lessons')
    .select('id')
    .ilike('title_uz', `${subtopicCode}%`)
    .limit(1)
    .maybeSingle()

  if (byCode) {
    lessonCache.set(subtopicCode, { id: byCode.id, fetchedAt: Date.now() })
    return byCode.id
  }

  // Strategy 3: slug starts with base slug
  const { data: bySlug } = await typedSupabase
    .from('lessons')
    .select('id, slug')
    .ilike('slug', `${baseSlug}%`)
    .limit(1)
    .maybeSingle()

  if (bySlug) {
    lessonCache.set(subtopicCode, { id: bySlug.id, fetchedAt: Date.now() })
    return bySlug.id
  }

  monitoring.captureMessage(
    `Lesson for '${subtopicCode}' not found (tried slug=${baseSlug})`,
    'warn'
  )
  return null
}
