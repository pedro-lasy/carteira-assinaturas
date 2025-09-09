'use client';

import { useState, useEffect } from 'react';
import { Subscription, SubscriptionCategory, UserSettings, AlertSubscription } from '@/lib/types';
import { mockSubscriptions } from '@/lib/constants';
import { getDaysUntilRenewal, generateId, getNextBillingDate } from '@/lib/utils';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'BRL',
    notifications: true,
    darkMode: true
  });
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | 'all'>('all');

  useEffect(() => {
    // Simular carregamento dos dados
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    } else {
      setSubscriptions(mockSubscriptions);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addSubscription = (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      billingDate: getNextBillingDate(subscription.billingDate)
    };
    
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const filteredSubscriptions = selectedCategory === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.category === selectedCategory);

  const totalMonthly = subscriptions
    .filter(sub => sub.isActive)
    .reduce((total, sub) => total + sub.price, 0);

  const upcomingRenewals: AlertSubscription[] = subscriptions
    .filter(sub => sub.isActive)
    .map(sub => ({
      subscription: sub,
      daysUntilRenewal: getDaysUntilRenewal(sub.billingDate)
    }))
    .filter(alert => alert.daysUntilRenewal <= 7 && alert.daysUntilRenewal >= 0)
    .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

  return {
    subscriptions: filteredSubscriptions,
    allSubscriptions: subscriptions,
    settings,
    selectedCategory,
    totalMonthly,
    upcomingRenewals,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    setSettings,
    setSelectedCategory
  };
}