/**
 * Attestatsiya brend assetlarini generatsiya qiladi:
 *   - public/apple-touch-icon.png  (180x180)
 *   - public/og-image.png          (1200x630)
 *
 * PNG yozuvchisi standart kutubxona (node:zlib) bilan yozilgan —
 * qo'shimcha dependency talab qilmaydi.
 *
 * Ishga tushirish:  node scripts/gen_assets.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '../public')
mkdirSync(PUBLIC, { recursive: true })

// ─── PNG encoder (RGBA, 8-bit) ─────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  const rowLen = width * 4 + 1
  const raw = Buffer.alloc(rowLen * height)
  for (let y = 0; y < height; y++) {
    raw[y * rowLen] = 0 // filter: None
    rgba.copy(raw, y * rowLen + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ─── Drawing helpers ───────────────────────────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => Math.round(a + (b - a) * t)

/** (px,py) nuqta radius `r` li dumaloq burchakli to'rtburchak ichidami */
function inRoundedRect(px, py, w, h, r) {
  const cx = clamp(px, r, w - r)
  const cy = clamp(py, r, h - r)
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= r * r
}

/**
 * Blokli "A" harfi — tepada torayadigan ikkita diagonal oyoq + chiziq.
 * `cy` — harfning vertikal markazi, `letterH` — balandligi.
 */
function inLetterA(x, y, cx, cy, letterW, letterH, thickness) {
  const t = thickness / 2
  // gorizontal chiziq (balandlikning ~1/6 qismi yuqoridan)
  const crossY = cy - letterH / 6
  if (Math.abs(y - crossY) <= t && Math.abs(x - cx) <= letterW * 0.34) return true
  // oyoqlar
  const top = cy - letterH / 2
  const progress = clamp((y - top) / letterH, 0, 1)
  const halfW = t + Math.max(0, letterW / 2 - 2 * t) * progress
  return Math.abs(Math.abs(x - cx) - halfW) <= t
}

/** Har bir piksel uchun [r, g, b, a] qaytaradigan `draw` funksiyasi */
function renderPixels(size, draw) {
  const px = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const [r, g, b, a] = draw(x + 0.5, y + 0.5)
      px[i] = r
      px[i + 1] = g
      px[i + 2] = b
      px[i + 3] = a
    }
  }
  return px
}

// ─── Apple touch icon (180x180) ────────────────────────────────────
{
  const SIZE = 180
  const px = renderPixels(SIZE, (x, y) => {
    if (!inRoundedRect(x, y, SIZE, SIZE, 40)) return [0, 0, 0, 0]
    const t = y / SIZE
    const r = lerp(37, 30, t)   // #2563eb -> #1e40af
    const g = lerp(99, 64, t)
    const b = lerp(235, 175, t)
    if (inLetterA(x, y, SIZE / 2, SIZE / 2 + 2, 88, 106, 22)) return [255, 255, 255, 255]
    return [r, g, b, 255]
  })
  writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), encodePNG(SIZE, SIZE, px))
  console.log('✔ public/apple-touch-icon.png (180x180)')
}

// ─── OG image (1200x630) ───────────────────────────────────────────
{
  const W = 1200
  const H = 630
  const rgba = Buffer.alloc(W * H * 4)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      const t = y / H
      const r = lerp(15, 23, t)   // #0f172a -> #172554 (to'q ko'k gradient)
      const g = lerp(23, 37, t)
      const b = lerp(42, 84, t)
      if (inLetterA(x + 0.5, y + 0.5, W / 2, H / 2 + 10, 250, 320, 56)) {
        rgba[i] = 255
        rgba[i + 1] = 255
        rgba[i + 2] = 255
        rgba[i + 3] = 255
        continue
      }
      rgba[i] = r
      rgba[i + 1] = g
      rgba[i + 2] = b
      rgba[i + 3] = 255
    }
  }
  writeFileSync(path.join(PUBLIC, 'og-image.png'), encodePNG(W, H, rgba))
  console.log('✔ public/og-image.png (1200x630)')
}

console.log('Barcha assetlar generatsiya qilindi:', PUBLIC)
