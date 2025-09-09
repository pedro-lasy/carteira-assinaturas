'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Subscription } from '@/lib/types'

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
}

export function SubscriptionForm({ onSubmit, onClose }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billing_cycle: 'monthly' as 'monthly' | 'yearly',
    category: 'streaming',
    next_billing_date: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.next_billing_date) {
      return
    }

    setIsLoading(true)
    
    try {
      const subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        price: parseFloat(formData.price),
        billing_cycle: formData.billing_cycle,
        category: formData.category,
        next_billing_date: formData.next_billing_date,
        is_active: true
      }

      await onSubmit(subscription)
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        billing_cycle: 'monthly',
        category: 'streaming',
        next_billing_date: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar assinatura:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'streaming', label: 'Streaming' },
    { value: 'software', label: 'Software' },
    { value: 'saas', label: 'SaaS' },
    { value: 'fitness', label: 'Academia' },
    { value: 'utilities', label: 'Utilitários' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'education', label: 'Educação' },
    { value: 'other', label: 'Outros' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white dark:bg-blue-900 border border-blue-100 dark:border-blue-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Nova Assinatura
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700 dark:text-blue-300">Nome do Serviço</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Netflix, Spotify..."
                  className="border-blue-200 dark:border-blue-700 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="text-blue-700 dark:text-blue-300">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0,00"
                  className="border-blue-200 dark:border-blue-700 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-700 dark:text-blue-300">Ciclo de Cobrança</Label>
                <Select 
                  value={formData.billing_cycle} 
                  onValueChange={(value: 'monthly' | 'yearly') => 
                    setFormData(prev => ({ ...prev, billing_cycle: value }))
                  }
                >
                  <SelectTrigger className="border-blue-200 dark:border-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-700 dark:text-blue-300">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="border-blue-200 dark:border-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_billing_date" className="text-blue-700 dark:text-blue-300">Próxima Cobrança</Label>
                <Input
                  id="next_billing_date"
                  type="date"
                  value={formData.next_billing_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_billing_date: e.target.value }))}
                  className="border-blue-200 dark:border-blue-700 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Assinatura
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}