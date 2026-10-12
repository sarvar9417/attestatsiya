import { createHash } from 'node:crypto'
import { supabase } from '../lib/supabase.js'
import { config } from '../config.js'
import { analyzeCandidateQuality } from './pedguli-quality.service.js'
import { AppError, AuthError, ForbiddenError } from '../lib/errors.js'
import type { PedguliCandidateInput, PedguliCandidateListQuery } from '../schemas/pedguli-candidates.js'

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
  return data.user.id
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
  async list(token:string, query:PedguliCandidateListQuery) {
    await requireStaff(token)
    let request=supabase.from('pedguli_source_candidates')
      .select('id,source_message_id,source_url,source_html,date_local,raw_text_private,suggested_constructs,media_present,key_marker_unverified,quality_flags,review_priority,four_options_detected,editorial_status,rights_status,answer_key_status,historical_exam_claim_status,review_notes,created_at',
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
}
