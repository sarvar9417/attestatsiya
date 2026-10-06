import type { GeneratedOption, GeneratedQuestion, QuestionGenerator } from './types'
import { asSeed, ensureConstruct, fingerprint, SeededRng } from './rng'

const CONSTRUCTS = ['S3.NUM.01', 'S3.NUM.02', 'S3.NUM.03'] as const
const BASES = [2, 8, 16] as const

function repr(value: number, base: number): string {
  return value.toString(base).toUpperCase()
}

function makeY1(
  seed: string,
  rng: SeededRng,
  constructCode: string,
  stem: string,
  correct: string,
  wrong: readonly string[],
  explanation: string,
  fingerprintParts: readonly (string | number)[],
  difficulty: 1 | 2 | 3 | 4 | 5,
): GeneratedQuestion {
  const unique = [...new Set(wrong.filter(value => value !== correct))]
  if (unique.length < 3) throw new Error('insufficient_unique_distractors')
  const values = rng.shuffle([correct, ...unique.slice(0, 3)])
  const options: GeneratedOption[] = values.map((content, index) => ({
    id: `o${index + 1}`,
    side: 'a',
    content,
  }))

  return {
    generator: 'sanoqSistema',
    seed,
    constructCode,
    groupCode: 'S3.NUM',
    format: 'Y1',
    cognitive: 'qollash',
    difficulty,
    stem,
    options,
    key: { kind: 'Y1', optionId: options[values.indexOf(correct)].id },
    explanation,
    fingerprint: fingerprint(['sanoqSistema', ...fingerprintParts]),
  }
}

function generateBaseRecognition(seed: string, rng: SeededRng): GeneratedQuestion {
  const base = rng.pick(BASES)
  const value = rng.int(32, 511)
  const representation = repr(value, base)
  const maxDigit = representation
    .split('')
    .map(char => parseInt(char, 16))
    .reduce((max, digit) => Math.max(max, digit), 0)
  const minimumBase = Math.max(2, maxDigit + 1)

  return makeY1(
    seed,
    rng,
    'S3.NUM.01',
    `${representation} yozuvi uchun mumkin bo‘lgan eng kichik sanoq sistemasi asosi qaysi?`,
    String(minimumBase),
    [String(minimumBase + 1), String(minimumBase + 2), String(minimumBase + 3), String(minimumBase + 4)],
    `Eng katta raqam qiymati ${maxDigit}; asos undan katta bo‘lishi kerak. Eng kichik asos — ${minimumBase}.`,
    ['01', representation, minimumBase],
    2,
  )
}

function generateConversion(seed: string, rng: SeededRng): GeneratedQuestion {
  const base = rng.pick(BASES)
  const value = rng.int(25, 1500)
  const correct = repr(value, base)

  return makeY1(
    seed,
    rng,
    'S3.NUM.02',
    `${value}₁₀ sonini ${base} lik sanoq sistemasiga o‘tkazing.`,
    correct,
    [
      repr(value + 1, base),
      repr(Math.max(1, value - 1), base),
      repr(value + base, base),
      repr(Math.floor(value / base), base),
    ],
    `${value} sonini ${base} ga ketma-ket bo‘lish orqali ${correct}₍${base}₎ hosil bo‘ladi.`,
    ['02', value, base],
    3,
  )
}

function generateArithmeticOrOrder(seed: string, rng: SeededRng): GeneratedQuestion {
  const base = rng.pick([2, 8] as const)
  const a = rng.int(8, 80)
  const b = rng.int(4, 50)

  if (rng.int(0, 1) === 0) {
    const sum = a + b
    return makeY1(
      seed,
      rng,
      'S3.NUM.03',
      `${repr(a, base)}₍${base}₎ + ${repr(b, base)}₍${base}₎ yig‘indisini shu asosda toping.`,
      repr(sum, base),
      [
        repr(sum + 1, base),
        repr(Math.max(1, sum - 1), base),
        repr(a * b, base),
        repr(Math.abs(a - b), base),
      ],
      `O‘nlik qiymatlar: ${a} + ${b} = ${sum}. ${sum}₁₀ = ${repr(sum, base)}₍${base}₎.`,
      ['03-add', a, b, base],
      3,
    )
  }

  const values = [a, a + rng.int(2, 9), a + rng.int(12, 24)]
    .sort((x, y) => x - y)
  const rendered = values.map((value, index) => ({
    id: `o${index + 1}`,
    side: 'a' as const,
    content: `${repr(value, base)}₍${base}₎`,
  }))
  const shuffled = rng.shuffle(rendered)

  return {
    generator: 'sanoqSistema',
    seed,
    constructCode: 'S3.NUM.03',
    groupCode: 'S3.NUM',
    format: 'Y3',
    cognitive: 'qollash',
    difficulty: 3,
    stem: 'Sonlarni kichigidan kattasiga qarab tartiblang.',
    options: shuffled,
    key: { kind: 'Y3', order: rendered.map(option => option.id) },
    explanation: `O‘nlik qiymatlar mos ravishda ${values.join(', ')}; shuning uchun tartib shu ketma-ketlikda.`,
    fingerprint: fingerprint(['sanoqSistema', '03-order', ...values, base]),
  }
}

export const sanoqSistemaGenerator: QuestionGenerator = {
  name: 'sanoqSistema',
  constructCodes: CONSTRUCTS,
  generate(inputSeed, requestedConstruct) {
    const seed = asSeed(inputSeed)
    const rng = new SeededRng(`sanoqSistema:${seed}`)
    const construct = ensureConstruct(requestedConstruct, CONSTRUCTS, rng)

    if (construct === 'S3.NUM.01') return generateBaseRecognition(seed, rng)
    if (construct === 'S3.NUM.02') return generateConversion(seed, rng)
    return generateArithmeticOrOrder(seed, rng)
  },
}
