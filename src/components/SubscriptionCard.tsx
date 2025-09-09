'use client';

import { Subscription } from '@/lib/types';
import { formatCurrency, formatDate, getDaysUntilRenewal, categoryConfigs } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SubscriptionCardProps {
  subscription: Subscription;
  currency: string;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onViewDetails: (subscription: Subscription) => void;
}

export function SubscriptionCard({ 
  subscription, 
  currency, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: SubscriptionCardProps) {
  const daysUntilRenewal = getDaysUntilRenewal(subscription.billingDate);
  const categoryConfig = categoryConfigs[subscription.category];
  const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
      onClick={() => onViewDetails(subscription)}
    >
      <CardContent className="p-6">
        {/* Header com logo e menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-2xl border border-white/10">
              {subscription.logo || '📦'}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg leading-tight">
                {subscription.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {categoryConfig.label}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(subscription);
                }}
                className="text-white hover:bg-white/10"
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(subscription.id);
                }}
                className="text-red-400 hover:bg-red-500/10"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Preço */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {formatCurrency(subscription.price, currency)}
            </span>
          </div>
          <p className="text-gray-400 text-sm">por mês</p>
        </div>

        {/* Data de renovação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-gray-300 text-sm">
              {formatDate(subscription.billingDate)}
            </span>
          </div>
          
          {isUpcoming && (
            <Badge 
              variant="outline" 
              className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs"
            >
              {daysUntilRenewal === 0 ? 'Hoje' : `${daysUntilRenewal}d`}
            </Badge>
          )}
        </div>

        {/* Gradiente de destaque para renovações próximas */}
        {isUpcoming && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
}