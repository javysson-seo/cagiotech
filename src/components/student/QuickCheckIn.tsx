import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CheckCircle, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const QuickCheckIn: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    // Simular check-in
    setTimeout(() => {
      setIsCheckedIn(true);
      setLoading(false);
      toast.success('Check-in realizado com sucesso! 🎉', {
        description: 'Ganhou 10 pontos!'
      });
    }, 1000);
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
