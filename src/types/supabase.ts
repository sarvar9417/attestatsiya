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
  graphql_public: {
    Tables: { [_ in never]: never }
    Views: { [_ in never]: never }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          id: number
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: number
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Update: {
          id?: number
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
        Relationships: []
      }
      adaptive_plans: {
        Row: {
          user_id: string
          date: string
          plan_data: Json
          updated_at: string | null
        }
        Insert: {
          user_id: string
          date: string
          plan_data: Json
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          date?: string
          plan_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          transcript: Json
          feedback: Json | null
          weak_grammar_points: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          transcript?: Json
          feedback?: Json | null
          weak_grammar_points?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          transcript?: Json
          feedback?: Json | null
          weak_grammar_points?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          day: number
          week: number
          total_minutes: number
          grammar_minutes: number
          vocab_minutes: number
          listening_minutes: number
          writing_minutes: number
          xp_earned: number
          streak: number
          grammar_pct: number
          vocab_pct: number
          listening_pct: number
          writing_pct: number
          checklist_completed: number
          reading_pct: number
          speaking_pct: number
          phrases_pct: number
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          day: number
          week: number
          total_minutes: number
          grammar_minutes: number
          vocab_minutes: number
          listening_minutes: number
          writing_minutes: number
          xp_earned: number
          streak: number
          grammar_pct: number
          vocab_pct: number
          listening_pct: number
          writing_pct: number
          checklist_completed: number
          reading_pct: number
          speaking_pct: number
          phrases_pct: number
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          day?: number
          week?: number
          total_minutes?: number
          grammar_minutes?: number
          vocab_minutes?: number
          listening_minutes?: number
          writing_minutes?: number
          xp_earned?: number
          streak?: number
          grammar_pct?: number
          vocab_pct?: number
          listening_pct?: number
          writing_pct?: number
          checklist_completed?: number
          reading_pct?: number
          speaking_pct?: number
          phrases_pct?: number
        }
        Relationships: []
      }
      duel_results: {
        Row: {
          id: string
          duel_id: string
          user_id: string
          grammar_score: number | null
          vocab_score: number | null
          topic_score: number | null
          feedback: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          duel_id: string
          user_id: string
          grammar_score?: number | null
          vocab_score?: number | null
          topic_score?: number | null
          feedback?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          duel_id?: string
          user_id?: string
          grammar_score?: number | null
          vocab_score?: number | null
          topic_score?: number | null
          feedback?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      duels: {
        Row: {
          id: string
          challenger: string
          opponent: string | null
          mode: string
          status: string
          question_set: Json | null
          challenger_score: number | null
          opponent_score: number | null
          is_bot: boolean | null
          expires_at: string
          created_at: string | null
          lesson_id: string | null
          lesson_title: string | null
        }
        Insert: {
          id?: string
          challenger: string
          opponent?: string | null
          mode: string
          status: string
          question_set?: Json | null
          challenger_score?: number | null
          opponent_score?: number | null
          is_bot?: boolean | null
          expires_at: string
          created_at?: string | null
          lesson_id?: string | null
          lesson_title?: string | null
        }
        Update: {
          id?: string
          challenger?: string
          opponent?: string | null
          mode?: string
          status?: string
          question_set?: Json | null
          challenger_score?: number | null
          opponent_score?: number | null
          is_bot?: boolean | null
          expires_at?: string
          created_at?: string | null
          lesson_id?: string | null
          lesson_title?: string | null
        }
        Relationships: []
      }
      duo_streaks: {
        Row: {
          id: string
          user_id: string
          buddy_id: string
          date: string
          both_completed: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          buddy_id: string
          date: string
          both_completed?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          buddy_id?: string
          date?: string
          both_completed?: boolean | null
        }
        Relationships: []
      }
      elo_history: {
        Row: {
          id: string
          user_id: string
          duel_id: string
          old_rating: number
          new_rating: number
          change: number
          opponent_name: string
          result: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          duel_id: string
          old_rating: number
          new_rating: number
          change: number
          opponent_name: string
          result: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          duel_id?: string
          old_rating?: number
          new_rating?: number
          change?: number
          opponent_name?: string
          result?: string
          created_at?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string | null
        }
        Relationships: []
      }
      grammar_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          topic_id: string
          topic_title: string
          score: number
          correct_count: number
          total_exercises: number
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          topic_id: string
          topic_title: string
          score: number
          correct_count: number
          total_exercises: number
          xp_earned: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          topic_id?: string
          topic_title?: string
          score?: number
          correct_count?: number
          total_exercises?: number
          xp_earned?: number
          completed_at?: string
        }
        Relationships: []
      }
      grammar_topics: {
        Row: {
          id: string
          level: string
          data: Json
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          data: Json
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          data?: Json
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      lesson_exercise_answers: {
        Row: {
          id: number
          user_id: string
          lesson_id: string
          section_index: number
          exercise_id: number
          exercise_type: string
          section_type: string
          answer: Json
          is_correct: boolean
          submitted_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_id: string
          section_index: number
          exercise_id: number
          exercise_type: string
          section_type: string
          answer: Json
          is_correct: boolean
          submitted_at: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_id?: string
          section_index?: number
          exercise_id?: number
          exercise_type?: string
          section_type?: string
          answer?: Json
          is_correct?: boolean
          submitted_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          lesson_id: string
          score: number
          correct_count: number
          total_exercises: number
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          lesson_id: string
          score: number
          correct_count: number
          total_exercises: number
          xp_earned: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          lesson_id?: string
          score?: number
          correct_count?: number
          total_exercises?: number
          xp_earned?: number
          completed_at?: string
        }
        Relationships: []
      }
      lesson_sessions: {
        Row: {
          id: number
          user_id: string
          lesson_id: string
          tab: string
          current_section: number
          test_section: number
          completed_sections: Json
          completed_test_sections: Json
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_id: string
          tab: string
          current_section: number
          test_section: number
          completed_sections: Json
          completed_test_sections: Json
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_id?: string
          tab?: string
          current_section?: number
          test_section?: number
          completed_sections?: Json
          completed_test_sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      lesson_skills: {
        Row: {
          lesson_id: string
          reading: Json | null
          writing: Json | null
          listening: Json | null
        }
        Insert: {
          lesson_id: string
          reading?: Json | null
          writing?: Json | null
          listening?: Json | null
        }
        Update: {
          lesson_id?: string
          reading?: Json | null
          writing?: Json | null
          listening?: Json | null
        }
        Relationships: []
      }
      lesson_viewed_tabs: {
        Row: {
          id: number
          user_id: string
          lesson_id: string
          viewed_tabs: Json
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_id: string
          viewed_tabs: Json
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_id?: string
          viewed_tabs?: Json
          updated_at?: string
        }
        Relationships: []
      }
      lesson_vocab_progress: {
        Row: {
          id: number
          user_id: string
          lesson_id: string
          word_index: number
          known: boolean
          quiz_correct: number
          quiz_wrong: number
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_id: string
          word_index: number
          known: boolean
          quiz_correct: number
          quiz_wrong: number
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_id?: string
          word_index?: number
          known?: boolean
          quiz_correct?: number
          quiz_wrong?: number
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          title: string
          subtitle: string
          level: string
          day: number
          data: Json
          created_at: string
          category: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          level: string
          day: number
          data: Json
          created_at?: string
          category?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          level?: string
          day?: number
          data?: Json
          created_at?: string
          category?: string | null
        }
        Relationships: []
      }
      listening_lessons: {
        Row: {
          id: string
          level: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      listening_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          lesson_id: string
          lesson_title: string
          score: number
          fill_correct: number
          fill_total: number
          tf_correct: number
          tf_total: number
          summary_done: boolean
          xp_earned: number
          play_count: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          lesson_id: string
          lesson_title: string
          score: number
          fill_correct: number
          fill_total: number
          tf_correct: number
          tf_total: number
          summary_done: boolean
          xp_earned: number
          play_count?: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          lesson_id?: string
          lesson_title?: string
          score?: number
          fill_correct?: number
          fill_total?: number
          tf_correct?: number
          tf_total?: number
          summary_done?: boolean
          xp_earned?: number
          play_count?: number
          completed_at?: string
        }
        Relationships: []
      }
      mock_tests: {
        Row: {
          id: number
          user_id: string
          date: string
          day: number
          week: number
          type: string
          reading_score: number
          listening_score: number
          grammar_score: number
          writing_score: number
          total_score: number
          level: string
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          day: number
          week: number
          type: string
          reading_score: number
          listening_score: number
          grammar_score: number
          writing_score: number
          total_score: number
          level: string
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          day?: number
          week?: number
          type?: string
          reading_score?: number
          listening_score?: number
          grammar_score?: number
          writing_score?: number
          total_score?: number
          level?: string
          feedback?: string | null
          created_at?: string
        }
        Relationships: []
      }
      mocktest_listening: {
        Row: {
          id: number
          level: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: number
          level: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: number
          level?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      mocktest_questions: {
        Row: {
          id: number
          level: string
          section: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: number
          level: string
          section: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: number
          level?: string
          section?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      mocktest_writing: {
        Row: {
          id: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      weekly_units: {
        Row: {
          id: number
          user_id: string
          week_no: number
          title: string
          subtitle: string | null
          objective: string | null
          success_criteria: string[]
          phase: string | null
          start_date: string | null
          end_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          week_no: number
          title: string
          subtitle?: string | null
          objective?: string | null
          success_criteria?: string[]
          phase?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          week_no?: number
          title?: string
          subtitle?: string | null
          objective?: string | null
          success_criteria?: string[]
          phase?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      weekly_lessons: {
        Row: {
          id: number
          user_id: string
          unit_id: number
          day_no: number
          title: string
          objective: string | null
          mode: string
          duration_min: number
          blocks: Json
          status: string
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          unit_id: number
          day_no: number
          title: string
          objective?: string | null
          mode?: string
          duration_min?: number
          blocks?: Json
          status?: string
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          unit_id?: number
          day_no?: number
          title?: string
          objective?: string | null
          mode?: string
          duration_min?: number
          blocks?: Json
          status?: string
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      personal_vocabulary_sessions: {
        Row: {
          id: number
          user_id: string
          vocab_id: number
          session_date: string
          result: string
          rating: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          vocab_id: number
          session_date?: string
          result: string
          rating?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          vocab_id?: number
          session_date?: string
          result?: string
          rating?: string | null
          created_at?: string
        }
        Relationships: []
      }
      personal_vocabulary: {
        Row: {
          id: number
          user_id: string
          english: string
          uzbek: string
          phonetic: string | null
          example: string | null
          example_uzbek: string | null
          part_of_speech: string | null
          category: string
          level: string
          source: string
          ai_suggested_translation: string | null
          box: number
          next_review: string
          is_learned: boolean
          correct_count: number
          wrong_count: number
          last_rating: string | null
          fsrs_stability: number | null
          fsrs_difficulty: number | null
          fsrs_reps: number | null
          fsrs_lapses: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          english: string
          uzbek: string
          phonetic?: string | null
          example?: string | null
          example_uzbek?: string | null
          part_of_speech?: string | null
          category: string
          level: string
          source: string
          ai_suggested_translation?: string | null
          box: number
          next_review: string
          is_learned: boolean
          correct_count: number
          wrong_count: number
          last_rating?: string | null
          fsrs_stability?: number | null
          fsrs_difficulty?: number | null
          fsrs_reps?: number | null
          fsrs_lapses?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          english?: string
          uzbek?: string
          phonetic?: string | null
          example?: string | null
          example_uzbek?: string | null
          part_of_speech?: string | null
          category?: string
          level?: string
          source?: string
          ai_suggested_translation?: string | null
          box?: number
          next_review?: string
          is_learned?: boolean
          correct_count?: number
          wrong_count?: number
          last_rating?: string | null
          fsrs_stability?: number | null
          fsrs_difficulty?: number | null
          fsrs_reps?: number | null
          fsrs_lapses?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      phrase_progress: {
        Row: {
          id: number
          user_id: string
          phrase_id: number
          box: number
          next_review: string
          correct_count: number
          wrong_count: number
          is_learned: boolean
          last_rating: string | null
          last_reviewed: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          phrase_id: number
          box: number
          next_review: string
          correct_count: number
          wrong_count: number
          is_learned: boolean
          last_rating?: string | null
          last_reviewed?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          phrase_id?: number
          box?: number
          next_review?: string
          correct_count?: number
          wrong_count?: number
          is_learned?: boolean
          last_rating?: string | null
          last_reviewed?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      phrase_sessions: {
        Row: {
          id: number
          user_id: string
          session_date: string
          batch_number: number
          phrases_json: Json | null
          score: number
          time_spent: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          session_date: string
          batch_number: number
          phrases_json?: Json | null
          score: number
          time_spent: number
          completed: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          session_date?: string
          batch_number?: number
          phrases_json?: Json | null
          score?: number
          time_spent?: number
          completed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      phrases: {
        Row: {
          id: number
          english: string
          uzbek: string
          level: string
          category: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: number
          english: string
          uzbek: string
          level: string
          category: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          english?: string
          uzbek?: string
          level?: string
          category?: string
          source?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profile_reactions: {
        Row: {
          id: string
          target_user_id: string
          reactor_user_id: string
          reaction_type: string
          created_at: string | null
        }
        Insert: {
          id?: string
          target_user_id: string
          reactor_user_id: string
          reaction_type: string
          created_at?: string | null
        }
        Update: {
          id?: string
          target_user_id?: string
          reactor_user_id?: string
          reaction_type?: string
          created_at?: string | null
        }
        Relationships: []
      }
      profile_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          claimed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          claimed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          claimed_at?: string | null
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          text_id: string
          text_title: string
          score: number
          correct_count: number
          total_questions: number
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          text_id: string
          text_title: string
          score: number
          correct_count: number
          total_questions: number
          xp_earned: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          text_id?: string
          text_title?: string
          score?: number
          correct_count?: number
          total_questions?: number
          xp_earned?: number
          completed_at?: string
        }
        Relationships: []
      }
      reading_texts: {
        Row: {
          id: string
          level: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      review_lessons: {
        Row: {
          id: string
          title: string
          subtitle: string
          level: string
          after_day: number
          data: Json
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          level: string
          after_day: number
          data: Json
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          level?: string
          after_day?: number
          data?: Json
        }
        Relationships: []
      }
      sentence_cards: {
        Row: {
          id: string
          topic_id: string
          front_uz: string
          back_en: string
          audio_url: string | null
          review_direction: string
          ease_factor: number
          interval_days: number
          repetitions: number
          next_review_date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          front_uz: string
          back_en: string
          audio_url?: string | null
          review_direction?: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_date?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          front_uz?: string
          back_en?: string
          audio_url?: string | null
          review_direction?: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_date?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      roleplay_sessions: {
        Row: {
          id: string
          pair_id: string
          scenario_id: string
          creator_id: string
          status: string
          user_a_messages: Json | null
          user_b_messages: Json | null
          user_a_evaluation: Json | null
          user_b_evaluation: Json | null
          expires_at: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          pair_id: string
          scenario_id: string
          creator_id: string
          status: string
          user_a_messages?: Json | null
          user_b_messages?: Json | null
          user_a_evaluation?: Json | null
          user_b_evaluation?: Json | null
          expires_at: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          pair_id?: string
          scenario_id?: string
          creator_id?: string
          status?: string
          user_a_messages?: Json | null
          user_b_messages?: Json | null
          user_a_evaluation?: Json | null
          user_b_evaluation?: Json | null
          expires_at?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: number
          user_id: string
          date: string
          type: string
          duration_minutes: number
          xp_earned: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          type: string
          duration_minutes: number
          xp_earned: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          type?: string
          duration_minutes?: number
          xp_earned?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      speaking_progress: {
        Row: {
          id: number
          user_id: string
          date: string
          prompt_id: string
          prompt_text: string
          fluency_score: number
          grammar_score: number
          vocabulary_score: number
          avg_score: number
          xp_earned: number
          feedback: string | null
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          prompt_id: string
          prompt_text: string
          fluency_score: number
          grammar_score: number
          vocabulary_score: number
          avg_score: number
          xp_earned: number
          feedback?: string | null
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          prompt_id?: string
          prompt_text?: string
          fluency_score?: number
          grammar_score?: number
          vocabulary_score?: number
          avg_score?: number
          xp_earned?: number
          feedback?: string | null
          completed_at?: string
        }
        Relationships: []
      }
      speaking_prompts: {
        Row: {
          id: string
          category: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      study_buddies: {
        Row: {
          id: string
          user_id: string
          buddy_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          buddy_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          buddy_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      system_words: {
        Row: {
          id: string
          word: string
          level: string | null
          translation: string | null
          phonetic: string | null
          example_sentence: string | null
          category: string
          week_introduced: number
        }
        Insert: {
          id?: string
          word: string
          level?: string | null
          translation?: string | null
          phonetic?: string | null
          example_sentence?: string | null
          category: string
          week_introduced: number
        }
        Update: {
          id?: string
          word?: string
          level?: string | null
          translation?: string | null
          phonetic?: string | null
          example_sentence?: string | null
          category?: string
          week_introduced?: number
        }
        Relationships: []
      }
      topics: {
        Row: {
          id: string
          day_number: number
          title_uz: string
          title_en: string
          grammar_focus: string | null
          level: string
          scenario_context: string | null
          roleplay_script: Json | null
          youtube_id: string | null
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          day_number: number
          title_uz: string
          title_en: string
          grammar_focus?: string | null
          level?: string
          scenario_context?: string | null
          roleplay_script?: Json | null
          youtube_id?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          day_number?: number
          title_uz?: string
          title_en?: string
          grammar_focus?: string | null
          level?: string
          scenario_context?: string | null
          roleplay_script?: Json | null
          youtube_id?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tandem_pairs: {
        Row: {
          id: string
          user_a: string
          user_b: string
          combined_streak: number
          freeze_used_on: string | null
          last_both_active: string | null
          total_xp: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          combined_streak: number
          freeze_used_on?: string | null
          last_both_active?: string | null
          total_xp: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          combined_streak?: number
          freeze_used_on?: string | null
          last_both_active?: string | null
          total_xp?: number
          created_at?: string | null
        }
        Relationships: []
      }
      user_elo: {
        Row: {
          user_id: string
          rating: number
          matches_played: number
          wins: number
          losses: number
          draws: number
          updated_at: string | null
        }
        Insert: {
          user_id: string
          rating: number
          matches_played: number
          wins: number
          losses: number
          draws: number
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          rating?: number
          matches_played?: number
          wins?: number
          losses?: number
          draws?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_facts: {
        Row: {
          id: string
          user_id: string
          fact_key: string
          fact_value: string
          learned_from_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fact_key: string
          fact_value: string
          learned_from_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fact_key?: string
          fact_value?: string
          learned_from_session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_words: {
        Row: {
          id: number
          user_id: string
          english: string
          uzbek: string
          level: string
          example: string
          phonetic: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          english: string
          uzbek: string
          level: string
          example: string
          phonetic: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          english?: string
          uzbek?: string
          level?: string
          example?: string
          phonetic?: string
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          level: string
          start_date: string
          target_date: string
          current_day: number
          current_week: number
          total_xp: number
          streak: number
          last_active: string | null
          words_learned: number
          created_at: string
          state: Json
          invite_code: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          level: string
          start_date: string
          target_date: string
          current_day: number
          current_week: number
          total_xp: number
          streak: number
          last_active?: string | null
          words_learned: number
          created_at?: string
          state: Json
          invite_code?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          level?: string
          start_date?: string
          target_date?: string
          current_day?: number
          current_week?: number
          total_xp?: number
          streak?: number
          last_active?: string | null
          words_learned?: number
          created_at?: string
          state?: Json
          invite_code?: string | null
        }
        Relationships: []
      }
      vocab_cards: {
        Row: {
          id: string
          topic_id: string
          word: string
          meaning_uz: string
          example_en: string
          audio_url: string | null
          review_direction: string
          ease_factor: number
          interval_days: number
          repetitions: number
          next_review_date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          word: string
          meaning_uz: string
          example_en: string
          audio_url?: string | null
          review_direction?: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_date?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          word?: string
          meaning_uz?: string
          example_en?: string
          audio_url?: string | null
          review_direction?: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review_date?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          id: number
          user_id: string
          word: string
          translation: string
          phonetic: string | null
          example_sentence: string | null
          level: string
          category: string
          srs_interval: number
          srs_repetitions: number
          srs_ease_factor: number
          next_review_at: string
          mastery_level: number
          learned_at: string
          status: string | null
        }
        Insert: {
          id?: number
          user_id: string
          word: string
          translation: string
          phonetic?: string | null
          example_sentence?: string | null
          level: string
          category: string
          srs_interval: number
          srs_repetitions: number
          srs_ease_factor: number
          next_review_at: string
          mastery_level: number
          learned_at: string
          status?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          word?: string
          translation?: string
          phonetic?: string | null
          example_sentence?: string | null
          level?: string
          category?: string
          srs_interval?: number
          srs_repetitions?: number
          srs_ease_factor?: number
          next_review_at?: string
          mastery_level?: number
          learned_at?: string
          status?: string | null
        }
        Relationships: []
      }
      vocabulary_progress: {
        Row: {
          id: number
          user_id: string
          word_id: number
          box: number
          next_review: string
          correct_count: number
          wrong_count: number
          is_learned: boolean
          last_reviewed: string | null
          created_at: string
          last_rating: string | null
          updated_at: string
          fsrs_stability: number | null
          fsrs_difficulty: number | null
          fsrs_reps: number | null
          fsrs_lapses: number | null
        }
        Insert: {
          id?: number
          user_id: string
          word_id: number
          box: number
          next_review: string
          correct_count: number
          wrong_count: number
          is_learned: boolean
          last_reviewed?: string | null
          created_at?: string
          last_rating?: string | null
          updated_at?: string
          fsrs_stability?: number | null
          fsrs_difficulty?: number | null
          fsrs_reps?: number | null
          fsrs_lapses?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          word_id?: number
          box?: number
          next_review?: string
          correct_count?: number
          wrong_count?: number
          is_learned?: boolean
          last_reviewed?: string | null
          created_at?: string
          last_rating?: string | null
          updated_at?: string
          fsrs_stability?: number | null
          fsrs_difficulty?: number | null
          fsrs_reps?: number | null
          fsrs_lapses?: number | null
        }
        Relationships: []
      }
      vocabulary_sessions: {
        Row: {
          id: number
          user_id: string
          session_date: string
          batch_number: number
          words_json: Json
          score: number
          time_spent: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          session_date: string
          batch_number: number
          words_json: Json
          score: number
          time_spent: number
          completed: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          session_date?: string
          batch_number?: number
          words_json?: Json
          score?: number
          time_spent?: number
          completed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      weekly_duels: {
        Row: {
          id: string
          pair_id: string
          week_start: string
          user_a_xp: number
          user_b_xp: number
          winner_id: string | null
          settled_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          pair_id: string
          week_start: string
          user_a_xp: number
          user_b_xp: number
          winner_id?: string | null
          settled_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          pair_id?: string
          week_start?: string
          user_a_xp?: number
          user_b_xp?: number
          winner_id?: string | null
          settled_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      words: {
        Row: {
          id: number
          english: string
          uzbek: string
          level: string
          example: string
          phonetic: string
        }
        Insert: {
          id?: number
          english: string
          uzbek: string
          level: string
          example: string
          phonetic: string
        }
        Update: {
          id?: number
          english?: string
          uzbek?: string
          level?: string
          example?: string
          phonetic?: string
        }
        Relationships: []
      }
      writing_prompts: {
        Row: {
          id: string
          type: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          data?: Json
          created_at?: string
        }
        Relationships: []
      }
      writings: {
        Row: {
          id: number
          user_id: string
          date: string
          day: number
          prompt: string
          user_text: string
          word_count: number
          ai_feedback: string | null
          score: number | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          day: number
          prompt: string
          user_text: string
          word_count: number
          ai_feedback?: string | null
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          day?: number
          prompt?: string
          user_text?: string
          word_count?: number
          ai_feedback?: string | null
          score?: number | null
          created_at?: string
        }
        Relationships: []
      }
      placement_results: {
        Row: {
          id: string
          user_id: string
          level: string
          scores: Json
          correct_count: number
          total_asked: number
          taken_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: string
          scores: Json
          correct_count: number
          total_asked: number
          taken_at: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: string
          scores?: Json
          correct_count?: number
          total_asked?: number
          taken_at?: string
        }
        Relationships: []
      }
      user_speaking_chunks: {
        Row: {
          user_id: string
          chunk_id: string
          stability: number
          difficulty: number
          due: string
          reps: number
          lapses: number
          updated_at: string
        }
        Insert: {
          user_id: string
          chunk_id: string
          stability: number
          difficulty: number
          due: string
          reps: number
          lapses: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          chunk_id?: string
          stability?: number
          difficulty?: number
          due?: string
          reps?: number
          lapses?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_speaking_progress: {
        Row: {
          user_id: string
          day: number
          completed: boolean
          best_speak_score: number | null
          spoken_seconds: number
          completed_at: string | null
        }
        Insert: {
          user_id: string
          day: number
          completed: boolean
          best_speak_score?: number | null
          spoken_seconds: number
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          day?: number
          completed?: boolean
          best_speak_score?: number | null
          spoken_seconds?: number
          completed_at?: string | null
        }
        Relationships: []
      }
      user_weak_points: {
        Row: {
          user_id: string
          grammar_point: string
          error_count: number
          last_seen: string
        }
        Insert: {
          user_id: string
          grammar_point: string
          error_count?: number
          last_seen?: string
        }
        Update: {
          user_id?: string
          grammar_point?: string
          error_count?: number
          last_seen?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_content_stats: { Args: never; Returns: Json }
      get_daily_words: { Args: {
            new_count?: number
            user_uuid: string
          }; Returns: { box: number; correct_count: number; english: string; example: string; is_learned: boolean; is_new: boolean; level: string; next_review: string; uzbek: string; word_id: number; wrong_count: number }[] }
      get_dashboard_stats: { Args: {
            user_uuid: string
          }; Returns: Json }
      get_daily_phrases: { Args: {
            p_user_id: string
            p_level?: string
            p_offset?: number
            p_limit?: number
          }; Returns: { phrase_id: number; english: string; uzbek: string; level: string; category: string; box: number; next_review: string; is_learned: boolean; correct_count: number; wrong_count: number; is_new: boolean; last_rating: string | null }[] }
      get_phrases_for_review: { Args: {
            p_user_id: string
          }; Returns: { phrase_id: number; english: string; uzbek: string; level: string; category: string; box: number; next_review: string; is_learned: boolean; correct_count: number; wrong_count: number; is_new: boolean; last_rating: string | null }[] }
      get_phrase_counts_by_level: { Args: never; Returns: { level: string; total: number }[] }
      get_learned_phrase_counts_by_level: { Args: {
            p_user_uuid: string
          }; Returns: { level: string; learned: number }[] }
      get_learned_counts_by_level: { Args: {
            user_uuid: string
          }; Returns: { learned: number; level: string }[] }
      get_weekly_report: { Args: {
            user_uuid: string
            week_number: number
          }; Returns: Json }
      get_word_counts_by_level: { Args: never; Returns: { level: string; total: number }[] }
      increment_weekly_xp: { Args: {
            p_pair_id: string
            p_week_start: string
            p_field: string
            p_amount: number
          }; Returns: void }
      lookup_user_by_invite_code: { Args: {
            p_code: string
          }; Returns: string }
      rate_personal_vocab_word: { Args: {
            p_user_id: string
            p_word_id: number
            p_rating: string
            p_fsrs_stability?: number | null
            p_fsrs_difficulty?: number | null
            p_fsrs_reps?: number | null
            p_fsrs_lapses?: number | null
          }; Returns: Json }
      rate_personal_vocab_words_batch: { Args: {
            p_user_id: string
            p_results: Json
          }; Returns: Database['public']['Tables']['personal_vocabulary']['Row'][] }
      get_speaking_os_due_count: { Args: {
            p_user_id: string
          }; Returns: Json }
      rate_speaking_os_card: { Args: {
            p_card_id: string
            p_rating: number
            p_deck_type: string
          }; Returns: Json }
      upsert_weak_point: { Args: {
            p_user_id: string
            p_grammar_point: string
          }; Returns: Json }
      upsert_weak_points_batch: { Args: {
            p_user_id: string
            p_grammar_points: string[]
          }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
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
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
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
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
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
  graphql_public: { Enums: {} },
  public: { Enums: {} },
} as const
