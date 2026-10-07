#!/usr/bin/env node

/**
 * Parametrik generatorlar -> PostgreSQL seed builder.
 *
 * Default pool: har bir qo'llab-quvvatlangan rasmiy construct uchun 30 ta
 * mazmunan turli savol (9 construct = 270 savol).
 *
 * Xavfsizlik / invariantlar:
 * - UUID'lar deterministic UUIDv5; qayta generatsiya aynan bir xil ID beradi.
 * - published savol mutatsiya qilinmaydi: INSERT ... ON CONFLICT DO NOTHING.
 * - Y1/Y2/Y3 answer key faqat question_keys jadvaliga yoziladi.
 * - learner-visible questions/options qatorlarida javob kaliti yo'q.
 * - bir construct ichida stem + option kontenti bo'yicha semantik takror yo'q.
 *
 * Usage:
 *   npx tsx scripts/gen_parametric_seed_sql.ts --check
 *   npx tsx scripts/gen_parametric_seed_sql.ts --write <path.sql>
 *   npx tsx scripts/gen_parametric_seed_sql.ts --stdout
 */

import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import {
  QUESTION_GENERATORS,
  type GeneratedQuestion,
  type QuestionGenerator,
} from '../src/lib/exam/generators/index.ts'

const NAMESPACE = 'a11e57a5-2026-4a77-9a10-000000000021'
const DEFAULT_PER_CONSTRUCT = 30
const MAX_ATTEMPTS_PER_CONSTRUCT = 20_000

interface MaterializedOption {
  localId: string
  id: string
  side: 'a' | 'b'
  orderIdx: number
  content: string
}

interface MaterializedQuestion {
  source: GeneratedQuestion
  questionId: string
  options: MaterializedOption[]
  keyPayload: Record<string, unknown>
  sourceReference: string
}

function sqlText(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function uuidBytes(uuid: string): Buffer {
  const hex = uuid.replaceAll('-', '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error(`invalid_uuid:${uuid}`)
  return Buffer.from(hex, 'hex')
}

function formatUuid(bytes: Buffer): string {
  const hex = bytes.toString('hex')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-')
}

/** RFC 4122 UUIDv5 — external uuid package talab qilmaydi. */
function uuidV5(name: string, namespace = NAMESPACE): string {
  const hash = createHash('sha1')
    .update(uuidBytes(namespace))
    .update(Buffer.from(name, 'utf8'))
    .digest()
    .subarray(0, 16)

  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  return formatUuid(hash)
}

function semanticSignature(question: GeneratedQuestion): string {
  const options = question.options
    .map(option => `${option.side}:${option.content}`)
    .sort()
    .join('|')
  return `${question.stem}::${options}`
}

function materialize(question: GeneratedQuestion): MaterializedQuestion {
  const questionId = uuidV5(
    `question:${question.generator}:${question.constructCode}:${question.fingerprint}`
  )
  const options = question.options.map((option, index) => ({
    localId: option.id,
    id: uuidV5(`option:${questionId}:${option.id}`),
    side: option.side,
    orderIdx: index + 1,
    content: option.content,
  }))
  const optionByLocalId = new Map(options.map(option => [option.localId, option.id]))

  let keyPayload: Record<string, unknown>
  if (question.key.kind === 'Y1') {
    const correctOptionId = optionByLocalId.get(question.key.optionId)
    if (!correctOptionId) throw new Error('generated_y1_key_missing_option')
    keyPayload = { correct_option_id: correctOptionId }
  } else if (question.key.kind === 'Y2') {
    const pairs: Record<string, string> = {}
    for (const [leftLocalId, rightLocalId] of Object.entries(question.key.pairs)) {
      const leftId = optionByLocalId.get(leftLocalId)
      const rightId = optionByLocalId.get(rightLocalId)
      if (!leftId || !rightId) throw new Error('generated_y2_key_missing_option')
      pairs[leftId] = rightId
    }
    keyPayload = { pairs }
  } else {
    const order = question.key.order.map(localId => {
      const id = optionByLocalId.get(localId)
      if (!id) throw new Error('generated_y3_key_missing_option')
      return id
    })
    keyPayload = { order }
  }

  return {
    source: question,
    questionId,
    options,
    keyPayload,
    sourceReference: `generated:${question.generator}:${question.constructCode}:${question.fingerprint}`,
  }
}

function generateConstructPool(
  generator: QuestionGenerator,
  constructCode: string,
  targetCount: number
): MaterializedQuestion[] {
  const seen = new Set<string>()
  const result: MaterializedQuestion[] = []

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_CONSTRUCT; attempt += 1) {
    const seed = `${constructCode}:${attempt}`
    const generated = generator.generate(seed, constructCode)
    if (generated.constructCode !== constructCode) {
      throw new Error(`construct_mismatch:${constructCode}:${generated.constructCode}`)
    }

    const signature = semanticSignature(generated)
    if (seen.has(signature)) continue
    seen.add(signature)
    result.push(materialize(generated))
    if (result.length === targetCount) return result
  }

  throw new Error(
    `insufficient_unique_generated_questions:${constructCode}:${result.length}/${targetCount}`
  )
}

export function buildParametricPool(
  perConstruct = DEFAULT_PER_CONSTRUCT
): MaterializedQuestion[] {
  if (!Number.isInteger(perConstruct) || perConstruct < 1 || perConstruct > 500) {
    throw new Error('invalid_per_construct')
  }

  return QUESTION_GENERATORS.flatMap(generator =>
    generator.constructCodes.flatMap(constructCode =>
      generateConstructPool(generator, constructCode, perConstruct)
    )
  )
}

function questionSql(item: MaterializedQuestion): string {
  const q = item.source
  return `insert into public.questions (
  id, subject_id, construct_id, group_code, format, cognitive, difficulty,
  stem_md, assets, is_generated, status, source_reference
)
values (
  ${sqlText(item.questionId)},
  (select id from public.subjects where code = 'informatika'),
  (select id from public.constructs where code = ${sqlText(q.constructCode)}),
  ${sqlText(q.groupCode)},
  ${sqlText(q.format)}::public.question_format,
  ${sqlText(q.cognitive)}::public.cognitive_level,
  ${q.difficulty},
  ${sqlText(q.stem)},
  '[]'::jsonb,
  true,
  'published'::public.content_status,
  ${sqlText(item.sourceReference)}
)
on conflict (id) do nothing;`
}

function optionsSql(item: MaterializedQuestion): string {
  return item.options
    .map(option => `insert into public.question_options (
  id, question_id, side, order_idx, content_md
)
values (
  ${sqlText(option.id)}, ${sqlText(item.questionId)}, ${sqlText(option.side)},
  ${option.orderIdx}, ${sqlText(option.content)}
)
on conflict (id) do nothing;`)
    .join('\n\n')
}

function keySql(item: MaterializedQuestion): string {
  return `insert into public.question_keys (question_id, payload, explanation_md)
values (
  ${sqlText(item.questionId)},
  ${sqlText(JSON.stringify(item.keyPayload))}::jsonb,
  ${sqlText(item.source.explanation)}
)
on conflict (question_id) do nothing;`
}

export function renderParametricSeedSql(pool: readonly MaterializedQuestion[]): string {
  const counts = new Map<string, number>()
  for (const item of pool) {
    counts.set(item.source.constructCode, (counts.get(item.source.constructCode) ?? 0) + 1)
  }

  const summary = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([construct, count]) => `--   ${construct}: ${count}`)
    .join('\n')

  return `-- AUTO-GENERATED by scripts/gen_parametric_seed_sql.ts
-- Do not hand-edit generated question rows.
-- Published rows are append-only: conflicts are intentionally ignored.
-- Total questions: ${pool.length}
${summary}

begin;

${pool
    .map(item => [questionSql(item), optionsSql(item), keySql(item)].join('\n\n'))
    .join('\n\n')}

commit;
`
}

export function validateParametricPool(pool: readonly MaterializedQuestion[]): void {
  const questionIds = new Set<string>()
  const sourceReferences = new Set<string>()
  const semanticByConstruct = new Map<string, Set<string>>()

  for (const item of pool) {
    if (questionIds.has(item.questionId)) throw new Error(`duplicate_question_id:${item.questionId}`)
    questionIds.add(item.questionId)

    if (sourceReferences.has(item.sourceReference)) {
      throw new Error(`duplicate_source_reference:${item.sourceReference}`)
    }
    sourceReferences.add(item.sourceReference)

    const semantic = semanticSignature(item.source)
    const bucket = semanticByConstruct.get(item.source.constructCode) ?? new Set<string>()
    if (bucket.has(semantic)) {
      throw new Error(`duplicate_semantic_question:${item.source.constructCode}`)
    }
    bucket.add(semantic)
    semanticByConstruct.set(item.source.constructCode, bucket)

    const optionIds = new Set(item.options.map(option => option.id))
    if (optionIds.size !== item.options.length) throw new Error('duplicate_option_id')

    if (item.source.key.kind === 'Y1') {
      const id = item.keyPayload.correct_option_id
      if (typeof id !== 'string' || !optionIds.has(id)) throw new Error('invalid_y1_payload')
    } else if (item.source.key.kind === 'Y2') {
      const pairs = item.keyPayload.pairs
      if (!pairs || typeof pairs !== 'object' || Array.isArray(pairs)) throw new Error('invalid_y2_payload')
      for (const [left, right] of Object.entries(pairs)) {
        if (!optionIds.has(left) || typeof right !== 'string' || !optionIds.has(right)) {
          throw new Error('invalid_y2_payload_option')
        }
      }
    } else {
      const order = item.keyPayload.order
      if (!Array.isArray(order) || order.length !== item.options.length) {
        throw new Error('invalid_y3_payload')
      }
      for (const id of order) {
        if (typeof id !== 'string' || !optionIds.has(id)) throw new Error('invalid_y3_payload_option')
      }
    }
  }
}

function parsePerConstruct(argv: readonly string[]): number {
  const arg = argv.find(value => value.startsWith('--per-construct='))
  if (!arg) return DEFAULT_PER_CONSTRUCT
  return Number(arg.split('=', 2)[1])
}

function main(): void {
  const argv = process.argv.slice(2)
  const perConstruct = parsePerConstruct(argv)
  const pool = buildParametricPool(perConstruct)
  validateParametricPool(pool)

  const expected = QUESTION_GENERATORS.reduce(
    (sum, generator) => sum + generator.constructCodes.length * perConstruct,
    0
  )
  if (pool.length !== expected) {
    throw new Error(`generated_pool_count_mismatch:${pool.length}/${expected}`)
  }

  if (argv.includes('--check')) {
    const formats = pool.reduce<Record<string, number>>((acc, item) => {
      acc[item.source.format] = (acc[item.source.format] ?? 0) + 1
      return acc
    }, {})
    console.log(
      `Parametric pool OK: ${pool.length} questions, ${QUESTION_GENERATORS.length} generators, formats=${JSON.stringify(formats)}`
    )
    return
  }

  const sql = renderParametricSeedSql(pool)
  const writeIndex = argv.indexOf('--write')
  if (writeIndex >= 0) {
    const output = argv[writeIndex + 1]
    if (!output) throw new Error('--write requires output path')
    const path = resolve(output)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, sql, 'utf8')
    console.log(`Generated ${pool.length} questions -> ${path}`)
    return
  }

  if (argv.includes('--stdout')) {
    process.stdout.write(sql)
    return
  }

  throw new Error('Use --check, --write <path.sql>, or --stdout')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
