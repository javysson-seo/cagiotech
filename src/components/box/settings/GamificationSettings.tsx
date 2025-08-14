
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trophy, Save, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

export const GamificationSettings: React.FC = () => {
  const [pointsSystem, setPointsSystem] = useState({
    enabled: true,
    attendancePoints: 10,
    punctualityBonus: 5,
    personalRecordPoints: 50,
    referralPoints: 100
  });

  const [levels] = useState([
    { name: 'Novato', minXP: 0, maxXP: 100 },
    { name: 'Intermediário', minXP: 101, maxXP: 500 },
    { name: 'Avançado', minXP: 501, maxXP: 1000 },
    { name: 'Elite', minXP: 1001, maxXP: 9999 }
  ]);

  const handleSave = () => {
    toast.success('Configurações de gamificação salvas!');
    console.log('Gamificação:', pointsSystem);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Gamificação</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Sistema de Pontos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ativar Sistema de Gamificação</Label>
              <p className="text-sm text-muted-foreground">
                Pontos, níveis e badges para motivar alunos
              </p>
            </div>
            <Switch
              checked={pointsSystem.enabled}
              onCheckedChange={(checked) => setPointsSystem({ ...pointsSystem, enabled: checked })}
            />
          </div>

          {pointsSystem.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Pontos por Presença</Label>
                <Input
                  type="number"
                  value={pointsSystem.attendancePoints}
                  onChange={(e) => setPointsSystem({ ...pointsSystem, attendancePoints: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Bônus Pontualidade</Label>
                <Input
                  type="number"
                  value={pointsSystem.punctualityBonus}
                  onChange={(e) => setPointsSystem({ ...pointsSystem, punctualityBonus: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Pontos Recorde Pessoal</Label>
                <Input
                  type="number"
                  value={pointsSystem.personalRecordPoints}
                  onChange={(e) => setPointsSystem({ ...pointsSystem, personalRecordPoints: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Pontos Indicação Amigo</Label>
                <Input
                  type="number"
                  value={pointsSystem.referralPoints}
                  onChange={(e) => setPointsSystem({ ...pointsSystem, referralPoints: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Níveis e Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levels.map((level, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{level.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {level.minXP} - {level.maxXP}+ XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de Gamificação
      </Button>
    </div>
  );
};
