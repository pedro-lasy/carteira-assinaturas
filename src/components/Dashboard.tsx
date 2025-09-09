'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  PieChart,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react'
import type { Subscription } from '@/lib/types'

interface DashboardProps {
  subscriptions: Subscription[]
}

export function Dashboard({ subscriptions }: DashboardProps) {
  const stats = useMemo(() => {
    const active = subscriptions.filter(sub => sub.is_active)
    const inactive = subscriptions.filter(sub => !sub.is_active)
    
    const monthlyTotal = active.reduce((total, sub) => {
      return total + (sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12)
    }, 0)
    
    const yearlyTotal = active.reduce((total, sub) => {
      return total + (sub.billing_cycle === 'yearly' ? sub.price : sub.price * 12)
    }, 0)
    
    // Categorias
    const categoryStats = active.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + (sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12)
      return acc
    }, {} as Record<string, number>)
    
    const sortedCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    // Próximas cobranças (próximos 30 dias)
    const today = new Date()
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    const upcomingBills = active.filter(sub => {
      const billDate = new Date(sub.next_billing_date)
      return billDate >= today && billDate <= next30Days
    }).sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
    
    const upcomingTotal = upcomingBills.reduce((total, sub) => total + sub.price, 0)
    
    // Média por categoria
    const avgByCategory = Object.entries(categoryStats).map(([category, total]) => ({
      category,
      total,
      count: active.filter(sub => sub.category === category).length,
      avg: total / active.filter(sub => sub.category === category).length
    }))
    
    return {
      active: active.length,
      inactive: inactive.length,
      total: subscriptions.length,
      monthlyTotal,
      yearlyTotal,
      categoryStats: sortedCategories,
      upcomingBills,
      upcomingTotal,
      avgByCategory
    }
  }, [subscriptions])

  const categoryLabels: Record<string, string> = {
    streaming: 'Streaming',
    software: 'Software',
    saas: 'SaaS',
    fitness: 'Academia',
    utilities: 'Utilitários',
    gaming: 'Gaming',
    education: 'Educação',
    other: 'Outros'
  }

  const categoryColors: Record<string, string> = {
    streaming: 'bg-red-500',
    software: 'bg-blue-500',
    saas: 'bg-green-500',
    fitness: 'bg-orange-500',
    utilities: 'bg-purple-500',
    gaming: 'bg-pink-500',
    education: 'bg-indigo-500',
    other: 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Gasto Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              R$ {stats.monthlyTotal.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              R$ {stats.yearlyTotal.toFixed(2)} por ano
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Assinaturas Ativas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.active}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {stats.inactive} inativas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Próximas Cobranças
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.upcomingBills.length}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              R$ {stats.upcomingTotal.toFixed(2)} em 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Ticket Médio
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              R$ {stats.active > 0 ? (stats.monthlyTotal / stats.active).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              por assinatura/mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por Categoria */}
        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.categoryStats.length > 0 ? (
              stats.categoryStats.map(([category, amount]) => {
                const percentage = (amount / stats.monthlyTotal) * 100
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`} />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {categoryLabels[category] || category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                          R$ {amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </div>
                )
              })
            ) : (
              <p className="text-blue-600 dark:text-blue-400 text-center py-4">
                Nenhuma assinatura ativa encontrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Próximas Cobranças */}
        <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Próximas Cobranças (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingBills.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingBills.slice(0, 5).map((subscription) => {
                  const daysUntil = Math.ceil(
                    (new Date(subscription.next_billing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <div key={subscription.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-800/50">
                      <div className="flex-1">
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          {subscription.name}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-900 dark:text-blue-100">
                          R$ {subscription.price.toFixed(2)}
                        </div>
                        <Badge 
                          variant={daysUntil <= 7 ? "destructive" : daysUntil <= 15 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
                
                {stats.upcomingBills.length > 5 && (
                  <div className="text-center text-sm text-blue-600 dark:text-blue-400 pt-2">
                    +{stats.upcomingBills.length - 5} outras cobranças
                  </div>
                )}
              </div>
            ) : (
              <p className="text-blue-600 dark:text-blue-400 text-center py-4">
                Nenhuma cobrança nos próximos 30 dias
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Análise Detalhada por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.avgByCategory.map(({ category, total, count, avg }) => (
              <div key={category} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`} />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    {categoryLabels[category] || category}
                  </h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Total:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-100">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Assinaturas:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-100">{count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Média:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-100">R$ {avg.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}