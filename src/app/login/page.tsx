'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { getSupabaseClient } from '@/lib/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/SessionContextProvider'

export default function LoginPage() {
  const { user, loading } = useSession()
  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    // Se já está logado, redireciona para home
    if (!loading && user) {
      console.log('LoginPage: Usuário já logado, redirecionando para home...')
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Listener específico para capturar o evento de login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('LoginPage - Auth event:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Login realizado com sucesso! Redirecionando...')
          // Usar router.replace para redirecionamento suave
          router.replace('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  // Mostra loading enquanto verifica se já está logado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se já está logado, não mostra o formulário
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-300">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-blue-900 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Bem-vindo
            </h1>
            <p className="text-blue-600 dark:text-blue-300">
              Entre na sua conta ou crie uma nova
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#f8fafc',
                    defaultButtonBackgroundHover: '#f1f5f9',
                    inputBackground: 'white',
                    inputBorder: '#e2e8f0',
                    inputBorderHover: '#cbd5e1',
                    inputBorderFocus: '#2563eb',
                  },
                  space: {
                    buttonPadding: '12px 16px',
                    inputPadding: '12px 16px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'transition-all duration-200 hover:shadow-md',
                input: 'transition-all duration-200',
                label: 'text-blue-900 dark:text-blue-100 font-medium',
                message: 'text-sm',
              },
            }}
            providers={[]}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/` : '/'}
            onlyThirdPartyProviders={false}
            magicLink={false}
            view="sign_in"
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  link_text: 'Já tem uma conta? Entre aqui',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  link_text: 'Não tem uma conta? Crie aqui',
                },
                forgotten_password: {
                  email_label: 'Email',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu email para redefinir a senha',
                },
              },
            }}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Ao continuar, você concorda com nossos termos de uso
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}