'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/SessionContextProvider'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Só redireciona após o loading terminar e confirmar que não há usuário
    if (!loading && !user) {
      console.log('AuthGuard: Usuário não autenticado, redirecionando para login...')
      router.replace('/login')
    }
  }, [user, loading, router])

  // Mostra loading enquanto verifica a sessão
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se não há usuário após o loading, mostra tela de redirecionamento
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-300">Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  // Usuário autenticado, renderiza o conteúdo
  return <>{children}</>
}