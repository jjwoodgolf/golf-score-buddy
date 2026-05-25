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
      course_holes: {
        Row: {
          course_id: string
          handicap_index: number | null
          hole_number: number
          id: string
          par: number
          yardage: number
        }
        Insert: {
          course_id: string
          handicap_index?: number | null
          hole_number: number
          id?: string
          par: number
          yardage: number
        }
        Update: {
          course_id?: string
          handicap_index?: number | null
          hole_number?: number
          id?: string
          par?: number
          yardage?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_holes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          city: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          state: string | null
          total_par: number | null
          total_yards: number | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          created_by: string
          id?: string
          name: string
          state?: string | null
          total_par?: number | null
          total_yards?: number | null
        }
        Update: {
          city?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          state?: string | null
          total_par?: number | null
          total_yards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      holes_played: {
        Row: {
          fairway_hit: boolean | null
          gir: boolean | null
          hole_id: string
          hole_number: number
          id: string
          putts: number | null
          round_id: string
          score: number | null
          sg_app: number | null
          sg_arg: number | null
          sg_ott: number | null
          sg_putt: number | null
        }
        Insert: {
          fairway_hit?: boolean | null
          gir?: boolean | null
          hole_id: string
          hole_number: number
          id?: string
          putts?: number | null
          round_id: string
          score?: number | null
          sg_app?: number | null
          sg_arg?: number | null
          sg_ott?: number | null
          sg_putt?: number | null
        }
        Update: {
          fairway_hit?: boolean | null
          gir?: boolean | null
          hole_id?: string
          hole_number?: number
          id?: string
          putts?: number | null
          round_id?: string
          score?: number | null
          sg_app?: number | null
          sg_arg?: number | null
          sg_ott?: number | null
          sg_putt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "holes_played_hole_id_fkey"
            columns: ["hole_id"]
            isOneToOne: false
            referencedRelation: "course_holes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holes_played_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          coach_id: string | null
          created_at: string
          email: string
          full_name: string
          handicap_index: number | null
          id: string
          role: string
        }
        Insert: {
          coach_id?: string | null
          created_at?: string
          email: string
          full_name: string
          handicap_index?: number | null
          id: string
          role: string
        }
        Update: {
          coach_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          handicap_index?: number | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rounds: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_complete: boolean
          notes: string | null
          played_at: string
          sg_app: number | null
          sg_arg: number | null
          sg_ott: number | null
          sg_putt: number | null
          sg_total: number | null
          student_id: string
          total_score: number | null
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_complete?: boolean
          notes?: string | null
          played_at: string
          sg_app?: number | null
          sg_arg?: number | null
          sg_ott?: number | null
          sg_putt?: number | null
          sg_total?: number | null
          student_id: string
          total_score?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_complete?: boolean
          notes?: string | null
          played_at?: string
          sg_app?: number | null
          sg_arg?: number | null
          sg_ott?: number | null
          sg_putt?: number | null
          sg_total?: number | null
          student_id?: string
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rounds_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rounds_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_benchmarks: {
        Row: {
          avg_strokes: number
          distance: number
          id: number
          is_putting: boolean
          lie_type: string
        }
        Insert: {
          avg_strokes: number
          distance: number
          id?: number
          is_putting?: boolean
          lie_type: string
        }
        Update: {
          avg_strokes?: number
          distance?: number
          id?: number
          is_putting?: boolean
          lie_type?: string
        }
        Relationships: []
      }
      shots: {
        Row: {
          benchmark_end: number | null
          benchmark_start: number | null
          created_at: string
          dist_end_yds: number
          dist_start_yds: number
          hole_played_id: string
          id: string
          lie_end: string
          lie_start: string
          penalty_strokes: number
          penalty_type: string | null
          sg_category: string | null
          sg_value: number | null
          shot_number: number
        }
        Insert: {
          benchmark_end?: number | null
          benchmark_start?: number | null
          created_at?: string
          dist_end_yds?: number
          dist_start_yds: number
          hole_played_id: string
          id?: string
          lie_end: string
          lie_start: string
          penalty_strokes?: number
          penalty_type?: string | null
          sg_category?: string | null
          sg_value?: number | null
          shot_number: number
        }
        Update: {
          benchmark_end?: number | null
          benchmark_start?: number | null
          created_at?: string
          dist_end_yds?: number
          dist_start_yds?: number
          hole_played_id?: string
          id?: string
          lie_end?: string
          lie_start?: string
          penalty_strokes?: number
          penalty_type?: string | null
          sg_category?: string | null
          sg_value?: number | null
          shot_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "shots_hole_played_id_fkey"
            columns: ["hole_played_id"]
            isOneToOne: false
            referencedRelation: "holes_played"
            referencedColumns: ["id"]
          },
        ]
      }
      student_trends: {
        Row: {
          avg_sg_app: number | null
          avg_sg_arg: number | null
          avg_sg_ott: number | null
          avg_sg_putt: number | null
          avg_sg_total: number | null
          id: string
          period: string
          rounds_counted: number | null
          student_id: string
          updated_at: string
        }
        Insert: {
          avg_sg_app?: number | null
          avg_sg_arg?: number | null
          avg_sg_ott?: number | null
          avg_sg_putt?: number | null
          avg_sg_total?: number | null
          id?: string
          period: string
          rounds_counted?: number | null
          student_id: string
          updated_at?: string
        }
        Update: {
          avg_sg_app?: number | null
          avg_sg_arg?: number | null
          avg_sg_ott?: number | null
          avg_sg_putt?: number | null
          avg_sg_total?: number | null
          id?: string
          period?: string
          rounds_counted?: number | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_trends_student_id_fkey"
            columns: ["student_id"]
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
      assign_sg_category:
        | {
            Args: {
              p_dist_start: number
              p_hole_par: number
              p_lie_start: string
            }
            Returns: string
          }
        | {
            Args: {
              p_dist_start: number
              p_hole_par: number
              p_lie_start: string
            }
            Returns: string
          }
      get_my_coach_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      lookup_benchmark: {
        Args: { p_distance: number; p_lie: string }
        Returns: number
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
    Enums: {},
  },
} as const
