#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const [, , inputPath] = process.argv
const baseUrl = (process.env.ATTESTATSIYA_API_URL ?? '').replace(/\/$/, '')
const token = process.env.ATTESTATSIYA_ADMIN_TOKEN ?? ''

if (!inputPath) {
  console.error('Usage: node scripts/import-private-question-bank.mjs <private-bank.json>')
  process.exit(2)
}

if (!baseUrl) {
  console.error('ATTESTATSIYA_API_URL is required')
  process.exit(2)
}

if (!token) {
  console.error('ATTESTATSIYA_ADMIN_TOKEN is required')
  process.exit(2)
}

const raw = await readFile(resolve(inputPath), 'utf8')
const payload = JSON.parse(raw)
const items = Array.isArray(payload) ? payload : payload.items

if (!Array.isArray(items) || items.length === 0) {
  console.error('Input must be a non-empty array or an object with an items array')
  process.exit(2)
}

const batchSize = 100
const totals = { inserted: 0, skipped: 0, rejected: 0 }
const errors = []

for (let offset = 0; offset < items.length; offset += batchSize) {
  const batch = items.slice(offset, offset + batchSize)
  const response = await fetch(`${baseUrl}/api/admin/question-bank/import`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ items: batch }),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    console.error(
      `Batch ${offset + 1}–${offset + batch.length} failed: HTTP ${response.status}`
    )
    if (body) console.error(JSON.stringify(body, null, 2))
    process.exit(1)
  }

  for (const key of Object.keys(totals)) {
    totals[key] += Number(body?.[key] ?? 0)
  }

  if (Array.isArray(body?.errors)) {
    errors.push(...body.errors)
  }

  console.log(
    `Imported ${offset + 1}–${offset + batch.length}: inserted=${body.inserted}, skipped=${body.skipped}, rejected=${body.rejected}`
  )
}

console.log(JSON.stringify({ total_items: items.length, ...totals, errors }, null, 2))

if (totals.rejected > 0) {
  process.exitCode = 1
}
