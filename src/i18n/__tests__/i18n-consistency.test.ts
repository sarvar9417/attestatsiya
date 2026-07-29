import { describe, it, expect } from 'vitest'
import uz from '../uz.json'
import en from '../en.json'
import ru from '../ru.json'

type Dict = Record<string, string>
const locales: Record<string, Dict> = { uz: uz as Dict, en: en as Dict, ru: ru as Dict }

const allKeys = new Set<string>()
for (const d of Object.values(locales)) for (const k of Object.keys(d)) allKeys.add(k)

const placeholders = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(',')

describe('i18n tarjima izchilligi (F4-3)', () => {
  it('uchala til bir xil kalitlar to\'plamiga ega (parite)', () => {
    const missing: Record<string, string[]> = {}
    for (const [name, dict] of Object.entries(locales)) {
      const gaps = [...allKeys].filter(k => dict[k] === undefined)
      if (gaps.length) missing[name] = gaps
    }
    expect(missing, `Yetishmayotgan kalitlar: ${JSON.stringify(missing, null, 2)}`).toEqual({})
  })

  it('bo\'sh tarjima qiymatlari yo\'q', () => {
    const empties: string[] = []
    for (const [name, dict] of Object.entries(locales)) {
      for (const [k, v] of Object.entries(dict)) {
        if (typeof v === 'string' && v.trim() === '') empties.push(`${name}:${k}`)
      }
    }
    expect(empties).toEqual([])
  })

  it('placeholder ({name}) lar barcha tilда mos keladi', () => {
    const mismatches: string[] = []
    for (const key of allKeys) {
      const present = Object.entries(locales).filter(([, d]) => d[key] !== undefined)
      if (present.length < 2) continue
      const ref = placeholders(present[0][1][key])
      for (const [name, d] of present.slice(1)) {
        if (placeholders(d[key]) !== ref) mismatches.push(`${key}: ${present[0][0]}≠${name}`)
      }
    }
    expect(mismatches).toEqual([])
  })
})
