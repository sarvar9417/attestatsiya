import { useState } from 'react'
import { AlertTriangle, ExternalLink, Save, X } from 'lucide-react'
import {
  savePedguliCandidateReview,
  type PedguliCandidateReviewInput,
  type PedguliSourceCandidate,
} from '../../features/admin/pedguliCandidateApi'

interface Props { candidate: PedguliSourceCandidate; onClose: () => void; onSaved: () => void }

export default function PedguliCandidateReviewModal({candidate,onClose,onSaved}:Props) {
  const [form,setForm]=useState<PedguliCandidateReviewInput>({
    editorial_status:candidate.editorial_status,
    rights_status:candidate.rights_status as PedguliCandidateReviewInput['rights_status'],
    answer_key_status:candidate.answer_key_status as PedguliCandidateReviewInput['answer_key_status'],
    historical_exam_claim_status:candidate.historical_exam_claim_status as PedguliCandidateReviewInput['historical_exam_claim_status'],
    suggested_constructs:candidate.suggested_constructs,
    review_notes:candidate.review_notes ?? '',
  })
  const [constructText,setConstructText]=useState(candidate.suggested_constructs.join(', '))
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const constructs=constructText.split(',').map(s=>s.trim()).filter(Boolean)
  const validConstructs=constructs.length<=20 && constructs.every(
    s=>/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/.test(s),
  )
  const readyForVerification=form.rights_status==='permission_granted'
    &&form.answer_key_status==='independently_verified'
    &&constructs.length>0 &&form.review_notes.trim().length>=40
  const valid=form.review_notes.trim().length>=30 &&validConstructs
    &&(form.editorial_status!=='verified'||readyForVerification)

  function update<K extends keyof PedguliCandidateReviewInput>(key:K,value:PedguliCandidateReviewInput[K]) {
    setForm(v=>({...v,[key]:value}))
    setError(null)
  }

  async function save() {
    if(!valid) return
    setBusy(true);setError(null)
    try{
      await savePedguliCandidateReview(candidate.id,{
        ...form,suggested_constructs:constructs,review_notes:form.review_notes.trim(),
      })
      onSaved()
    }catch(e){
      setError(e instanceof Error?e.message:'Tekshiruv yozib bo‘lmadi')
    }finally{setBusy(false)}
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-950/75 p-3">
      <section role="dialog" aria-modal="true" aria-labelledby="candidate-review-title"
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:bg-gray-900 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="candidate-review-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Manba nomzodi #{candidate.source_message_id}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Original Telegram matni faqat ichki tahrir uchun. Bu tasdiqlangan rasmiy imtihon savoli emas.
            </p>
          </div>
          <button type="button" aria-label="Yopish" onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20}/></button>
        </div>
        <div className="mt-4 max-h-48 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm leading-6 dark:bg-gray-800">
          {candidate.raw_text_private}
        </div>
        <a href={candidate.source_url} target="_blank" rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-indigo-600 underline dark:text-indigo-300">
          Asl Telegram xabarini ochish <ExternalLink size={13}/>
        </a>
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">
          Ustuvorlik {candidate.review_priority}/3 · {candidate.quality_flags.length
            ? candidate.quality_flags.join(', ') : 'Avtomatik sifat ogohlantirishi yo‘q'}
        </p>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0"/>
          Javobning to‘g‘riligini, kanaldagi postdan foydalanish huquqini va attestatsiya tarixini
          alohida mustaqil dalillar bilan tekshiring. Bu oynada hech narsa avtomatik nashr qilinmaydi.
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
            Tahririy holat
            <select aria-label="Tahririy holat" className="input mt-1 w-full" value={form.editorial_status}
              onChange={e=>update('editorial_status',e.target.value as PedguliCandidateReviewInput['editorial_status'])}>
              <option value="needs_review">Tekshiruvda</option>
              <option value="needs_source">Dalil/manba kerak</option>
              <option value="needs_rights">Foydalanish huquqi kerak</option>
              <option value="rejected">Rad etilgan</option>
              <option value="verified">To‘liq tekshirilgan (faqat admin)</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
            Asl materialdan foydalanish huquqi
            <select aria-label="Huquq holati" className="input mt-1 w-full" value={form.rights_status}
              onChange={e=>update('rights_status',e.target.value as PedguliCandidateReviewInput['rights_status'])}>
              <option value="not_cleared">Aniqlanmagan</option>
              <option value="permission_granted">Ruxsat dalili tekshirilgan</option>
              <option value="not_reusable">Qayta nashr etib bo‘lmaydi</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
            To‘g‘ri javob
            <select aria-label="Javob tekshiruvi" className="input mt-1 w-full" value={form.answer_key_status}
              onChange={e=>update('answer_key_status',e.target.value as PedguliCandidateReviewInput['answer_key_status'])}>
              <option value="unverified">Tasdiqlanmagan</option>
              <option value="needs_source">Manba bilan tekshirish kerak</option>
              <option value="independently_verified">Mustaqil manba bilan tekshirilgan</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
            Oldingi rasmiy imtihonga tegishlilik
            <select aria-label="Imtihon manbasi" className="input mt-1 w-full" value={form.historical_exam_claim_status}
              onChange={e=>update('historical_exam_claim_status',e.target.value as PedguliCandidateReviewInput['historical_exam_claim_status'])}>
              <option value="unverified">Tasdiqlanmagan</option>
              <option value="not_claimed">Bunday da’vo qilinmaydi</option>
              <option value="independently_verified">Mustaqil ravishda tekshirilgan</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block text-xs font-semibold text-gray-700 dark:text-gray-200" htmlFor="candidate-constructs">
          Mavzular (vergul bilan, masalan PM.GEN.07, KS.03)
        </label>
        <input id="candidate-constructs" className="input mt-1 w-full" value={constructText}
          onChange={e=>setConstructText(e.target.value)}/>
        {!validConstructs&&<p role="alert" className="mt-1 text-xs text-red-600">Mavzu kodi noto‘g‘ri. Masalan: KS.03 yoki PM.GEN.08.</p>}
        <label className="mt-4 block text-xs font-semibold text-gray-700 dark:text-gray-200" htmlFor="candidate-review-notes">
          Tekshiruv dalillari (kamida 30 belgi)
        </label>
        <textarea id="candidate-review-notes" rows={4} maxLength={4000}
          className="input mt-1 w-full resize-y" value={form.review_notes}
          onChange={e=>update('review_notes',e.target.value)}
          placeholder="Qaysi pedagogik manba, qaysi sahifa/band, huquq hujjati, aniqlangan xato va qaror asosini yozing."/>
        {form.editorial_status==='verified'&&!readyForVerification&&(
          <p role="alert" className="mt-2 text-xs text-amber-700 dark:text-amber-300">
            Yakuniy tasdiq uchun foydalanish ruxsati, mustaqil javob tekshiruvi, mavzu va kamida 40 belgili dalil zarur.
          </p>
        )}
        {error&&<p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={()=>void save()} disabled={busy||!valid}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            <Save size={16}/>{busy?'Saqlanmoqda…':'Tekshiruvni saqlash'}
          </button>
        </div>
      </section>
    </div>
  )
}
