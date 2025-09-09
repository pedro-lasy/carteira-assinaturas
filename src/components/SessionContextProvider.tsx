'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase'

interface SessionContextType {
  session: Session | null
  user: User | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true
})

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionContextProvider')
  }
  return context
}

interface SessionContextProviderProps {
  children: React.ReactNode
}

export function SessionContextProvider({ children }: SessionContextProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erro ao obter sessão:', error)
        }
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SessionContext - Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  )
}