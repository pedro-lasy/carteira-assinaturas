'use client';

import { useState, useEffect } from 'react';
import { Subscription, SubscriptionCategory } from '@/lib/types';
import { categoryConfigs } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Save } from 'lucide-react';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Subscription>) => void;
  subscription?: Subscription;
  mode: 'create' | 'edit';
}

export function SubscriptionForm({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  subscription, 
  mode 
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingDate: '',
    category: 'other' as SubscriptionCategory,
    logo: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (mode === 'edit' && subscription) {
      setFormData({
        name: subscription.name,
        price: subscription.price.toString(),
        billingDate: subscription.billingDate,
        category: subscription.category,
        logo: subscription.logo || '',
        description: subscription.description || '',
        isActive: subscription.isActive
      });
    } else {
      setFormData({
        name: '',
        price: '',
        billingDate: '',
        category: 'other',
        logo: '',
        description: '',
        isActive: true
      });
    }
  }, [mode, subscription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.billingDate) {
      return;
    }

    const subscriptionData = {
      name: formData.name,
      price: parseFloat(formData.price),
      billingDate: formData.billingDate,
      category: formData.category,
      logo: formData.logo,
      description: formData.description,
      isActive: formData.isActive
    };

    if (mode === 'edit' && subscription && onUpdate) {
      onUpdate(subscription.id, subscriptionData);
    } else {
      onSave(subscriptionData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {mode === 'edit' ? 'Editar Assinatura' : 'Nova Assinatura'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do serviço */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Nome do Serviço
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Netflix, Spotify..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              required
            />
          </div>

          {/* Preço e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                Valor Mensal
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0,00"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingDate" className="text-sm font-medium text-gray-300">
                Data de Cobrança
              </Label>
              <Input
                id="billingDate"
                type="date"
                value={formData.billingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, billingDate: e.target.value }))}
                className="bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                required
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">
              Categoria
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: SubscriptionCategory) => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10">
                {Object.entries(categoryConfigs).map(([key, config]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="text-white hover:bg-white/10"
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logo (emoji) */}
          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium text-gray-300">
              Ícone (Emoji)
            </Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
              placeholder="📺 🎵 💻 ..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              maxLength={2}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-300">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Breve descrição do serviço..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 resize-none"
              rows={3}
            />
          </div>

          {/* Status ativo */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="text-sm font-medium text-gray-300">
              Assinatura Ativa
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {mode === 'edit' ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}