
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface AthleteExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: any[];
}

export const AthleteExportDialog: React.FC<AthleteExportDialogProps> = ({
  isOpen,
  onClose,
  athletes
}) => {
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    phone: true,
    birthDate: true,
    gender: false,
    address: false,
    plan: true,
    trainer: true,
    group: false,
    status: true,
    joinDate: true,
    monthlyFee: true,
    emergencyContact: false,
    emergencyPhone: false,
    medicalConditions: false,
    goals: false,
    notes: false
  });

  const [sortOption, setSortOption] = useState('name-asc');

  const exportFields = [
    { key: 'name', label: 'Nome', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Telefone' },
    { key: 'birthDate', label: 'Data de Nascimento' },
    { key: 'gender', label: 'Género' },
    { key: 'address', label: 'Morada' },
    { key: 'plan', label: 'Plano' },
    { key: 'trainer', label: 'Personal Trainer' },
    { key: 'group', label: 'Grupo' },
    { key: 'status', label: 'Estado' },
    { key: 'joinDate', label: 'Data de Cadastro' },
    { key: 'monthlyFee', label: 'Mensalidade' },
    { key: 'emergencyContact', label: 'Contacto de Emergência' },
    { key: 'emergencyPhone', label: 'Telefone de Emergência' },
    { key: 'medicalConditions', label: 'Condições Médicas' },
    { key: 'goals', label: 'Objetivos' },
    { key: 'notes', label: 'Notas' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Nome (A-Z)' },
    { value: 'name-desc', label: 'Nome (Z-A)' },
    { value: 'date-asc', label: 'Data Cadastro (Mais Antigo)' },
    { value: 'date-desc', label: 'Data Cadastro (Mais Recente)' },
    { value: 'plan-asc', label: 'Plano (A-Z)' },
    { value: 'plan-desc', label: 'Plano (Z-A)' }
  ];

  const handleFieldToggle = (fieldKey: string, checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: checked
    }));
  };

  const sortAthletes = (athletes: any[]) => {
    const sorted = [...athletes];
    
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
      case 'plan-asc':
        return sorted.sort((a, b) => a.plan.localeCompare(b.plan));
      case 'plan-desc':
        return sorted.sort((a, b) => b.plan.localeCompare(a.plan));
      default:
        return sorted;
    }
  };

  const generateCSVContent = () => {
    const sortedAthletes = sortAthletes(athletes);
    const selectedFieldKeys = Object.keys(selectedFields).filter(key => selectedFields[key as keyof typeof selectedFields]);
    
    // Headers
    const headers = selectedFieldKeys.map(key => {
      const field = exportFields.find(f => f.key === key);
      return field?.label || key;
    });

    // Data rows
    const rows = sortedAthletes.map(athlete => {
      return selectedFieldKeys.map(key => {
        let value = athlete[key];
        
        // Format specific fields
        if (key === 'birthDate' && value) {
          value = new Date(value).toLocaleDateString('pt-PT');
        } else if (key === 'joinDate' && value) {
          value = new Date(value).toLocaleDateString('pt-PT');
        } else if (key === 'goals' && Array.isArray(value)) {
          value = value.join('; ');
        } else if (key === 'gender') {
          const genderMap = { male: 'Masculino', female: 'Feminino', other: 'Outro' };
          value = genderMap[value as keyof typeof genderMap] || value;
        }
        
        // Escape commas and quotes for CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value || '';
      });
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  };

  const handleExport = () => {
    try {
      const csvContent = generateCSVContent();
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `atletas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Exportação realizada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao exportar dados');
      console.error('Export error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Exportar Atletas para XLSX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ordenação */}
          <div className="space-y-2">
            <Label>Ordenar por:</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Campos */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Campos para Exportar:</Label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {exportFields.map(field => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields[field.key as keyof typeof selectedFields]}
                    onCheckedChange={(checked) => handleFieldToggle(field.key, checked as boolean)}
                    disabled={field.required}
                  />
                  <Label 
                    htmlFor={field.key} 
                    className={`text-sm cursor-pointer ${field.required ? 'font-medium' : ''}`}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumo da Exportação:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• {athletes.length} atletas serão exportados</p>
              <p>• {Object.values(selectedFields).filter(Boolean).length} campos selecionados</p>
              <p>• Ordenação: {sortOptions.find(opt => opt.value === sortOption)?.label}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleExport} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar XLSX
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
