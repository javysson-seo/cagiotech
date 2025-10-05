import React, { useState, useMemo } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { DealModal } from '@/components/crm/DealModal';
import { Plus, Search, Filter, Euro, TrendingUp, Target, Award } from 'lucide-react';
import { useCRMDeals } from '@/hooks/useCRMDeals';
import { useCRMStages } from '@/hooks/useCRMStages';

const BoxCRMContent: React.FC = () => {
  const { deals, refetch } = useCRMDeals();
  const { stages } = useCRMStages();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const handleNewDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleDealClick = (deal: any) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
    refetch();
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const activeDeals = deals.filter(d => d.status === 'active').length;
    
    const wonStage = stages.find(s => s.is_won);
    const wonDeals = wonStage ? deals.filter(d => d.stage_id === wonStage.id).length : 0;
    
    const averageProbability = deals.length > 0
      ? Math.round(deals.reduce((sum, d) => sum + d.probability, 0) / deals.length)
      : 0;

    return {
      totalValue,
      activeDeals,
      wonDeals,
      averageProbability,
    };
  }, [deals, stages]);

  return (
    <div className="flex min-h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-full mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">CRM & Pipeline de Vendas</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerir oportunidades e funil de vendas
                </p>
              </div>
              <Button onClick={handleNewDeal}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Oportunidade
              </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Euro className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-xl font-bold">
                        €{metrics.totalValue.toLocaleString('pt-PT', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Oportunidades Ativas</p>
                      <p className="text-xl font-bold">{metrics.activeDeals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Negócios Ganhos</p>
                      <p className="text-xl font-bold">{metrics.wonDeals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Probabilidade Média</p>
                      <p className="text-xl font-bold">{metrics.averageProbability}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar oportunidades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-full sm:w-48 z-50 bg-popover">
                      <SelectValue placeholder="Filtrar por estágio" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="all">Todos Estágios</SelectItem>
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Kanban Board */}
            <div className="bg-muted/20 rounded-lg p-4">
              <KanbanBoard onDealClick={handleDealClick} />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deal={selectedDeal}
        onSave={handleCloseModal}
      />
    </div>
  );
};

export const BoxCRM: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxCRMContent />
    </AreaThemeProvider>
  );
};
