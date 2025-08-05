
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Trophy,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const GoalsManagement: React.FC = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Mock data - em produção virá da API/Supabase
  const goals = [
    {
      id: 1,
      title: 'Frequentar 15 aulas este mês',
      description: 'Manter constância no treino',
      target: 15,
      current: 12,
      deadline: '2024-01-31',
      status: 'in_progress',
      category: 'frequency'
    },
    {
      id: 2,
      title: 'Experimentar 3 modalidades diferentes',
      description: 'Diversificar os treinos',
      target: 3,
      current: 2,
      deadline: '2024-02-15',
      status: 'in_progress',
      category: 'variety'
    },
    {
      id: 3,
      title: 'Alcançar 500 pontos',
      description: 'Sistema de gamificação',
      target: 500,
      current: 350,
      deadline: '2024-02-29',
      status: 'in_progress',
      category: 'points'
    },
    {
      id: 4,
      title: 'Completar desafio de Janeiro',
      description: '20 aulas em 31 dias',
      target: 20,
      current: 20,
      deadline: '2024-01-31',
      status: 'completed',
      category: 'challenge'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
      case 'paused':
        return <Badge className="bg-orange-100 text-orange-800">Pausado</Badge>;
      case 'failed':
        return <Badge variant="destructive">Não Atingido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frequency': return <Calendar className="h-4 w-4" />;
      case 'variety': return <Target className="h-4 w-4" />;
      case 'points': return <TrendingUp className="h-4 w-4" />;
      case 'challenge': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleAddGoal = () => {
    setShowAddGoal(true);
  };

  const handleDeleteGoal = (goalId: number) => {
    console.log('Deleting goal:', goalId);
    // Implementar lógica de remoção
  };

  const handleEditGoal = (goalId: number) => {
    console.log('Editing goal:', goalId);
    // Implementar lógica de edição
  };

  if (showAddGoal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Novo Objetivo
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goalTitle">Título do Objetivo</Label>
            <Input
              id="goalTitle"
              placeholder="Ex: Frequentar 20 aulas este mês"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalDescription">Descrição</Label>
            <Input
              id="goalDescription"
              placeholder="Descreva brevemente seu objetivo"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalTarget">Meta</Label>
              <Input
                id="goalTarget"
                type="number"
                placeholder="20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goalDeadline">Data Limite</Label>
              <Input
                id="goalDeadline"
                type="date"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalCategory">Categoria</Label>
            <select
              id="goalCategory"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="frequency">Frequência</option>
              <option value="variety">Variedade</option>
              <option value="points">Pontuação</option>
              <option value="challenge">Desafio</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddGoal(false)} variant="outline">
              Cancelar
            </Button>
            <Button>
              Criar Objetivo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'in_progress');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-6">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{activeGoals.length}</p>
            <p className="text-sm text-muted-foreground">Objetivos Ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{completedGoals.length}</p>
            <p className="text-sm text-muted-foreground">Conquistas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">
              {Math.round((completedGoals.length / goals.length) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6 cursor-pointer hover:bg-accent/50" onClick={handleAddGoal}>
            <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Novo Objetivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Objetivos Ativos ({activeGoals.length})
            </CardTitle>
            <Button onClick={handleAddGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const isOverdue = new Date(goal.deadline) < new Date();
            
            return (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(goal.category)}
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(goal.status)}
                    {isOverdue && (
                      <Badge variant="destructive">Atrasado</Badge>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progresso: {goal.current}/{goal.target}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Até {format(parseISO(goal.deadline), 'dd/MM/yyyy', { locale: pt })}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGoal(goal.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {activeGoals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum objetivo ativo</p>
              <p className="text-sm">Crie um objetivo para começar a acompanhar seu progresso</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Conquistas ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="p-3 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <div>
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Concluído em {format(parseISO(goal.deadline), 'dd/MM/yyyy', { locale: pt })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
