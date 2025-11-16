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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      athlete_activities: {
        Row: {
          athlete_id: string
          company_id: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          performed_by: string | null
          performed_by_name: string | null
          type: string
        }
        Insert: {
          athlete_id: string
          company_id: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
          type: string
        }
        Update: {
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_activities_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_badges: {
        Row: {
          athlete_id: string
          badge_id: string
          company_id: string
          earned_at: string | null
          id: string
        }
        Insert: {
          athlete_id: string
          badge_id: string
          company_id: string
          earned_at?: string | null
          id?: string
        }
        Update: {
          athlete_id?: string
          badge_id?: string
          company_id?: string
          earned_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_badges_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_check_ins: {
        Row: {
          athlete_id: string
          check_in_time: string
          check_in_type: string | null
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          athlete_id: string
          check_in_time?: string
          check_in_type?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          athlete_id?: string
          check_in_time?: string
          check_in_type?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_check_ins_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_check_ins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_check_ins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_communications: {
        Row: {
          athlete_id: string | null
          company_id: string
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          sent_at: string | null
          sent_by: string | null
          status: string | null
          subject: string | null
          type: string
        }
        Insert: {
          athlete_id?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          athlete_id?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_communications_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_documents: {
        Row: {
          athlete_id: string
          company_id: string
          created_at: string | null
          file_size: number | null
          file_url: string
          id: string
          name: string
          type: string
          uploaded_by: string | null
        }
        Insert: {
          athlete_id: string
          company_id: string
          created_at?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          name: string
          type: string
          uploaded_by?: string | null
        }
        Update: {
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          name?: string
          type?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_documents_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_groups: {
        Row: {
          athlete_id: string
          group_id: string
          id: string
          joined_at: string | null
        }
        Insert: {
          athlete_id: string
          group_id: string
          id?: string
          joined_at?: string | null
        }
        Update: {
          athlete_id?: string
          group_id?: string
          id?: string
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_groups_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_levels: {
        Row: {
          athlete_id: string
          best_streak: number
          company_id: string
          current_level: string
          current_streak: number
          last_check_in_date: string | null
          total_classes: number
          total_points: number
          total_referrals: number
          updated_at: string | null
        }
        Insert: {
          athlete_id: string
          best_streak?: number
          company_id: string
          current_level?: string
          current_streak?: number
          last_check_in_date?: string | null
          total_classes?: number
          total_points?: number
          total_referrals?: number
          updated_at?: string | null
        }
        Update: {
          athlete_id?: string
          best_streak?: number
          company_id?: string
          current_level?: string
          current_streak?: number
          last_check_in_date?: string | null
          total_classes?: number
          total_points?: number
          total_referrals?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_levels_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: true
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_levels_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_levels_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_payments: {
        Row: {
          amount: number
          athlete_id: string
          company_id: string
          created_at: string | null
          due_date: string
          id: string
          installment_number: number | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          plan_name: string | null
          status: string
          total_installments: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          athlete_id: string
          company_id: string
          created_at?: string | null
          due_date: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          plan_name?: string | null
          status?: string
          total_installments?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          plan_name?: string | null
          status?: string
          total_installments?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_payments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_points: {
        Row: {
          athlete_id: string
          awarded_by: string | null
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
          points: number
          reason: string
          reference_id: string | null
        }
        Insert: {
          athlete_id: string
          awarded_by?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          points?: number
          reason: string
          reference_id?: string | null
        }
        Update: {
          athlete_id?: string
          awarded_by?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          points?: number
          reason?: string
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_points_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_points_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_points_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      athlete_subscriptions: {
        Row: {
          athlete_id: string
          auto_renew: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          company_id: string
          created_at: string | null
          end_date: string | null
          id: string
          next_billing_date: string | null
          payment_method: string | null
          plan_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          athlete_id: string
          auto_renew?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          company_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          athlete_id?: string
          auto_renew?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          company_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_subscriptions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "athlete_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      athletes: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
          birth_date: string | null
          blocked_at: string | null
          blocked_reason: string | null
          cc_expiry_date: string | null
          cc_number: string | null
          company_id: string
          created_at: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string | null
          goals: string[] | null
          group: string | null
          id: string
          is_approved: boolean | null
          join_date: string | null
          last_check_in: string | null
          medical_notes: string | null
          monthly_fee: number | null
          name: string
          nif: string | null
          niss: string | null
          notes: string | null
          nutrition_preview: string | null
          phone: string | null
          plan: string | null
          profile_photo: string | null
          status: string | null
          tags: string[] | null
          total_check_ins: number | null
          trainer: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          birth_date?: string | null
          blocked_at?: string | null
          blocked_reason?: string | null
          cc_expiry_date?: string | null
          cc_number?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          goals?: string[] | null
          group?: string | null
          id?: string
          is_approved?: boolean | null
          join_date?: string | null
          last_check_in?: string | null
          medical_notes?: string | null
          monthly_fee?: number | null
          name: string
          nif?: string | null
          niss?: string | null
          notes?: string | null
          nutrition_preview?: string | null
          phone?: string | null
          plan?: string | null
          profile_photo?: string | null
          status?: string | null
          tags?: string[] | null
          total_check_ins?: number | null
          trainer?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          birth_date?: string | null
          blocked_at?: string | null
          blocked_reason?: string | null
          cc_expiry_date?: string | null
          cc_number?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          goals?: string[] | null
          group?: string | null
          id?: string
          is_approved?: boolean | null
          join_date?: string | null
          last_check_in?: string | null
          medical_notes?: string | null
          monthly_fee?: number | null
          name?: string
          nif?: string | null
          niss?: string | null
          notes?: string | null
          nutrition_preview?: string | null
          phone?: string | null
          plan?: string | null
          profile_photo?: string | null
          status?: string | null
          tags?: string[] | null
          total_check_ins?: number | null
          trainer?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athletes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athletes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      badge_definitions: {
        Row: {
          category: string
          color: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          color?: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      bd_ativo: {
        Row: {
          created_at: string
          id: number
          num: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          num?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          num?: number | null
        }
        Relationships: []
      }
      cagio_subscription_payments: {
        Row: {
          amount: number
          billing_period: string
          company_id: string
          created_at: string | null
          due_date: string
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          plan_id: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          billing_period: string
          company_id: string
          created_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          plan_id: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          billing_period?: string
          company_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          plan_id?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cagio_subscription_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cagio_subscription_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "cagio_subscription_payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "cagio_subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cagio_subscription_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      cagio_subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_athletes: number | null
          max_classes_per_month: number | null
          max_staff: number | null
          name: string
          price_monthly: number
          price_yearly: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_athletes?: number | null
          max_classes_per_month?: number | null
          max_staff?: number | null
          name: string
          price_monthly: number
          price_yearly: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_athletes?: number | null
          max_classes_per_month?: number | null
          max_staff?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      class_bookings: {
        Row: {
          athlete_id: string
          booking_date: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          checked_in_at: string | null
          class_id: string
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          athlete_id: string
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          checked_in_at?: string | null
          class_id: string
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          athlete_id?: string
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          checked_in_at?: string | null
          class_id?: string
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      class_check_ins: {
        Row: {
          athlete_id: string
          booking_id: string
          check_in_method: string | null
          check_in_time: string | null
          class_id: string
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          athlete_id: string
          booking_id: string
          check_in_method?: string | null
          check_in_time?: string | null
          class_id: string
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          athlete_id?: string
          booking_id?: string
          check_in_method?: string | null
          check_in_time?: string | null
          class_id?: string
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_check_ins_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_check_ins_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "class_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_check_ins_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_check_ins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_check_ins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      class_templates: {
        Row: {
          company_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          max_capacity: number
          modality_id: string
          room_id: string | null
          start_time: string
          trainer_id: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          max_capacity?: number
          modality_id: string
          room_id?: string | null
          start_time: string
          trainer_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          max_capacity?: number
          modality_id?: string
          room_id?: string | null
          start_time?: string
          trainer_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "class_templates_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_templates_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_templates_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          current_bookings: number | null
          date: string
          description: string | null
          end_time: string
          id: string
          max_capacity: number
          modality_id: string
          notes: string | null
          room_id: string | null
          start_time: string
          status: string
          title: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          current_bookings?: number | null
          date: string
          description?: string | null
          end_time: string
          id?: string
          max_capacity?: number
          modality_id: string
          notes?: string | null
          room_id?: string | null
          start_time: string
          status?: string
          title: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          current_bookings?: number | null
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          max_capacity?: number
          modality_id?: string
          notes?: string | null
          room_id?: string | null
          start_time?: string
          status?: string
          title?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "classes_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      closures: {
        Row: {
          affects_all_modalities: boolean | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          modality_ids: string[] | null
          start_date: string
          title: string
        }
        Insert: {
          affects_all_modalities?: boolean | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          modality_ids?: string[] | null
          start_date: string
          title: string
        }
        Update: {
          affects_all_modalities?: boolean | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          modality_ids?: string[] | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "closures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communications: {
        Row: {
          company_id: string
          created_at: string
          id: string
          message: string
          read_at: string | null
          recipient_id: string | null
          recipient_type: string
          sender_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          recipient_id?: string | null
          recipient_type: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string | null
          recipient_type?: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          business_type: string | null
          capacity: number | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          founded_date: string | null
          gps_coordinates: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          name: string
          nif: string | null
          operating_hours: Json | null
          owner_id: string
          phone: string | null
          postal_code: string | null
          slogan: string | null
          slug: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          capacity?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_date?: string | null
          gps_coordinates?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name: string
          nif?: string | null
          operating_hours?: Json | null
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          slogan?: string | null
          slug?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          capacity?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_date?: string | null
          gps_coordinates?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name?: string
          nif?: string | null
          operating_hours?: Json | null
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          slogan?: string | null
          slug?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_announcements: {
        Row: {
          background_color: string | null
          company_id: string
          content: string | null
          created_at: string | null
          created_by: string | null
          display_order: number | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          start_date: string | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          company_id: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          start_date?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          company_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          start_date?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_documents: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          document_type: string
          file_size: number | null
          file_url: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          document_type: string
          file_size?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          document_type?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_events: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          is_active: boolean | null
          location: string | null
          max_participants: number | null
          price: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_messages: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_notifications: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          id: string
          is_urgent: boolean | null
          message: string
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          is_urgent?: boolean | null
          message: string
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          is_urgent?: boolean | null
          message?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_payment_methods: {
        Row: {
          company_id: string
          configuration: Json | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          method_type: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          method_type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          method_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_payment_methods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_payment_methods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_schedule: {
        Row: {
          close_time: string | null
          company_id: string
          created_at: string | null
          day_of_week: number
          id: string
          is_open: boolean | null
          notes: string | null
          open_time: string | null
          updated_at: string | null
        }
        Insert: {
          close_time?: string | null
          company_id: string
          created_at?: string | null
          day_of_week: number
          id?: string
          is_open?: boolean | null
          notes?: string | null
          open_time?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time?: string | null
          company_id?: string
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_open?: boolean | null
          notes?: string | null
          open_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_type: string
          company_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          metadata: Json | null
          prospect_id: string | null
          scheduled_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          activity_type: string
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          prospect_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          prospect_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          id: string
          lost_reason: string | null
          probability: number | null
          prospect_id: string | null
          stage_id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          probability?: number | null
          prospect_id?: string | null
          stage_id: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          probability?: number | null
          prospect_id?: string | null
          stage_id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "crm_deals_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stages: {
        Row: {
          color: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_lost: boolean | null
          is_won: boolean | null
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_lost?: boolean | null
          is_won?: boolean | null
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_lost?: boolean | null
          is_won?: boolean | null
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      discount_coupons: {
        Row: {
          code: string
          company_id: string
          created_at: string | null
          discount_percentage: number
          discount_type: string | null
          discount_value: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string | null
          discount_percentage: number
          discount_type?: string | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string | null
          discount_percentage?: number
          discount_type?: string | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_coupons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_coupons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      email_verification_codes: {
        Row: {
          code: string
          company_name: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          used: boolean | null
        }
        Insert: {
          code: string
          company_name: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          used?: boolean | null
        }
        Update: {
          code?: string
          company_name?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string | null
          company_id: string
          condition: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          maintenance_date: string | null
          name: string
          next_maintenance: string | null
          purchase_date: string | null
          purchase_price: number | null
          quantity: number | null
          serial_number: string | null
          status: string | null
          supplier: string | null
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          condition?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          maintenance_date?: string | null
          name: string
          next_maintenance?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          serial_number?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          condition?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          maintenance_date?: string | null
          name?: string
          next_maintenance?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          serial_number?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          athlete_id: string
          event_id: string
          id: string
          notes: string | null
          payment_status: string | null
          registration_date: string | null
        }
        Insert: {
          athlete_id: string
          event_id: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
        }
        Update: {
          athlete_id?: string
          event_id?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "company_events"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          category: string
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_default: boolean | null
          muscle_group: string
          name: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          muscle_group: string
          name: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          muscle_group?: string
          name?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_library_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_library_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          company_id: string
          created_at: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_date: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          company_id: string
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_date: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_date?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      gamification_settings: {
        Row: {
          company_id: string
          created_at: string | null
          enabled: boolean | null
          points_per_attendance: number | null
          points_per_personal_record: number | null
          points_per_punctuality: number | null
          points_per_referral: number | null
          streak_bonus_enabled: boolean | null
          streak_bonus_points: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          enabled?: boolean | null
          points_per_attendance?: number | null
          points_per_personal_record?: number | null
          points_per_punctuality?: number | null
          points_per_referral?: number | null
          streak_bonus_enabled?: boolean | null
          streak_bonus_points?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          enabled?: boolean | null
          points_per_attendance?: number | null
          points_per_personal_record?: number | null
          points_per_punctuality?: number | null
          points_per_referral?: number | null
          streak_bonus_enabled?: boolean | null
          streak_bonus_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gamification_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamification_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      groups: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "groups_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_activities: {
        Row: {
          activity_type: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          performed_by: string
          performed_by_name: string | null
          reference_id: string | null
          title: string
        }
        Insert: {
          activity_type: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          performed_by: string
          performed_by_name?: string | null
          reference_id?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          performed_by?: string
          performed_by_name?: string | null
          reference_id?: string | null
          title?: string
        }
        Relationships: []
      }
      kpis: {
        Row: {
          company_id: string
          created_at: string
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          notes: string | null
          period_end: string
          period_start: string
          target_value: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          notes?: string | null
          period_end: string
          period_start: string
          target_value?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          period_end?: string
          period_start?: string
          target_value?: number | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          id: string
          message: string
          name: string
          subject: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          message: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      modalities: {
        Row: {
          color: string | null
          company_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          max_capacity: number | null
          name: string
          requires_booking: boolean | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name: string
          requires_booking?: boolean | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name?: string
          requires_booking?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modalities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modalities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      notification_reads: {
        Row: {
          created_at: string | null
          id: string
          notification_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "company_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          company_id: string
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      nutritional_plans: {
        Row: {
          athlete_id: string
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          plan_details: Json | null
          title: string
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          athlete_id: string
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          plan_details?: Json | null
          title: string
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          plan_details?: Json | null
          title?: string
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutritional_plans_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutritional_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutritional_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "nutritional_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      observatory_reports: {
        Row: {
          company_id: string
          created_at: string
          data: Json
          generated_by: string | null
          id: string
          period_end: string
          period_start: string
          report_type: string
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          data: Json
          generated_by?: string | null
          id?: string
          period_end: string
          period_start: string
          report_type: string
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          data?: Json
          generated_by?: string | null
          id?: string
          period_end?: string
          period_start?: string
          report_type?: string
          title?: string
        }
        Relationships: []
      }
      password_reset_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      payment_gateway_settings: {
        Row: {
          company_id: string
          created_at: string | null
          gateway_type: string
          id: string
          is_enabled: boolean | null
          is_sandbox: boolean | null
          settings: Json
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          gateway_type: string
          id?: string
          is_enabled?: boolean | null
          is_sandbox?: boolean | null
          settings?: Json
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          gateway_type?: string
          id?: string
          is_enabled?: boolean | null
          is_sandbox?: boolean | null
          settings?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_gateway_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          athlete_id: string | null
          company_id: string
          created_at: string | null
          currency: string
          entity: string | null
          expires_at: string | null
          gateway_type: string
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_id: string | null
          payment_method: string
          phone_number: string | null
          reference: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          athlete_id?: string | null
          company_id: string
          created_at?: string | null
          currency?: string
          entity?: string | null
          expires_at?: string | null
          gateway_type: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_id?: string | null
          payment_method: string
          phone_number?: string | null
          reference?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          athlete_id?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string
          entity?: string | null
          expires_at?: string | null
          gateway_type?: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string
          phone_number?: string | null
          reference?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "athlete_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks_log: {
        Row: {
          company_id: string | null
          created_at: string | null
          error_message: string | null
          gateway_type: string
          id: string
          payload: Json
          processed_at: string | null
          status: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          gateway_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          status?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          error_message?: string | null
          gateway_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_webhooks_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_webhooks_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      payroll: {
        Row: {
          base_salary: number
          bonuses: number | null
          classes_taught: number | null
          commissions: number | null
          company_id: string
          created_at: string | null
          created_by: string | null
          deductions: number | null
          gross_amount: number
          hours_worked: number | null
          id: string
          net_amount: number
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string
          reference_month: string
          social_security: number | null
          staff_id: string
          tax_amount: number | null
          updated_at: string | null
        }
        Insert: {
          base_salary?: number
          bonuses?: number | null
          classes_taught?: number | null
          commissions?: number | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          deductions?: number | null
          gross_amount: number
          hours_worked?: number | null
          id?: string
          net_amount: number
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string
          reference_month: string
          social_security?: number | null
          staff_id: string
          tax_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          base_salary?: number
          bonuses?: number | null
          classes_taught?: number | null
          commissions?: number | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          deductions?: number | null
          gross_amount?: number
          hours_worked?: number | null
          id?: string
          net_amount?: number
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string
          reference_month?: string
          social_security?: number | null
          staff_id?: string
          tax_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payroll_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_assessments: {
        Row: {
          assessed_by: string | null
          assessment_date: string
          athlete_id: string
          body_fat_percentage: number | null
          company_id: string
          created_at: string | null
          height: number | null
          id: string
          measurements: Json | null
          muscle_mass: number | null
          notes: string | null
          photos: Json | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          assessed_by?: string | null
          assessment_date: string
          athlete_id: string
          body_fat_percentage?: number | null
          company_id: string
          created_at?: string | null
          height?: number | null
          id?: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string
          athlete_id?: string
          body_fat_percentage?: number | null
          company_id?: string
          created_at?: string | null
          height?: number | null
          id?: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_assessments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      plans: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          duration_months: number | null
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      platform_suggestions: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_suggestions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_suggestions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          id: string
          is_approved: boolean | null
          name: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          id: string
          is_approved?: boolean | null
          name: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_approved?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prospects: {
        Row: {
          assigned_to: string | null
          company_id: string
          contact_date: string | null
          created_at: string
          email: string | null
          follow_up_date: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          contact_date?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          contact_date?: string | null
          created_at?: string
          email?: string | null
          follow_up_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      recurring_payments: {
        Row: {
          amount: number
          athlete_id: string
          company_id: string
          created_at: string | null
          due_day: number
          end_date: string | null
          id: string
          last_generated_date: string | null
          start_date: string
          status: string
          subscription_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          athlete_id: string
          company_id: string
          created_at?: string | null
          due_day: number
          end_date?: string | null
          id?: string
          last_generated_date?: string | null
          start_date: string
          status?: string
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          due_day?: number
          end_date?: string | null
          id?: string
          last_generated_date?: string | null
          start_date?: string
          status?: string
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_payments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "recurring_payments_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_key: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_key: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_key?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          color: string
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          company_id: string
          created_at: string | null
          description: string | null
          floor: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          company_id: string
          created_at?: string | null
          description?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          company_id?: string
          created_at?: string | null
          description?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          address: string | null
          birth_date: string | null
          company_id: string
          created_at: string | null
          department: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_login: boolean | null
          hire_date: string | null
          id: string
          name: string
          notes: string | null
          password_changed_at: string | null
          phone: string | null
          position: string
          profile_photo: string | null
          role_id: string | null
          role_type: string | null
          salary: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          company_id: string
          created_at?: string | null
          department: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_login?: boolean | null
          hire_date?: string | null
          id?: string
          name: string
          notes?: string | null
          password_changed_at?: string | null
          phone?: string | null
          position: string
          profile_photo?: string | null
          role_id?: string | null
          role_type?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          company_id?: string
          created_at?: string | null
          department?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_login?: boolean | null
          hire_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          password_changed_at?: string | null
          phone?: string | null
          position?: string
          profile_photo?: string | null
          role_id?: string | null
          role_type?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_documents: {
        Row: {
          company_id: string
          created_at: string | null
          document_type: string
          file_size: number | null
          file_url: string
          id: string
          name: string
          notes: string | null
          staff_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          document_type: string
          file_size?: number | null
          file_url: string
          id?: string
          name: string
          notes?: string | null
          staff_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          document_type?: string
          file_size?: number | null
          file_url?: string
          id?: string
          name?: string
          notes?: string | null
          staff_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_documents_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_events: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          location: string | null
          staff_ids: string[] | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          location?: string | null
          staff_ids?: string[] | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          location?: string | null
          staff_ids?: string[] | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_payment_config: {
        Row: {
          bank_account: string | null
          base_amount: number
          commission_percentage: number | null
          company_id: string
          created_at: string | null
          currency: string
          hourly_rate: number | null
          iban: string | null
          id: string
          is_active: boolean | null
          nib: string | null
          notes: string | null
          payment_day: number | null
          payment_frequency: string | null
          payment_type: string
          per_class_rate: number | null
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          bank_account?: string | null
          base_amount?: number
          commission_percentage?: number | null
          company_id: string
          created_at?: string | null
          currency?: string
          hourly_rate?: number | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          nib?: string | null
          notes?: string | null
          payment_day?: number | null
          payment_frequency?: string | null
          payment_type: string
          per_class_rate?: number | null
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          bank_account?: string | null
          base_amount?: number
          commission_percentage?: number | null
          company_id?: string
          created_at?: string | null
          currency?: string
          hourly_rate?: number | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          nib?: string | null
          notes?: string | null
          payment_day?: number | null
          payment_frequency?: string | null
          payment_type?: string
          per_class_rate?: number | null
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_payment_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_payment_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_payment_config_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: true
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_permissions: {
        Row: {
          can_access: boolean | null
          company_id: string
          created_at: string | null
          id: string
          permission_key: string
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          can_access?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          permission_key: string
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          can_access?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          permission_key?: string
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_permissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_permissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_permissions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_required_terms: {
        Row: {
          auto_accept: boolean | null
          company_id: string
          created_at: string | null
          display_order: number | null
          document_id: string
          id: string
          is_required: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_accept?: boolean | null
          company_id: string
          created_at?: string | null
          display_order?: number | null
          document_id: string
          id?: string
          is_required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_accept?: boolean | null
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          document_id?: string
          id?: string
          is_required?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_required_terms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_required_terms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_required_terms_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "company_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_term_acceptances: {
        Row: {
          accepted_at: string | null
          company_id: string
          document_id: string
          id: string
          ip_address: string | null
          staff_id: string
          user_agent: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          document_id: string
          id?: string
          ip_address?: string | null
          staff_id: string
          user_agent?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          staff_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_term_acceptances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_term_acceptances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_term_acceptances_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "company_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_term_acceptances_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_time_off: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          days_count: number
          end_date: string
          id: string
          reason: string | null
          rejection_reason: string | null
          request_type: string
          staff_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          days_count: number
          end_date: string
          id?: string
          reason?: string | null
          rejection_reason?: string | null
          request_type: string
          staff_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          days_count?: number
          end_date?: string
          id?: string
          reason?: string | null
          rejection_reason?: string | null
          request_type?: string
          staff_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_work_log: {
        Row: {
          amount: number | null
          class_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          hours_worked: number | null
          id: string
          log_date: string
          log_type: string
          staff_id: string
        }
        Insert: {
          amount?: number | null
          class_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hours_worked?: number | null
          id?: string
          log_date: string
          log_type: string
          staff_id: string
        }
        Update: {
          amount?: number | null
          class_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hours_worked?: number | null
          id?: string
          log_date?: string
          log_type?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_work_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_work_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "staff_work_log_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          sku: string | null
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          sku?: string | null
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      store_sales: {
        Row: {
          athlete_id: string | null
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          product_id: string
          quantity: number
          sale_date: string | null
          sold_by: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          athlete_id?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id: string
          quantity: number
          sale_date?: string | null
          sold_by?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          athlete_id?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string
          quantity?: number
          sale_date?: string | null
          sold_by?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "store_sales_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "store_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          amount: number
          athlete_id: string
          company_id: string
          created_at: string | null
          currency: string
          due_date: string
          external_payment_id: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string
          payment_proof_url: string | null
          processed_by: string | null
          status: string
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          athlete_id: string
          company_id: string
          created_at?: string | null
          currency?: string
          due_date: string
          external_payment_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          payment_proof_url?: string | null
          processed_by?: string | null
          status?: string
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          athlete_id?: string
          company_id?: string
          created_at?: string | null
          currency?: string
          due_date?: string
          external_payment_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          payment_proof_url?: string | null
          processed_by?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "athlete_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_period: string
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_classes_per_week: number | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          billing_period: string
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_classes_per_week?: number | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          billing_period?: string
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_classes_per_week?: number | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      suggestion_votes: {
        Row: {
          company_id: string
          created_at: string
          id: string
          suggestion_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          suggestion_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          suggestion_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_votes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "platform_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          birth_date: string | null
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          specialties: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_date?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_date?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "trainers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          athlete_id: string | null
          company_id: string
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          exercises: Json | null
          frequency_per_week: number | null
          id: string
          is_active: boolean | null
          name: string
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          athlete_id?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          exercises?: Json | null
          frequency_per_week?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          athlete_id?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          exercises?: Json | null
          frequency_per_week?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_financial_overview"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "workout_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_financial_overview: {
        Row: {
          active_subscriptions: number | null
          company_id: string | null
          company_name: string | null
          pending_amount: number | null
          pending_payments: number | null
          revenue_last_30_days: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      athlete_has_active_subscription: {
        Args: { _athlete_id: string; _company_id: string }
        Returns: boolean
      }
      calculate_next_billing_date: {
        Args: { billing_period: string; start_date: string }
        Returns: string
      }
      can_access_company_data: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      can_access_profile: {
        Args: { target_profile_id: string }
        Returns: boolean
      }
      can_update_profile: {
        Args: { target_profile_id: string }
        Returns: boolean
      }
      check_birthday_notifications: { Args: never; Returns: undefined }
      check_suspicious_activity: {
        Args: { _action: string; _user_id: string }
        Returns: boolean
      }
      clean_expired_verification_codes: { Args: never; Returns: undefined }
      get_company_financial_overview: {
        Args: { target_company_id: string }
        Returns: {
          active_subscriptions: number
          company_id: string
          company_name: string
          pending_amount: number
          pending_payments: number
          revenue_last_30_days: number
        }[]
      }
      has_role: {
        Args: {
          _company_id?: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      inserir_3x_e_parar: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role:
        | "cagio_admin"
        | "box_owner"
        | "personal_trainer"
        | "staff_member"
        | "student"
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
      app_role: [
        "cagio_admin",
        "box_owner",
        "personal_trainer",
        "staff_member",
        "student",
      ],
    },
  },
} as const
