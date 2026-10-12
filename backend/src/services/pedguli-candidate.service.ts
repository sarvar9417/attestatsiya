import { createHash } from 'node:crypto'
import { supabase } from '../lib/supabase.js'
import { config } from '../config.js'
import { analyzeCandidateQuality } from './pedguli-quality.service.js'
import { suggestPedguliTopic } from './pedguli-topic-suggestions.service.js'
import { AppError, AuthError, ForbiddenError, NotFoundError } from '../lib/errors.js'
import type { PedguliCandidateInput, PedguliCandidateListQuery, PedguliCandidateReview } from '../schemas/pedguli-candidates.js'
import type { PedguliStage4Batch } from '../schemas/pedguli-candidates.js'

/** Review-only source archive; never inserts into public.questions. */
async function requireStaff(token: string, adminOnly = false) {
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) throw new AuthError()
  const { data: profile, error: roleError } = await supabase.from('profiles')
    .select('role,is_blocked').eq('id',data.user.id).maybeSingle()
  if (roleError) throw new AppError('Profil tekshirilmadi',500,'ADMIN_PROFILE_ERROR')
  if (!profile || profile.is_blocked ||
    !(['admin','editor'].includes(profile.role)) ||
    (adminOnly && profile.role!=='admin')) {
    throw new ForbiddenError('Ushbu amal uchun faol administrator huquqi talab etiladi')
  }
  return {id:data.user.id,role:profile.role}
}

export function fingerprintCandidate(text: string) {
  return createHash('sha256')
    .update(text.toLocaleLowerCase('uz-UZ').replace(/\s+/g,' ').trim())
    .digest('hex')
}

export const pedguliCandidateService = {
  async importBatch(token:string, items:PedguliCandidateInput[]) {
    await requireStaff(token,true)
    // Hard release gate: staging API must not write into the known production
    // Supabase project. Explicit release requires later manual env approval.
    const productionProjectRef='plyqezulrfowyblsfpzy'
    if (config.supabase.url.includes(productionProjectRef) &&
        process.env.PEDGULI_PRODUCTION_IMPORT_RELEASE !== 'EXPLICIT_FINAL_USER_APPROVAL') {
      throw new AppError('Production import yakuniy foydalanuvchi ruxsatigacha bloklangan',
        403,'PEDGULI_PRODUCTION_IMPORT_BLOCKED')
    }
    // Compute all fingerprints server-side; never trust a supplied key or approval.
    const unique = new Map<string,PedguliCandidateInput>()
    for(const item of items) {
      const hash=fingerprintCandidate(item.raw_text_private)
      if(!unique.has(hash)) unique.set(hash,item)
    }
    const rows=[...unique].map(([hash,item])=>{ const quality=analyzeCandidateQuality(item.raw_text_private,item.media_present,item.suggested_constructs)
      const suggestion= suggestPedguliTopic(item.raw_text_private,item.message_id)
      // Do not auto-overwrite preexisting tags. Only keep topic proposals for
      // unclassified items or explicitly audited source-ID mismatches.
      const proposal=(item.suggested_constructs.length===0 || suggestion.suggestion_state==='editorial_proposal')
        ? suggestion : {proposed_constructs:[],suggestion_state:'unclassified',evidence_terms:[]}
      return ({
      source_channel:'@PedMahoratGuli',
      source_message_id:item.message_id,
      source_url:item.source_url,
      source_html:item.source_html,
      date_local:item.date_local,
      text_sha256:hash,
      raw_text_private:item.raw_text_private,
      suggested_constructs:item.suggested_constructs,
      media_present:item.media_present,
      key_marker_unverified:item.key_marker_unverified,
      quality_flags:quality.flags,
      review_priority:quality.priority,
      four_options_detected:quality.four_options_detected,
      proposed_constructs:proposal.proposed_constructs,
      topic_suggestion_state:proposal.suggestion_state,
      topic_suggestion_evidence:proposal.evidence_terms,
      editorial_status:'needs_review',
      rights_status:'not_cleared',
      answer_key_status:'unverified',
      historical_exam_claim_status:'unverified',
      linked_question_id:null,
      reviewer_id:null,
    })})
    const { data, error } = await supabase
      .from('pedguli_source_candidates')
      .upsert(rows,{onConflict:'source_channel,text_sha256',ignoreDuplicates:true})
      .select('id')
    if(error) {
      // Never log source text or put third-party content into operator errors.
      throw new AppError('Telegram nomzodlarini saqlab bo‘lmadi',500,'PEDGULI_IMPORT_FAILED')
    }
    return {
      submitted:items.length,unique_in_batch:unique.size,
      inserted:data?.length??0,
      already_present_or_duplicate:items.length-(data?.length??0),
      status:'needs_review',
      published:0,
    }
  },
  async importStage4(token:string, batch:PedguliStage4Batch) {
    await requireStaff(token,true)
    if (config.supabase.url.includes('plyqezulrfowyblsfpzy') &&
        process.env.PEDGULI_PRODUCTION_IMPORT_RELEASE!=='EXPLICIT_FINAL_USER_APPROVAL') {
      throw new AppError('Production import foydalanuvchi ruxsatigacha bloklangan',
        403,'PEDGULI_PRODUCTION_IMPORT_BLOCKED')
    }
    const ids=[...new Set([...batch.topics.map(x=>x.telegram_message_id),
      ...batch.answer_references.map(x=>x.telegram_message_id)])]
    const {data:candidates,error:fetchError}=await supabase.from('pedguli_source_candidates')
      .select('id,source_message_id').eq('source_channel','@PedMahoratGuli')
      .in('source_message_id',ids)
    if(fetchError)throw new AppError('Nomzodlarni topib bo‘lmadi',500,'PEDGULI_STAGE4_SOURCE_QUERY_FAILED')
    const index=new Map((candidates??[]).map(r=>[Number(r.source_message_id),r.id]))
    if(index.size!==ids.length){
      throw new AppError('Dastlab barcha 1394 ta manba nomzodini stagingga kiriting',
        409,'PEDGULI_STAGE4_MISSING_CANDIDATES')
    }
    if(batch.topics.length){
      const reviewRows=batch.topics.map(x=>({
        candidate_id:index.get(x.telegram_message_id)!,
        proposed_construct:x.suggested_construct||null,
        alternate_construct:x.second_choice,
        model_margin:x.model_margin,
        review_bucket:x.suggestion_mode,
        review_warning:x.source_scope_warning,
        expert_approved:false,rights_cleared:false,answer_verified:false,
        updated_at:new Date().toISOString(),
      }))
      const {error}=await supabase.from('pedguli_candidate_stage4_reviews')
        .upsert(reviewRows,{onConflict:'candidate_id'})
      if(error)throw new AppError('673 mavzu taklifini saqlashda xatolik',500,'PEDGULI_STAGE4_SAVE_FAILED')
    }
    if(batch.answer_references.length){
      const referenceRows=batch.answer_references.map(x=>({
        candidate_id:index.get(x.telegram_message_id)!,
        proposed_option:x.proposed_correct_letter,
        compared_concept:x.expected_concept,
        proposed_construct:x.proposed_construct,
        source_title:x.source_title,
        source_url:x.source_url,
        evidence_summary:x.source_support_note,
        review_state:'source_correspondence_pending_editor',
        expert_approved:false,rights_cleared:false,transferable_answer_key:false,
      }))
      const {error}=await supabase.from('pedguli_answer_source_comparisons')
        .upsert(referenceRows,{onConflict:'candidate_id'})
      if(error)throw new AppError('7 manba solishtirmasini saqlashda xatolik',500,'PEDGULI_STAGE4_REFERENCE_FAILED')
    }
    return {
      topic_suggestions_saved:batch.topics.length,
      private_source_comparisons_saved:batch.answer_references.length,
      expert_approved:0,published:0,permissions_confirmed:0,
    }
  },
  async list(token:string, query:PedguliCandidateListQuery) {
    await requireStaff(token)
    let request=supabase.from('pedguli_source_candidates')
      .select('id,source_message_id,source_url,source_html,date_local,raw_text_private,suggested_constructs,media_present,key_marker_unverified,quality_flags,review_priority,four_options_detected,proposed_constructs,topic_suggestion_state,topic_suggestion_evidence,editorial_status,rights_status,answer_key_status,historical_exam_claim_status,review_notes,created_at,stage4:pedguli_candidate_stage4_reviews(proposed_construct,alternate_construct,model_margin,review_bucket,review_warning),source_comparison:pedguli_answer_source_comparisons(proposed_option,compared_concept,proposed_construct,source_title,source_url,evidence_summary,review_state)',
        {count:'exact'})
      .order('review_priority',{ascending:false})
      .order('source_message_id',{ascending:true})
      .range((query.page-1)*query.page_size,query.page*query.page_size-1)
    if(query.status) request=request.eq('editorial_status',query.status)
    if(query.min_priority) request=request.gte('review_priority',query.min_priority)
    const {data,count,error}=await request
    if(error) throw new AppError('Nomzodlarni olishda xatolik',500,'PEDGULI_LIST_FAILED')
    return {items:data??[],total:count??0,page:query.page,page_size:query.page_size}
  },
  async review(token: string, id: string, input: PedguliCandidateReview) {
    const staff=await requireStaff(token, input.editorial_status==='verified')
    const {data:existing,error:loadError}=await supabase.from('pedguli_source_candidates')
      .select('id,editorial_status').eq('id',id).maybeSingle()
    if(loadError)throw new AppError('Nomzodni tekshirib bo‘lmadi',500,'PEDGULI_REVIEW_QUERY_FAILED')
    if(!existing)throw new NotFoundError('Telegram nomzodi topilmadi')
    const {data,error}=await supabase.from('pedguli_source_candidates')
      .update({
        editorial_status:input.editorial_status,
        rights_status:input.rights_status,
        answer_key_status:input.answer_key_status,
        historical_exam_claim_status:input.historical_exam_claim_status,
        suggested_constructs:input.suggested_constructs,
        reviewer_id:staff.id,
        reviewed_at:new Date().toISOString(),
        review_notes:input.review_notes,
      }).eq('id',id)
      .select('id,source_message_id,source_url,editorial_status,rights_status,answer_key_status,historical_exam_claim_status,suggested_constructs,review_notes,reviewed_at')
      .single()
    if(error || !data){
      throw new AppError('Tahririy qarorni saqlab bo‘lmadi',409,'PEDGULI_REVIEW_SAVE_FAILED')
    }
    // Separate from public.questions; no insertion or publication occurs.
    return data
  },
}
