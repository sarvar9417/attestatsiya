import type { GeneratedOption, GeneratedQuestion, QuestionGenerator } from './types'
import { asSeed, ensureConstruct, fingerprint, SeededRng } from './rng'

const CONSTRUCTS = ['S6.NET.03'] as const
const COMMON_PREFIXES = [8, 16, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] as const

function prefixToMask(prefix: number): string {
  const bits = '1'.repeat(prefix).padEnd(32, '0')
  return [0, 8, 16, 24]
    .map(offset => parseInt(bits.slice(offset, offset + 8), 2))
    .join('.')
}

function ipToInt(parts: readonly number[]): number {
  return (
    ((parts[0] << 24) >>> 0) +
    (parts[1] << 16) +
    (parts[2] << 8) +
    parts[3]
  ) >>> 0
}

function intToIp(value: number): string {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join('.')
}

function networkAddress(ip: readonly number[], prefix: number): string {
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  return intToIp(ipToInt(ip) & mask)
}

function generateMatching(seed: string, rng: SeededRng): GeneratedQuestion {
  const prefixPool = Array.from({ length: 23 }, (_, index) => index + 8)
  const prefixes = rng.shuffle(prefixPool).slice(0, 4).sort((a, b) => a - b)
  const left = prefixes.map((prefix, index) => ({
    id: `l${index + 1}`,
    side: 'a' as const,
    content: `/${prefix}`,
  }))
  const rightCanonical = prefixes.map((prefix, index) => ({
    id: `r${index + 1}`,
    side: 'b' as const,
    content: prefixToMask(prefix),
  }))
  const right = rng.shuffle(rightCanonical)
  const pairs = Object.fromEntries(
    left.map((option, index) => [option.id, rightCanonical[index].id]),
  )

  return {
    generator: 'ipMaska',
    seed,
    constructCode: 'S6.NET.03',
    groupCode: 'S6.NET',
    format: 'Y2',
    cognitive: 'qollash',
    difficulty: 3,
    stem: 'CIDR prefikslarini mos tarmoq maskalari bilan juftlang.',
    options: [...left, ...right],
    key: { kind: 'Y2', pairs },
    explanation: prefixes
      .map(prefix => `/${prefix} = ${prefixToMask(prefix)}`)
      .join('; '),
    fingerprint: fingerprint(['ipMaska', 'match', ...prefixes]),
  }
}

function generateNetwork(seed: string, rng: SeededRng): GeneratedQuestion {
  const prefix = rng.pick(COMMON_PREFIXES.filter(value => value >= 20))
  const ip = [
    10 + rng.int(0, 180),
    rng.int(0, 255),
    rng.int(0, 255),
    rng.int(1, 254),
  ]
  const correct = networkAddress(ip, prefix)
  const mask = prefixToMask(prefix)
  const candidates = [
    ip.join('.'),
    networkAddress([ip[0], ip[1], ip[2], 0], 24),
    networkAddress([ip[0], ip[1], 0, 0], 16),
    intToIp((ipToInt(ip) + 1) >>> 0),
  ]
  const wrong = [...new Set(candidates.filter(value => value !== correct))].slice(0, 3)
  while (wrong.length < 3) {
    wrong.push(intToIp((ipToInt(ip) + wrong.length + 2) >>> 0))
  }
  const values = rng.shuffle([correct, ...wrong])
  const options: GeneratedOption[] = values.map((content, index) => ({
    id: `o${index + 1}`,
    side: 'a',
    content,
  }))

  return {
    generator: 'ipMaska',
    seed,
    constructCode: 'S6.NET.03',
    groupCode: 'S6.NET',
    format: 'Y1',
    cognitive: 'qollash',
    difficulty: 4,
    stem: `${ip.join('.')} /${prefix} (${mask}) hosti qaysi tarmoq manziliga tegishli?`,
    options,
    key: { kind: 'Y1', optionId: options[values.indexOf(correct)].id },
    explanation: `IP manzil va ${mask} maska bitwise AND qilinadi. Natija: ${correct}.`,
    fingerprint: fingerprint(['ipMaska', 'network', ...ip, prefix]),
  }
}

export const ipMaskaGenerator: QuestionGenerator = {
  name: 'ipMaska',
  constructCodes: CONSTRUCTS,
  generate(inputSeed, requestedConstruct) {
    const seed = asSeed(inputSeed)
    const rng = new SeededRng(`ipMaska:${seed}`)
    ensureConstruct(requestedConstruct, CONSTRUCTS, rng)

    return rng.int(0, 3) === 0
      ? generateMatching(seed, rng)
      : generateNetwork(seed, rng)
  },
}

export const ipMath = {
  prefixToMask,
  networkAddress,
}
