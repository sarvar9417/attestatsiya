import { useEffect, useState } from 'react'
import { getCustomExamAnalysis, type CustomExamAnalysis as Report } from './customTestApi'

interface Props { examId: string }
function Percentage({ value, total }: { value: number; total: number }) {
  return <span className="text-sm tabular-nums">
    {value}/{total} ({total > 0 ? Math.round(100 * value / total) : 0}%)
  </span>
}

export default function CustomExamAnalysis({ examId }: Props) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    void getCustomExamAnalysis(examId).then(data => {
      if (mounted) setReport(data)
    }).catch(() => {
      if (mounted) setError('Mavzular tahlilini olib bo‘lmadi.')
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [examId])

  return (
    <section aria-label="Shaxsiy test diagnostikasi" className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Batafsil shaxsiy diagnostika</h2>
      {loading && <p role="status" className="text-sm text-gray-500">Tahlil yuklanmoqda...</p>}
      {error && <p role="alert" className="text-sm text-amber-600">{error}</p>}
      {report && (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Jami {report.total} ta savol · Javob berilgan: {report.answered} · To‘g‘ri: {report.correct} ·
            Javobsiz: {report.total - report.answered}
          </p>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold dark:text-white">Mavzular bo‘yicha</h3>
              {report.by_lesson.map(item => (
                <div key={item.lesson_id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-sm dark:text-white">{item.lesson_title}</p>
                  <Percentage value={item.correct} total={item.total}/>
                  <p className="text-xs text-gray-500">Javob berilgan: {item.answered}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold dark:text-white">Qiyinchilik A–E</h3>
              {report.by_difficulty.map(item => (
                <div key={item.difficulty} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <span className="font-semibold dark:text-white">{String.fromCharCode(64 + item.difficulty)}</span>
                  <Percentage value={item.correct} total={item.total}/>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold dark:text-white">Savol formati</h3>
              {report.by_format.map(item => (
                <div key={item.format} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <span className="font-semibold dark:text-white">{item.format}</span>
                  <Percentage value={item.correct} total={item.total}/>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
