import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trophy, Calendar, Target, Users } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';

export const Workouts: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const { workoutPlans, isLoading } = useWorkoutPlans(currentCompany?.id || '');

  const filteredPlans = workoutPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Planos de Treino</h1>
                <p className="text-muted-foreground">Gerencie os treinos dos seus alunos</p>
              </div>
              <Button style={{ backgroundColor: '#aeca12' }} className="text-white">
                <Plus className="mr-2 h-4 w-4" />
                Novo Plano
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(174, 202, 18, 0.1)' }}>
                    <Trophy className="h-6 w-6" style={{ color: '#aeca12' }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Planos</p>
                    <p className="text-2xl font-bold">{workoutPlans.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                    <p className="text-2xl font-bold">
                      {workoutPlans.filter(p => p.athlete_id).length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Planos Ativos</p>
                    <p className="text-2xl font-bold">
                      {workoutPlans.filter(p => p.is_active).length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Esta Semana</p>
                    <p className="text-2xl font-bold">
                      {workoutPlans.filter(p => p.frequency_per_week).reduce((a, b) => a + (b.frequency_per_week || 0), 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar planos de treino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum plano de treino encontrado</p>
                  <Button className="mt-4" style={{ backgroundColor: '#aeca12' }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Plano
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          {plan.difficulty && (
                            <Badge className={getDifficultyColor(plan.difficulty)}>
                              {plan.difficulty}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.description || 'Sem descrição'}
                        </p>

                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {plan.duration_weeks && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {plan.duration_weeks} sem
                            </div>
                          )}
                          {plan.frequency_per_week && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {plan.frequency_per_week}x/sem
                            </div>
                          )}
                        </div>

                        <Button variant="outline" className="w-full">
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Workouts;