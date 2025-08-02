import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// Using fallback values for development when env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create the client if we have real credentials
export const supabase = supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder') 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey)

// Database Types for TypeScript
export interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'volunteer' | 'buddy'
  department?: string
  location?: string
  created_at: string
  
  // Buddy Profile Fields
  bio?: string
  experience_years?: number
  expertise?: string[]
  availability_days?: string[]
  preferred_times?: string[]
  meeting_preference?: 'in-person' | 'virtual' | 'both'
  languages?: string[]
  max_weekly_hours?: number
  
  // Buddy Status Fields
  rating?: number
  review_count?: number
  availability_status?: 'online' | 'busy' | 'offline'
  response_time?: string
  
  // Profile completion
  profile_completed?: boolean
  last_active?: string
}

export interface BuddyRequest {
  id: string
  requester_id: string
  buddy_id?: string
  type: 'mentorship' | 'companionship' | 'guidance'
  description: string
  status: 'pending' | 'matched' | 'completed' | 'cancelled'
  scheduled_date?: string
  created_at: string
}

export interface VolunteerRequest {
  id: string
  requester_id: string
  volunteer_id?: string
  help_type: 'elevator_assistance' | 'moving_equipment' | 'guidance' | 'other'
  location: string
  description: string
  required_time: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  created_at: string
}

export interface Availability {
  id: string
  user_id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string
  end_time: string
  is_active: boolean
}

export interface EmotionalCheckIn {
  id: string
  user_id: string
  mood_score: number // 1-10
  stress_level: number // 1-10
  notes?: string
  created_at: string
} 