import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Save } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DaySchedule {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  notes: string;
}

export const ScheduleRulesSettings: React.FC = () => {
  const { currentCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day_of_week: 1, is_open: true, open_time: '06:00', close_time: '22:00', notes: '' },
    { day_of_week: 2, is_open: true, open_time: '06:00', close_time: '22:00', notes: '' },
    { day_of_week: 3, is_open: true, open_time: '06:00', close_time: '22:00', notes: '' },
    { day_of_week: 4, is_open: true, open_time: '06:00', close_time: '22:00', notes: '' },
    { day_of_week: 5, is_open: true, open_time: '06:00', close_time: '22:00', notes: '' },
    { day_of_week: 6, is_open: true, open_time: '09:00', close_time: '14:00', notes: '' },
    { day_of_week: 0, is_open: false, open_time: '', close_time: '', notes: 'Fechado' },
  ]);

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    if (currentCompany?.id) {
      loadSchedule();
    }
  }, [currentCompany?.id]);

  const loadSchedule = async () => {
    if (!currentCompany?.id) return;

    try {
      const { data, error } = await supabase
        .from('company_schedule')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('day_of_week');

      if (error) throw error;

      if (data && data.length > 0) {
        setSchedule(data.map(d => ({
          day_of_week: d.day_of_week,
          is_open: d.is_open,
          open_time: d.open_time || '',
          close_time: d.close_time || '',
          notes: d.notes || '',
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  };

  const handleSave = async () => {
    if (!currentCompany?.id) return;

    setLoading(true);
    try {
      const upsertData = schedule.map(s => ({
        company_id: currentCompany.id,
        day_of_week: s.day_of_week,
        is_open: s.is_open,
        open_time: s.is_open ? s.open_time : null,
        close_time: s.is_open ? s.close_time : null,
        notes: s.notes || null,
      }));

      const { error } = await supabase
        .from('company_schedule')
        .upsert(upsertData, {
          onConflict: 'company_id,day_of_week',
        });

      if (error) throw error;

      toast.success('Horários salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      toast.error('Erro ao salvar horários');
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayOfWeek: number, field: keyof DaySchedule, value: any) => {
    setSchedule(prev =>
      prev.map(day =>
        day.day_of_week === dayOfWeek
          ? { ...day, [field]: value }
          : day
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Horários de Funcionamento</h2>
          <p className="text-sm text-muted-foreground">Configure os horários de abertura e fechamento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedule.map((day) => (
            <div
              key={day.day_of_week}
              className="p-4 border rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{dayNames[day.day_of_week]}</h4>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Aberto</Label>
                  <Switch
                    checked={day.is_open}
                    onCheckedChange={(checked) =>
                      updateDay(day.day_of_week, 'is_open', checked)
                    }
                  />
                </div>
              </div>

              {day.is_open ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Abertura</Label>
                    <Input
                      type="time"
                      value={day.open_time}
                      onChange={(e) =>
                        updateDay(day.day_of_week, 'open_time', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Fechamento</Label>
                    <Input
                      type="time"
                      value={day.close_time}
                      onChange={(e) =>
                        updateDay(day.day_of_week, 'close_time', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Observações</Label>
                    <Input
                      placeholder="Ex: Horário especial"
                      value={day.notes}
                      onChange={(e) =>
                        updateDay(day.day_of_week, 'notes', e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Fechado neste dia</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg" disabled={loading}>
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Salvando...' : 'Salvar Horários'}
      </Button>
    </div>
  );
};
