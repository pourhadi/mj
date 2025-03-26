export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          created_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          prompt: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          url?: string
          created_at?: string
        }
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
  }
}

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Image = Database['public']['Tables']['images']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ImageInsert = Database['public']['Tables']['images']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ImageUpdate = Database['public']['Tables']['images']['Update']

// Custom types for the application
export interface UserProfile extends Profile {
  images_count?: number
}

export interface ImageWithProfile extends Image {
  profile: Profile
}

export interface AuthResponse {
  data: {
    user: Profile | null
    session: any | null
  }
  error: Error | null
}