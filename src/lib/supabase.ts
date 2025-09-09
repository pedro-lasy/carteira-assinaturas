import { createBrowserClient } from '@supabase/ssr'

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          price: number
          billing_cycle: 'monthly' | 'yearly'
          category: string
          next_billing_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          price: number
          billing_cycle: 'monthly' | 'yearly'
          category: string
          next_billing_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          price?: number
          billing_cycle?: 'monthly' | 'yearly'
          category?: string
          next_billing_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Cliente singleton compartilhado com storageKey consistente
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storageKey: 'supabase-auth-token',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      }
    )
  }
  return supabaseClient
}

// Alias para compatibilidade
export const createSupabaseClient = getSupabaseClient