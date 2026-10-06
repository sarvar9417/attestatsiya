import type { GeneratedOption, GeneratedQuestion, QuestionGenerator } from './types'
import { asSeed, ensureConstruct, fingerprint, SeededRng } from './rng'

const CONSTRUCTS = ['S3.LOGIC.02', 'S3.LOGIC.04'] as const

function boolWord(value: boolean): string {
  return value ? 'rost' : 'yolg‘on'
}

function y1(
  seed: string,
  rng: SeededRng,
  constructCode: string,
  stem: string,
  correct: string,
  explanation: string,
  fp: readonly (string | number)[],
  difficulty: 1 | 2 | 3 | 4 | 5,
): GeneratedQuestion {
  const candidates = correct === 'rost'
    ? ['yolg‘on', 'aniqlab bo‘lmaydi', 'ikkalasi ham']
    : ['rost', 'aniqlab bo‘lmaydi', 'ikkalasi ham']
  const values = rng.shuffle([correct, ...candidates])
  const options: GeneratedOption[] = values.map((content, index) => ({
    id: `o${index + 1}`,
    side: 'a',
    content,
  }))

  return {
    generator: 'mantiqAmal',
    seed,
    constructCode,
    groupCode: 'S3.LOGIC',
    format: 'Y1',
    cognitive: constructCode === 'S3.LOGIC.04' ? 'mulohaza' : 'qollash',
    difficulty,
    stem,
    options,
    key: { kind: 'Y1', optionId: options[values.indexOf(correct)].id },
    explanation,
    fingerprint: fingerprint(['mantiqAmal', ...fp]),
  }
}

function generateOperation(seed: string, rng: SeededRng): GeneratedQuestion {
  const a = rng.int(0, 1) === 1
  const b = rng.int(0, 1) === 1
  const op = rng.pick(['AND', 'OR', 'XOR'] as const)
  const result =
    op === 'AND' ? a && b :
    op === 'OR' ? a || b :
    a !== b

  return y1(
    seed,
    rng,
    'S3.LOGIC.02',
    `A = ${boolWord(a)}, B = ${boolWord(b)} bo‘lsa, A ${op} B qiymatini toping.`,
    boolWord(result),
    `${op} amalining rostlik qoidasiga ko‘ra natija ${boolWord(result)}.`,
    ['02', Number(a), Number(b), op],
    2,
  )
}

function generateTruthTable(seed: string, rng: SeededRng): GeneratedQuestion {
  const variant = rng.int(0, 3)
  const expressions = [
    {
      text: '(A ∧ B) ∨ C',
      evaluate: (a: boolean, b: boolean, c: boolean) => (a && b) || c,
    },
    {
      text: '¬A ∨ (B ∧ C)',
      evaluate: (a: boolean, b: boolean, c: boolean) => !a || (b && c),
    },
    {
      text: '(A ∨ B) ∧ ¬C',
      evaluate: (a: boolean, b: boolean, c: boolean) => (a || b) && !c,
    },
    {
      text: '(A ⊕ B) ∨ C',
      evaluate: (a: boolean, b: boolean, c: boolean) => (a !== b) || c,
    },
  ] as const
  const expression = expressions[variant]
  let trueRows = 0

  for (const a of [false, true]) {
    for (const b of [false, true]) {
      for (const c of [false, true]) {
        if (expression.evaluate(a, b, c)) trueRows += 1
      }
    }
  }

  const values = rng.shuffle([trueRows, ...[0, 1, 2, 3, 4, 5, 6, 7, 8]
    .filter(value => value !== trueRows)
    .slice(rng.int(0, 3), rng.int(0, 3) + 3)])
  const normalized = [trueRows, ...values.filter(value => value !== trueRows)]
    .slice(0, 4)
  const shuffled = rng.shuffle(normalized)
  const options: GeneratedOption[] = shuffled.map((value, index) => ({
    id: `o${index + 1}`,
    side: 'a',
    content: `${value} ta`,
  }))

  return {
    generator: 'mantiqAmal',
    seed,
    constructCode: 'S3.LOGIC.04',
    groupCode: 'S3.LOGIC',
    format: 'Y1',
    cognitive: 'mulohaza',
    difficulty: 4,
    stem: `${expression.text} ifodasi uchun 3 o‘zgaruvchili rostlik jadvalida nechta qatorda natija rost bo‘ladi?`,
    options,
    key: { kind: 'Y1', optionId: options[shuffled.indexOf(trueRows)].id },
    explanation: `8 ta kombinatsiyani tekshirganda ${trueRows} ta qatorda ifoda rost bo‘ladi.`,
    fingerprint: fingerprint(['mantiqAmal', '04', variant, trueRows]),
  }
}

export const mantiqAmalGenerator: QuestionGenerator = {
  name: 'mantiqAmal',
  constructCodes: CONSTRUCTS,
  generate(inputSeed, requestedConstruct) {
    const seed = asSeed(inputSeed)
    const rng = new SeededRng(`mantiqAmal:${seed}`)
    const construct = ensureConstruct(requestedConstruct, CONSTRUCTS, rng)

    if (construct === 'S3.LOGIC.02') return generateOperation(seed, rng)
    return generateTruthTable(seed, rng)
  },
}
