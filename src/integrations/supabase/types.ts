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
      articles: {
        Row: {
          content: string
          created_at: string
          id: string
          question_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          question_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      blog_posts: {
        Row: {
          content: string
          created_at: string
          description: string
          html_content: string | null
          id: string
          read_time: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          html_content?: string | null
          id?: string
          read_time: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          html_content?: string | null
          id?: string
          read_time?: number
          title?: string
          updated_at?: string
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
      post_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      post_category_relations: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_category_relations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "post_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_category_relations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_resources: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_resources_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          cgpa: number | null
          college_name: string | null
          created_at: string
          github_url: string | null
          id: string
          leetcode_url: string | null
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
          leetcode_url?: string | null
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
          leetcode_url?: string | null
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
          questionid: string | null
          solution_link: string | null
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty: string
          id: string
          practice_link?: string | null
          questionid?: string | null
          solution_link?: string | null
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          id?: string
          practice_link?: string | null
          questionid?: string | null
          solution_link?: string | null
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
          assigned_learning_paths: string[] | null
          course: string | null
          created_at: string
          department: string | null
          email: string
          grad_year: number | null
          id: string
          password: string
          prn: string
          updated_at: string
          username: string
        }
        Insert: {
          assigned_learning_paths?: string[] | null
          course?: string | null
          created_at?: string
          department?: string | null
          email: string
          grad_year?: number | null
          id?: string
          password: string
          prn: string
          updated_at?: string
          username: string
        }
        Update: {
          assigned_learning_paths?: string[] | null
          course?: string | null
          created_at?: string
          department?: string | null
          email?: string
          grad_year?: number | null
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
      authenticate_user: {
        Args: { prn_input: string; password_input: string }
        Returns: {
          id: string
          username: string
          prn: string
          email: string
          department: string
          course: string
          grad_year: number
        }[]
      }
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
