'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { Subscription } from '@/lib/types'
import { useSession } from '@/components/SessionContextProvider'

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSession()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchSubscriptions(user.id)
    } else {
      setSubscriptions([])
      setLoading(false)
    }
  }, [user])

  const fetchSubscriptions = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar assinaturas:', error)
        return
      }

      setSubscriptions(data || [])
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            ...subscription,
            user_id: user.id,
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar assinatura:', error)
        return
      }

      setSubscriptions(prev => [data, ...prev])
    } catch (error) {
      console.error('Erro ao adicionar assinatura:', error)
    }
  }

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar assinatura:', error)
        return
      }

      setSubscriptions(prev =>
        prev.map(sub => sub.id === id ? data : sub)
      )
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error)
    }
  }

  const toggleSubscription = async (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id)
    if (!subscription) return

    await updateSubscription(id, { is_active: !subscription.is_active })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    subscriptions,
    loading,
    user,
    addSubscription,
    updateSubscription,
    toggleSubscription,
    signOut,
  }
}