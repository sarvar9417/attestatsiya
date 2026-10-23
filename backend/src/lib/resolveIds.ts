/**
 * UUID Resolver (Backend)
 *
 * Maps contentTree codes (e.g. "M01", "M01.01") to database UUIDs.
 * The frontend uses human-readable codes; Supabase RPCs expect UUIDs.
 * This bridge avoids coupling the contentTree to database PKs.
 *
 * @note Uses the admin supabase client (not user-scoped) since
 *       modules and lessons are public read-only data.
 */

import { supabase } from './supabase.js'

type CacheEntry = { id: string; fetchedAt: number }
const CACHE_TTL = 600_000 // 10 min
const moduleCache = new Map<string, CacheEntry>()
const lessonCache = new Map<string, CacheEntry>()

function isFresh(entry: CacheEntry | undefined): entry is CacheEntry {
  return entry !== undefined && Date.now() - entry.fetchedAt < CACHE_TTL
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Resolve a module code (e.g. "M01") to its UUID in the `modules` table.
 * Returns the input unchanged if it's already a valid UUID.
 */
export async function resolveModuleUuid(code: string): Promise<string | null> {
  if (UUID_RE.test(code)) return code // already a UUID

  const cached = moduleCache.get(code)
  if (isFresh(cached)) return cached.id

  const { data, error } = await supabase
    .from('modules')
    .select('id')
    .eq('code', code)
    .maybeSingle()

  if (error || !data) {
    console.warn(`[resolveIds] Module '${code}' not found:`, error?.message ?? 'no data')
    return null
  }

  moduleCache.set(code, { id: data.id, fetchedAt: Date.now() })
  return data.id
}

/**
 * Resolve a subtopic/lesson code (e.g. "M01.01") to its UUID in the `lessons` table.
 * Returns the input unchanged if it's already a valid UUID.
 * Tries strategies: exact slug match → slug prefix match
 */
export async function resolveLessonUuid(subtopicCode: string): Promise<string | null> {
  if (UUID_RE.test(subtopicCode)) return subtopicCode // already a UUID

  const cached = lessonCache.get(subtopicCode)
  if (isFresh(cached)) return cached.id

  // Only M05 Sanoq systems and existing M14–M16 professional lessons have human-readable
  // slugs, not m05-01 style slugs. Resolve the *published* lesson by its
  // module + ordinal so topic tests, study previews and progress all agree.
  // Never silently fall through to a legacy/draft lesson for these modules.
  const canonicalMatch = /^(M(?:02|04|05|1[456]))\.(0[1-9]|[1-9][0-9])$/.exec(subtopicCode.toUpperCase())
  if (canonicalMatch) {
    // M02 has exactly four canonical published lessons; never route M02.05–09 to archived lessons.
    if (canonicalMatch[1] === 'M02' && Number(canonicalMatch[2]) > 4) return null
    const moduleId = await resolveModuleUuid(canonicalMatch[1])
    if (moduleId) {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('order_idx', Number(canonicalMatch[2]))
        .eq('status', 'published')
        .maybeSingle()
      if (!error && lesson) {
        lessonCache.set(subtopicCode, { id: lesson.id, fetchedAt: Date.now() })
        return lesson.id
      }
    }
    console.warn(`[resolveIds] Canonical lesson '${subtopicCode}' not found`)
    return null
  }

  // Manually vetted chapter→published lesson links, backed by the
  // exact topic titles and active published source records. Never derive this
  // mapping from ordinals: several modules contain both legacy and V2 editions.
  // Deliberately exclude many-to-one and only partially matching chapters.
  const publishedTopicSlugs: Record<string, string> = {
    'M03.01': 'office-v2-w01', // Word interface, create/edit
    'M03.02': 'office-v2-w02', // Word formatting
    'M03.03': 'office-v2-w03', // Word objects
    'M03.04': 'office-v2-e01', // Excel data/workbook structure
    'M03.05': 'excel-formulalar-va-funksiyalar',
    'M03.06': 'excel-filtr-saralash-diagramma',
    'M03.08': 'office-v2-p01', // PowerPoint design
    'M03.10': 'office-v2-p02', // PowerPoint animation/transitions
    'M09.01': 'malumotlar-bazasi-va-mbbt-asoslari',
    'M09.03': 'kalitlar-va-jadvallarni-boglash',
    'M10.01': 'kompyuter-grafikasi-turlari',
    'M10.02': 'paint-va-photoshop-asoslari',
    'M11.02': 'html-matn-rasm-royxat',
    'M11.03': 'html-jadval-va-forma',
    'M12.03': 'arxitektura-va-topologiyalar',
    'M12.05': 'ip-manzil-va-tarmoq-maskasi',
  }
  const publishedSlug = publishedTopicSlugs[subtopicCode.toUpperCase()]
  if (publishedSlug) {
    // The slug is exact and publication-gated; no archived/draft fallback.
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('id')
      .eq('slug', publishedSlug)
      .eq('status', 'published')
      .maybeSingle()
    if (error || !lesson) return null
    lessonCache.set(subtopicCode, { id: lesson.id, fetchedAt: Date.now() })
    return lesson.id
  }

  const baseSlug = subtopicCode.toLowerCase().replace('.', '-')

  // Strategy 1: exact slug match
  const { data: exact } = await supabase
    .from('lessons')
    .select('id')
    .eq('slug', baseSlug)
    .maybeSingle()

  if (exact) {
    lessonCache.set(subtopicCode, { id: exact.id, fetchedAt: Date.now() })
    return exact.id
  }

  // Strategy 2: title_uz starts with the subtopic code (e.g. "M01.01")
  const { data: byCode } = await supabase
    .from('lessons')
    .select('id')
    .ilike('title_uz', `${subtopicCode}%`)
    .limit(1)
    .maybeSingle()

  if (byCode) {
    lessonCache.set(subtopicCode, { id: byCode.id, fetchedAt: Date.now() })
    return byCode.id
  }

  // Strategy 3: slug starts with the base slug
  const { data: bySlug } = await supabase
    .from('lessons')
    .select('id')
    .ilike('slug', `${baseSlug}%`)
    .limit(1)
    .maybeSingle()

  if (bySlug) {
    lessonCache.set(subtopicCode, { id: bySlug.id, fetchedAt: Date.now() })
    return bySlug.id
  }

  console.warn(`[resolveIds] Lesson for '${subtopicCode}' not found (tried slug=${baseSlug})`)
  return null
}
