export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingDate: string;
  category: SubscriptionCategory;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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