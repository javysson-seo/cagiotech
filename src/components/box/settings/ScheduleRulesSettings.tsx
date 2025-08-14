
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export const ScheduleRulesSettings: React.FC = () => {
  const handleSave = () => {
    toast.success('Configurações de horários salvas!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Horários & Regras</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade de Horários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade em desenvolvimento</p>
            <p className="text-sm">Em breve: configuração completa da grade de horários</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de Horários
      </Button>
    </div>
  );
};
