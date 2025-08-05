
import React, { useState } from 'react';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  BookOpen,
  Users,
  Target,
  Apple,
  Edit,
  Copy,
  Eye,
  Utensils
} from 'lucide-react';

export const TrainerNutritionPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will come from API/Supabase
  const nutritionPlans = [
    {
      id: 1,
      name: 'Plano Perda de Peso',
      description: 'Dieta equilibrada para perda de peso saudável',
      goal: 'Perda de Peso',
      calories: 1800,
      duration: '12 semanas',
      assignedStudents: 8,
      meals: 6,
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      macros: { protein: 30, carbs: 40, fats: 30 },
      tags: ['Perda de Peso', 'Baixa Caloria', 'Equilibrado']
    },
    {
      id: 2,
      name: 'Ganho de Massa Muscular',
      description: 'Plano hipercalórico para ganho de massa magra',
      goal: 'Ganho de Massa',
      calories: 2800,
      duration: '16 semanas',
      assignedStudents: 5,
      meals: 7,
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-12',
      macros: { protein: 35, carbs: 45, fats: 20 },
      tags: ['Ganho de Massa', 'Hipercalórico', 'Alto Proteína']
    },
    {
      id: 3,
      name: 'Manutenção Atlético',
      description: 'Dieta para manutenção e performance atlética',
      goal: 'Manutenção',
      calories: 2400,
      duration: '8 semanas',
      assignedStudents: 12,
      meals: 5,
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-14',
      macros: { protein: 25, carbs: 50, fats: 25 },
      tags: ['Manutenção', 'Performance', 'Atlético']
    }
  ];

  const filteredPlans = nutritionPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'Perda de Peso': return 'bg-red-100 text-red-700';
      case 'Ganho de Massa': return 'bg-green-100 text-green-700';
      case 'Manutenção': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Planos Nutricionais
                </h1>
                <p className="text-muted-foreground">
                  Criar e gerir planos nutricionais personalizados
                </p>
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Plano
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Planos</p>
                      <p className="text-2xl font-bold">{nutritionPlans.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Alunos Atribuídos</p>
                      <p className="text-2xl font-bold">25</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Apple className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Receitas</p>
                      <p className="text-2xl font-bold">124</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Metas Ativas</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Pesquisar planos nutricionais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge className={`mt-2 ${getGoalColor(plan.goal)}`}>
                          {plan.goal}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Calorias/dia</p>
                        <p className="font-medium">{plan.calories} kcal</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Refeições</p>
                        <p className="font-medium">{plan.meals}/dia</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Alunos</p>
                        <p className="font-medium">{plan.assignedStudents}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duração</p>
                        <p className="font-medium">{plan.duration}</p>
                      </div>
                    </div>

                    {/* Macros */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Macronutrientes</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Proteína</span>
                          <span>{plan.macros.protein}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${plan.macros.protein}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span>Carboidratos</span>
                          <span>{plan.macros.carbs}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${plan.macros.carbs}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span>Gorduras</span>
                          <span>{plan.macros.fats}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${plan.macros.fats}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Criado: {new Date(plan.createdDate).toLocaleDateString()}</span>
                        <span>Atualizado: {new Date(plan.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Editar Plano
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Atribuir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não foram encontrados planos nutricionais com os critérios de pesquisa.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Plano
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
