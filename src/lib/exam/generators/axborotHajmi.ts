import type { GeneratedOption, GeneratedQuestion, QuestionGenerator } from './types'
import {
  asSeed,
  ensureConstruct,
  fingerprint,
  SeededRng,
  uniqueNumbers,
} from './rng'

const CONSTRUCTS = ['S1.INFO.04', 'S1.INFO.05', 'S1.INFO.06'] as const

function y1Options(
  rng: SeededRng,
  correct: number,
  distractors: readonly number[],
  unit: string,
): { options: GeneratedOption[]; correctId: string } {
  const wrong = uniqueNumbers(correct, distractors, 3)
  const values = rng.shuffle([correct, ...wrong])
  const options = values.map((value, index) => ({
    id: `o${index + 1}`,
    side: 'a' as const,
    content: `${value} ${unit}`,
  }))
  const correctIndex = values.indexOf(correct)
  return { options, correctId: options[correctIndex].id }
}

function generateUnitConversion(seed: string, rng: SeededRng): GeneratedQuestion {
  const kib = rng.int(2, 255)
  const correct = kib * 1024
  const { options, correctId } = y1Options(
    rng,
    correct,
    [kib * 1000, correct * 8, Math.floor(correct / 8), correct + 1024],
    'bayt',
  )

  return {
    generator: 'axborotHajmi',
    seed,
    constructCode: 'S1.INFO.04',
    groupCode: 'S1.INFO',
    format: 'Y1',
    cognitive: 'qollash',
    difficulty: 2,
    stem: `${kib} KiB axborot necha baytga teng? 1 KiB = 1024 bayt deb oling.`,
    options,
    key: { kind: 'Y1', optionId: correctId },
    explanation: `${kib} × 1024 = ${correct} bayt.`,
    fingerprint: fingerprint(['axborotHajmi', '04', kib]),
  }
}

function generateTextVolume(seed: string, rng: SeededRng): GeneratedQuestion {
  const chars = rng.int(120, 980)
  const bitsPerChar = rng.pick([8, 16, 32] as const)
  const correct = (chars * bitsPerChar) / 8
  const { options, correctId } = y1Options(
    rng,
    correct,
    [
      chars * bitsPerChar,
      Math.max(1, correct / 2),
      correct * 2,
      chars,
      chars * (bitsPerChar / 4),
    ],
    'bayt',
  )

  return {
    generator: 'axborotHajmi',
    seed,
    constructCode: 'S1.INFO.05',
    groupCode: 'S1.INFO',
    format: 'Y1',
    cognitive: 'qollash',
    difficulty: 3,
    stem: `${chars} ta belgidan iborat matnda har bir belgi ${bitsPerChar} bit bilan kodlangan. Matn hajmini baytda toping.`,
    options,
    key: { kind: 'Y1', optionId: correctId },
    explanation: `${chars} × ${bitsPerChar} = ${chars * bitsPerChar} bit; 8 ga bo‘lsak ${correct} bayt.`,
    fingerprint: fingerprint(['axborotHajmi', '05', chars, bitsPerChar]),
  }
}

function generateTransfer(seed: string, rng: SeededRng): GeneratedQuestion {
  const speedMbps = rng.pick([2, 4, 8, 16, 20, 25, 32, 40] as const)
  const seconds = rng.int(3, 40)
  const sizeMbit = speedMbps * seconds
  const sizeMb = sizeMbit / 8
  const correct = seconds
  const { options, correctId } = y1Options(
    rng,
    correct,
    [
      seconds * 8,
      Math.max(1, Math.floor(seconds / 2)),
      seconds + speedMbps,
      Math.max(1, seconds - 1),
    ],
    'soniya',
  )

  return {
    generator: 'axborotHajmi',
    seed,
    constructCode: 'S1.INFO.06',
    groupCode: 'S1.INFO',
    format: 'Y1',
    cognitive: 'qollash',
    difficulty: 3,
    stem: `${sizeMb} MB fayl ${speedMbps} Mbit/s tezlikda uzatilsa, ideal sharoitda uzatish qancha vaqt oladi?`,
    options,
    key: { kind: 'Y1', optionId: correctId },
    explanation: `${sizeMb} MB = ${sizeMbit} Mbit. Vaqt = hajm / tezlik = ${sizeMbit} / ${speedMbps} = ${seconds} soniya.`,
    fingerprint: fingerprint(['axborotHajmi', '06', sizeMbit, speedMbps]),
  }
}

export const axborotHajmiGenerator: QuestionGenerator = {
  name: 'axborotHajmi',
  constructCodes: CONSTRUCTS,
  generate(inputSeed, requestedConstruct) {
    const seed = asSeed(inputSeed)
    const rng = new SeededRng(`axborotHajmi:${seed}`)
    const construct = ensureConstruct(requestedConstruct, CONSTRUCTS, rng)

    if (construct === 'S1.INFO.04') return generateUnitConversion(seed, rng)
    if (construct === 'S1.INFO.05') return generateTextVolume(seed, rng)
    return generateTransfer(seed, rng)
  },
}
