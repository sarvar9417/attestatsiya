// ═══════════════════════════════════════════════════════════════════════════
// vocabularyExport.test.ts — Lug'at eksport/import (toza funksiyalar)
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import {
  exportToCsv, exportToAnkiCsv, exportToJson, parseImportData,
} from '../vocabularyExport'
import type { GameWord } from '../../store/vocabularyStore'

function word(over: Partial<GameWord> = {}): GameWord {
  return {
    english: 'cat', uzbek: 'mushuk', level: 'A1', phonetic: '/kæt/', example: 'A cat sat.',
    box: 2, is_learned: false, correct_count: 3, wrong_count: 1,
    next_review: '2026-06-20', last_rating: 'good',
    ...over,
  } as GameWord
}

describe('exportToCsv', () => {
  it('starts with header row', () => {
    const csv = exportToCsv([word()])
    expect(csv.split('\n')[0]).toBe('english,uzbek,level,phonetic,example,box,is_learned,correct_count,wrong_count,next_review,last_rating')
  })

  it('escapes values containing commas/quotes', () => {
    const csv = exportToCsv([word({ example: 'Hello, "world"' })])
    // vergul + qo'shtirnoq bo'lgani uchun maydon qo'shtirnoqqa olinadi va " → ""
    expect(csv).toContain('"Hello, ""world"""')
  })

  it('emits one data line per word', () => {
    const csv = exportToCsv([word(), word({ english: 'dog', uzbek: 'it' })])
    expect(csv.split('\n')).toHaveLength(3) // header + 2
  })
})

describe('exportToAnkiCsv', () => {
  it('Front=english, Back=uzbek + example + phonetic', () => {
    const csv = exportToAnkiCsv([word()])
    expect(csv.split('\n')[0]).toBe('Front,Back')
    const back = csv.split('\n')[1]
    expect(back).toContain('cat')
    expect(back).toContain('<i>A cat sat.</i>')
    expect(back).toContain('[/kæt/]')
  })
})

describe('exportToJson', () => {
  it('round-trips to an array of rows', () => {
    const json = exportToJson([word()])
    const parsed = JSON.parse(json)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed[0].english).toBe('cat')
    expect(parsed[0].box).toBe(2)
  })
})

describe('parseImportData', () => {
  it('parses a valid JSON array', () => {
    const text = JSON.stringify([{ english: 'cat', uzbek: 'mushuk', level: 'A1' }])
    const { rows, errors } = parseImportData(text, 'vocab.json')
    expect(errors).toHaveLength(0)
    expect(rows[0].english).toBe('cat')
  })

  it('errors when JSON is not an array', () => {
    const { rows, errors } = parseImportData('{"x":1}', 'vocab.json')
    expect(rows).toHaveLength(0)
    expect(errors.join(' ')).toContain('array')
  })

  it('parses CSV with correct types', () => {
    const csv = 'english,uzbek,level,box,is_learned,correct_count,wrong_count\ncat,mushuk,A2,3,true,5,2'
    const { rows } = parseImportData(csv, 'vocab.csv')
    expect(rows[0].level).toBe('A2')
    expect(rows[0].box).toBe(3)            // raqamga aylandi
    expect(rows[0].is_learned).toBe(true)  // bool'ga aylandi
    expect(rows[0].correct_count).toBe(5)
  })

  it('rejects unsupported extension', () => {
    const { errors } = parseImportData('x', 'vocab.txt')
    expect(errors.join(' ')).toContain('.txt')
  })

  it('skips rows missing english/uzbek with an error', () => {
    const text = JSON.stringify([{ english: '', uzbek: 'x', level: 'A1' }, { english: 'cat', uzbek: 'mushuk', level: 'A1' }])
    const { rows, errors } = parseImportData(text, 'v.json')
    expect(rows).toHaveLength(1)
    expect(rows[0].english).toBe('cat')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('normalizes invalid level to A1', () => {
    const text = JSON.stringify([{ english: 'cat', uzbek: 'mushuk', level: 'C99' }])
    const { rows } = parseImportData(text, 'v.json')
    expect(rows[0].level).toBe('A1')
  })

  it('CSV export → import round-trip preserves english/uzbek', () => {
    const csv = exportToCsv([word({ example: 'Comma, here' })])
    const { rows } = parseImportData(csv, 'vocab.csv')
    expect(rows[0].english).toBe('cat')
    expect(rows[0].uzbek).toBe('mushuk')
    expect(rows[0].example).toBe('Comma, here') // escaping to'g'ri ochildi
  })
})
