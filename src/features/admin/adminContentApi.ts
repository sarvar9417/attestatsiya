import { api } from '../../lib/apiClient'

export type AdminContentStatus = 'draft' | 'review' | 'published' | 'archived'
export type AdminQuestionFormat = 'Y1' | 'Y2' | 'Y3'
export type AdminCognitive = 'bilish' | 'qollash' | 'mulohaza'

export interface AdminDashboardStats {
  role: 'editor' | 'admin'
  modules: number
  questions: number
  blueprints: number
  users: number | null
}

export interface AdminLessonRow {
  id: string
  module_id: string
  title_uz: string
  est_minutes: number
  order_idx: number
  slug: string
  status: string
}

export interface AdminModuleRow {
  id: string
  code: string | null
  title_uz: string
  summary_uz: string | null
  order_idx: number
  slug: string
  status: string
}

export interface AdminSubjectRow {
  id: string
  code: string
  name_uz: string
}

export interface AdminModulesResponse {
  modules: AdminModuleRow[]
  lessons: AdminLessonRow[]
  subjects: AdminSubjectRow[]
}

export interface AdminQuestionRow {
  id: string
  stem_md: string
  format: string
  cognitive: string
  difficulty: number
  status: string
  group_code: string
  construct_id: string | null
  subject_id: string | null
  created_at: string
  source_reference: string | null
}

export interface AdminConstructRow {
  id: string
  code: string
  title_uz: string
  subject_id: string
  group_code: string
}

export interface AdminQuestionEditorMeta {
  constructs: AdminConstructRow[]
  subjects: AdminSubjectRow[]
}

export interface AdminQuestionEditorData {
  options: Array<{
    id: string
    content_md: string
    order_idx: number
  }>
  correct_index: number | null
  explanation_md: string
}

export interface SaveAdminQuestionInput {
  stem_md: string
  format: AdminQuestionFormat
  cognitive: AdminCognitive
  difficulty: number
  construct_id: string
  options?: Array<{ content_md: string }>
  correct_index?: number
  explanation_md?: string
}

export function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return api.get<AdminDashboardStats>('/api/admin/dashboard')
}

export function getAdminModules(): Promise<AdminModulesResponse> {
  return api.get<AdminModulesResponse>('/api/admin/modules')
}

export function createAdminModule(input: {
  code?: string | null
  title_uz: string
  summary_uz?: string | null
  subject_id: string
}): Promise<AdminModuleRow> {
  return api.post<AdminModuleRow>('/api/admin/modules', input)
}

export interface AdminQuestionsPage {
  items: AdminQuestionRow[]
  total: number
  page: number
  page_size: number
}
export type AdminPedagogyGroup = 'KS' | 'PM.GEN' | 'PM.MET'

export async function listAdminQuestions(
  status?: AdminContentStatus,
  source?: 'pedguli' | 'pedagogy_pdf',
  page = 1,
  groupCode?: AdminPedagogyGroup,
  query?: string,
): Promise<AdminQuestionsPage> {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (source) params.set('source', source)
  if (groupCode) params.set('group_code', groupCode)
  if (query?.trim()) params.set('query', query.trim())
  params.set('page', String(page))
  params.set('page_size', '25')
  return api.get<AdminQuestionsPage>(`/api/admin/questions?${params.toString()}`)
}

export function transitionAdminQuestionStatus(
  questionId: string,
  status: AdminContentStatus
): Promise<{ id: string; status: AdminContentStatus }> {
  return api.patch<{ id: string; status: AdminContentStatus }>(
    `/api/admin/questions/${encodeURIComponent(questionId)}/status`,
    { status }
  )
}

export function getAdminQuestionEditorMeta(): Promise<AdminQuestionEditorMeta> {
  return api.get<AdminQuestionEditorMeta>('/api/admin/question-editor/meta')
}

export function getAdminQuestionEditor(
  questionId: string
): Promise<AdminQuestionEditorData> {
  return api.get<AdminQuestionEditorData>(
    `/api/admin/questions/${encodeURIComponent(questionId)}/editor`
  )
}

export function createAdminQuestion(
  input: SaveAdminQuestionInput
): Promise<{ id: string }> {
  return api.post<{ id: string }>('/api/admin/questions', input)
}

export function updateAdminQuestion(
  questionId: string,
  input: SaveAdminQuestionInput
): Promise<{ id: string }> {
  return api.put<{ id: string }>(
    `/api/admin/questions/${encodeURIComponent(questionId)}`,
    input
  )
}

export interface PedguliEditorialCheckInput {
  answer_verified: boolean
  reference_verified: boolean
  wording_verified: boolean
  original_authorship_verified: boolean
  reviewer_notes: string
}

export interface PedguliEditorialCheck extends PedguliEditorialCheckInput {
  question_id: string
  reviewer_id: string
  reviewed_at: string
}

export interface PedguliEditorialReviewResponse {
  question_id: string
  status: AdminContentStatus
  checks: PedguliEditorialCheck | null
}

export function getPedguliEditorialReview(questionId: string) {
  return api.get<PedguliEditorialReviewResponse>(
    `/api/admin/questions/${encodeURIComponent(questionId)}/editorial`,
  )
}

export function savePedguliEditorialReview(
  questionId: string,
  input: PedguliEditorialCheckInput,
) {
  return api.put<PedguliEditorialCheck>(
    `/api/admin/questions/${encodeURIComponent(questionId)}/editorial`,
    input,
  )
}
