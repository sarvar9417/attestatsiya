/**
 * check-youtube-availability.ts — Listening videolari barqarorligi (F9-1)
 *
 * src/data ichidagi barcha `youtubeId` larni YouTube oEmbed API orqali tekshiradi
 * (API kalit kerak emas). O'chirilgan / yopiq / mavjud bo'lmagan videolarni
 * ro'yxat qiladi — kontent jamoasi ularni almashtirishi mumkin.
 *
 * Ishlatish:
 *   npx tsx scripts/check-youtube-availability.ts            # barchasini tekshiradi
 *   npx tsx scripts/check-youtube-availability.ts --limit 10 # faqat 10 tasini (tezkor sinov)
 *
 * Chiqish kodi: 0 = hammasi mavjud, 1 = buzilgan link(lar) topildi.
 *
 * Eslatma: video o'chsa ham Listening bo'limi ishlaydi — TTS audio pleyer
 * transkriptdan ovoz sintez qiladi va savollar ko'rinadi (graceful degradation).
 * Bu skript shunchaki sifatni saqlash uchun monitoring.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface VideoRef { id: string; file: string }

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []
  })
}

// ── 1) Barcha youtubeId larni yig'ish (fayl bilan) ──────────────────────────
const refs = new Map<string, string>() // id -> birinchi topilgan fayl
for (const file of walk('src/data')) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/youtubeId:\s*['"]([^'"]+)['"]/g)) {
    if (!refs.has(m[1])) refs.set(m[1], file.replace('src/data/', ''))
  }
}
let list: VideoRef[] = [...refs].map(([id, file]) => ({ id, file }))

const limitArg = process.argv.indexOf('--limit')
if (limitArg !== -1) list = list.slice(0, Number(process.argv[limitArg + 1]) || 10)

console.log(`🎬 ${list.length} ta unikal youtubeId tekshirilmoqda...\n`)

// ── 2) oEmbed orqali tekshirish (cheklangan parallellik) ────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchStatus(id: string): Promise<number> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 10000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    return res.status
  } catch {
    return 0 // tarmoq/timeout
  } finally {
    clearTimeout(t)
  }
}

async function isAvailable(id: string): Promise<boolean> {
  let status = await fetchStatus(id)
  // 401/403/404 = o'chirilgan / embed yopiq / topilmadi → aniq ishlamaydi (retry shart emas).
  // 429 (rate-limit) / 5xx / 0 (tarmoq) → noto'g'ri-ijobiy bo'lishi mumkin → 1 marta qayta urinish.
  if (status === 429 || status >= 500 || status === 0) {
    await sleep(1500)
    status = await fetchStatus(id)
  }
  return status >= 200 && status < 300
}

const CONCURRENCY = 5
const broken: VideoRef[] = []
let checked = 0

async function worker(queue: VideoRef[]) {
  while (queue.length) {
    const ref = queue.shift()!
    const ok = await isAvailable(ref.id)
    checked++
    if (!ok) {
      broken.push(ref)
      process.stdout.write('✗')
    } else {
      process.stdout.write('·')
    }
    if (checked % 60 === 0) process.stdout.write(`\n`)
  }
}

const queue = [...list]
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)))

// ── 3) Hisobot ──────────────────────────────────────────────────────────────
console.log('\n')
if (broken.length === 0) {
  console.log(`✅ Barcha ${list.length} ta video mavjud.`)
  process.exit(0)
}
console.log(`⚠️ ${broken.length} ta buzilgan/mavjud bo'lmagan video:\n`)
for (const b of broken) {
  console.log(`  ✗ ${b.id}  — ${b.file}  (https://youtu.be/${b.id})`)
}
console.log(`\n💡 Bu videolarni almashtiring yoki olib tashlang. Listening baribir TTS+transkript bilan ishlaydi.`)
process.exit(1)
