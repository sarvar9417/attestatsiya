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

export function listPedguliSourceCandidates(page: number, status?: string): Promise<CandidatePage> {
  const q=new URLSearchParams()
  q.set('page',String(page))
  q.set('page_size','25')
  if(status)q.set('status',status)
  return api.get<CandidatePage>(`/api/admin/pedguli-candidates?${q}`)
}
