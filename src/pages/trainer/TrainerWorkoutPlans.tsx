
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
  Dumbbell,
  Users,
  Clock,
  Target,
  Edit,
  Copy,
  Trash2,
  Eye
} from 'lucide-react';

export const TrainerWorkoutPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will come from API/Supabase
  const workoutPlans = [
    {
      id: 1,
      name: 'Força & Condicionamento',
      description: 'Plano focado no desenvolvimento de força e condicionamento cardiovascular',
      duration: '12 semanas',
      frequency: '4x por semana',
      difficulty: 'Intermédio',
      assignedStudents: 8,
      exercises: 25,
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      category: 'Força',
      tags: ['Força', 'Condicionamento', 'Funcional']
    },
    {
      id: 2,
      name: 'Hipertrofia Avançada',
      description: 'Programa intensivo para ganho de massa muscular',
      duration: '16 semanas',
      frequency: '5x por semana',
      difficulty: 'Avançado',
      assignedStudents: 5,
      exercises: 35,
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-12',
      category: 'Hipertrofia',
      tags: ['Hipertrofia', 'Massa Muscular', 'Avançado']
    },
    {
      id: 3,
      name: 'Funcional Iniciante',
      description: 'Introdução ao treino funcional para iniciantes',
      duration: '8 semanas',
      frequency: '3x por semana',
      difficulty: 'Iniciante',
      assignedStudents: 12,
      exercises: 15,
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-14',
      category: 'Funcional',
      tags: ['Funcional', 'Iniciante', 'Mobilidade']
    }
  ];

  const filteredPlans = workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-700';
      case 'Intermédio': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
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
                  Planos de Treino
                </h1>
                <p className="text-muted-foreground">
                  Criar e gerir planos de treino personalizados
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
                    <Dumbbell className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Planos</p>
                      <p className="text-2xl font-bold">{workoutPlans.length}</p>
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
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foregor">Exercícios Únicos</p>
                      <p className="text-2xl font-bold">75</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Duração Média</p>
                      <p className="text-2xl font-bold">12 sem</p>
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
                    placeholder="Pesquisar planos de treino..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Workout Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge className={`mt-2 ${getDifficultyColor(plan.difficulty)}`}>
                          {plan.difficulty}
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
                        <p className="text-muted-foreground">Duração</p>
                        <p className="font-medium">{plan.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequência</p>
                        <p className="font-medium">{plan.frequency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Alunos</p>
                        <p className="font-medium">{plan.assignedStudents}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exercícios</p>
                        <p className="font-medium">{plan.exercises}</p>
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
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não foram encontrados planos de treino com os critérios de pesquisa.
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
