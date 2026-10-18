import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import {
  listPedagogyPdfCandidates,
  stagePedagogyPdfQuestion,
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
            {item.editorial_status==='verified' &&
              item.answer_key_status==='independently_verified' &&
              item.mapped_construct_id && !item.linked_question_id && (
              <PdfManualAuthorForm candidateId={item.id} onSaved={()=>void load()} />
            )}
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

/** Never prefill source wording or assert that a source marker is official. */
function PdfManualAuthorForm({candidateId,onSaved}:{
  candidateId:string;onSaved:()=>void
}) {
  const [stem,setStem]=useState('')
  const [options,setOptions]=useState(['','','',''])
  const [correct,setCorrect]=useState(0)
  const [explanation,setExplanation]=useState('')
  const [verified,setVerified]=useState(false)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const [complete,setComplete]=useState(false)
  const lengths=options.map(text=>text.trim().split(/\s+/u).filter(Boolean).length)
  const max=Math.max(...lengths)
  const min=Math.min(...lengths)
  const wrongMax=Math.max(...lengths.filter((_,index)=>index!==correct))
  const balanced=min>=2 && max<=min*1.8 && lengths[correct]<=wrongMax*1.25
  const distinct=new Set(options.map(text=>text.trim().toLocaleLowerCase('uz'))).size===4
  const canSave=verified && stem.trim().length>=15 && explanation.trim().length>=12 &&
    distinct && balanced && !saving

  async function save() {
    if(!canSave)return
    setSaving(true);setError(null)
    try{
      const r=await stagePedagogyPdfQuestion(candidateId,{
        stem_md:stem.trim(), options:options.map(x=>x.trim()),
        correct_index:correct, explanation_md:explanation.trim(),
      })
      if(r.status!=='review')throw new Error('Savol review holatida yaratilmagan')
      setComplete(true)
      onSaved()
    }catch(err){setError(err instanceof Error?err.message:'Savol saqlanmadi')}
    finally{setSaving(false)}
  }

  return <details className="mt-4 rounded-xl border border-indigo-200 p-3 dark:border-indigo-800">
    <summary className="cursor-pointer text-sm font-semibold text-indigo-700 dark:text-indigo-300">
      Ushbu tekshirilgan manbadan original review savoli tayyorlash
    </summary>
    <div className="mt-3 space-y-3">
      <p className="text-xs text-gray-500">Asl savolni so‘zma-so‘z ko‘chirmang.
        Javobni darslik bilan tekshiring. Variantlarni bir xil darajada ishonarli va uzunlikda yarating.
        Bu forma hech qachon avtomatik nashr qilmaydi.</p>
      <label className="block space-y-1 text-sm font-medium">Qayta yozilgan savol
        <textarea className="input w-full" rows={3} value={stem}
          onChange={event=>setStem(event.target.value)} />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">A/B/C/D variantlari va yagona to‘g‘ri javob</legend>
        {options.map((option,index)=><div key={index} className="flex items-center gap-2">
          <label className="shrink-0 text-xs font-semibold">
            <input type="radio" name={`pdf-answer-${candidateId}`}
              checked={correct===index} onChange={()=>setCorrect(index)}
              aria-label={`To‘g‘ri variant ${index+1}`}/>
            {String.fromCharCode(65+index)}
          </label>
          <input className="input flex-1" value={option}
            aria-label={`PDF savoli varianti ${index+1}`}
            onChange={event=>setOptions(prev=>prev.map((v,i)=>i===index?event.target.value:v))}/>
          <span className="text-xs text-gray-500">{lengths[index]} so‘z</span>
        </div>)}
      </fieldset>
      <p className={`text-xs ${balanced&&distinct?'text-emerald-600':'text-red-600'}`}>
        {balanced&&distinct?'Variant uzunligi va takrorlanmaslik tekshirildi':
          'Variantlar: kamida 2 so‘z, max/min ≤1.8, to‘g‘ri javob eng uzun variant bo‘lmasin; matnlar takrorlanmasin.'}
      </p>
      <label className="block space-y-1 text-sm font-semibold">Javobning ilmiy izohi
        <textarea className="input w-full" rows={2} value={explanation}
          onChange={event=>setExplanation(event.target.value)} />
      </label>
      <label className="flex gap-2 text-xs">
        <input type="checkbox" checked={verified}
          onChange={event=>setVerified(event.target.checked)}/>
        Asl kalitni mustaqil manba bilan solishtirdim; variantlarni o‘zim yozdim
      </label>
      {error&&<p role="alert" className="text-xs text-red-600">{error}</p>}
      {complete?<p role="status" className="text-sm text-emerald-700">Savol review holatida saqlandi.</p>:
        <button type="button" onClick={()=>void save()} disabled={!canSave}
          className="btn-primary min-h-10 disabled:opacity-50">
          {saving?'Saqlanmoqda...':'Savolni faqat review navbatiga kiritish'}
        </button>}
    </div>
  </details>
}
