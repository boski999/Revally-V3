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
      stores: {
        Row: {
          id: string
          name: string
          type: string
          address: string
          phone: string | null
          website: string | null
          is_active: boolean
          total_reviews: number
          average_rating: number
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          address: string
          phone?: string | null
          website?: string | null
          is_active?: boolean
          total_reviews?: number
          average_rating?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          address?: string
          phone?: string | null
          website?: string | null
          is_active?: boolean
          total_reviews?: number
          average_rating?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          platform: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          reviewer_name: string
          reviewer_avatar: string | null
          rating: number
          title: string | null
          content: string
          review_date: string
          ai_response_content: string
          ai_response_confidence: number
          ai_response_sentiment: 'positive' | 'neutral' | 'negative'
          status: 'pending' | 'approved' | 'published' | 'rejected'
          is_urgent: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          platform: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          reviewer_name: string
          reviewer_avatar?: string | null
          rating: number
          title?: string | null
          content: string
          review_date: string
          ai_response_content: string
          ai_response_confidence: number
          ai_response_sentiment: 'positive' | 'neutral' | 'negative'
          status?: 'pending' | 'approved' | 'published' | 'rejected'
          is_urgent?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          platform?: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          reviewer_name?: string
          reviewer_avatar?: string | null
          rating?: number
          title?: string | null
          content?: string
          review_date?: string
          ai_response_content?: string
          ai_response_confidence?: number
          ai_response_sentiment?: 'positive' | 'neutral' | 'negative'
          status?: 'pending' | 'approved' | 'published' | 'rejected'
          is_urgent?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      analytics_snapshots: {
        Row: {
          id: string
          store_id: string
          snapshot_date: string
          total_reviews: number
          average_rating: number
          pending_responses: number
          auto_approval_rate: number
          response_time: number
          platform_breakdown: Json
          rating_distribution: Json
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          snapshot_date?: string
          total_reviews: number
          average_rating: number
          pending_responses: number
          auto_approval_rate: number
          response_time: number
          platform_breakdown: Json
          rating_distribution: Json
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          snapshot_date?: string
          total_reviews?: number
          average_rating?: number
          pending_responses?: number
          auto_approval_rate?: number
          response_time?: number
          platform_breakdown?: Json
          rating_distribution?: Json
          created_at?: string
        }
      }
      review_platforms: {
        Row: {
          id: string
          store_id: string
          platform_name: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          connected: boolean
          average_rating: number
          total_reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          platform_name: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          connected?: boolean
          average_rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          platform_name?: 'Google' | 'Yelp' | 'Facebook' | 'TripAdvisor'
          connected?: boolean
          average_rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_store_analytics: {
        Args: { store_id: string }
        Returns: {
          total_reviews: number
          average_rating: number
          pending_responses: number
          auto_approval_rate: number
          response_time: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
