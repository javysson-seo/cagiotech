import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CheckCircle, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const QuickCheckIn: React.FC = () => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!user?.email) {
      toast.error('Você precisa estar logado para fazer check-in');
      return;
    }

    setLoading(true);
    
    try {
      // Get athlete ID
      const { data: athlete } = await supabase
        .from('athletes')
        .select('id, company_id')
        .eq('email', user.email)
        .maybeSingle();

      if (!athlete) {
        toast.error('Atleta não encontrado');
        setLoading(false);
        return;
      }

      // Create check-in
      const { error } = await supabase
        .from('athlete_check_ins')
        .insert({
          athlete_id: athlete.id,
          company_id: athlete.company_id,
          check_in_type: 'manual',
          notes: 'Check-in via app do aluno'
        });

      if (error) throw error;

      setIsCheckedIn(true);
      toast.success('Check-in realizado com sucesso! 🎉', {
        description: 'Presença registrada e pontos adicionados!'
      });
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Erro ao fazer check-in. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckedIn) {
    return (
      <Card className="border-2 border-cagio-green bg-cagio-green-light">
        <CardContent className="p-6 text-center">
          <div className="inline-flex p-3 rounded-full bg-cagio-green mb-3">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-lg text-cagio-green mb-1">
            Check-in Confirmado!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Bom treino! 💪
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-cagio-green" />
              <span>18:00</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-cagio-green" />
              <span>Sala Principal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-cagio-green hover:border-solid transition-all">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-cagio-green-light mb-4">
            <QrCode className="h-10 w-10 text-cagio-green" />
          </div>
          <h3 className="font-bold text-lg mb-2">
            Pronto para treinar?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Faça check-in para registrar sua presença
          </p>
          <Button 
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full bg-cagio-green hover:bg-cagio-green-dark text-white h-12"
          >
            {loading ? 'Processando...' : 'Fazer Check-in'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
