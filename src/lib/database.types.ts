export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          entity: string
          entity_id: string | null
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity: string
          entity_id?: string | null
          id?: number
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string
          entity_id?: string | null
          id?: number
        }
        Relationships: []
      }
      blueprint_quotas: {
        Row: {
          blueprint_id: string
          group_code: string
          id: string
          n_bilish: number
          n_mulohaza: number
          n_qollash: number
          order_idx: number
          question_count: number
        }
        Insert: {
          blueprint_id: string
          group_code: string
          id?: string
          n_bilish?: number
          n_mulohaza?: number
          n_qollash?: number
          order_idx: number
          question_count: number
        }
        Update: {
          blueprint_id?: string
          group_code?: string
          id?: string
          n_bilish?: number
          n_mulohaza?: number
          n_qollash?: number
          order_idx?: number
          question_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_quotas_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprints: {
        Row: {
          created_at: string
          duration_min: number
          effective_year: number
          id: string
          is_active: boolean
          points_per_item: number
          subject_id: string
          total_questions: number
          version: number
        }
        Insert: {
          created_at?: string
          duration_min: number
          effective_year: number
          id?: string
          is_active?: boolean
          points_per_item?: number
          subject_id: string
          total_questions: number
          version: number
        }
        Update: {
          created_at?: string
          duration_min?: number
          effective_year?: number
          id?: string
          is_active?: boolean
          points_per_item?: number
          subject_id?: string
          total_questions?: number
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      constructs: {
        Row: {
          code: string
          created_at: string
          description_uz: string | null
          group_code: string
          id: string
          is_active: boolean
          slug: string
          subject_id: string
          title_uz: string
        }
        Insert: {
          code: string
          created_at?: string
          description_uz?: string | null
          group_code: string
          id?: string
          is_active?: boolean
          slug: string
          subject_id: string
          title_uz: string
        }
        Update: {
          code?: string
          created_at?: string
          description_uz?: string | null
          group_code?: string
          id?: string
          is_active?: boolean
          slug?: string
          subject_id?: string
          title_uz?: string
        }
        Relationships: [
          {
            foreignKeyName: "constructs_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_items: {
        Row: {
          answered_at: string | null
          client_answered_at: string | null
          construct_id: string
          exam_id: string
          flagged: boolean
          id: string
          is_correct: boolean | null
          option_order: string[] | null
          order_idx: number
          question_id: string
          score: number
          time_spent_sec: number | null
          user_answer: Json | null
        }
        Insert: {
          answered_at?: string | null
          client_answered_at?: string | null
          construct_id: string
          exam_id: string
          flagged?: boolean
          id?: string
          is_correct?: boolean | null
          option_order?: string[] | null
          order_idx: number
          question_id: string
          score?: number
          time_spent_sec?: number | null
          user_answer?: Json | null
        }
        Update: {
          answered_at?: string | null
          client_answered_at?: string | null
          construct_id?: string
          exam_id?: string
          flagged?: boolean
          id?: string
          is_correct?: boolean | null
          option_order?: string[] | null
          order_idx?: number
          question_id?: string
          score?: number
          time_spent_sec?: number | null
          user_answer?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_items_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_items_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_items_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          blueprint_id: string | null
          breakdown: Json | null
          duration_sec: number | null
          finished_at: string | null
          id: string
          kind: Database["public"]["Enums"]["exam_kind"]
          lesson_id: string | null
          max_score: number | null
          module_id: string | null
          passed: boolean | null
          started_at: string
          total_score: number | null
          user_id: string
        }
        Insert: {
          blueprint_id?: string | null
          breakdown?: Json | null
          duration_sec?: number | null
          finished_at?: string | null
          id?: string
          kind: Database["public"]["Enums"]["exam_kind"]
          lesson_id?: string | null
          max_score?: number | null
          module_id?: string | null
          passed?: boolean | null
          started_at?: string
          total_score?: number | null
          user_id: string
        }
        Update: {
          blueprint_id?: string | null
          breakdown?: Json | null
          duration_sec?: number | null
          finished_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["exam_kind"]
          lesson_id?: string | null
          max_score?: number | null
          module_id?: string | null
          passed?: boolean | null
          started_at?: string
          total_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_constructs: {
        Row: {
          construct_id: string
          lesson_id: string
        }
        Insert: {
          construct_id: string
          lesson_id: string
        }
        Update: {
          construct_id?: string
          lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_constructs_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_constructs_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          blocks: Json
          blocks_kind: string
          body_mdx: string | null
          created_at: string
          est_minutes: number
          id: string
          module_id: string
          order_idx: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title_uz: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          blocks_kind?: string
          body_mdx?: string | null
          created_at?: string
          est_minutes?: number
          id?: string
          module_id: string
          order_idx: number
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title_uz: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          blocks_kind?: string
          body_mdx?: string | null
          created_at?: string
          est_minutes?: number
          id?: string
          module_id?: string
          order_idx?: number
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title_uz?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          code: string | null
          created_at: string
          exam_question_count: number | null
          exam_section: Database["public"]["Enums"]["exam_section"] | null
          id: string
          order_idx: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          subject_id: string
          summary_uz: string | null
          title_uz: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          exam_question_count?: number | null
          exam_section?: Database["public"]["Enums"]["exam_section"] | null
          id?: string
          order_idx: number
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          subject_id: string
          summary_uz?: string | null
          title_uz: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          exam_question_count?: number | null
          exam_section?: Database["public"]["Enums"]["exam_section"] | null
          id?: string
          order_idx?: number
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          subject_id?: string
          summary_uz?: string | null
          title_uz?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          is_blocked: boolean
          last_seen_at: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          is_blocked?: boolean
          last_seen_at?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_blocked?: boolean
          last_seen_at?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      question_keys: {
        Row: {
          explanation_md: string
          payload: Json
          question_id: string
          updated_at: string
        }
        Insert: {
          explanation_md: string
          payload: Json
          question_id: string
          updated_at?: string
        }
        Update: {
          explanation_md?: string
          payload?: Json
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_keys_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          content_md: string
          id: string
          order_idx: number
          question_id: string
          side: string
        }
        Insert: {
          content_md: string
          id?: string
          order_idx: number
          question_id: string
          side?: string
        }
        Update: {
          content_md?: string
          id?: string
          order_idx?: number
          question_id?: string
          side?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reports: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          question_id: string
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          question_id: string
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          question_id?: string
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_stats: {
        Row: {
          attempts: number
          avg_time_sec: number | null
          correct: number
          discrimination: number | null
          option_dist: Json | null
          p_value: number | null
          question_id: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          avg_time_sec?: number | null
          correct?: number
          discrimination?: number | null
          option_dist?: Json | null
          p_value?: number | null
          question_id: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          avg_time_sec?: number | null
          correct?: number
          discrimination?: number | null
          option_dist?: Json | null
          p_value?: number | null
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_stats_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          assets: Json
          author_id: string | null
          cognitive: Database["public"]["Enums"]["cognitive_level"]
          construct_id: string
          created_at: string
          difficulty: number
          format: Database["public"]["Enums"]["question_format"]
          group_code: string
          id: string
          is_generated: boolean
          source_lesson_id: string | null
          source_reference: string | null
          status: Database["public"]["Enums"]["content_status"]
          stem_md: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          assets?: Json
          author_id?: string | null
          cognitive: Database["public"]["Enums"]["cognitive_level"]
          construct_id: string
          created_at?: string
          difficulty?: number
          format: Database["public"]["Enums"]["question_format"]
          group_code: string
          id?: string
          is_generated?: boolean
          source_lesson_id?: string | null
          source_reference?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          stem_md: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          assets?: Json
          author_id?: string | null
          cognitive?: Database["public"]["Enums"]["cognitive_level"]
          construct_id?: string
          created_at?: string
          difficulty?: number
          format?: Database["public"]["Enums"]["question_format"]
          group_code?: string
          id?: string
          is_generated?: boolean
          source_lesson_id?: string | null
          source_reference?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          stem_md?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_source_lesson_id_fkey"
            columns: ["source_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_uz: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_uz: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_uz?: string
        }
        Relationships: []
      }
      user_construct_stats: {
        Row: {
          attempts: number
          construct_id: string
          correct: number
          due_at: string | null
          ease: number
          interval_days: number
          last_seen_at: string | null
          streak: number
          user_id: string
        }
        Insert: {
          attempts?: number
          construct_id: string
          correct?: number
          due_at?: string | null
          ease?: number
          interval_days?: number
          last_seen_at?: string | null
          streak?: number
          user_id: string
        }
        Update: {
          attempts?: number
          construct_id?: string
          correct?: number
          due_at?: string | null
          ease?: number
          interval_days?: number
          last_seen_at?: string | null
          streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_construct_stats_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          attempts: number
          best_score: number | null
          lesson_id: string
          mastered_at: string | null
          read_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          best_score?: number | null
          lesson_id: string
          mastered_at?: string | null
          read_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          best_score?: number | null
          lesson_id?: string
          mastered_at?: string | null
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          completed_at: string | null
          exam_best_score: number | null
          module_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          exam_best_score?: number | null
          module_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          exam_best_score?: number | null
          module_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_sm2: {
        Args: { p_construct: string; p_correct: boolean; p_user: string }
        Returns: undefined
      }
      attach_questions: {
        Args: { p_exam_id: string; p_ids: string[] }
        Returns: undefined
      }
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      check_answer: {
        Args: {
          p_format: Database["public"]["Enums"]["question_format"]
          p_key: Json
          p_user_answer: Json
        }
        Returns: boolean
      }
      exam_payload: { Args: { p_exam_id: string }; Returns: Json }
      finish_exam: { Args: { p_exam_id: string }; Returns: Json }
      generate_topic_test: { Args: { p_lesson_id: string }; Returns: Json }
      get_due_reviews: { Args: never; Returns: Json }
      get_review: { Args: { p_exam_id: string }; Returns: Json }
      mark_lesson_read: { Args: { p_lesson_id: string }; Returns: undefined }
      pick_due_questions: {
        Args: { p_n: number; p_user: string }
        Returns: string[]
      }
      pick_lesson_extra: {
        Args: {
          p_exclude: string[]
          p_lesson: string
          p_n: number
          p_user: string
        }
        Returns: string[]
      }
      pick_module_questions: {
        Args: { p_exclude: string[]; p_module: string; p_n: number }
        Returns: string[]
      }
      pick_questions: {
        Args: {
          p_cog: Database["public"]["Enums"]["cognitive_level"]
          p_exclude: string[]
          p_group: string
          p_n: number
        }
        Returns: string[]
      }
      pick_weak_questions: {
        Args: { p_n: number; p_user: string }
        Returns: string[]
      }
      start_exam: {
        Args: {
          p_kind: Database["public"]["Enums"]["exam_kind"]
          p_module_id?: string
        }
        Returns: Json
      }
      submit_answer: {
        Args: {
          p_answer: Json
          p_exam_id: string
          p_question_id: string
          p_time_spent?: number
        }
        Returns: Json
      }
    }
    Enums: {
      cognitive_level: "bilish" | "qollash" | "mulohaza"
      content_status: "draft" | "review" | "published" | "archived"
      exam_kind:
        | "diagnostika"
        | "mashq"
        | "mavzu"
        | "bolim"
        | "mock"
        | "takrorlash"
        | "zaif"
      exam_section:
        | "specialty"
        | "professional_standard"
        | "pedagogy"
        | "methodology"
      question_format: "Y1" | "Y2" | "Y3"
      report_status: "yangi" | "korilmoqda" | "tuzatildi" | "rad"
      user_role: "user" | "editor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cognitive_level: ["bilish", "qollash", "mulohaza"],
      content_status: ["draft", "review", "published", "archived"],
      exam_kind: [
        "diagnostika",
        "mashq",
        "mavzu",
        "bolim",
        "mock",
        "takrorlash",
        "zaif",
      ],
      exam_section: [
        "specialty",
        "professional_standard",
        "pedagogy",
        "methodology",
      ],
      question_format: ["Y1", "Y2", "Y3"],
      report_status: ["yangi", "korilmoqda", "tuzatildi", "rad"],
      user_role: ["user", "editor", "admin"],
    },
  },
} as const
