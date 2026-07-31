/**
 * M01 seed SQL generator
 *
 * src/data/topics/m01.ts (783 blok, 400 savol) ni idempotent SQL
 * migratsiyaga o'giradi:
 *   - 12 ta lesson → lessons.blocks (jsonb) + blocks_kind
 *   - 400 ta savol → questions + question_options + question_keys
 *
 * Deterministik UUID'lar: UUIDv5 (project namespace + manba identifikator).
 * Qayta generatsiya:  npx tsx scripts/gen_m01_seed_sql.ts
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { M01_CONTENT } from '../src/data/topics/m01.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const NAMESPACE = '9f4b1c3e-2a7d-4e8b-9c1f-5d6e7a8b9c0d'

// ─── UUIDv5 ────────────────────────────────────────────────────────
function uuidv5(name: string): string {
  const ns = Buffer.from(NAMESPACE.replace(/-/g, ''), 'hex')
  const hash = createHash('sha1').update(ns).update(Buffer.from(name, 'utf8')).digest()
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  const hex = hash.subarray(0, 16).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// ─── SQL escaping ──────────────────────────────────────────────────
function sqlStr(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function jsonb(value: unknown): string {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
}

// ─── Subtopic → construct mapping ─────────────────────────────────
const CONSTRUCT_MAP: Record<string, string[]> = {
  'M01.02': ['S1.INFO.01'],
  'M01.03': ['S1.INFO.02'],
  'M01.04': ['S1.INFO.07'],
  'M01.05': ['S1.INFO.03', 'S1.INFO.04'],
  'M01.06': ['S1.INFO.03'],
  'M01.07': ['S1.INFO.05'],
}

function slugOf(subtopicId: string): string {
  return `m01-${subtopicId.split('.')[1]}`
}

// ─── Lessons ──────────────────────────────────────────────────────
function lessonInserts(): string[] {
  const rows: string[] = []
  const updates: string[] = []
  const links: string[] = []

  let idx = 0
  for (const [subtopicId, topic] of Object.entries(M01_CONTENT)) {
    idx++
    const id = uuidv5(`lesson:${subtopicId}`)
    const slug = slugOf(subtopicId)
    const kind = topic.kind === 'appendix' ? 'appendix' : 'chapter'

    rows.push(
      `  (${sqlStr(id)}::uuid, ${idx}, ${sqlStr(slug)}, ${sqlStr(topic.title)}, ${jsonb(topic.theory)}, ${sqlStr(kind)}, 15, 'published'::public.content_status)`
    )
    updates.push(
      `    blocks = excluded.blocks, blocks_kind = excluded.blocks_kind, title_uz = excluded.title_uz, est_minutes = excluded.est_minutes, status = excluded.status, updated_at = now()`
    )

    for (const code of CONSTRUCT_MAP[subtopicId] ?? []) {
      links.push(
        `insert into public.lesson_constructs (lesson_id, construct_id)
select l.id, c.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
  cross join public.constructs c
 where m.code = 'M01' and l.slug = ${sqlStr(slug)} and c.code = ${sqlStr(code)}
on conflict (lesson_id, construct_id) do nothing;`
      )
    }
  }

  return [
    `insert into public.lessons (id, module_id, order_idx, slug, title_uz, blocks, blocks_kind, est_minutes, status)
select v.id, m.id, v.order_idx, v.slug, v.title_uz, v.blocks, v.blocks_kind, v.est_minutes, v.status
  from public.modules m
  cross join (values
${rows.join(',\n')}
  ) as v(id, order_idx, slug, title_uz, blocks, blocks_kind, est_minutes, status)
 where m.code = 'M01'
on conflict (module_id, slug) do update set
  ${updates[0]};`,
    ...links,
  ]
}

// ─── Questions ────────────────────────────────────────────────────
function questionInsertsFull(): string[] {
  const qRows: string[] = []
  const optRows: string[] = []
  const keyRows: string[] = []
  const linkRows: string[] = []
  let qCount = 0
  let optCount = 0

  for (const [subtopicId, topic] of Object.entries(M01_CONTENT)) {
    const constructCode = (CONSTRUCT_MAP[subtopicId] ?? [])[0]
    const lessonId = uuidv5(`lesson:${subtopicId}`)
    if (!constructCode) continue

    for (const q of topic.questions) {
      const qId = uuidv5(`question:${q.id}`)
      const correctOptionId = uuidv5(`option:${q.id}:${q.correctIndex}`)

      qRows.push(
        `insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, assets, is_generated, status, source_reference)
values (${sqlStr(qId)}, (select id from public.subjects where code = 'informatika'),
        (select id from public.constructs where code = ${sqlStr(constructCode)}),
        'S1.INFO', 'Y1'::public.question_format, 'bilish'::public.cognitive_level, 3,
        ${sqlStr(q.text)}, '[]'::jsonb, false, 'published'::public.content_status, ${sqlStr(q.id)})
on conflict (id) do nothing;`
      )

      q.options.forEach((opt, i) => {
        optRows.push(
          `insert into public.question_options (id, question_id, side, order_idx, content_md)
values (${sqlStr(uuidv5(`option:${q.id}:${i}`))}, ${sqlStr(qId)}, 'a', ${i}, ${sqlStr(opt)})
on conflict (id) do nothing;`
        )
        optCount++
      })

      keyRows.push(
        `insert into public.question_keys (question_id, payload, explanation_md)
values (${sqlStr(qId)}, ${jsonb({ correct_option_id: correctOptionId })}, ${sqlStr(q.explanation)})
on conflict (question_id) do nothing;`
      )

      linkRows.push(
        `update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = ${sqlStr(slugOf(subtopicId))}
   and q.id = ${sqlStr(qId)}
   and q.source_lesson_id is distinct from l.id;`
      )
      qCount++
    }
  }

  console.log(`[gen_m01_seed_sql] questions=${qCount} options=${optCount}`)
  return [...qRows, ...optRows, ...keyRows, ...linkRows]
}

// ─── Verify block integrity ───────────────────────────────────────
function verifyBlocks(): void {
  let total = 0
  const types = new Map<string, number>()
  for (const topic of Object.values(M01_CONTENT)) {
    for (const b of topic.theory) {
      total++
      types.set(b.type, (types.get(b.type) ?? 0) + 1)
    }
  }
  console.log(`[gen_m01_seed_sql] topics=${Object.keys(M01_CONTENT).length} blocks=${total} types=${JSON.stringify(Object.fromEntries(types))}`)
}

// ─── Migration assembly ───────────────────────────────────────────
function buildMigration(): string {
  verifyBlocks()
  const lessonParts = lessonInserts()
  const questionParts = questionInsertsFull()

  return `-- M01 "Axborot va raqamli savodxonlik" kontentini DB ga ko'chirish
--
-- Manba: src/data/topics/m01.ts (LaTeX qo'llanmadan generatsiya qilingan).
-- Ushbu fayl AVTOMATIK generatsiya qilinadi:
--   npx tsx scripts/gen_m01_seed_sql.ts
-- Qo'lda tahrirlamang.
--
-- lessons.blocks — structured theory bloklari (kalitsiz, learner uchun xavfsiz).
-- questions/question_options/question_keys — published savollar;
--   question_keys RLS bilan faqat staff (va o'z exam'idagi savollar) ko'radi.

begin;

-- ─── Schema: lessons ga structured blocks ─────────────────────────
alter table public.lessons
  add column if not exists blocks jsonb not null default '[]'::jsonb;

alter table public.lessons
  add column if not exists blocks_kind text not null default 'chapter'
  check (blocks_kind in ('chapter', 'appendix'));

-- ─── M01 darslari (12) ────────────────────────────────────────────
${lessonParts[0]}

${lessonParts.slice(1).join('\n\n')}

-- ─── M01 savollari (400) ──────────────────────────────────────────
${questionParts.join('\n\n')}

commit;
`
}

const outPath = path.resolve(__dirname, '../supabase/migrations/20260731000012_m01_content_seed.sql')
const linkMigrationPath = path.resolve(__dirname, '../supabase/migrations/20260731000015_m01_source_lesson_backfill.sql')

const mainSql = buildMigration()
writeFileSync(outPath, mainSql, 'utf8')
console.log(`[gen_m01_seed_sql] written ${outPath}`)

const questionParts = questionInsertsFull()
const linkSql = questionParts.filter(p => p.startsWith('update public.questions')).join('\n')

const linkMigration = `-- 000014 da backfill bo'sh ketgan (generator filter bug'i tuzatilgandan keyin).
-- 000014 append-only qoladi; to'ldirish ushbu forward-fix migratsiyada.

begin;

${linkSql}

commit;
`
writeFileSync(linkMigrationPath, linkMigration, 'utf8')
console.log(`[gen_m01_seed_sql] written ${linkMigrationPath}`)
