export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: { id: number; name: string; created_at: string }
        Insert: { name: string }
        Update: { name?: string }
      }
      specification_versions: {
        Row: { id: number; version: string; year: number; is_active: boolean; description: string | null; created_at: string; updated_at: string }
        Insert: { version: string; year: number; is_active?: boolean; description?: string | null }
        Update: { version?: string; year?: number; is_active?: boolean; description?: string | null }
      }
      modules: {
        Row: { id: number; spec_id: number; code: string; title: string; description: string | null; sort_order: number; created_at: string; updated_at: string }
        Insert: { spec_id: number; code: string; title: string; description?: string | null; sort_order?: number }
        Update: { spec_id?: number; code?: string; title?: string; description?: string | null; sort_order?: number }
      }
      subtopics: {
        Row: { id: number; module_id: number; title: string; description: string | null; sort_order: number; created_at: string; updated_at: string }
        Insert: { module_id: number; title: string; description?: string | null; sort_order?: number }
        Update: { module_id?: number; title?: string; description?: string | null; sort_order?: number }
      }
      lessons: {
        Row: { id: number; subtopic_id: number; title: string; theory: string | null; duration_min: number | null; sort_order: number; status: string; created_by: string | null; created_at: string; updated_at: string }
        Insert: { subtopic_id: number; title: string; theory?: string | null; duration_min?: number | null; sort_order?: number; status?: string; created_by?: string | null }
        Update: { subtopic_id?: number; title?: string; theory?: string | null; duration_min?: number | null; sort_order?: number; status?: string; created_by?: string | null }
      }
      questions: {
        Row: { id: number; spec_id: number; module_id: number; subtopic_id: number | null; lesson_id: number | null; stimulus_id: number | null; test_type: string; difficulty: number; cognitive_level: string; question_text: string; explanation: string | null; status: string; version: number; created_by: string | null; reviewed_by: string | null; created_at: string; updated_at: string }
        Insert: { spec_id: number; module_id: number; subtopic_id?: number | null; lesson_id?: number | null; stimulus_id?: number | null; test_type?: string; difficulty?: number; cognitive_level?: string; question_text: string; explanation?: string | null; status?: string; version?: number; created_by?: string | null; reviewed_by?: string | null }
        Update: { spec_id?: number; module_id?: number; subtopic_id?: number | null; lesson_id?: number | null; stimulus_id?: number | null; test_type?: string; difficulty?: number; cognitive_level?: string; question_text?: string; explanation?: string | null; status?: string; version?: number; created_by?: string | null; reviewed_by?: string | null }
      }
      options: {
        Row: { id: number; question_id: number; option_text: string; is_correct: boolean; sort_order: number; created_at: string }
        Insert: { question_id: number; option_text: string; is_correct?: boolean; sort_order?: number }
        Update: { question_id?: number; option_text?: string; is_correct?: boolean; sort_order?: number }
      }
      sources: {
        Row: { id: number; title: string; author: string | null; isbn: string | null; pdf_url: string | null; notes: string | null; created_at: string }
        Insert: { title: string; author?: string | null; isbn?: string | null; pdf_url?: string | null; notes?: string | null }
        Update: { title?: string; author?: string | null; isbn?: string | null; pdf_url?: string | null; notes?: string | null }
      }
      source_references: {
        Row: { id: number; lesson_id: number; source_id: number; page_from: number | null; page_to: number | null; created_at: string }
        Insert: { lesson_id: number; source_id: number; page_from?: number | null; page_to?: number | null }
        Update: { lesson_id?: number; source_id?: number; page_from?: number | null; page_to?: number | null }
      }
      stimuli: {
        Row: { id: number; content: string; type: string; language: string | null; created_at: string }
        Insert: { content: string; type?: string; language?: string | null }
        Update: { content?: string; type?: string; language?: string | null }
      }
      question_versions: {
        Row: { id: number; question_id: number; version: number; snapshot: Json; changed_by: string | null; change_reason: string | null; created_at: string }
        Insert: { question_id: number; version: number; snapshot: Json; changed_by?: string | null; change_reason?: string | null }
        Update: { question_id?: number; version?: number; snapshot?: Json; changed_by?: string | null; change_reason?: string | null }
      }
      attempts: {
        Row: { id: number; user_id: string; lesson_id: number | null; test_type: string; score: number | null; max_score: number | null; passed: boolean | null; time_spent_sec: number | null; completed_at: string | null; created_at: string }
        Insert: { user_id: string; lesson_id?: number | null; test_type: string; score?: number | null; max_score?: number | null; passed?: boolean | null; time_spent_sec?: number | null; completed_at?: string | null }
        Update: { user_id?: string; lesson_id?: number | null; test_type?: string; score?: number | null; max_score?: number | null; passed?: boolean | null; time_spent_sec?: number | null; completed_at?: string | null }
      }
      attempt_answers: {
        Row: { id: number; attempt_id: number; question_id: number; option_id: number | null; is_correct: boolean; time_spent_sec: number | null; created_at: string }
        Insert: { attempt_id: number; question_id: number; option_id?: number | null; is_correct: boolean; time_spent_sec?: number | null }
        Update: { attempt_id?: number; question_id?: number; option_id?: number | null; is_correct?: boolean; time_spent_sec?: number | null }
      }
      mastery_records: {
        Row: { id: number; user_id: string; subtopic_id: number; status: string; score: number | null; reviewed_at: string | null; next_review: string | null; created_at: string; updated_at: string }
        Insert: { user_id: string; subtopic_id: number; status?: string; score?: number | null; reviewed_at?: string | null; next_review?: string | null }
        Update: { user_id?: string; subtopic_id?: number; status?: string; score?: number | null; reviewed_at?: string | null; next_review?: string | null }
      }
      review_queue: {
        Row: { id: number; user_id: string; subtopic_id: number; due_at: string; interval_days: number; ease_factor: number; reviewed: boolean; created_at: string; updated_at: string }
        Insert: { user_id: string; subtopic_id: number; due_at?: string; interval_days?: number; ease_factor?: number; reviewed?: boolean }
        Update: { user_id?: string; subtopic_id?: number; due_at?: string; interval_days?: number; ease_factor?: number; reviewed?: boolean }
      }
      mock_exams: {
        Row: { id: number; user_id: string; spec_id: number; score: number | null; max_score: number | null; time_spent_sec: number | null; status: string; started_at: string; completed_at: string | null }
        Insert: { user_id: string; spec_id: number; score?: number | null; max_score?: number | null; time_spent_sec?: number | null; status?: string; completed_at?: string | null }
        Update: { user_id?: string; spec_id?: number; score?: number | null; max_score?: number | null; time_spent_sec?: number | null; status?: string; completed_at?: string | null }
      }
      mock_exam_questions: {
        Row: { id: number; mock_exam_id: number; question_id: number; sort_order: number; chosen_option_id: number | null; is_correct: boolean | null; created_at: string }
        Insert: { mock_exam_id: number; question_id: number; sort_order: number; chosen_option_id?: number | null; is_correct?: boolean | null }
        Update: { mock_exam_id?: number; question_id?: number; sort_order?: number; chosen_option_id?: number | null; is_correct?: boolean | null }
      }
      users: {
        Row: { id: string; role_id: number | null; full_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }
        Insert: { id: string; role_id?: number | null; full_name?: string | null; avatar_url?: string | null }
        Update: { role_id?: number | null; full_name?: string | null; avatar_url?: string | null }
      }
    }
    Views: Record<string, never>
    Functions: {
      handle_new_user: { Args: Record<string, never>; Returns: unknown }
    }
    Enums: Record<string, never>
  }
}
