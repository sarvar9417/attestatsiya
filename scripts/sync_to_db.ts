#!/usr/bin/env tsx
/**
 * DB Sync Script (Management API versiyasi)
 * ===========================================
 * Frontend static kontentni Supabase PostgreSQL ga sinxronlashtiradi.
 * Supabase Management API (sbp_ kaliti) orqali ishlaydi.
 *
 * Ishga tushirish:
 *   npm run db:sync
 *
 * Idempotent: qayta ishga tushirish xavfsiz (ON CONFLICT DO NOTHING / source_reference orqali dedup)
 *
 * Ma'lumotlar manbai:
 *   - src/data/contentTree.ts → modullar + subtopiclar
 *   - src/data/topicContent.ts → nazariy bloklar + test savollari
 *
 * Ma'lumotlar manzili:
 *   - public.lessons (117 ta dars)
 *   - public.lesson_constructs (dars ↔ konstrukt bog'lanishi)
 *   - public.questions (420+ savol)
 *   - public.question_options (variantlar A/B/C/D)
 *   - public.question_keys (javob kalitlari + izoh)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// ─── Config ───────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

// .env ni yuklash
const envPath = path.join(PROJECT_ROOT, '.env')
const backendEnvPath = path.join(PROJECT_ROOT, 'backend', '.env')
if (fs.existsSync(envPath)) dotenv.config({ path: envPath })
if (fs.existsSync(backendEnvPath)) dotenv.config({ path: backendEnvPath, override: true })

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)!.replace(/\/$/, '')
const MGMT_KEY = process.env.SUPABASE_SERVICE_KEY

// Project refni URL dan ajratib olish
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
const MGMT_API = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

if (!SUPABASE_URL || !MGMT_KEY || !PROJECT_REF) {
  console.error('❌ SUPABASE_URL va SUPABASE_SERVICE_KEY kerak!')
  console.error('   .env da VITE_SUPABASE_URL va backend/.env da SUPABASE_SERVICE_KEY bo\'lishi kerak')
  process.exit(1)
}

// ─── SQL Executor ─────────────────────────────────────────────────
async function sql(query: string): Promise<any[]> {
  const res = await fetch(MGMT_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MGMT_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)')
    throw new Error(`SQL xatolik (${res.status}): ${body.substring(0, 300)}`)
  }

  const result = await res.json()
  return result || []
}

// ─── Helpers ──────────────────────────────────────────────────────
function quote(val: string): string {
  // PostgreSQL: standard_conforming_strings=on (PG 14+), backslash literal
  // Single quote'ni double qilish kifoya
  return `'${(val || '').replace(/'/g, "''")}'`
}

function jsonb(val: any): string {
  return quote(JSON.stringify(val))
}

// ─── 1. Parse contentTree.ts ──────────────────────────────────────
interface Subtopic {
  id: string
  title: string
}

interface Module {
  id: string
  code: string
  title: string
  subtopics: Subtopic[]
}

interface AllSubtopics {
  [subtopicId: string]: {
    moduleCode: string
    title: string
  }
}

function parseContentTree(): { modules: Module[]; allSubtopics: AllSubtopics } {
  const filePath = path.join(PROJECT_ROOT, 'src', 'data', 'contentTree.ts')
  const content = fs.readFileSync(filePath, 'utf-8')

  const modules: Module[] = []
  const allSubtopics: AllSubtopics = {}

  const modulePattern = /id:\s*'([^']+)',\s*code:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',/g
  let modMatch: RegExpExecArray | null

  while ((modMatch = modulePattern.exec(content)) !== null) {
    const modCode = modMatch[2]
    const modTitle = modMatch[3]

    const subtopicsStart = content.indexOf('subtopics: [', modMatch.index)
    if (subtopicsStart === -1) continue

    const subtopicsEnd = content.indexOf(']', subtopicsStart + 12)
    if (subtopicsEnd === -1) continue

    const subtopicsBlock = content.substring(subtopicsStart + 12, subtopicsEnd)
    const subtopicPattern = /{ id:\s*'([^']+)',\s*title:\s*'([^']+)'\s*}/g
    const subtopics: Subtopic[] = []
    let stMatch: RegExpExecArray | null

    while ((stMatch = subtopicPattern.exec(subtopicsBlock)) !== null) {
      subtopics.push({ id: stMatch[1], title: stMatch[2] })
      allSubtopics[stMatch[1]] = { moduleCode: modCode, title: stMatch[2] }
    }

    modules.push({ id: modCode, code: modCode, title: modTitle, subtopics })
  }

  console.log(`📖 contentTree.ts: ${modules.length} modul, ${Object.keys(allSubtopics).length} subtopic`)
  return { modules, allSubtopics }
}

// ─── 2. Parse topicContent.ts ────────────────────────────────────
interface TheoryBlock {
  type: string
  content: string
}

interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  type: string
}

interface TopicContent {
  subtopicId: string
  title: string
  theory: TheoryBlock[]
  questions: Question[]
}

function formatTheoryAsMarkdown(theory: TheoryBlock[]): string {
  return theory.map(block => {
    switch (block.type) {
      case 'definition':
        return `> **Ta'rif:** ${block.content}\n`
      case 'text':
        return `${block.content}\n`
      case 'table':
        return `${block.content}\n`
      case 'formula':
        return `\`\`\`\n${block.content}\n\`\`\`\n`
      case 'code':
        return `\`\`\`${(block as any).language || 'text'}\n${block.content}\n\`\`\`\n`
      case 'example':
        return `**Misol:**\n${block.content}\n`
      case 'note':
        return `> 💡 ${block.content}\n`
      default:
        return `${block.content}\n`
    }
  }).join('\n')
}

function parseTopicContent(): Map<string, TopicContent> {
  const filePath = path.join(PROJECT_ROOT, 'src', 'data', 'topicContent.ts')
  const content = fs.readFileSync(filePath, 'utf-8')
  const result = new Map<string, TopicContent>()

  // Match double-quoted entries (M01-M03)
  const entryPattern = /['"](M\d{2}\.\d{2})['"]\s*:\s*t\s*\(\s*['"]([^'"]+)['"],\s*\[([\s\S]*?)\],\s*\[([\s\S]*?)\]\)/g
  let match: RegExpExecArray | null

  while ((match = entryPattern.exec(content)) !== null) {
    const subtopicId = match[1]
    const title = match[2]
    const theoryBlock = match[3]
    const questionsBlock = match[4]

    // Parse theory blocks
    const theory: TheoryBlock[] = []

    // Try both single and double quote patterns
    const theoryRe1 = /\{\s*type:\s*['"]([^'"]+)['"],\s*content:\s*['"]((?:[^'\\]|\\.)*?)['"]/g
    const theoryRe2 = /\{\s*type:\s*"([^"]+)",\s*content:\s*"((?:[^"\\]|\\.)*?)"/g

    let tMatch: RegExpExecArray | null
    while ((tMatch = theoryRe1.exec(theoryBlock)) !== null) {
      const content = tMatch[2].replace(/\\'/g, "'").replace(/\\n/g, '\n').replace(/\\"/g, '"')
      if (!theory.some(t => t.type === tMatch[1] && t.content.substring(0, 30) === content.substring(0, 30))) {
        theory.push({ type: tMatch[1], content })
      }
    }
    while ((tMatch = theoryRe2.exec(theoryBlock)) !== null) {
      const content = tMatch[2].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\'/g, "'")
      if (!theory.some(t => t.type === tMatch[1] && t.content.substring(0, 30) === content.substring(0, 30))) {
        theory.push({ type: tMatch[1], content })
      }
    }

    // Parse questions
    const questions: Question[] = []

    const qRe1 = /\{\s*id:\s*['"]([^'"]+)['"],\s*text:\s*['"]((?:[^'\\]|\\.)*?)['"],\s*options:\s*\[(.*?)\],\s*correctIndex:\s*(\d+),\s*explanation:\s*['"]((?:[^'\\]|\\.)*?)['"],\s*type:\s*['"]([^'"]+)['"]/g
    const qRe2 = /\{\s*id:\s*"([^"]+)",\s*text:\s*"((?:[^"\\]|\\.)*?)",\s*options:\s*\[(.*?)\],\s*correctIndex:\s*(\d+),\s*explanation:\s*"((?:[^"\\]|\\.)*?)",\s*type:\s*"([^"]+)"/g

    let qMatch: RegExpExecArray | null
    while ((qMatch = qRe1.exec(questionsBlock)) !== null) {
      const opts = qMatch[3].match(/['"]([^'"]+)['"]/g)?.map(o => o.replace(/['"]/g, '')) || []
      questions.push({
        id: qMatch[1],
        text: qMatch[2].replace(/\\'/g, "'"),
        options: opts,
        correctIndex: parseInt(qMatch[4]),
        explanation: qMatch[5].replace(/\\'/g, "'"),
        type: qMatch[6],
      })
    }
    while ((qMatch = qRe2.exec(questionsBlock)) !== null) {
      if (!questions.some(q => q.id === qMatch[1])) {
        const opts = qMatch[3].match(/"[^"]+"/g)?.map(o => o.replace(/"/g, '')) || []
        questions.push({
          id: qMatch[1],
          text: qMatch[2].replace(/\\"/g, '"'),
          options: opts,
          correctIndex: parseInt(qMatch[4]),
          explanation: qMatch[5].replace(/\\"/g, '"'),
          type: qMatch[6],
        })
      }
    }

    result.set(subtopicId, { subtopicId, title, theory, questions })
  }

  let totalQ = 0
  for (const [, tc] of result) totalQ += tc.questions.length
  console.log(`📖 topicContent.ts: ${result.size} subtopic, ${totalQ} savol`)

  return result
}

// ─── 3. Construct Mapping ─────────────────────────────────────────
const SUBTOPIC_TO_CONSTRUCT: Record<string, string[]> = {
  'M01.01': ['S1.INFO.01'], 'M01.02': ['S1.INFO.02'],
  'M01.03': ['S1.INFO.03'], 'M01.04': ['S1.INFO.03'],
  'M01.05': ['S1.INFO.04', 'S1.INFO.05'], 'M01.06': ['S1.INFO.05', 'S1.INFO.06'],
  'M01.07': ['S1.INFO.03'], 'M01.08': ['S1.INFO.07'], 'M01.09': ['S1.INFO.07'],
  'M02.01': ['S2.HW.01'], 'M02.02': ['S2.HW.01'], 'M02.03': ['S2.HW.01'],
  'M02.04': ['S2.HW.01'], 'M02.05': ['S2.HW.01'],
  'M02.06': ['S2.HW.04'], 'M02.07': ['S2.HW.02'],
  'M02.08': ['S2.HW.04'], 'M02.09': ['S2.HW.03'],
  'M03.01': ['S2.OFFICE.01'], 'M03.02': ['S2.OFFICE.01'], 'M03.03': ['S2.OFFICE.01'],
  'M03.04': ['S2.OFFICE.02'], 'M03.05': ['S2.OFFICE.02'],
  'M03.06': ['S2.OFFICE.03'], 'M03.07': ['S2.OFFICE.03'],
  'M03.08': ['S2.OFFICE.04'], 'M03.09': ['S2.OFFICE.04'], 'M03.10': ['S2.OFFICE.04'],
  'M04.01': ['S3.LOGIC.01'], 'M04.02': ['S3.LOGIC.01', 'S3.LOGIC.02'],
  'M04.03': ['S3.LOGIC.03', 'S3.LOGIC.04'], 'M04.04': ['S3.LOGIC.04'],
  'M04.05': ['S3.LOGIC.03'], 'M04.06': ['S3.LOGIC.03'],
  'M05.01': ['S3.NUM.01'], 'M05.02': ['S3.NUM.02'], 'M05.03': ['S3.NUM.03'],
  'M06.01': ['S3.ALGO.01'], 'M06.02': ['S3.ALGO.01'],
  'M06.03': ['S3.ALGO.02'], 'M06.04': ['S3.ALGO.04'],
  'M07.01': ['S4.BLOCK.01'], 'M07.02': ['S4.BLOCK.02'], 'M07.03': ['S4.BLOCK.01'],
  'M07.04': ['S4.BLOCK.03'], 'M07.05': ['S4.BLOCK.04'], 'M07.06': ['S4.BLOCK.05'],
  'M08.01': ['S4.CODE.01'], 'M08.02': ['S4.CODE.01'], 'M08.03': ['S4.CODE.01'],
  'M08.04': ['S4.CODE.01'], 'M08.05': ['S4.CODE.02'], 'M08.06': ['S4.CODE.02'],
  'M08.07': ['S4.CODE.03'], 'M08.08': ['S4.CODE.03'], 'M08.09': ['S4.CODE.03'],
  'M08.10': ['S4.CODE.03'], 'M08.11': ['S4.CODE.04'], 'M08.12': ['S4.CODE.05'],
  'M09.01': ['S4.DB.01'], 'M09.02': ['S4.DB.01', 'S4.DB.02'],
  'M09.03': ['S4.DB.03'], 'M09.04': ['S4.DB.02', 'S4.DB.04'],
  'M09.05': ['S4.DB.02'], 'M09.06': ['S4.DB.01', 'S4.DB.05'],
  'M10.01': ['S5.WEB.01'], 'M10.02': ['S5.WEB.02', 'S5.WEB.03'],
  'M10.03': ['S5.WEB.02', 'S5.WEB.03'], 'M10.04': ['S5.WEB.02', 'S5.WEB.03'],
  'M10.05': ['S5.WEB.01'], 'M10.06': ['S5.WEB.01'], 'M10.07': ['S5.WEB.01'],
  'M11.01': ['S5.WEB.04'], 'M11.02': ['S5.WEB.04'],
  'M11.03': ['S5.WEB.05'], 'M11.04': ['S5.WEB.04'],
  'M11.05': ['S5.WEB.06'], 'M11.06': ['S5.WEB.06'], 'M11.07': ['S5.WEB.04', 'S5.WEB.06'],
  'M12.01': ['S6.NET.01'], 'M12.02': ['S6.NET.01'],
  'M12.03': ['S6.NET.02'], 'M12.04': ['S6.NET.02'],
  'M12.05': ['S6.NET.03'], 'M12.06': ['S6.NET.04', 'S6.NET.05'],
  'M12.07': ['S6.NET.04', 'S6.NET.05'], 'M12.08': ['S6.NET.04'], 'M12.09': ['S6.NET.04'],
  'M13.01': ['S7.SEC.01'], 'M13.02': ['S7.SEC.02'], 'M13.03': ['S7.SEC.03'],
  'M13.04': ['S7.SEC.01'], 'M13.05': ['S7.SEC.04'], 'M13.06': ['S7.SEC.04'],
  'M13.07': ['S7.SEC.05'], 'M13.08': ['S7.SEC.05'], 'M13.09': ['S7.SEC.05'],
  'M13.10': ['S7.SEC.05'], 'M13.11': ['S7.SEC.06'],
  'M14.01': ['KS.01'], 'M14.02': ['KS.02'], 'M14.03': ['KS.03'],
  'M14.04': ['KS.04'], 'M14.05': ['KS.05'], 'M14.06': ['KS.06'], 'M14.07': ['KS.07'],
  'M15.01': ['PM.GEN.01'], 'M15.02': ['PM.GEN.02'], 'M15.03': ['PM.GEN.03'],
  'M15.04': ['PM.GEN.04'], 'M15.05': ['PM.GEN.05'], 'M15.06': ['PM.GEN.06'],
  'M15.07': ['PM.GEN.07'], 'M15.08': ['PM.GEN.08'],
  'M16.01': ['PM.MET.01'], 'M16.02': ['PM.MET.02'], 'M16.03': ['PM.MET.03'],
}

// ─── 4. Database Operations ──────────────────────────────────────

async function applyMigration() {
  console.log('\n🔧 Migration tekshirilmoqda...')
  try {
    // Check if source_reference column exists
    const cols = await sql(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'questions' AND column_name = 'source_reference'
    `)
    if (cols.length > 0) {
      console.log('   ✅ source_reference kolonkasi allaqachon mavjud')
      return
    }

    // Add column
    await sql(`ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS source_reference text`)
    await sql(`CREATE INDEX IF NOT EXISTS idx_questions_source_ref ON public.questions(source_reference) WHERE source_reference IS NOT NULL`)
    console.log('   ✅ source_reference kolonkasi qo\'shildi')
  } catch (err: any) {
    console.log(`   ⚠️ Migration xatolik (davom etiladi): ${err.message}`)
  }
}

async function getModuleUuid(code: string): Promise<string | null> {
  const rows = await sql(`SELECT id FROM public.modules WHERE code = ${quote(code)} LIMIT 1`)
  return rows[0]?.id || null
}

async function getConstructUuid(code: string): Promise<string | null> {
  const rows = await sql(`SELECT id FROM public.constructs WHERE code = ${quote(code)} LIMIT 1`)
  return rows[0]?.id || null
}

async function getLessonId(slug: string): Promise<string | null> {
  const rows = await sql(`SELECT id FROM public.lessons WHERE slug = ${quote(slug)} LIMIT 1`)
  return rows[0]?.id || null
}

async function dropAllLessons() {
  console.log('🧹 Eski lesson/link ma\'lumotlari tozalanmoqda...')
  // Transaction: yoki hammasi yoki hech narsa
  await sql(`
    BEGIN;
    DELETE FROM public.lesson_constructs;
    DELETE FROM public.lessons;
    COMMIT;
  `)
  console.log('   ✅ Tozalandi')
}

async function syncLessons(allSubtopics: AllSubtopics) {
  console.log('\n📚 Lessons sinxronizatsiyasi...')

  const valueRows: string[] = []
  const updateRows: string[] = []

  for (const [subtopicId, info] of Object.entries(allSubtopics)) {
    const moduleId = await getModuleUuid(info.moduleCode)
    if (!moduleId) {
      console.warn(`   ⚠️  Modul topilmadi: ${info.moduleCode}`)
      continue
    }

    const orderNum = parseInt(subtopicId.split('.')[1])
    const slug = subtopicId.toLowerCase().replace('.', '-')
    const topicContent = topicContentMap.get(subtopicId)
    const bodyMdx = topicContent ? formatTheoryAsMarkdown(topicContent.theory) : null

    if (bodyMdx) {
      valueRows.push(
        `(${quote(moduleId)}, ${orderNum}, ${quote(slug)}, ${quote(info.title)}, ${quote(bodyMdx)}, 15, 'published')`
      )
    } else {
      valueRows.push(
        `(${quote(moduleId)}, ${orderNum}, ${quote(slug)}, ${quote(info.title)}, NULL, 15, 'published')`
      )
    }
  }

  if (valueRows.length === 0) {
    console.log('   ⚠️  Hech qanday lesson yaratilmadi')
    return
  }

  const batchSize = 50
  for (let i = 0; i < valueRows.length; i += batchSize) {
    const batch = valueRows.slice(i, i + batchSize).join(', \n')
    await sql(`
      INSERT INTO public.lessons (module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status)
      VALUES ${batch}
      ON CONFLICT (module_id, order_idx) DO UPDATE SET
        title_uz = EXCLUDED.title_uz,
        body_mdx = COALESCE(EXCLUDED.body_mdx, lessons.body_mdx),
        status = 'published'
    `)
  }

  console.log(`   ✅ ${valueRows.length} ta lesson sinxronlashtirildi`)
}

async function syncLessonConstructs(allSubtopics: AllSubtopics) {
  console.log('\n🔗 Lesson–Construct bog\'lanishi...')

  // Pre-fetch all UUIDs to avoid N+1 queries
  const allConstructCodes = new Set<string>()
  for (const codes of Object.values(SUBTOPIC_TO_CONSTRUCT)) {
    codes.forEach(c => allConstructCodes.add(c))
  }

  // Batch fetch construct UUIDs
  const constructUuids = new Map<string, string>()
  for (const code of allConstructCodes) {
    const uuid = await getConstructUuid(code)
    if (uuid) constructUuids.set(code, uuid)
  }

  const valueRows: string[] = []

  for (const [subtopicId] of Object.entries(allSubtopics)) {
    const constructCodes = SUBTOPIC_TO_CONSTRUCT[subtopicId]
    if (!constructCodes || constructCodes.length === 0) continue

    const slug = subtopicId.toLowerCase().replace('.', '-')
    const lessonId = await getLessonId(slug)
    if (!lessonId) continue

    for (const constCode of constructCodes) {
      const constructId = constructUuids.get(constCode)
      if (!constructId) continue
      valueRows.push(`(${quote(lessonId)}, ${quote(constructId)})`)
    }
  }

  if (valueRows.length === 0) {
    console.log('   ⚠️  Hech qanday bog\'lanish yaratilmadi')
    return
  }

  // Batch insert with ON CONFLICT DO NOTHING
  const batchSize = 100
  for (let i = 0; i < valueRows.length; i += batchSize) {
    const batch = valueRows.slice(i, i + batchSize).join(', \n')
    await sql(`
      INSERT INTO public.lesson_constructs (lesson_id, construct_id)
      VALUES ${batch}
      ON CONFLICT (lesson_id, construct_id) DO NOTHING
    `)
  }

  console.log(`   ✅ ${valueRows.length} ta bog\'lanish yaratildi`)
}

async function syncQuestions(allSubtopics: AllSubtopics) {
  console.log('\n❓ Savollar sinxronizatsiyasi...')

  interface QuestionBatch {
    sourceRef: string
    format: string
    cognitiveLevel: string
    text: string
    constructId: string | null
    options: string[]
    correctIndex: number
    explanation: string
  }

  const allQuestions: QuestionBatch[] = []

  // 1. Collect all new questions (skip existing via source_reference)
  for (const [subtopicId] of Object.entries(allSubtopics)) {
    const tc = topicContentMap.get(subtopicId)
    if (!tc || tc.questions.length === 0) continue

    const lessonId = await getLessonId(subtopicId.toLowerCase().replace('.', '-'))
    if (!lessonId) continue

    const constructCodes = SUBTOPIC_TO_CONSTRUCT[subtopicId]
    let constructId: string | null = null
    if (constructCodes && constructCodes.length > 0) {
      const uuid = await getConstructUuid(constructCodes[0])
      if (uuid) constructId = uuid
    }

    for (const q of tc.questions) {
      // Check existing
      const existing = await sql(
        `SELECT id FROM public.questions WHERE source_reference = ${quote(q.id)} LIMIT 1`
      )
      if (existing.length > 0) continue

      const format = q.type as 'Y1' | 'Y2' | 'Y3'
      const cognitiveLevel: string =
        format === 'Y3' ? 'mulohaza' :
        format === 'Y2' ? 'qollash' : 'bilish'

      allQuestions.push({
        sourceRef: q.id,
        format,
        cognitiveLevel,
        text: q.text,
        constructId,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })
    }
  }

  if (allQuestions.length === 0) {
    console.log('   ℹ️  Barcha savollar allaqachon mavjud')
    return
  }

  console.log(`   📋 ${allQuestions.length} ta yangi savol topildi, yaratilmoqda...`)

  // 2. Batch insert questions with RETURNING
  const batchSize = 25
  let created = 0

  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize)

    const valueRows = batch.map(q => {
      const constructVal = q.constructId ? quote(q.constructId) : 'NULL'
      return `(${quote(q.text)}, ${quote(q.sourceRef)}, ${constructVal}, ${quote(q.format)}, ${quote(q.cognitiveLevel)}, 2, 'published')`
    })

    // Insert questions in batch
    const qRows = await sql(`
      INSERT INTO public.questions (stem_md, source_reference, construct_id, format, cognitive_level, points, status)
      VALUES ${valueRows.join(', \n')}
      ON CONFLICT DO NOTHING
      RETURNING id, source_reference
    `)

    if (!qRows || qRows.length === 0) continue

    // Build sourceRef → UUID map
    const idMap = new Map<string, string>()
    for (const row of qRows) {
      idMap.set(row.source_reference, row.id)
    }

    // 3. Batch insert options & keys in groups
    const optRows: string[] = []
    const keyRows: string[] = []

    for (const q of batch) {
      const questionId = idMap.get(q.sourceRef)
      if (!questionId) continue

      for (let o = 0; o < q.options.length; o++) {
        optRows.push(
          `(${quote(questionId)}, ${o + 1}, ${quote(String.fromCharCode(65 + o))}, ${quote(q.options[o])})`
        )
      }

      keyRows.push(
        `(${quote(questionId)}, ${quote(JSON.stringify({ correct_index: q.correctIndex }))}, ${quote(q.explanation)})`
      )
    }

    // Insert options in batch
    if (optRows.length > 0) {
      const optBatchSize = 100
      for (let oi = 0; oi < optRows.length; oi += optBatchSize) {
        await sql(`
          INSERT INTO public.question_options (question_id, order_idx, label, text_uz)
          VALUES ${optRows.slice(oi, oi + optBatchSize).join(', \n')}
        `)
      }
    }

    // Insert keys in batch
    if (keyRows.length > 0) {
      await sql(`
        INSERT INTO public.question_keys (question_id, payload, explanation_md)
        VALUES ${keyRows.join(', \n')}
      `)
    }

    created += idMap.size
    if (created % 50 === 0 || i + batchSize >= allQuestions.length) {
      console.log(`   📊 ${created}/${allQuestions.length} savol yaratildi...`)
    }
  }

  console.log(`   ✅ ${created} ta yangi savol yaratildi`)
}

// ─── 5. Main ──────────────────────────────────────────────────────

let topicContentMap = new Map<string, TopicContent>()

async function main() {
  console.log('='.repeat(60))
  console.log('🔄 DB Sync: Frontend → Database (Management API)')
  console.log(`   Project: ${PROJECT_REF}`)
  console.log(`   API: ${MGMT_API}`)
  console.log('='.repeat(60))

  // Check connection
  console.log('\n🔌 Supabase Management API...')
  try {
    const ping = await sql('SELECT 1 as ping')
    console.log(`   ✅ Connected (${ping[0]?.ping || 'ok'})`)
  } catch (err: any) {
    console.error(`❌ API ga ulanishda xatolik: ${err.message}`)
    process.exit(1)
  }

  // Apply migration (self-contained)
  await applyMigration()

  // Parse source data
  const { modules, allSubtopics } = parseContentTree()
  topicContentMap = parseTopicContent()

  // Current state
  const [modRows, lessonRows, qRows] = await Promise.all([
    sql('SELECT count(*) as cnt FROM public.modules'),
    sql('SELECT count(*) as cnt FROM public.lessons'),
    sql('SELECT count(*) as cnt FROM public.questions'),
  ])

  console.log(`\n📊 Hozirgi holat:`)
  console.log(`   Modules:   ${modRows[0]?.cnt || 0}`)
  console.log(`   Lessons:   ${lessonRows[0]?.cnt || 0}`)
  console.log(`   Questions: ${qRows[0]?.cnt || 0}`)

  // Clean + reload lessons
  await dropAllLessons()

  // Sync (ketma-ket, chunki lesson ID questions uchun kerak)
  await syncLessons(allSubtopics)
  await syncLessonConstructs(allSubtopics)
  await syncQuestions(allSubtopics)

  // Final state
  const [finalLessons, finalQuestions, finalConstructs] = await Promise.all([
    sql('SELECT count(*) as cnt FROM public.lessons'),
    sql('SELECT count(*) as cnt FROM public.questions'),
    sql('SELECT count(*) as cnt FROM public.lesson_constructs'),
  ])

  console.log('\n' + '='.repeat(60))
  console.log('📊 Sinxronizatsiya yakuni:')
  console.log(`   Lessons:           ${finalLessons[0]?.cnt || 0}`)
  console.log(`   Lesson–Constructs: ${finalConstructs[0]?.cnt || 0}`)
  console.log(`   Questions:         ${finalQuestions[0]?.cnt || 0}`)
  console.log('='.repeat(60))
}

main().catch(err => {
  console.error('❌ Xatolik:', err)
  process.exit(1)
})
