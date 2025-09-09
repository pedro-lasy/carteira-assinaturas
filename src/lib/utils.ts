import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryConfig, SubscriptionCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryConfigs: Record<SubscriptionCategory, CategoryConfig> = {
  streaming: {
    label: 'Streaming',
    icon: 'Play',
    color: 'from-red-500 to-pink-500'
  },
  software: {
    label: 'Software',
    icon: 'Code',
    color: 'from-blue-500 to-cyan-500'
  },
  saas: {
    label: 'SaaS',
    icon: 'Cloud',
    color: 'from-purple-500 to-indigo-500'
  },
  fitness: {
    label: 'Academia',
    icon: 'Dumbbell',
    color: 'from-green-500 to-emerald-500'
  },
  utilities: {
    label: 'Utilitários',
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-500'
  },
  gaming: {
    label: 'Gaming',
    icon: 'Gamepad2',
    color: 'from-violet-500 to-purple-500'
  },
  education: {
    label: 'Educação',
    icon: 'GraduationCap',
    color: 'from-teal-500 to-cyan-500'
  },
  other: {
    label: 'Outros',
    icon: 'Package',
    color: 'from-gray-500 to-slate-500'
  }
};

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback se Intl não estiver disponível
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  }
}

export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    // Tenta usar Intl.DateFormat primeiro
    if (typeof Intl !== 'undefined' && Intl.DateFormat) {
      return new Intl.DateFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateObj);
    }
    
    // Fallback manual se Intl não estiver disponível
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

export function getDaysUntilRenewal(billingDate: string): number {
  try {
    const today = new Date();
    const billing = new Date(billingDate);
    
    // Verifica se as datas são válidas
    if (isNaN(today.getTime()) || isNaN(billing.getTime())) {
      return 0;
    }
    
    const diffTime = billing.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Erro ao calcular dias até renovação:', error);
    return 0;
  }
}

export function getNextBillingDate(billingDate: string): string {
  try {
    const billing = new Date(billingDate);
    const today = new Date();
    
    // Verifica se as datas são válidas
    if (isNaN(billing.getTime()) || isNaN(today.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    
    if (billing < today) {
      // Se a data já passou, adiciona um mês
      billing.setMonth(billing.getMonth() + 1);
    }
    
    return billing.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erro ao calcular próxima data de cobrança:', error);
    return new Date().toISOString().split('T')[0];
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}