'use client'

import { useState } from 'react'
import { Plus, LogOut, User, BarChart3, Grid3X3 } from 'lucide-react'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { SubscriptionForm } from '@/components/SubscriptionForm'
import { Dashboard } from '@/components/Dashboard'
import { AuthGuard } from '@/components/AuthGuard'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const { subscriptions, loading, user, addSubscription, updateSubscription, toggleSubscription, signOut } = useSubscriptions()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.is_active)
  const inactiveSubscriptions = subscriptions.filter(sub => !sub.is_active)

  const totalMonthly = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12)
  }, 0)

  const totalYearly = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billing_cycle === 'yearly' ? sub.price : sub.price * 12)
  }, 0)

  const handleSignOut = async () => {
    console.log('Fazendo logout...')
    await signOut()
    window.location.href = '/login'
  }

  const handleAddSubscription = async (subscription: any) => {
    await addSubscription(subscription)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Gerenciador de Assinaturas
            </h1>
            <p className="text-blue-600 dark:text-blue-300">
              Dashboard completo para controle financeiro das suas assinaturas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Assinatura
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-blue-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Total Mensal</h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              R$ {totalMonthly.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-blue-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Total Anual</h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              R$ {totalYearly.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-blue-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Assinaturas Ativas</h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {activeSubscriptions.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Assinaturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard subscriptions={subscriptions} />
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            {/* Active Subscriptions */}
            {activeSubscriptions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Assinaturas Ativas ({activeSubscriptions.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSubscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onUpdate={updateSubscription}
                      onToggle={toggleSubscription}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Subscriptions */}
            {inactiveSubscriptions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Assinaturas Inativas ({inactiveSubscriptions.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inactiveSubscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onUpdate={updateSubscription}
                      onToggle={toggleSubscription}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {subscriptions.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-blue-900 rounded-xl p-8 shadow-lg border border-blue-100 dark:border-blue-800 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Nenhuma assinatura encontrada
                  </h3>
                  <p className="text-blue-600 dark:text-blue-300 mb-4">
                    Comece adicionando sua primeira assinatura para ver o dashboard completo
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Assinatura
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Subscription Form Modal */}
        {showForm && (
          <SubscriptionForm
            onSubmit={handleAddSubscription}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  )
}