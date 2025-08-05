
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Edit, Trash2, Users, Euro, Calendar, 
  Clock, Target, Dumbbell, Star, Crown
} from 'lucide-react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  features: string[];
  maxClasses: number | 'unlimited';
  personalTraining: boolean;
  nutritionPlan: boolean;
  isActive: boolean;
  membersCount: number;
  popular: boolean;
}

export const MembershipPlans: React.FC = () => {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  // Mock data para planos
  const plans: MembershipPlan[] = [
    {
      id: '1',
      name: 'Básico',
      description: 'Plano ideal para iniciantes',
      price: 35,
      duration: 'monthly',
      features: ['Acesso ao ginásio', 'Aulas de grupo', 'Vestiário'],
      maxClasses: 8,
      personalTraining: false,
      nutritionPlan: false,
      isActive: true,
      membersCount: 45,
      popular: false
    },
    {
      id: '2',
      name: 'Premium',
      description: 'O mais popular entre os nossos membros',
      price: 55,
      duration: 'monthly',
      features: ['Acesso completo', 'Aulas ilimitadas', 'Nutrição básica', 'Vestiário premium'],
      maxClasses: 'unlimited',
      personalTraining: false,
      nutritionPlan: true,
      isActive: true,
      membersCount: 128,
      popular: true
    },
    {
      id: '3',
      name: 'Elite',
      description: 'Para quem quer o máximo',
      price: 89,
      duration: 'monthly',
      features: ['Tudo incluído', 'Personal training', 'Plano nutricional completo', 'Acesso 24/7'],
      maxClasses: 'unlimited',
      personalTraining: true,
      nutritionPlan: true,
      isActive: true,
      membersCount: 32,
      popular: false
    },
    {
      id: '4',
      name: 'Estudante',
      description: 'Desconto especial para estudantes',
      price: 25,
      duration: 'monthly',
      features: ['Acesso ao ginásio', 'Aulas básicas', 'Horário limitado'],
      maxClasses: 6,
      personalTraining: false,
      nutritionPlan: false,
      isActive: true,
      membersCount: 67,
      popular: false
    }
  ];

  const getDurationLabel = (duration: string) => {
    const labels = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      biannual: 'Semestral',
      annual: 'Anual'
    };
    return labels[duration as keyof typeof labels];
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'básico': return <Dumbbell className="h-6 w-6 text-blue-600" />;
      case 'premium': return <Star className="h-6 w-6 text-purple-600" />;
      case 'elite': return <Crown className="h-6 w-6 text-gold-600" />;
      case 'estudante': return <Target className="h-6 w-6 text-green-600" />;
      default: return <Dumbbell className="h-6 w-6 text-gray-600" />;
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setPlanDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Planos de Adesão</h1>
                <p className="text-muted-foreground">
                  Gestão de planos, preços e benefícios
                </p>
              </div>
              
              <Button onClick={handleNewPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </div>

            {/* Plans Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Membros</p>
                      <p className="text-2xl font-bold">{plans.reduce((sum, p) => sum + p.membersCount, 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Euro className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                      <p className="text-2xl font-bold">
                        €{plans.reduce((sum, p) => sum + (p.price * p.membersCount), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Planos Ativos</p>
                      <p className="text-2xl font-bold">{plans.filter(p => p.isActive).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Preço Médio</p>
                      <p className="text-2xl font-bold">
                        €{Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(plan.name)}
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      <Switch checked={plan.isActive} />
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center space-x-1">
                        <Euro className="h-5 w-5 text-muted-foreground" />
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{getDurationLabel(plan.duration).toLowerCase()}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Aulas</p>
                          <p className="font-semibold">
                            {plan.maxClasses === 'unlimited' ? 'Ilimitadas' : `${plan.maxClasses}/mês`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Membros</p>
                          <p className="font-semibold">{plan.membersCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dialog for Plan Creation/Edit */}
            <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPlan ? 'Editar Plano' : 'Novo Plano'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input id="name" defaultValue={selectedPlan?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (€)</Label>
                    <Input id="price" type="number" defaultValue={selectedPlan?.price} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <select 
                      id="duration" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      defaultValue={selectedPlan?.duration}
                    >
                      <option value="monthly">Mensal</option>
                      <option value="quarterly">Trimestral</option>
                      <option value="biannual">Semestral</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxClasses">Máximo de Aulas</Label>
                    <Input id="maxClasses" placeholder="Digite número ou 'unlimited'" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" defaultValue={selectedPlan?.description} />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <Label>Benefícios Incluídos</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={selectedPlan?.personalTraining} />
                        <Label>Personal Training</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={selectedPlan?.nutritionPlan} />
                        <Label>Plano Nutricional</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setPlanDialogOpen(false)}>
                    {selectedPlan ? 'Atualizar' : 'Criar'} Plano
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};
