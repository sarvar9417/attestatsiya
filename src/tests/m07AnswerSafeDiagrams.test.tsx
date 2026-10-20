import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import ExamQuestionAssets, { safeAsset } from '../features/exam/questions/ExamQuestionAssets'

const SOURCE_IDS = [
  'm07_sl2_05_014', 'm07_sl2_05_018', 'm07_sl2_05_020',
  'm07_sl2_05_023', 'm07_sl2_05_028', 'm07_sl2_06_015',
  'm07_sl2_06_020', 'm07_sl2_06_022', 'm07_sl2_06_025',
  'm07_sl2_06_026', 'm07_sl2_06_027',
]

describe('M07 source-only graphics release quality gates', () => {
  it('has 11 real first-party SVGs; none disclose the drawn answer', () => {
    expect(new Set(SOURCE_IDS).size).toBe(11)
    for (const id of SOURCE_IDS) {
      const path = join(process.cwd(), 'public', 'm07-source-blocks', id + '.svg')
      expect(existsSync(path), id).toBe(true)
      const svg = readFileSync(path, 'utf8')
      expect(svg).toContain('<svg ')
      expect(svg).toContain('dastur buyruqlari')
      expect(svg).not.toMatch(/Shakl tasviri:|Kvadrat konturi|Teng tomonli uchburchak konturi/i)
    }
  })

  it('shows audited code-only images and rejects forged paths', () => {
    for (const id of SOURCE_IDS) {
      const src = '/m07-source-blocks/' + id + '.svg'
      const value = { kind: 'image', diagram_id: id, src, alt: 'LOGO yoki Scratch kodi' }
      expect(safeAsset(value)?.src).toBe(src)
      const html = renderToStaticMarkup(<ExamQuestionAssets assets={[value]} />)
      expect(html).toContain(src)
      expect(safeAsset({ ...value, src: 'https://external.invalid/figure.svg' })).toBeNull()
      expect(safeAsset({ ...value, src: '/m07-source-blocks/../private.svg' })).toBeNull()
    }
    expect(safeAsset({
      kind: 'image', diagram_id: 'm07_sl2_fake', src: '/m07-source-blocks/m07_sl2_fake.svg',
    })).toBeNull()
  })
})
