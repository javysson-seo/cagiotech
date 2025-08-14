
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Wrench, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const RoomsEquipmentSettings: React.FC = () => {
  const [rooms] = useState([
    { id: '1', name: 'Sala Principal', capacity: 15, sqm: 100, status: 'active' },
    { id: '2', name: 'Sala Yoga', capacity: 8, sqm: 60, status: 'maintenance' }
  ]);

  const handleSave = () => {
    toast.success('Configurações de salas salvas!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Salas & Equipamentos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Salas Disponíveis</span>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Sala
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {room.capacity} pessoas • {room.sqm}m²
                    </p>
                  </div>
                  <Badge variant={room.status === 'active' ? 'default' : 'destructive'}>
                    {room.status === 'active' ? 'Ativa' : 'Manutenção'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Gestão de Equipamentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade em desenvolvimento</p>
            <p className="text-sm">Em breve: inventário completo e alertas de manutenção</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        Salvar Configurações de Salas
      </Button>
    </div>
  );
};
