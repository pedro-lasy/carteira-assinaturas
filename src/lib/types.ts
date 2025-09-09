export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  category: string;
  next_billing_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionCategory = 
  | 'streaming'
  | 'software'
  | 'saas'
  | 'fitness'
  | 'utilities'
  | 'gaming'
  | 'education'
  | 'other';

export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
}

export interface AlertSubscription {
  subscription: Subscription;
  daysUntilRenewal: number;
}

export interface UserSettings {
  currency: string;
  notifications: boolean;
  darkMode: boolean;
}