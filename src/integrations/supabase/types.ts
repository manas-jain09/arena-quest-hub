export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badge_types: {
        Row: {
          background_color: string
          created_at: string
          description: string | null
          icon_name: string
          id: string
          name: string
          text_color: string
        }
        Insert: {
          background_color: string
          created_at?: string
          description?: string | null
          icon_name: string
          id?: string
          name: string
          text_color: string
        }
        Update: {
          background_color?: string
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          name?: string
          text_color?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string
          issuer: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          issuer: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuer?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      code_templates: {
        Row: {
          created_at: string | null
          id: number
          language: string
          problem_id: string
          template_code: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          language: string
          problem_id: string
          template_code: string
        }
        Update: {
          created_at?: string | null
          id?: number
          language?: string
          problem_id?: string
          template_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_templates_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          id: string
          sr: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          id: string
          sr?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          sr?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      problem_examples: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: number
          input: Json
          output: Json
          problem_id: string
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: number
          input: Json
          output: Json
          problem_id: string
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: number
          input?: Json
          output?: Json
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_examples_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          constraints: Json | null
          created_at: string | null
          description: string
          difficulty: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          constraints?: Json | null
          created_at?: string | null
          description: string
          difficulty: string
          id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          constraints?: Json | null
          created_at?: string | null
          description?: string
          difficulty?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          cgpa: number | null
          college_name: string | null
          created_at: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          profile_picture_url: string | null
          real_name: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          cgpa?: number | null
          college_name?: string | null
          created_at?: string
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          profile_picture_url?: string | null
          real_name: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          cgpa?: number | null
          college_name?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          profile_picture_url?: string | null
          real_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          project_url: string | null
          start_date: string
          technologies: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          start_date: string
          technologies?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          start_date?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          difficulty: string
          id: string
          practice_link: string | null
          solution_link: string
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty: string
          id: string
          practice_link?: string | null
          solution_link: string
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          id?: string
          practice_link?: string | null
          solution_link?: string
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          batch: string | null
          cheating_detected: boolean | null
          contest_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          prn: string | null
          score: number | null
          year: string | null
        }
        Insert: {
          batch?: string | null
          cheating_detected?: boolean | null
          contest_id?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          prn?: string | null
          score?: number | null
          year?: string | null
        }
        Update: {
          batch?: string | null
          cheating_detected?: boolean | null
          contest_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          prn?: string | null
          score?: number | null
          year?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          code: string | null
          id: string
          language_id: string | null
          question_id: string | null
          result_id: string | null
          score: number | null
          submitted_at: string | null
        }
        Insert: {
          code?: string | null
          id: string
          language_id?: string | null
          question_id?: string | null
          result_id?: string | null
          score?: number | null
          submitted_at?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          language_id?: string | null
          question_id?: string | null
          result_id?: string | null
          score?: number | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          created_at: string | null
          expected_output: Json
          id: number
          input: Json
          is_hidden: boolean | null
          problem_id: string
        }
        Insert: {
          created_at?: string | null
          expected_output: Json
          id?: number
          input: Json
          is_hidden?: boolean | null
          problem_id: string
        }
        Update: {
          created_at?: string | null
          expected_output?: Json
          id?: number
          input?: Json
          is_hidden?: boolean | null
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          id: string
          learning_path_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          learning_path_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_path_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean | null
          is_marked_for_revision: boolean | null
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          is_marked_for_revision?: boolean | null
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          is_marked_for_revision?: boolean | null
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          max_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          max_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          max_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
          prn: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
          prn: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
          prn?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          company: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          location: string | null
          position: string
          start_date: string
          technologies: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          location?: string | null
          position: string
          start_date: string
          technologies?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          location?: string | null
          position?: string
          start_date?: string
          technologies?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
