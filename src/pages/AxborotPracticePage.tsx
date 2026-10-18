import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowLeft, BookOpen, ChevronRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { backendGateway } from '../features/exam/backendGateway'
import {
  AXB_CHAPTER_TITLES, allowedAxborotSizes, type AXBChapter,
} from '../features/axb/chapters'

export default function AxborotPracticePage({ embedded = false }: { embedded?: boolean }) {
  const [chapters, setChapters] = useState<AXBChapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await backendGateway.getAxborotChapters?.()
      if (!rows || rows.length !== 19) throw new Error('Boblar ro‘yxati to‘liq emas')
      setChapters(rows)
    } catch {
      setError('Boblar ro‘yxatini yuklashda xatolik. Qayta urinib ko‘ring.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const Wrapper = embedded ? 'section' : 'main'
  return <Wrapper className={embedded ? 'pt-4' : 'mx-auto max-w-6xl px-4 py-6 sm:px-6'}>
    {!embedded && <Link to="/learn/M01" className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-indigo-600">
      <ArrowLeft size={16} aria-hidden /> M01 mavzulariga qaytish
    </Link>}
    <header className={embedded ? 'rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-gray-900 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-gray-100' : 'rounded-2xl bg-indigo-700 p-6 text-white'}>
      <div className={embedded ? 'flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300' : 'flex items-center gap-2 text-indigo-100'}><BookOpen size={18} aria-hidden /> Mustaqil mashqlar</div>
      {embedded ? <h3 className="mt-2 text-lg font-bold">Axborot savollari banki — 19 bob</h3> : <h1 className="mt-2 text-2xl font-bold">Axborot savollari banki — 19 bob</h1>}
      <p className={embedded ? 'mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300' : 'mt-2 text-sm leading-6 text-indigo-100'}>
        570 savollik PDF bankining faqat tasdiqlangan savollari. Har bir bobdan alohida practice ishlang.
        Natijalar serverda saqlanadi; javob kalitlari test yakuniga qadar ko‘rsatilmaydi.
      </p>
    </header>

    {loading && <p role="status" className="mt-6 text-sm text-gray-500">Boblar yuklanmoqda…</p>}
    {error && <div role="alert" className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-rose-200 p-4 text-sm text-rose-700">
      <AlertCircle size={18} aria-hidden /> {error}
      <button type="button" onClick={() => void load()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border px-3">
        <RefreshCw size={15} aria-hidden /> Qayta urinish
      </button>
    </div>}
    {!loading && !error && <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="19 bobning practice ro‘yxati">
      {chapters.map(ch => {
        const sizes = allowedAxborotSizes(ch.published_count)
        const title = AXB_CHAPTER_TITLES[ch.chapter_no - 1] ?? 'Noma’lum bob'
        return <article key={ch.chapter_no} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">{String(ch.chapter_no).padStart(2, '0')}-bob</p>
          <h2 className="mt-2 flex-1 text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Tasdiqlangan: <strong>{ch.published_count}/{ch.total_pdf}</strong>
            {ch.review_count > 0 && <> · Tekshiruvda: <strong>{ch.review_count}</strong></>}
          </p>
          {ch.published_count > 0 ? <div className="mt-4 flex flex-wrap gap-2" aria-label={title + ' savol sonini tanlash'}>
            {sizes.map(count => <Link key={count} to={`/exam/axb_bob?chapter=${ch.chapter_no}&count=${count}`}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-200 dark:hover:bg-indigo-950">
              {count} savol <ChevronRight size={15} aria-hidden />
            </Link>)}
          </div> : <p className="mt-4 text-sm text-amber-600">Bu bobda hali e’lon qilingan savol yo‘q.</p>}
        </article>
      })}
    </section>}
    <p className="mt-6 text-sm text-gray-500">
      Eslatma: bu practice rasmiy 50 savollik, 120 daqiqalik mockdan alohida rejim.
      <Link to="/history" className="ml-2 font-semibold text-indigo-600">Natijalar tarixi</Link>
    </p>
  </Wrapper>
}
