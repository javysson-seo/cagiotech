
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trophy, Save, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '@/contexts/CompanyContext';
import { useGamificationSettings } from '@/hooks/useGamification';

export const GamificationSettings: React.FC = () => {
  const { currentCompany } = useCompany();
  const { settings, isLoading, saveSettings } = useGamificationSettings(currentCompany?.id);

  const [pointsSystem, setPointsSystem] = useState({
    enabled: true,
    points_per_attendance: 10,
    points_per_punctuality: 5,
    points_per_personal_record: 50,
    points_per_referral: 100,
    streak_bonus_enabled: true,
    streak_bonus_points: 5,
  });

  useEffect(() => {
    if (settings) {
      setPointsSystem({
        enabled: settings.enabled,
        points_per_attendance: settings.points_per_attendance,
        points_per_punctuality: settings.points_per_punctuality,
        points_per_personal_record: settings.points_per_personal_record,
        points_per_referral: settings.points_per_referral,
        streak_bonus_enabled: settings.streak_bonus_enabled,
        streak_bonus_points: settings.streak_bonus_points,
      });
    }
  }, [settings]);

  const [levels] = useState([
    { name: 'Novato', minXP: 0, maxXP: 99 },
    { name: 'Intermediário', minXP: 100, maxXP: 499 },
    { name: 'Avançado', minXP: 500, maxXP: 999 },
    { name: 'Elite', minXP: 1000, maxXP: 2499 },
    { name: 'Lendário', minXP: 2500, maxXP: 999999 }
  ]);

  const handleSave = async () => {
    try {
      await saveSettings(pointsSystem);
      toast.success('Configurações de gamificação salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>;
  }

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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Pontos por Presença</Label>
                  <Input
                    type="number"
                    value={pointsSystem.points_per_attendance}
                    onChange={(e) => setPointsSystem({ ...pointsSystem, points_per_attendance: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Bônus Pontualidade</Label>
                  <Input
                    type="number"
                    value={pointsSystem.points_per_punctuality}
                    onChange={(e) => setPointsSystem({ ...pointsSystem, points_per_punctuality: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Pontos Recorde Pessoal</Label>
                  <Input
                    type="number"
                    value={pointsSystem.points_per_personal_record}
                    onChange={(e) => setPointsSystem({ ...pointsSystem, points_per_personal_record: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Pontos Indicação Amigo</Label>
                  <Input
                    type="number"
                    value={pointsSystem.points_per_referral}
                    onChange={(e) => setPointsSystem({ ...pointsSystem, points_per_referral: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label>Bônus de Sequência</Label>
                  <p className="text-sm text-muted-foreground">
                    Dar pontos extras a cada 7 dias consecutivos
                  </p>
                </div>
                <Switch
                  checked={pointsSystem.streak_bonus_enabled}
                  onCheckedChange={(checked) => setPointsSystem({ ...pointsSystem, streak_bonus_enabled: checked })}
                />
              </div>

              {pointsSystem.streak_bonus_enabled && (
                <div>
                  <Label>Pontos por Bônus de Sequência</Label>
                  <Input
                    type="number"
                    value={pointsSystem.streak_bonus_points}
                    onChange={(e) => setPointsSystem({ ...pointsSystem, streak_bonus_points: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}
            </>
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
