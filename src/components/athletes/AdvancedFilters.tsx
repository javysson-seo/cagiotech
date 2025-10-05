import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useTrainers } from '@/hooks/useTrainers';
import { useCompany } from '@/contexts/CompanyContext';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const AdvancedFilters = ({ onFiltersChange }: AdvancedFiltersProps) => {
  const { currentCompany } = useCompany();
  const { plans } = useSubscriptionPlans(currentCompany?.id);
  const { trainers } = useTrainers();
  
  const [filters, setFilters] = useState({
    plan: 'all',
    trainer: 'all',
    paymentStatus: 'all',
    attendance: 'all',
    tags: [] as string[],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      plan: 'all',
      trainer: 'all',
      paymentStatus: 'all',
      attendance: 'all',
      tags: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== 'all' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-cagio-green">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros Avançados</SheetTitle>
          <SheetDescription>
            Refine sua pesquisa com filtros personalizados
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Plano */}
          <div>
            <Label htmlFor="plan-filter">Plano de Assinatura</Label>
            <Select value={filters.plan} onValueChange={(value) => setFilters({ ...filters, plan: value })}>
              <SelectTrigger id="plan-filter">
                <SelectValue placeholder="Todos os planos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trainer */}
          <div>
            <Label htmlFor="trainer-filter">Personal Trainer</Label>
            <Select value={filters.trainer} onValueChange={(value) => setFilters({ ...filters, trainer: value })}>
              <SelectTrigger id="trainer-filter">
                <SelectValue placeholder="Todos os trainers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os trainers</SelectItem>
                {trainers.map(trainer => (
                  <SelectItem key={trainer.id} value={trainer.name}>
                    {trainer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status de Pagamento */}
          <div>
            <Label htmlFor="payment-filter">Status de Pagamento</Label>
            <Select value={filters.paymentStatus} onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}>
              <SelectTrigger id="payment-filter">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="up-to-date">Em dia</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frequência */}
          <div>
            <Label htmlFor="attendance-filter">Frequência</Label>
            <Select value={filters.attendance} onValueChange={(value) => setFilters({ ...filters, attendance: value })}>
              <SelectTrigger id="attendance-filter">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos (&gt;= 3x/semana)</SelectItem>
                <SelectItem value="moderate">Moderados (1-2x/semana)</SelectItem>
                <SelectItem value="inactive">Inativos (0x/semana)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1 bg-cagio-green hover:bg-cagio-green-dark">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};