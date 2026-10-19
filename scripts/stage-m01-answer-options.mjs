/**
 * Review-only tool for the PUBLIC 400-item M01 authoring bank.
 *
 * USAGE:
 *   node scripts/stage-m01-answer-options.mjs
 *   node scripts/stage-m01-answer-options.mjs --emit-review > /tmp/m01-review.json
 *
 * This tool NEVER edits input files, migrations, a live database or published
 * questions. The transformation is deterministic solely for editorial diff
 * reproducibility; it is NOT a secrecy boundary or runtime exam randomizer.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = new URL('../Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json', import.meta.url)
const REVIEW_SALT = 'M01-2026-review-option-order-v1'
const ALPHABET = 'ABCD'

// A noncryptographic stable hash, followed by xorshift32. Never use this for
// secure exam option randomization or unpredictability against adversaries.
function fnv1a(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

function permutation(question) {
  const order = question.options.map((_, index) => index)
  let state = fnv1a(REVIEW_SALT + '|' + question.id + '|' + question.stem)
  for (let i = order.length - 1; i > 0; i -= 1) {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    const j = (state >>> 0) % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function stageOptions(bank) {
  let oldPredictable = 0
  let newPredictable = 0
  let changedKeyPositions = 0
  const newPositions = [0, 0, 0, 0]
  const staged = {
    ...bank,
    chapters: bank.chapters.map(chapter => ({
      ...chapter,
      questions: chapter.questions.map(q => {
        if (q.options.length !== 4 || !Number.isInteger(q.answer_index) ||
          q.answer_index < 0 || q.answer_index >= q.options.length) {
          throw Error('Invalid four-option answer contract: ' + q.id)
        }
        if (q.answer !== ALPHABET[q.answer_index]) {
          throw Error('Original answer letter mismatch: ' + q.id)
        }
        const correctText = q.options[q.answer_index]
        const oldPatternPosition = (q.chapter + q.number - 2) % 4
        if (q.answer_index === oldPatternPosition) oldPredictable += 1
        const order = permutation(q)
        const answerIndex = order.indexOf(q.answer_index)
        const options = order.map(i => q.options[i])
        if (options[answerIndex] !== correctText) throw Error('Answer remap lost correct text: ' + q.id)
        if (answerIndex !== q.answer_index) changedKeyPositions += 1
        if (answerIndex === oldPatternPosition) newPredictable += 1
        newPositions[answerIndex] += 1
        return { ...q, options, answer_index: answerIndex, answer: ALPHABET[answerIndex] }
      }),
    })),
  }
  const all = staged.chapters.flatMap(c => c.questions)
  return { staged, audit: {
    totalQuestions: all.length,
    originalPatternMatches: oldPredictable,
    candidatePatternMatches: newPredictable,
    changedAnswerPositions: changedKeyPositions,
    candidatePositionCounts: newPositions,
    publishedChanged: false,
    outputMode: 'editorial_candidate_only',
  } }
}

function main() {
  const args = process.argv.slice(2)
  if (args.length > 1 || (args.length && args[0] !== '--emit-review' && args[0] !== '--audit')) {
    throw Error('Only --audit and --emit-review are supported. There are no write options.')
  }
  const original = JSON.parse(readFileSync(SOURCE, 'utf8'))
  const { staged, audit } = stageOptions(original)
  if (args[0] === '--emit-review') {
    process.stdout.write(JSON.stringify(staged, null, 2) + '\n')
  } else {
    process.stdout.write(JSON.stringify(audit, null, 2) + '\n')
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main()
}
