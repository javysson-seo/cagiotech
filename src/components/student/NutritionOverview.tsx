import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Apple, ChevronRight, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAthleteNutrition } from '@/hooks/useAthleteNutrition';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NutritionOverview: React.FC = () => {
  const navigate = useNavigate();
  const { plans, loading } = useAthleteNutrition();

  if (loading) {
    return (
      <Card className="border-t-4 border-t-green-500">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Carregando planos...</p>
        </CardContent>
      </Card>
    );
  }

  const activePlan = plans[0]; // Most recent plan

  return (
    <Card className="border-t-4 border-t-green-500">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg sm:text-xl text-green-500 flex items-center">
          <Apple className="h-5 w-5 mr-2" />
          Nutrição
        </CardTitle>
        {plans.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/student/nutrition')}
            className="text-green-500 hover:bg-green-500/10"
          >
            Ver plano
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!activePlan ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-3">
              <Apple className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-muted-foreground mb-2">Nenhum plano nutricional ativo</p>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite um plano ao seu treinador
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">{activePlan.title}</h4>
              {activePlan.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activePlan.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              {activePlan.trainers && (
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-1 text-green-500" />
                  <span>{activePlan.trainers.name}</span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1 text-green-500" />
                <span>
                  {format(parseISO(activePlan.created_at), "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>

            {activePlan.plan_details && (
              <div className="pt-3 border-t">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                    <p className="font-bold text-green-500">
                      {activePlan.plan_details.calories || '-'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Proteínas</p>
                    <p className="font-bold text-blue-500">
                      {activePlan.plan_details.protein || '-'}g
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                    <p className="font-bold text-orange-500">
                      {activePlan.plan_details.carbs || '-'}g
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => navigate('/student/nutrition')}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              Ver Plano Completo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
