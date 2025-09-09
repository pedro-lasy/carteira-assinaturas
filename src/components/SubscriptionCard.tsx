'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, Trash2, Edit, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Subscription } from '@/lib/types'

interface SubscriptionCardProps {
  subscription: Subscription
  onRemove: (id: string) => Promise<boolean>
}

export function SubscriptionCard({ subscription, onRemove }: SubscriptionCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await onRemove(subscription.id)
    setIsRemoving(false)
  }

  const getBillingCycleText = (cycle: string) => {
    return cycle === 'monthly' ? 'Mensal' : 'Anual'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Entretenimento': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Produtividade': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Música': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Design': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Desenvolvimento': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Educação': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Saúde': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Outros': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[category] || colors['Outros']
  }

  const isUpcoming = (date: string) => {
    const billingDate = new Date(date)
    const today = new Date()
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-lg font-semibold">
            {subscription.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getCategoryColor(subscription.category)}
            >
              {subscription.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign className="w-4 h-4" />
            <span className="text-2xl font-bold text-white">
              {formatCurrency(subscription.price)}
            </span>
            <span className="text-sm text-gray-400">
              / {getBillingCycleText(subscription.billingCycle)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Próxima cobrança: {formatDate(subscription.nextBillingDate)}
          </span>
          {isUpcoming(subscription.nextBillingDate) && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
              Em breve
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}