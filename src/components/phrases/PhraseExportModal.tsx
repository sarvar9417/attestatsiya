import { useState, useRef } from 'react'
import { Download, Upload, FileText, FileJson, FileSpreadsheet, X, CheckCircle, Loader2 } from 'lucide-react'
import type { GamePhrase } from '../../store/phrasesStore'

interface Props {
  phrases: GamePhrase[]
  open: boolean
  onClose: () => void
}

type ExportFormat = 'csv' | 'json'

export default function PhraseExportModal({ phrases, open, onClose }: Props) {
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleExport = (format: ExportFormat) => {
    const rows = phrases.map(p => ({
      english: p.english,
      uzbek: p.uzbek,
      level: p.level,
      category: p.category,
      box: p.box,
      is_learned: p.is_learned,
      correct_count: p.correct_count,
      wrong_count: p.wrong_count,
      last_rating: p.last_rating,
    }))

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `phrases-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const headers = ['english', 'uzbek', 'level', 'category', 'box', 'is_learned', 'correct_count', 'wrong_count', 'last_rating']
      const csvRows = [headers.join(',')]
      for (const r of rows) {
        csvRows.push([
          `"${r.english.replace(/"/g, '""')}"`,
          `"${r.uzbek.replace(/"/g, '""')}"`,
          r.level,
          r.category,
          r.box,
          r.is_learned,
          r.correct_count,
          r.wrong_count,
          r.last_rating || '',
        ].join(','))
      }
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `phrases-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const exportButtons: { format: ExportFormat; label: string; desc: string; icon: typeof FileText; color: string }[] = [
    { format: 'csv', label: 'CSV', desc: 'Excel/Google Sheets da ochish uchun', icon: FileSpreadsheet, color: 'text-green-600' },
    { format: 'json', label: 'JSON (full backup)', desc: "Barcha ma'lumotlar bilan", icon: FileJson, color: 'text-purple-600' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gaplar eksport/import</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {phrases.length} ta gap eksport qilish mumkin
        </p>

        <div className="space-y-2 mb-5">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Download size={12} /> Eksport
          </p>
          {exportButtons.map(({ format, label, desc, icon: Icon, color }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all text-left"
            >
              <div className={`w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400">yoki</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Upload size={12} /> Import (.json / .csv)
          </p>

          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-b1-500 bg-b1-50 dark:bg-b1-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            onClick={() => fileRef.current?.click()}
          >
            {importing ? (
              <Loader2 size={24} className="animate-spin text-b1-500 mx-auto" />
            ) : importResult ? (
              <div className="flex flex-col items-center gap-1">
                <CheckCircle size={22} className="text-green-500" />
                <p className="text-xs font-semibold text-green-600">
                  {importResult.success} ta gap import qilindi
                </p>
                {importResult.errors.length > 0 && (
                  <div className="mt-1 text-xs text-amber-600 max-w-xs">
                    {importResult.errors.slice(0, 3).map((e, i) => (
                      <p key={i}>{e}</p>
                    ))}
                    {importResult.errors.length > 3 && <p>+{importResult.errors.length - 3} ta xatolik</p>}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Upload size={20} className="mx-auto mb-1.5 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Faylni tashlang yoki <span className="text-b1-500 font-semibold">tanlang</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">.json yoki .csv formatda</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".json,.csv"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      </div>
    </div>
  )

  async function handleFile(file: File) {
    if (!file) return
    setImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      let rows: { english: string; uzbek: string; level?: string; category?: string }[] = []

      if (file.name.endsWith('.json')) {
        rows = JSON.parse(text) as { english: string; uzbek: string; level?: string; category?: string }[]
      } else {
        const lines = text.split('\n').filter(Boolean)
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const row: Record<string, string> = {}
          headers.forEach((h, idx) => { row[h] = vals[idx] || '' })
          rows.push({
            english: row['english'] ?? '',
            uzbek: row['uzbek'] ?? '',
            level: row['level'],
            category: row['category'],
          })
        }
      }

      setImportResult({
        success: rows.length,
        errors: [],
      })
    } catch (e) {
      setImportResult({
        success: 0,
        errors: [`Faylni o'qishda xatolik: ${e instanceof Error ? e.message : e}`],
      })
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }
}
