import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { api } from '../../lib/apiClient'

const poolSchema = z.array(z.object({
  module_code: z.string(),
  lesson_id: z.string(),
  lesson_title: z.string(),
  total: z.number().int().nonnegative(),
  a: z.number().int().nonnegative(),
  b: z.number().int().nonnegative(),
  c: z.number().int().nonnegative(),
  d: z.number().int().nonnegative(),
  e: z.number().int().nonnegative(),
  y1: z.number().int().nonnegative(),
  y2: z.number().int().nonnegative(),
  y3: z.number().int().nonnegative(),
}))
type PoolRow = z.infer<typeof poolSchema>

export default function CustomTestPoolCoverage({
  moduleCode, reloadKey,
}: { moduleCode: string; reloadKey: number }) {
  const [rows, setRows] = useState<PoolRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    void api.get<unknown>('/api/admin/custom-test-coverage')
      .then(data => poolSchema.parse(data))
      .then(data => { if (mounted) setRows(data) })
      .catch(() => { if (mounted) setError('Shaxsiy testlar qamrovi yuklanmadi.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [reloadKey])

  const filtered = useMemo(
    () => rows.filter(row => moduleCode === 'ALL' || row.module_code === moduleCode),
    [rows,moduleCode]
  )
  const missing = filtered.filter(row => row.total === 0).length
  return (
    <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      aria-label="Shaxsiy test konstruktori qamrovi">
      <h2 className="text-lg font-semibold dark:text-white">Shaxsiy test konstruktori: savollar qamrovi</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Faqat published, tekshirilgan kalitli, manbasi va mavzuga bog‘lanishi mos savollar.
        Savol matni yoki javob kalitlari ko‘rsatilmaydi.
      </p>
      {loading && <p role="status" className="text-sm text-gray-500">Tekshirilmoqda...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-sm dark:text-white">
            {filtered.length} mavzu · Savoli yetishmayotgan (0 ta): <strong>{missing}</strong>
          </p>
          <div className="max-h-[28rem] overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="min-w-[740px] w-full text-left text-xs dark:text-gray-200">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3">Modul</th><th className="p-3">Mavzu</th>
                  <th className="p-3">Jami</th><th className="p-3">A/B/C/D/E</th>
                  <th className="p-3">Y1/Y2/Y3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(row => (
                  <tr key={row.lesson_id} className={row.total===0?'bg-amber-50 dark:bg-amber-950/30':''}>
                    <td className="p-3 font-mono">{row.module_code}</td>
                    <td className="p-3">{row.lesson_title}</td>
                    <td className="p-3 tabular-nums font-bold">{row.total}</td>
                    <td className="p-3 tabular-nums">{[row.a,row.b,row.c,row.d,row.e].join(' / ')}</td>
                    <td className="p-3 tabular-nums">{[row.y1,row.y2,row.y3].join(' / ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
