
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { 
  Calendar,
  Filter,
  X,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardFiltersProps {
  dateRange: any;
  onDateRangeChange: (value: any) => void;
  selectedTrainer: string;
  onTrainerChange: (value: string) => void;
  selectedModality: string;
  onModalityChange: (value: string) => void;
  selectedRoom: string;
  onRoomChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  selectedTrainer,
  onTrainerChange,
  selectedModality,
  onModalityChange,
  selectedRoom,
  onRoomChange,
  onRefresh,
  onExport
}) => {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onTrainerChange('');
    onModalityChange('');
    onRoomChange('');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DatePickerWithRange
              date={dateRange}
              setDate={onDateRangeChange}
            />
          </div>

          {/* Trainer Filter */}
          <Select value={selectedTrainer} onValueChange={onTrainerChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trainer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Trainers</SelectItem>
              <SelectItem value="joão">João Silva</SelectItem>
              <SelectItem value="maria">Maria Santos</SelectItem>
              <SelectItem value="pedro">Pedro Costa</SelectItem>
              <SelectItem value="ana">Ana Ferreira</SelectItem>
            </SelectContent>
          </Select>

          {/* Modality Filter */}
          <Select value={selectedModality} onValueChange={onModalityChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Modalidades</SelectItem>
              <SelectItem value="crossfit">CrossFit</SelectItem>
              <SelectItem value="funcional">Funcional</SelectItem>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="hiit">HIIT</SelectItem>
              <SelectItem value="mobilidade">Mobilidade</SelectItem>
            </SelectContent>
          </Select>

          {/* Room Filter */}
          <Select value={selectedRoom} onValueChange={onRoomChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Salas</SelectItem>
              <SelectItem value="sala1">Sala 1</SelectItem>
              <SelectItem value="sala2">Sala 2</SelectItem>
              <SelectItem value="sala3">Sala 3</SelectItem>
              <SelectItem value="exterior">Exterior</SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Limpar todos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
