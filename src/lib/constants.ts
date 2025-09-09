import { Subscription } from "./types";

// Mock data para demonstração
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    price: 45.90,
    billingDate: '2024-12-15',
    category: 'streaming',
    logo: '🎬',
    description: 'Streaming de filmes e séries',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Spotify Premium',
    price: 21.90,
    billingDate: '2024-12-10',
    category: 'streaming',
    logo: '🎵',
    description: 'Música sem anúncios',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    price: 89.90,
    billingDate: '2024-12-20',
    category: 'software',
    logo: '🎨',
    description: 'Suite de design profissional',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'GitHub Pro',
    price: 24.90,
    billingDate: '2024-12-08',
    category: 'saas',
    logo: '💻',
    description: 'Repositórios privados ilimitados',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Smart Fit',
    price: 79.90,
    billingDate: '2024-12-25',
    category: 'fitness',
    logo: '💪',
    description: 'Academia com acesso nacional',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const currencies = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];