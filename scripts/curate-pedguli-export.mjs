#!/usr/bin/env node
/**
 * Review-only curator for an AUTHORIZED Telegram Desktop JSON export of @PedMahoratGuli.
 * Never fetches Telegram, discovers private messages or publishes/copies text to Git.
 *
 * Usage:
 *   node scripts/curate-pedguli-export.mjs <path/to/result.json> <secure/out.json>
 * Input and output MUST remain private and outside the tracked repository.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, relative } from 'node:path'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'

export const CANONICAL_HANDLE = 'PedMahoratGuli'
export const EXPECTED_NAME = /ped\s*mahorat\s*[|\-:–]?\s*guli/i

/** Telegram Desktop exports may split text into mixed string/format objects. */
export function flattenTelegramText(input) {
  if (typeof input === 'string') return input
  if (Array.isArray(input)) return input.map(value => {
    if (typeof value === 'string') return value
    return typeof value?.text === 'string' ? value.text : ''
  }).join('')
  return ''
}

export function classifyTopic(text) {
  const t = text.toLocaleLowerCase('uz-UZ')
  const found = new Set()
  const patterns = [
    [/kasb\s*standart|mehnat\s*vazifa|kasbiy\s*standart|o['’]zlashtirishni\s*baholash|xavfsiz\s*rivojlantir/, 'KS'],
    [/akvarium|asalari|ajurli|jigsaw|keys.?stadi|metod|texnologiya|loyiha|individual\s*ta['’]lim|muammoli/, 'PM.GEN.08'],
    [/didaktik|nazariya.*amaliyot|ta['’]lim\s*tamoyil/, 'PM.GEN.02'],
    [/qobiliyat|pedagogik\s*xayol|perseptiv|oldindan\s*ko['’]r/, 'PM.GEN.07'],
    [/etik|takt|pedagogik\s*texnika|nutq\s*madaniyat/, 'PM.GEN.06'],
    [/sinf\s*rahbar/, 'PM.GEN.05'],
    [/darsni\s*rejal|sinf\s*boshqar|dars\s*tur/, 'PM.GEN.04'],
    [/tarbiya|tarbiyaviy/, 'PM.GEN.03'],
    [/metodika|informatika|dasturlash|algoritm/, 'PM.MET.02']
  ]
  for (const [re, code] of patterns) if (re.test(t)) found.add(code)
  return [...found]
}

const REVIEW_MARKERS = /(test|savol|variant|tushgan|mavzu|metod|dars|standart|pedagog|didakt|texnolog|qobiliyat|baholash|muhit|akvarium|asalari)/i

export function curateTelegramExport(exportData) {
  if (!exportData || !Array.isArray(exportData.messages)) {
    throw new Error('Expected Telegram Desktop JSON with messages array')
  }
  if (!EXPECTED_NAME.test(String(exportData.name ?? ''))) {
    throw new Error('Export channel name does not match Pedmahorat Guli; stop instead of misattributing')
  }

  const unique = new Set()
  const candidates = []
  const counts = { total: exportData.messages.length, empty: 0, ignored: 0, duplicates: 0, candidates: 0 }
  for (const message of exportData.messages) {
    if (message?.type !== 'message') { counts.ignored++; continue }
    const text = flattenTelegramText(message.text).trim()
    if (!text) { counts.empty++; continue }
    if (!REVIEW_MARKERS.test(text)) { counts.ignored++; continue }
    const norm = text.toLocaleLowerCase('uz-UZ').replace(/\s+/g,' ').trim()
    const fingerprint = createHash('sha256').update(norm).digest('hex')
    if (unique.has(fingerprint)) { counts.duplicates++; continue }
    unique.add(fingerprint)
    const id = Number(message.id)
    if (!Number.isSafeInteger(id) || id <= 0) { counts.ignored++; continue }
    candidates.push({
      source_channel: '@' + CANONICAL_HANDLE,
      source_url: 'https://t.me/' + CANONICAL_HANDLE + '/' + id,
      telegram_message_id: id,
      date: typeof message.date === 'string' ? message.date : null,
      source_text_hash: fingerprint,
      suggested_constructs: classifyTopic(text),
      review_status: 'needs_manual_review',
      provenance_status: 'public_post_unverified',
      rights_status: 'not_cleared',
      answer_key_status: 'not_verified',
      claimed_exam_year: null,
      // Only a LOCAL, non-public review file may contain channel text.
      private_review_text: text
    })
  }
  counts.candidates = candidates.length
  return {
    _notice: 'PRIVATE reviewer work product. Copyright, accuracy and provenance must be verified before any original source material is republished.',
    source_channel: '@' + CANONICAL_HANDLE,
    generated_from: 'user-provided-authorized-telegram-desktop-export',
    counts,
    candidates
  }
}

/** Forbid writing a raw export/copyrighted corpus inside this Git repository. */
export function assertPrivatePath(inputPath, outputPath, projectRoot) {
  const root = resolve(projectRoot)
  for (const [name, raw] of [['Input',inputPath],['Output',outputPath]]) {
    const p = resolve(raw)
    const rel = relative(root, p)
    if (!rel.startsWith('..') && !rel.startsWith('../') && rel !== '' && !rel.startsWith('..\\')) {
      throw new Error(name + ' path must be OUTSIDE the repository; never commit source texts')
    }
  }
}

async function main() {
  const [inFile, outFile] = process.argv.slice(2)
  if (!inFile || !outFile) {
    console.error('Usage: node scripts/curate-pedguli-export.mjs /private/export/result.json /private/review/pedguli-review.json')
    process.exitCode = 2
    return
  }
  assertPrivatePath(inFile, outFile, process.cwd())
  const input = JSON.parse(await readFile(resolve(inFile), 'utf8'))
  const report = curateTelegramExport(input)
  await mkdir(dirname(resolve(outFile)), { recursive: true, mode: 0o700 })
  await writeFile(resolve(outFile), JSON.stringify(report, null, 2), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
  console.log(JSON.stringify(report.counts))
  console.log('Review file written outside repository. NO questions published.')
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })
}
