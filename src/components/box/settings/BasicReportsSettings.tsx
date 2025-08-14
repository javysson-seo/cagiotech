
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Euro } from 'lucide-react';
import { toast } from 'sonner';

export const BasicReportsSettings: React.FC = () => {
  const handleSave = () => {
    toast.success('Configurações de relatórios salvas!');
  };

  const metrics = [
    { icon: Euro, label: 'Receita Mensal', value: '€4,250', trend: '+12%' },
    { icon: Users, label: 'Alunos Ativos', value: '127', trend: '+8%' },
    { icon: TrendingUp, label: 'Ocupação Média', value: '78%', trend: '+5%' },
    { icon: BarChart3, label: 'Aulas/Semana', value: '42', trend: '+3%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Relatórios Básicos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-green-600">{metric.trend}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Automáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade em desenvolvimento</p>
            <p className="text-sm">Em breve: relatórios mensais automáticos e análises detalhadas</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        Salvar Configurações de Relatórios
      </Button>
    </div>
  );
};
