import type { GeneratedOption, GeneratedQuestion, QuestionGenerator } from './types'
import { asSeed, ensureConstruct, fingerprint, SeededRng } from './rng'

const CONSTRUCTS = ['S3.LOGIC.02', 'S3.LOGIC.04'] as const
const OPS = ['AND', 'OR', 'XOR'] as const
type Op = (typeof OPS)[number]

interface LogicExpression {
  text: string
  variables: readonly [string, string, string]
  evaluate: (a: boolean, b: boolean, c: boolean) => boolean
  fingerprintParts: readonly (string | number)[]
}

function applyOp(left: boolean, right: boolean, op: Op): boolean {
  if (op === 'AND') return left && right
  if (op === 'OR') return left || right
  return left !== right
}

function maybeNot(value: boolean, negated: boolean): boolean {
  return negated ? !value : value
}

function atom(name: string, negated: boolean): string {
  return negated ? `¬${name}` : name
}

const VARIABLE_SETS = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['X', 'Y', 'Z'],
  ['A', 'X', 'Y'],
  ['M', 'N', 'K'],
  ['U', 'V', 'W'],
  ['D', 'E', 'F'],
  ['L', 'M', 'N'],
] as const

function buildExpression(rng: SeededRng): LogicExpression {
  const variables = rng.shuffle(rng.pick(VARIABLE_SETS)) as [string, string, string]
  const op1 = rng.pick(OPS)
  const op2 = rng.pick(OPS)
  const negA = rng.int(0, 1) === 1
  const negB = rng.int(0, 1) === 1
  const negC = rng.int(0, 1) === 1
  const shape = rng.int(0, 1)

  const aText = atom(variables[0], negA)
  const bText = atom(variables[1], negB)
  const cText = atom(variables[2], negC)

  if (shape === 0) {
    return {
      text: `(${aText} ${op1} ${bText}) ${op2} ${cText}`,
      variables,
      evaluate: (a, b, c) =>
        applyOp(
          applyOp(maybeNot(a, negA), maybeNot(b, negB), op1),
          maybeNot(c, negC),
          op2,
        ),
      fingerprintParts: [variables.join(','), shape, op1, op2, Number(negA), Number(negB), Number(negC)],
    }
  }

  return {
    text: `${aText} ${op1} (${bText} ${op2} ${cText})`,
    variables,
    evaluate: (a, b, c) =>
      applyOp(
        maybeNot(a, negA),
        applyOp(maybeNot(b, negB), maybeNot(c, negC), op2),
        op1,
      ),
    fingerprintParts: [variables.join(','), shape, op1, op2, Number(negA), Number(negB), Number(negC)],
  }
}

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
  const candidates =
    correct === 'rost'
      ? ['yolg‘on', 'aniqlab bo‘lmaydi', 'ifoda xato']
      : ['rost', 'aniqlab bo‘lmaydi', 'ifoda xato']
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
  const expression = buildExpression(rng)
  const a = rng.int(0, 1) === 1
  const b = rng.int(0, 1) === 1
  const c = rng.int(0, 1) === 1
  const result = expression.evaluate(a, b, c)

  return y1(
    seed,
    rng,
    'S3.LOGIC.02',
    `${expression.variables[0]} = ${boolWord(a)}, ${expression.variables[1]} = ${boolWord(b)}, ${expression.variables[2]} = ${boolWord(c)} bo‘lsa, ${expression.text} qiymatini toping.`,
    boolWord(result),
    `Amallar qavs va inkor ustuvorligi bo‘yicha bajarilganda natija ${boolWord(result)}.`,
    [
      '02',
      ...expression.fingerprintParts,
      Number(a),
      Number(b),
      Number(c),
    ],
    3,
  )
}

function generateTruthTable(seed: string, rng: SeededRng): GeneratedQuestion {
  const expression = buildExpression(rng)
  let trueRows = 0

  for (const a of [false, true]) {
    for (const b of [false, true]) {
      for (const c of [false, true]) {
        if (expression.evaluate(a, b, c)) trueRows += 1
      }
    }
  }

  const distractors = rng
    .shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8].filter(value => value !== trueRows))
    .slice(0, 3)
  const values = rng.shuffle([trueRows, ...distractors])
  const options: GeneratedOption[] = values.map((value, index) => ({
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
    key: { kind: 'Y1', optionId: options[values.indexOf(trueRows)].id },
    explanation: `8 ta kombinatsiyani tekshirganda ${trueRows} ta qatorda ifoda rost bo‘ladi.`,
    fingerprint: fingerprint([
      'mantiqAmal',
      '04',
      ...expression.fingerprintParts,
      trueRows,
    ]),
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
