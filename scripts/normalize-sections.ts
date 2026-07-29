/**
 * exerciseSections nomlarini standartlashtiradi.
 *
 * Standard 5-section mapping:
 *   pos 0 → 🌱 Boshlang'ich  (bg-emerald-500)
 *   pos 1 → 📘 O'rtacha      (bg-blue-500)
 *   pos 2 → 🎯 Qiyin         (bg-violet-500)
 *   pos 3 → 🚫 Inkor         (bg-red-500)    [5-section only]
 *   pos 4 → 🔄 O'zgartirish  (bg-teal-500)
 *
 * 4-section mapping: pos 3 → O'zgartirish (skip Inkor)
 * 6+ section blocks: SKIP (a1 lesson 1, already correct)
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FILES = [
  '../src/data/daily/a1Part1.ts',
  '../src/data/daily/a1Part2.ts',
  '../src/data/daily/a2Part1.ts',
  '../src/data/daily/a2Part2.ts',
  '../src/data/daily/a2Part3.ts',
  '../src/data/daily/a2Part4.ts',
  '../src/data/daily/b1Part1.ts',
  '../src/data/daily/b1plusPart1.ts',
  '../src/data/daily/b1plusPart2.ts',
  '../src/data/daily/b2Part1.ts',
  '../src/data/daily/b2Part2.ts',
  '../src/data/daily/b2Part3.ts',
]

// A1 fayllarida position 3 → "Kengaytish" (semantik jihatdan to'g'ri)
const A1_STANDARD = [
  { title: "Boshlang'ich", color: 'bg-emerald-500', icon: '🌱' },
  { title: "O'rtacha",     color: 'bg-blue-500',    icon: '📘' },
  { title: 'Qiyin',        color: 'bg-violet-500',  icon: '🎯' },
  { title: 'Kengaytish',   color: 'bg-amber-500',   icon: '🔤' },
  { title: "O'zgartirish", color: 'bg-teal-500',    icon: '🔄' },
]

const STANDARD = [
  { title: "Boshlang'ich", color: 'bg-emerald-500', icon: '🌱' },
  { title: "O'rtacha",     color: 'bg-blue-500',    icon: '📘' },
  { title: 'Qiyin',        color: 'bg-violet-500',  icon: '🎯' },
  { title: 'Inkor',        color: 'bg-red-500',     icon: '🚫' },
  { title: "O'zgartirish", color: 'bg-teal-500',    icon: '🔄' },
]

// Slot maps per section count
const SLOT_MAP: Record<number, number[]> = {
  3: [0, 1, 2],
  4: [0, 1, 2, 4],   // 4-section: last → O'zgartirish (skip Inkor)
  5: [0, 1, 2, 3, 4],
}

// ─── Normalize a single exerciseSections block ────────────────────────────────

function isA1File(rel: string): boolean {
  return rel.includes('a1Part')
}

function normalizeBlock(blockText: string, rel: string): string {
  const lines = blockText.split('\n')

  // Find indices of lines that represent individual section objects
  // (each section is on one line, contains 'title:' and 'ids:')
  const sectionIdx: number[] = []
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (l.includes('title:') && l.includes('ids:')) sectionIdx.push(i)
  }

  const n = sectionIdx.length
  if (n === 0 || n >= 6) return blockText  // empty or 6–7 section (a1 lesson 1) → skip

  const slotMap = SLOT_MAP[n] ?? [0, 1, 2, 3, 4]
  const template = isA1File(rel) ? A1_STANDARD : STANDARD

  for (let i = 0; i < sectionIdx.length; i++) {
    const lineIdx = sectionIdx[i]
    const std = template[slotMap[i]]
    lines[lineIdx] = lines[lineIdx]
      // title: "..." or title: '...'
      .replace(/title:\s*(?:"[^"]*"|'(?:[^'\\]|\\.)*')/, `title: "${std.title}"`)
      // color: "..." or color: '...'
      .replace(/color:\s*(?:"[^"]*"|'(?:[^'\\]|\\.)*')/, `color: '${std.color}'`)
      // icon: "..." or icon: '...'  (handles unicode escapes \uXXXX too)
      .replace(/icon:\s*(?:"[^"]*"|'(?:[^'\\]|\\.)*')/, `icon: '${std.icon}'`)
  }

  return lines.join('\n')
}

// ─── Process a file ────────────────────────────────────────────────────────────

function processFile(rel: string): { changed: boolean; sections: number } {
  const abs = path.resolve(__dirname, rel)
  const original = readFileSync(abs, 'utf-8')
  let content = original
  let sectionCount = 0

  content = content.replace(
    /exerciseSections:\s*\[([\s\S]*?)\],/g,
    (_, inner) => {
      sectionCount++
      const normalized = normalizeBlock(inner, rel)
      return `exerciseSections: [${normalized}],`
    }
  )

  if (content !== original) {
    writeFileSync(abs, content, 'utf-8')
    return { changed: true, sections: sectionCount }
  }
  return { changed: false, sections: sectionCount }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let changed = 0
for (const f of FILES) {
  const r = processFile(f)
  const fname = path.basename(f)
  if (r.changed) {
    console.log(`✅ ${fname}  (${r.sections} lessons updated)`)
    changed++
  } else {
    console.log(`   ${fname}  (no change)`)
  }
}
console.log(`\nDone: ${changed}/${FILES.length} files modified`)
