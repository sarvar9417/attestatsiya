#!/usr/bin/env node
/**
 * Run metadata-only preflight on an owner-held private M08 Y3 review JSON file.
 * Does NOT execute uploaded programs, connect to DB, or publish any question.
 *
 * npm run content:m08:y3:validate -- /secure/path/private-review.json
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { validateM08Y3ReviewBatch } from '../src/lib/content/m08Y3ReviewPreflight'

async function main(): Promise<void> {
  const filename = process.argv[2]
  if (!filename) {
    console.error('Usage: npm run content:m08:y3:validate -- <private-json-path>')
    process.exitCode = 2
    return
  }
  let payload: unknown
  try {
    payload = JSON.parse(await readFile(resolve(filename), 'utf8')) as unknown
  } catch {
    console.error('Cannot read or parse private JSON. Content not printed.')
    process.exitCode = 2
    return
  }

  const result = validateM08Y3ReviewBatch(payload)
  console.log('M08 Y3 review: checked=' + result.count +
    ', passed=' + (result.count - new Set(result.failures.map(x => x.index)).size) +
    ', flagged=' + result.failures.length)
  for (const failure of result.failures) {
    console.error('Index ' + failure.index + ': ' + failure.codes.join(', '))
  }
  console.log('Preflight is structural only; program output/answer meaning and source linkage need independent review.')
  if (result.failures.length) process.exitCode = 1
}

void main()
