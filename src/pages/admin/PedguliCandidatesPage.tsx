import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from 'lucide-react'
import {
  listPedguliSourceCandidates,
  type CandidatePage,
  type PedguliSourceCandidate,
} from '../../features/admin/pedguliCandidateApi'

export default function PedguliCandidatesPage() {
  const [page,setPage]=useState(1)
  const [status,setStatus]=useState('')
  const [result,setResult]=useState<CandidatePage|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string|null>(null)
  const [selected,setSelected]=useState<PedguliSourceCandidate|null>(null)

  const load=useCallback(async()=>{
    setLoading(true)
    setError(null)
    try { setResult(await listPedguliSourceCandidates(page,status||undefined)) }
    catch(err){ setError(err instanceof Error?err.message:'Nomzodlarni yuklab bo‘lmadi') }
    finally{ setLoading(false) }
  },[page,status])

  useEffect(()=>{void load()},[load])

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-950 dark:text-white">Telegram savol nomzodlari</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Pedmahorat | Guli eksportining shaxsiy tahrir banki. Asl matnlar mualliflik
          huquqi va javob aniqligi tasdiqlanmaguncha o‘quvchilarga ko‘rsatilmaydi.
        </p>
      </div>
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertTriangle className="mt-1 shrink-0" size={18}/>
        <p><strong>Manba nomzodlari ≠ nashr etilgan testlar.</strong> Telegramdagi ✅ belgisi to‘g‘ri javob isboti emas.
          Konstrukt yorliqlari taxminiy. Ruxsatsiz matnlarni ochiq savollar bankiga ko‘chirmang.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <label htmlFor="candidate-status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Holat</label>
          <select id="candidate-status" className="input min-h-10"
            value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>
            <option value="">Barchasi</option>
            <option value="needs_review">Tekshiruv talab etiladi</option>
            <option value="needs_source">Manba talab etiladi</option>
            <option value="needs_rights">Foydalanish huquqi talab etiladi</option>
            <option value="verified">Tekshirilgan</option>
            <option value="rejected">Rad etilgan</option>
          </select>
        </div>
        <button type="button" onClick={()=>void load()} disabled={loading}
          className="flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm dark:border-gray-600">
          <RefreshCw size={16}/> Yangilash
        </button>
      </div>
      {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p role="status" className="text-sm text-gray-500">Yuklanmoqda…</p> :
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Bazada {result?.total??0} ta nomzod. {page}-sahifa.
        </p>
        {(result?.items??[]).map(row=>
          <article key={row.id}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>#{row.source_message_id}</span><span>{row.date_local}</span>
              <span className="rounded bg-amber-50 px-2 py-1 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                {row.editorial_status}
              </span>
              {row.key_marker_unverified&&<span>✅ belgisi — tekshirilmagan</span>}
              {row.media_present&&<span>Media bilan bog‘liq</span>}
            </div>
            <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-gray-900 dark:text-gray-100">
              {row.raw_text_private}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {row.suggested_constructs.length ? row.suggested_constructs.join(', ') : 'Mavzu hali aniqlanmagan'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <button type="button" className="font-semibold text-indigo-600 dark:text-indigo-300"
                onClick={()=>setSelected(row)}>To‘liq ko‘rish</button>
              <a href={row.source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-600 underline dark:text-gray-300">
                Telegramdagi manba <ExternalLink size={13}/>
              </a>
            </div>
          </article>
        )}
        {!result?.items.length&&<p className="p-5 text-sm text-gray-500">Nomzod topilmadi.</p>}
      </div>}
      <div className="flex items-center justify-between">
        <button type="button" onClick={()=>setPage(n=>Math.max(1,n-1))} disabled={page===1||loading}
          className="flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm disabled:opacity-40 dark:border-gray-700">
          <ChevronLeft size={16}/> Oldingi
        </button>
        <span className="text-xs text-gray-500">{page} / {Math.max(1,Math.ceil((result?.total??0)/25))}</span>
        <button type="button" onClick={()=>setPage(n=>n+1)}
          disabled={loading||page*25>=(result?.total??0)}
          className="flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm disabled:opacity-40 dark:border-gray-700">
          Keyingi <ChevronRight size={16}/>
        </button>
      </div>
      {selected&&(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/70 p-3">
          <section role="dialog" aria-modal="true" aria-labelledby="source-review-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2">
              <h2 id="source-review-title" className="text-lg font-bold">Manba xabari #{selected.source_message_id}</h2>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700"
                onClick={()=>setSelected(null)}>Yopish</button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Huquq: {selected.rights_status}; javob: {selected.answer_key_status};
              tarixiy imtihon: {selected.historical_exam_claim_status}.
            </p>
            <div className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm leading-6 dark:bg-gray-800">
              {selected.raw_text_private}
            </div>
            <a className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600 underline"
              href={selected.source_url} target="_blank" rel="noopener noreferrer">
              Asl xabar <ExternalLink size={15}/>
            </a>
          </section>
        </div>
      )}
    </div>
  )
}
