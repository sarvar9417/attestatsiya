import type { GameWord } from '../store/vocabularyStore'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VocabExportRow {
  english:   string
  uzbek:     string
  level:     string
  phonetic?: string
  example?:  string
  box:       number
  is_learned: boolean
  correct_count: number
  wrong_count: number
  next_review?: string
  last_rating?: string
}

export type ExportFormat = 'csv' | 'json' | 'anki-csv'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

function rowsToCsv(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCsv).join(',')
  const dataLines = rows.map(row => row.map(escapeCsv).join(','))
  return [headerLine, ...dataLines].join('\n')
}

// ─── Export ───────────────────────────────────────────────────────────────────

function buildExportRows(words: GameWord[]): VocabExportRow[] {
  return words.map(w => ({
    english: w.english,
    uzbek: w.uzbek,
    level: w.level,
    phonetic: w.phonetic ?? '',
    example: w.example ?? '',
    box: w.box,
    is_learned: w.is_learned,
    correct_count: w.correct_count,
    wrong_count: w.wrong_count,
    next_review: w.next_review,
    last_rating: w.last_rating,
  }))
}

export function exportToCsv(words: GameWord[]): string {
  const rows = buildExportRows(words)
  const headers = ['english', 'uzbek', 'level', 'phonetic', 'example', 'box', 'is_learned', 'correct_count', 'wrong_count', 'next_review', 'last_rating']
  const data = rows.map(r => [
    r.english, r.uzbek, r.level, r.phonetic ?? '', r.example ?? '',
    String(r.box), String(r.is_learned), String(r.correct_count), String(r.wrong_count),
    r.next_review ?? '', r.last_rating ?? '',
  ])
  return rowsToCsv(headers, data)
}

export function exportToAnkiCsv(words: GameWord[]): string {
  // Anki-compatible: Front=English, Back=Uzbek + example + phonetic
  const headers = ['Front', 'Back']
  const data = words.map(w => {
    const backParts = [w.uzbek]
    if (w.example) backParts.push(`<i>${w.example}</i>`)
    if (w.phonetic) backParts.push(`[${w.phonetic}]`)
    return [w.english, backParts.join('<br>')]
  })
  return rowsToCsv(headers, data)
}

export function exportToJson(words: GameWord[]): string {
  return JSON.stringify(buildExportRows(words), null, 2)
}

// ─── Download ─────────────────────────────────────────────────────────────────

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadExport(words: GameWord[], format: ExportFormat) {
  const dateStr = new Date().toISOString().split('T')[0]
  switch (format) {
    case 'csv': {
      const csv = exportToCsv(words)
      downloadFile(csv, `vocabulary-${dateStr}.csv`, 'text/csv;charset=utf-8')
      break
    }
    case 'anki-csv': {
      const csv = exportToAnkiCsv(words)
      downloadFile(csv, `anki-vocabulary-${dateStr}.csv`, 'text/csv;charset=utf-8')
      break
    }
    case 'json': {
      const json = exportToJson(words)
      downloadFile(json, `vocabulary-${dateStr}.json`, 'application/json;charset=utf-8')
      break
    }
  }
}

// ─── Import ───────────────────────────────────────────────────────────────────

export interface ImportResult {
  success: number
  errors: string[]
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length < 2) return []

  // Parse header
  const headers = parseCsvLine(lines[0])
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    if (values.length === headers.length) {
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h.trim().toLowerCase()] = values[idx] })
      rows.push(row)
    }
  }
  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        result.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
  }
  result.push(current.trim())
  return result
}

export function parseImportData(text: string, filename: string): { rows: VocabExportRow[]; errors: string[] } {
  const ext = filename.split('.').pop()?.toLowerCase()
  const errors: string[] = []
  let rows: VocabExportRow[] = []

  try {
    if (ext === 'json') {
      const data = JSON.parse(text)
      if (Array.isArray(data)) {
        rows = data as VocabExportRow[]
      } else {
        errors.push('JSON format noto\'g\'ri — array bo\'lishi kerak')
      }
    } else if (ext === 'csv') {
      const parsed = parseCsv(text)
      rows = parsed.map(row => ({
        english: row['english'] ?? '',
        uzbek: row['uzbek'] ?? '',
        level: row['level'] ?? 'A1',
        phonetic: row['phonetic'] ?? '',
        example: row['example'] ?? '',
        box: row['box'] !== undefined && row['box'] !== '' ? Number(row['box']) : 1,
        is_learned: row['is_learned'] === 'true',
        correct_count: Number(row['correct_count']) || 0,
        wrong_count: Number(row['wrong_count']) || 0,
        next_review: row['next_review'] ?? '',
        last_rating: row['last_rating'] ?? '',
      }))
    } else {
      errors.push(`Qo'llab-quvvatlanmaydigan format: .${ext} (faqat .json yoki .csv)`)
    }
  } catch (e) {
    errors.push(`Faylni o'qishda xatolik: ${e instanceof Error ? e.message : e}`)
  }

  // Validate
  const valid: VocabExportRow[] = []
  for (const row of rows) {
    if (!row.english || !row.uzbek) {
      errors.push(`So'z o'tkazib yuborildi: english yoki uzbek bo'sh (${row.english || '???'})`)
      continue
    }
    if (!['A1', 'A2', 'B1', 'B2'].includes(row.level)) {
      row.level = 'A1'
    }
    valid.push(row)
  }

  return { rows: valid, errors }
}
