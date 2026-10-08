#!/usr/bin/env node

/**
 * Validate the private 570-item professional bank before admin import.
 *
 * The private payload itself must never be committed. This script reads it
 * locally, validates identifiers/taxonomy/keys/distributions, and prints only
 * aggregate diagnostics plus question IDs that need review.
 *
 * Usage:
 *   npm run content:private-bank:validate -- /secure/path/bank.json
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: node scripts/validate-private-question-bank.mjs <bank.json>')
  process.exit(2)
}

const root = process.cwd()
const payloadPath = resolve(root, inputPath)
const blueprintPath = resolve(root, 'src/data/blueprint2026.ts')

const [rawPayload, blueprintSource] = await Promise.all([
  readFile(payloadPath, 'utf8'),
  readFile(blueprintPath, 'utf8'),
])

let parsed
try {
  parsed = JSON.parse(rawPayload)
} catch (error) {
  console.error('Invalid JSON:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}

const items = Array.isArray(parsed) ? parsed : parsed?.items
if (!Array.isArray(items)) {
  console.error('Payload must be an array or an object with an items array.')
  process.exit(1)
}

const constructCodes = new Set(
  [...blueprintSource.matchAll(/\{\s*code:\s*'([^']+)'\s*,\s*group:/g)].map(
    (match) => match[1]
  )
)

const expectedIds = new Set()
for (let chapter = 1; chapter <= 19; chapter += 1) {
  for (let number = 1; number <= 30; number += 1) {
    expectedIds.add(
      `AXB-${String(chapter).padStart(2, '0')}-${String(number).padStart(3, '0')}`
    )
  }
}

const expectedLevel = (externalId) => {
  const number = Number(externalId.slice(-3))
  if (number <= 10) return { cognitive: 'bilish', difficulty: 1 }
  if (number <= 20) return { cognitive: 'bilish', difficulty: 2 }
  if (number <= 25) return { cognitive: 'qollash', difficulty: 3 }
  if (number <= 28) return { cognitive: 'mulohaza', difficulty: 4 }
  return { cognitive: 'mulohaza', difficulty: 5 }
}

const errors = []
const warnings = []
const seen = new Set()
const constructCounts = new Map()
const groupCounts = new Map()
const cognitiveCounts = new Map()
const difficultyCounts = new Map()

const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1)

for (const [index, item] of items.entries()) {
  const id = item?.external_id
  const at = typeof id === 'string' ? id : `index:${index}`

  if (typeof id !== 'string' || !/^AXB-\d{2}-\d{3}$/.test(id)) {
    errors.push(`${at}: invalid external_id`)
    continue
  }

  if (seen.has(id)) errors.push(`${id}: duplicate external_id`)
  seen.add(id)

  if (!expectedIds.has(id)) errors.push(`${id}: outside AXB-01..19 / 001..030 bank`)

  if (item.format !== 'Y1') errors.push(`${id}: format must be Y1`)

  if (!constructCodes.has(item.construct_code)) {
    errors.push(`${id}: unknown construct_code ${String(item.construct_code)}`)
  } else {
    bump(constructCounts, item.construct_code)
    bump(groupCounts, item.construct_code.split('.').slice(0, 2).join('.'))
  }

  if (!['bilish', 'qollash', 'mulohaza'].includes(item.cognitive)) {
    errors.push(`${id}: invalid cognitive ${String(item.cognitive)}`)
  } else {
    bump(cognitiveCounts, item.cognitive)
  }

  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 5) {
    errors.push(`${id}: difficulty must be integer 1..5`)
  } else {
    bump(difficultyCounts, item.difficulty)
  }

  const expected = expectedLevel(id)
  if (
    item.cognitive !== expected.cognitive ||
    item.difficulty !== expected.difficulty
  ) {
    errors.push(
      `${id}: level contract expected ${expected.cognitive}/${expected.difficulty}, got ${String(item.cognitive)}/${String(item.difficulty)}`
    )
  }

  if (typeof item.stem_md !== 'string' || !item.stem_md.trim()) {
    errors.push(`${id}: empty stem_md`)
  }

  if (!Array.isArray(item.options) || item.options.length !== 4) {
    errors.push(`${id}: exactly four options required`)
  } else {
    const texts = item.options.map((option) => option?.content_md?.trim())
    if (texts.some((text) => !text)) errors.push(`${id}: option content is empty`)
    if (new Set(texts).size !== 4) warnings.push(`${id}: duplicate option text`)
  }

  if (!Number.isInteger(item.correct_index) || item.correct_index < 0 || item.correct_index > 3) {
    errors.push(`${id}: correct_index must be 0..3`)
  }

  if (typeof item.explanation_md !== 'string' || !item.explanation_md.trim()) {
    errors.push(`${id}: empty explanation_md`)
  }

  if (typeof item.source_locator !== 'string' || !item.source_locator.trim()) {
    warnings.push(`${id}: missing source_locator`)
  }

  if (!Number.isInteger(item.bank_pdf_page) || item.bank_pdf_page < 1) {
    warnings.push(`${id}: missing/invalid bank_pdf_page`)
  }

  // Extraction-risk hints. These do not block import because every item is
  // staged as REVIEW, but they identify questions whose formula typography
  // should be compared with the source PDF before publication.
  const formulaText = [item.stem_md, ...(item.options ?? []).map((o) => o?.content_md ?? ''), item.explanation_md]
    .join(' ')
  if (
    /\b(?:two.?s complement|sanoq|ikkilik|sakkizlik|o.?n oltilik|kib|mib|gb|bit\/s|baud|kbit\/s|mbit\/s)\b/i.test(formulaText) &&
    /\d/.test(formulaText)
  ) {
    warnings.push(`${id}: formula/base typography review recommended`)
  }
}

for (const missing of expectedIds) {
  if (!seen.has(missing)) errors.push(`${missing}: missing from payload`)
}

if (items.length !== 570) {
  errors.push(`payload: expected exactly 570 items, got ${items.length}`)
}

const expectedCognitive = { bilish: 380, qollash: 95, mulohaza: 95 }
for (const [key, count] of Object.entries(expectedCognitive)) {
  if ((cognitiveCounts.get(key) ?? 0) !== count) {
    errors.push(
      `payload: cognitive ${key} expected ${count}, got ${cognitiveCounts.get(key) ?? 0}`
    )
  }
}

const expectedDifficulty = { 1: 190, 2: 190, 3: 95, 4: 57, 5: 38 }
for (const [key, count] of Object.entries(expectedDifficulty)) {
  if ((difficultyCounts.get(Number(key)) ?? 0) !== count) {
    errors.push(
      `payload: difficulty ${key} expected ${count}, got ${difficultyCounts.get(Number(key)) ?? 0}`
    )
  }
}

const sortedEntries = (map) =>
  [...map.entries()].sort(([a], [b]) => String(a).localeCompare(String(b)))

console.log(`Private professional bank: ${items.length} items`)
console.log(`Unique IDs: ${seen.size}`)
console.log(
  'Cognitive:',
  Object.fromEntries(sortedEntries(cognitiveCounts))
)
console.log(
  'Difficulty:',
  Object.fromEntries(sortedEntries(difficultyCounts))
)
console.log('By group:', Object.fromEntries(sortedEntries(groupCounts)))
console.log('By construct:', Object.fromEntries(sortedEntries(constructCounts)))
console.log(`Warnings: ${warnings.length}`)
for (const warning of warnings.slice(0, 80)) console.log(`  WARN ${warning}`)
if (warnings.length > 80) console.log(`  ... ${warnings.length - 80} more warning(s)`)

if (errors.length) {
  console.error(`Validation FAILED: ${errors.length} error(s)`)
  for (const error of errors.slice(0, 120)) console.error(`  ERROR ${error}`)
  if (errors.length > 120) console.error(`  ... ${errors.length - 120} more error(s)`)
  process.exit(1)
}

console.log('Validation PASSED: payload is structurally ready for private admin import.')
