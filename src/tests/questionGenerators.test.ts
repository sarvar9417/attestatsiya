import { describe, expect, it } from 'vitest'
import {
  axborotHajmiGenerator,
  getQuestionGenerator,
  ipMaskaGenerator,
  ipMath,
  mantiqAmalGenerator,
  QUESTION_GENERATORS,
  sanoqSistemaGenerator,
  type GeneratedQuestion,
} from '../lib/exam/generators'

function selectedY1Text(question: GeneratedQuestion): string {
  const key = question.key
  if (key.kind !== 'Y1') throw new Error('expected_y1')
  const option = question.options.find(item => item.id === key.optionId)
  if (!option) throw new Error('missing_correct_option')
  return option.content
}

function validateKey(question: GeneratedQuestion): void {
  const key = question.key

  if (key.kind === 'Y1') {
    expect(question.format).toBe('Y1')
    expect(
      question.options.some(
        option => option.side === 'a' && option.id === key.optionId,
      ),
    ).toBe(true)
    return
  }

  if (key.kind === 'Y2') {
    expect(question.format).toBe('Y2')
    const left = new Set(
      question.options.filter(option => option.side === 'a').map(option => option.id),
    )
    const right = new Set(
      question.options.filter(option => option.side === 'b').map(option => option.id),
    )
    expect(Object.keys(key.pairs).sort()).toEqual([...left].sort())
    expect(new Set(Object.values(key.pairs)).size).toBe(left.size)
    for (const rightId of Object.values(key.pairs)) {
      expect(right.has(rightId)).toBe(true)
    }
    return
  }

  expect(question.format).toBe('Y3')
  const optionIds = question.options.map(option => option.id).sort()
  expect([...key.order].sort()).toEqual(optionIds)
  expect(new Set(key.order).size).toBe(optionIds.length)
}

describe('T-012 parametrik savol generatorlari', () => {
  it('4 generator va 9 rasmiy konstruktni qoplaydi', () => {
    expect(QUESTION_GENERATORS).toHaveLength(4)
    expect(
      QUESTION_GENERATORS.flatMap(generator => generator.constructCodes).sort(),
    ).toEqual(
      [
        'S1.INFO.04',
        'S1.INFO.05',
        'S1.INFO.06',
        'S3.LOGIC.02',
        'S3.LOGIC.04',
        'S3.NUM.01',
        'S3.NUM.02',
        'S3.NUM.03',
        'S6.NET.03',
      ].sort(),
    )
  })

  it('bir xil seed aynan bir xil savol beradi', () => {
    for (const generator of QUESTION_GENERATORS) {
      expect(generator.generate('stable-42')).toEqual(
        generator.generate('stable-42'),
      )
    }
  })

  it('har generator 100 seedda takrorlanmaydigan savol beradi', () => {
    for (const generator of QUESTION_GENERATORS) {
      const signatures = Array.from({ length: 100 }, (_, seed) => {
        const question = generator.generate(seed)
        return JSON.stringify({
          stem: question.stem,
          options: question.options
            .map(option => `${option.side}:${option.content}`)
            .sort(),
        })
      })

      expect(
        new Set(signatures).size,
        `${generator.name} 100 seed uniqueness`,
      ).toBe(100)
    }
  })

  it('100 seedning har birida format va answer key ichki invariantlari to‘g‘ri', () => {
    for (const generator of QUESTION_GENERATORS) {
      for (let seed = 0; seed < 100; seed += 1) {
        const question = generator.generate(seed)
        expect(question.stem.length).toBeGreaterThan(10)
        expect(question.explanation.length).toBeGreaterThan(10)
        expect(question.options.length).toBeGreaterThanOrEqual(3)
        validateKey(question)
      }
    }
  })

  it('noma’lum konstruktni jim fallback qilmaydi', () => {
    expect(() =>
      axborotHajmiGenerator.generate(1, 'S9.UNKNOWN'),
    ).toThrow('unsupported_construct:S9.UNKNOWN')
    expect(() => getQuestionGenerator('unknown')).toThrow(
      'unknown_generator:unknown',
    )
  })
})

describe('axborotHajmi mustaqil hisob tekshiruvlari', () => {
  it('KiB → bayt formulasi mustaqil hisobga mos', () => {
    const question = axborotHajmiGenerator.generate(17, 'S1.INFO.04')
    const match = question.stem.match(/(\d+) KiB/)
    expect(match).not.toBeNull()
    const kib = Number(match?.[1])
    expect(selectedY1Text(question)).toBe(`${kib * 1024} bayt`)
  })

  it('matn hajmi: belgilar × bit / 8', () => {
    const question = axborotHajmiGenerator.generate(23, 'S1.INFO.05')
    const match = question.stem.match(/(\d+) ta belgidan.* (\d+) bit/)
    expect(match).not.toBeNull()
    const chars = Number(match?.[1])
    const bits = Number(match?.[2])
    expect(selectedY1Text(question)).toBe(`${(chars * bits) / 8} bayt`)
  })

  it('uzatish vaqti: MB × 8 / Mbit/s', () => {
    const question = axborotHajmiGenerator.generate(31, 'S1.INFO.06')
    const match = question.stem.match(/([\d.]+) MB fayl (\d+) Mbit\/s/)
    expect(match).not.toBeNull()
    const mb = Number(match?.[1])
    const speed = Number(match?.[2])
    expect(selectedY1Text(question)).toBe(`${(mb * 8) / speed} soniya`)
  })
})

describe('sanoqSistema mustaqil hisob tekshiruvlari', () => {
  it('o‘nlikdan boshqa asosga o‘tkazishni Number.toString bilan tekshiradi', () => {
    const question = sanoqSistemaGenerator.generate(41, 'S3.NUM.02')
    const match = question.stem.match(/(\d+)₁₀ sonini (\d+) lik/)
    expect(match).not.toBeNull()
    const decimal = Number(match?.[1])
    const base = Number(match?.[2])
    expect(selectedY1Text(question)).toBe(decimal.toString(base).toUpperCase())
  })

  it('Y3 tartiblash keyi sonlarning haqiqiy qiymati bo‘yicha o‘sadi', () => {
    let question = sanoqSistemaGenerator.generate(0, 'S3.NUM.03')
    for (let seed = 1; question.format !== 'Y3' && seed < 100; seed += 1) {
      question = sanoqSistemaGenerator.generate(seed, 'S3.NUM.03')
    }
    expect(question.key.kind).toBe('Y3')
    const key = question.key
    if (key.kind !== 'Y3') return

    const byId = new Map(question.options.map(option => [option.id, option.content]))
    const values = key.order.map(id => {
      const text = byId.get(id)
      if (!text) throw new Error('missing_order_option')
      const match = text.match(/^([0-9A-F]+)₍(\d+)₎$/)
      if (!match) throw new Error('invalid_base_label')
      return parseInt(match[1], Number(match[2]))
    })

    expect(values).toEqual([...values].sort((a, b) => a - b))
  })
})

describe('IP maska mustaqil formulalari', () => {
  it('CIDR prefikslarini klassik dotted-decimal maskaga aylantiradi', () => {
    expect(ipMath.prefixToMask(16)).toBe('255.255.0.0')
    expect(ipMath.prefixToMask(24)).toBe('255.255.255.0')
    expect(ipMath.prefixToMask(26)).toBe('255.255.255.192')
    expect(ipMath.prefixToMask(30)).toBe('255.255.255.252')
  })

  it('network address bitwise AND natijasini beradi', () => {
    expect(ipMath.networkAddress([192, 168, 1, 130], 24)).toBe('192.168.1.0')
    expect(ipMath.networkAddress([192, 168, 1, 130], 26)).toBe('192.168.1.128')
    expect(ipMath.networkAddress([10, 20, 30, 40], 16)).toBe('10.20.0.0')
  })

  it('Y2 maska matching variantini ham hosil qila oladi', () => {
    let question = ipMaskaGenerator.generate(0)
    for (let seed = 1; question.format !== 'Y2' && seed < 100; seed += 1) {
      question = ipMaskaGenerator.generate(seed)
    }
    expect(question.format).toBe('Y2')
    validateKey(question)
  })
})

describe('mantiqAmal generatori', () => {
  it('mantiqiy amal va rostlik jadvali konstruktlarini alohida generatsiya qiladi', () => {
    const operation = mantiqAmalGenerator.generate(5, 'S3.LOGIC.02')
    const truthTable = mantiqAmalGenerator.generate(5, 'S3.LOGIC.04')

    expect(operation.constructCode).toBe('S3.LOGIC.02')
    expect(operation.cognitive).toBe('qollash')
    expect(truthTable.constructCode).toBe('S3.LOGIC.04')
    expect(truthTable.cognitive).toBe('mulohaza')
    expect(truthTable.stem).toContain('rostlik jadvalida')
  })
})
