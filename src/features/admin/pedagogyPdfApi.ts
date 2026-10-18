import { api } from '../../lib/apiClient'

export interface PedagogyPdfCandidate {
  id: string
  source_file_name: string
  source_year: number | null
  source_sitting: string
  page_no: number
  source_question_no: number
  raw_question_private: string
  raw_answer_private: string | null
  editorial_status: string
  answer_key_status: string
  historical_exam_claim_status: string
  mapped_construct_id: string | null
  attestation_bucket: string
  linked_question_id: string | null
  source_quality_flags: string[]
  review_notes: string
  reviewed_at: string | null
}
export interface PedagogyPdfCandidatePage {
  items: PedagogyPdfCandidate[]
  total: number
  page: number
  page_size: number
  disclaimer: string
}
export function listPedagogyPdfCandidates(input: {
  page: number
  status?: string
  source_year?: number
  unlinked_only?: boolean
}): Promise<PedagogyPdfCandidatePage> {
  const params = new URLSearchParams({
    page: String(input.page),
    page_size: '20',
  })
  if (input.status) params.set('status',input.status)
  if (input.source_year) params.set('source_year',String(input.source_year))
  if (input.unlinked_only) params.set('unlinked_only','true')
  return api.get<PedagogyPdfCandidatePage>(
    `/api/admin/pedagogy-pdf-candidates?${params.toString()}`
  )
}
