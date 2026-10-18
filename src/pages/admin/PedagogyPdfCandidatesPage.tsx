import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import {
  listPedagogyPdfCandidates,
  type PedagogyPdfCandidatePage,
} from '../../features/admin/pedagogyPdfApi'

export default function PedagogyPdfCandidatesPage() {
  const [page,setPage]=useState(1)
  const [status,setStatus]=useState('')
  const [year,setYear]=useState('')
  const [onlyUnlinked,setOnlyUnlinked]=useState(false)
  const [result,setResult]=useState<PedagogyPdfCandidatePage|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string|null>(null)

  const load=useCallback(async()=>{
    setLoading(true)
    setError(null)
    try{
      setResult(await listPedagogyPdfCandidates({
        page,
        status:status||undefined,
        source_year:year?Number(year):undefined,
        unlinked_only:onlyUnlinked,
      }))
    }catch(err){
      setError(err instanceof Error?err.message:'PDF manbalari yuklanmadi')
    }finally{
      setLoading(false)
    }
  },[page,status,year,onlyUnlinked])
  useEffect(()=>{void load()},[load])

  const totalPages=Math.max(1,Math.ceil((result?.total??0)/20))
  return <div className="mx-auto max-w-6xl space-y-5">
    <header>
      <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
        Pedagogika PDF manbalari — shaxsiy tekshiruv
      </h1>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        2024–2026 to‘plamlaridan ajratilgan savol nomzodlari.
        Bu yerda manba belgilagan javobni ko‘rish uning rasmiy yoki mustaqil
        tasdiqlanganligini anglatmaydi. Faqat vakolatli tahririyat uchun.
      </p>
    </header>
    <aside className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle size={19} className="mt-0.5 shrink-0"/>
      Manbadagi tarixiy imtihon haqidagi da’vo mustaqil tasdiq emas.
      `accepted_general` nomzodlarining javoblari hali tekshirilmagan.
      Asl matnlar o‘quvchilarga chiqarilmaydi.
    </aside>
    <section className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <label className="flex flex-col gap-1 text-xs font-semibold">Holat
        <select className="input min-h-10" aria-label="PDF nomzod holati"
          value={status} onChange={event=>{setStatus(event.target.value);setPage(1)}}>
          <option value="">Barcha holatlar</option>
          <option value="verified">Mustaqil tekshirilgan</option>
          <option value="accepted_general">Umumiy pedagogika (kalit tekshirilmagan)</option>
          <option value="rejected">Karantin / rad</option>
          <option value="needs_review">Tekshiruvda</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold">Yil
        <select className="input min-h-10" aria-label="PDF manba yili"
          value={year} onChange={event=>{setYear(event.target.value);setPage(1)}}>
          <option value="">Barcha yillar</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={onlyUnlinked}
          onChange={event=>{setOnlyUnlinked(event.target.checked);setPage(1)}}/>
        Faqat savolga bog‘lanmaganlari
      </label>
      <button type="button" disabled={loading} onClick={()=>void load()}
        className="btn-secondary flex min-h-10 items-center gap-2 disabled:opacity-50">
        <RefreshCw size={16}/> Yangilash
      </button>
    </section>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <p className="text-sm text-gray-500">
      Filtr bo‘yicha {result?.total??0} manba nomzodi · {page}/{totalPages}-sahifa
    </p>
    {loading ? <p role="status" className="p-6 text-sm">Yuklanmoqda...</p> :
      <section className="space-y-3" aria-label="PDF nomzodlari">
        {(result?.items??[]).map(item=>
          <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
              <span>{item.source_year} · {item.source_sitting}</span>
              <span>{item.page_no}-bet · №{item.source_question_no}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{item.editorial_status}</span>
              <span className={item.answer_key_status==='independently_verified'?'text-emerald-700':'text-amber-700'}>
                Javob: {item.answer_key_status}
              </span>
              <span>{item.linked_question_id?'Mashq savoliga bog‘langan':'Savolga bog‘lanmagan'}</span>
            </div>
            <p className="mt-2 text-xs break-words text-gray-400">{item.source_file_name}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-900 dark:text-white">{item.raw_question_private}</p>
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
              <strong>Manbada keltirilgan javob:</strong>
              <p className="mt-1 whitespace-pre-wrap">{item.raw_answer_private||'Ko‘rsatilmagan'}</p>
            </div>
            <p className="mt-2 text-xs text-gray-500">Tasnif: {item.attestation_bucket}</p>
            {item.review_notes && <p className="mt-1 text-xs text-gray-500">Izoh: {item.review_notes}</p>}
            {item.source_quality_flags?.length>0 && <p className="mt-1 text-xs text-amber-700">
              Sifat belgilari: {item.source_quality_flags.join(', ')}
            </p>}
          </article>
        )}
        {(result?.items.length??0)===0 && <p className="rounded-xl border p-6 text-sm">Ushbu filtrda manba topilmadi.</p>}
      </section>}
    <div className="flex items-center justify-end gap-2">
      <button type="button" disabled={loading||page===1}
        onClick={()=>setPage(p=>Math.max(1,p-1))}
        className="btn-secondary flex min-h-10 items-center gap-1 disabled:opacity-50">
        <ChevronLeft size={16}/> Oldingi
      </button>
      <button type="button" disabled={loading||page>=totalPages}
        onClick={()=>setPage(p=>p+1)}
        className="btn-secondary flex min-h-10 items-center gap-1 disabled:opacity-50">
        Keyingi <ChevronRight size={16}/>
      </button>
    </div>
  </div>
}
