'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription, SubscriptionCategory } from '@/lib/types';
import { formatCurrency, categoryConfigs } from '@/lib/utils';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { SubscriptionForm } from '@/components/SubscriptionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  Filter,
  Settings,
  CreditCard,
  Calendar,
  AlertTriangle,
  X,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export default function Home() {
  const {
    subscriptions,
    allSubscriptions,
    settings,
    selectedCategory,
    totalMonthly,
    upcomingRenewals,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    setSettings,
    setSelectedCategory
  } = useSubscriptions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();

  const handleAddNew = () => {
    setFormMode('create');
    setSelectedSubscription(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    setFormMode('edit');
    setSelectedSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta assinatura?')) {
      deleteSubscription(id);
    }
  };

  const categories = Object.keys(categoryConfigs) as SubscriptionCategory[];

  // Dados para gráficos
  const categoryData = categories.map(category => {
    const categorySubscriptions = allSubscriptions.filter(s => s.category === category && s.isActive);
    const total = categorySubscriptions.reduce((sum, s) => sum + s.price, 0);
    return {
      name: categoryConfigs[category].label,
      value: total,
      count: categorySubscriptions.length,
      color: categoryConfigs[category].color
    };
  }).filter(item => item.value > 0);

  const monthlyTrendData = [
    { month: 'Jul', value: totalMonthly * 0.7 },
    { month: 'Ago', value: totalMonthly * 0.8 },
    { month: 'Set', value: totalMonthly * 0.9 },
    { month: 'Out', value: totalMonthly * 0.95 },
    { month: 'Nov', value: totalMonthly * 0.98 },
    { month: 'Dez', value: totalMonthly }
  ];

  const subscriptionsByPrice = allSubscriptions
    .filter(s => s.isActive)
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(s => ({
      name: s.name,
      value: s.price,
      logo: s.logo
    }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label}</p>
          <p className="text-blue-400">
            {`Valor: ${formatCurrency(payload[0].value, settings.currency)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Carteira de Assinaturas</h1>
                <p className="text-sm text-gray-400">Gerencie seus gastos mensais</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Assinatura
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Assinaturas
            </TabsTrigger>
          </TabsList>

          {/* Aba Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total mensal */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Gasto Total Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatCurrency(totalMonthly, settings.currency)}
                  </div>
                  <p className="text-sm text-gray-400">
                    {allSubscriptions.filter(s => s.isActive).length} assinaturas ativas
                  </p>
                </CardContent>
              </Card>

              {/* Próximas renovações */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10 hover:border-orange-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Renovações Próximas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {upcomingRenewals.length}
                  </div>
                  <p className="text-sm text-gray-400">
                    Próximos 7 dias
                  </p>
                </CardContent>
              </Card>

              {/* Média por categoria */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10 hover:border-green-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Média por Assinatura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatCurrency(
                      allSubscriptions.filter(s => s.isActive).length > 0 
                        ? totalMonthly / allSubscriptions.filter(s => s.isActive).length 
                        : 0, 
                      settings.currency
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Por serviço
                  </p>
                </CardContent>
              </Card>

              {/* Categorias ativas */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Categorias Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {categoryData.length}
                  </div>
                  <p className="text-sm text-gray-400">
                    De {categories.length} disponíveis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertas de renovação */}
            {upcomingRenewals.length > 0 && (
              <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Renovações Próximas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingRenewals.map(({ subscription, daysUntilRenewal }) => (
                      <div key={subscription.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{subscription.logo || '📦'}</div>
                          <div>
                            <p className="font-medium text-white">{subscription.name}</p>
                            <p className="text-sm text-gray-400">
                              {formatCurrency(subscription.price, settings.currency)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                          {daysUntilRenewal === 0 ? 'Hoje' : `${daysUntilRenewal} dias`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza - Gastos por Categoria */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Gastos por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${formatCurrency(value, settings.currency)}`}
                            labelLine={false}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [formatCurrency(value, settings.currency), 'Valor']}
                            contentStyle={{
                              backgroundColor: '#1A1A1A',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum dado disponível</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Top 5 Assinaturas */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top 5 Assinaturas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptionsByPrice.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subscriptionsByPrice} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#9CA3AF"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickFormatter={(value) => formatCurrency(value, settings.currency)}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="value" 
                            fill="url(#colorGradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum dado disponível</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Linha - Tendência Mensal */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendência de Gastos (6 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis 
                          stroke="#9CA3AF" 
                          fontSize={12}
                          tickFormatter={(value) => formatCurrency(value, settings.currency)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <defs>
                          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#colorArea)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Categorias com Detalhes */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Detalhes por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {categoryData.length > 0 ? (
                      categoryData.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                              <p className="font-medium text-white">{category.name}</p>
                              <p className="text-sm text-gray-400">{category.count} assinatura{category.count !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">
                              {formatCurrency(category.value, settings.currency)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {((category.value / totalMonthly) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma categoria com gastos</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Assinaturas */}
          <TabsContent value="subscriptions" className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filtrar por:</span>
              </div>
              <Select 
                value={selectedCategory} 
                onValueChange={(value: SubscriptionCategory | 'all') => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    Todas as categorias
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-white hover:bg-white/10"
                    >
                      {categoryConfigs[category].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de assinaturas */}
            {subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    currency={settings.currency}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {selectedCategory === 'all' ? 'Nenhuma assinatura encontrada' : 'Nenhuma assinatura nesta categoria'}
                  </h3>
                  <p className="text-gray-400 text-center mb-6">
                    {selectedCategory === 'all' 
                      ? 'Comece adicionando sua primeira assinatura para controlar seus gastos mensais.'
                      : 'Não há assinaturas na categoria selecionada. Tente outra categoria ou adicione uma nova assinatura.'
                    }
                  </p>
                  <Button
                    onClick={handleAddNew}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Assinatura
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Formulário de assinatura */}
      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={addSubscription}
        onUpdate={updateSubscription}
        subscription={selectedSubscription}
        mode={formMode}
      />

      {/* Modal de detalhes */}
      {selectedSubscription && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  Detalhes da Assinatura
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailsOpen(false)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header com logo */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-3xl border border-white/10">
                  {selectedSubscription.logo || '📦'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedSubscription.name}
                  </h3>
                  <p className="text-gray-400">
                    {categoryConfigs[selectedSubscription.category].label}
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor mensal:</span>
                  <span className="text-xl font-semibold text-white">
                    {formatCurrency(selectedSubscription.price, settings.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Próxima cobrança:</span>
                  <span className="text-white">
                    {new Date(selectedSubscription.billingDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <Badge 
                    variant={selectedSubscription.isActive ? "default" : "secondary"}
                    className={selectedSubscription.isActive 
                      ? "bg-green-500/10 text-green-400 border-green-500/20" 
                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }
                  >
                    {selectedSubscription.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>

                {selectedSubscription.description && (
                  <div>
                    <span className="text-gray-400 block mb-2">Descrição:</span>
                    <p className="text-white text-sm bg-white/5 p-3 rounded-lg">
                      {selectedSubscription.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleEdit(selectedSubscription);
                  }}
                  className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleDelete(selectedSubscription.id);
                  }}
                  className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de configurações */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Configurações
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(false)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Moeda
              </label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  <SelectItem value="BRL" className="text-white hover:bg-white/10">
                    Real (R$)
                  </SelectItem>
                  <SelectItem value="USD" className="text-white hover:bg-white/10">
                    Dólar ($)
                  </SelectItem>
                  <SelectItem value="EUR" className="text-white hover:bg-white/10">
                    Euro (€)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Notificações
                </label>
                <p className="text-xs text-gray-500">
                  Alertas de renovação
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={`border-white/10 ${
                  settings.notifications 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {settings.notifications ? 'Ativado' : 'Desativado'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Tema Escuro
                </label>
                <p className="text-xs text-gray-500">
                  Sempre ativado
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-white/10 bg-blue-500/20 text-blue-400 border-blue-500/20"
              >
                Ativado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}