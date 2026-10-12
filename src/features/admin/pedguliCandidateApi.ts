import { api } from '../../lib/apiClient'

export interface PedguliSourceCandidate {
  id: string
  source_message_id: number
  source_url: string
  source_html: string
  date_local: string | null
  raw_text_private: string
  suggested_constructs: string[]
  media_present: boolean
  quality_flags: string[]
  review_priority: 1 | 2 | 3
  four_options_detected: boolean
  key_marker_unverified: boolean
  editorial_status: 'needs_review' | 'needs_source' | 'needs_rights' | 'verified' | 'rejected'
  rights_status: string
  answer_key_status: string
  historical_exam_claim_status: string
  review_notes: string
  created_at: string
}

export interface CandidatePage {
  items: PedguliSourceCandidate[]
  total: number
  page: number
  page_size: number
}

export function listPedguliSourceCandidates(page: number, status?: string, minPriority?: number): Promise<CandidatePage> {
  const q=new URLSearchParams()
  q.set('page',String(page))
  q.set('page_size','25')
  if(status)q.set('status',status)
  if(minPriority)q.set('min_priority',String(minPriority))
  return api.get<CandidatePage>(`/api/admin/pedguli-candidates?${q}`)
}

export interface PedguliCandidateReviewInput {
  editorial_status: PedguliSourceCandidate['editorial_status']
  rights_status: 'not_cleared' | 'permission_granted' | 'not_reusable'
  answer_key_status: 'unverified' | 'needs_source' | 'independently_verified'
  historical_exam_claim_status: 'unverified' | 'independently_verified' | 'not_claimed'
  suggested_constructs: string[]
  review_notes: string
}

export function savePedguliCandidateReview(id:string,input:PedguliCandidateReviewInput) {
  return api.patch<PedguliSourceCandidate>(
    `/api/admin/pedguli-candidates/${encodeURIComponent(id)}/review`,input)
}
