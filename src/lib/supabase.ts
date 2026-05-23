import { createClient } from '@supabase/supabase-js'

// Support both VITE_ and NEXT_PUBLIC_ prefixes for flexibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[v0] Missing Supabase environment variables')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Database types
export interface DbRates {
  id: string
  gold22k: number
  gold18k: number
  silver: number
  gold_change: 'up' | 'down'
  silver_change: 'up' | 'down'
  updated_at: string
}

export interface DbProduct {
  id: string
  title: string
  item_code: string
  category: 'rings' | 'earrings' | 'bangles' | 'necklaces' | 'pendants' | 'bracelets' | 'chains' | 'mangalsutra' | 'other'
  purity: 'gold22k' | 'gold18k' | 'silver'
  making_charge: number
  weight: number
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface DbSettings {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface DbContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
}

export interface DbInquiry {
  id: string
  product_title: string
  product_code: string
  created_at: string
}
