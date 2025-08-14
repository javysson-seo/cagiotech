
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dumbbell, Heart, Users, Baby, Zap, Music } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { areas: string[], source: string }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [source, setSource] = useState('');

  const areas = [
    { id: 'fitness', label: 'Fitness/Musculação', icon: Dumbbell },
    { id: 'crossfit', label: 'CrossFit/Funcional', icon: Zap },
    { id: 'pilates', label: 'Pilates/Yoga', icon: Heart },
    { id: 'dance', label: 'Dança/Zumba', icon: Music },
    { id: 'martial_arts', label: 'Artes Marciais', icon: Users },
    { id: 'kids', label: 'Atividades Infantis', icon: Baby }
  ];

  const sources = [
    { id: 'google', label: 'Google/Pesquisa online' },
    { id: 'social_media', label: 'Redes sociais' },
    { id: 'recommendation', label: 'Recomendação de amigo/colega' },
    { id: 'events', label: 'Eventos/Feiras do setor' },
    { id: 'advertising', label: 'Publicidade online' },
    { id: 'other', label: 'Outro' }
  ];

  const handleAreaToggle = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
    } else if (selectedAreas.length < 3) {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  const handleComplete = () => {
    if (selectedAreas.length > 0 && source) {
      onComplete({ areas: selectedAreas, source });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-4">
            Quase pronto! 🎉
          </DialogTitle>
          <p className="text-center text-muted-foreground mb-6">
            Ajude-nos a personalizar a sua experiência
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Em que áreas a sua empresa atua? (máximo 3)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area) => {
                const Icon = area.icon;
                const isSelected = selectedAreas.includes(area.id);
                const isDisabled = !isSelected && selectedAreas.length >= 3;

                return (
                  <div
                    key={area.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#bed700] bg-[#bed700]/10'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50'
                        : 'border-gray-200 hover:border-[#bed700]/50'
                    }`}
                    onClick={() => !isDisabled && handleAreaToggle(area.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      className="data-[state=checked]:bg-[#bed700] data-[state=checked]:border-[#bed700]"
                    />
                    <Icon className="h-4 w-4 text-[#bed700]" />
                    <span className="text-sm font-medium">{area.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedAreas.length}/3 selecionadas
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Como conheceu o CagioTech?
            </Label>
            <RadioGroup value={source} onValueChange={setSource}>
              {sources.map((sourceOption) => (
                <div key={sourceOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={sourceOption.id} 
                    id={sourceOption.id}
                    className="text-[#bed700] border-[#bed700] data-[state=checked]:bg-[#bed700]"
                  />
                  <Label htmlFor={sourceOption.id} className="text-sm cursor-pointer">
                    {sourceOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={handleComplete}
            disabled={selectedAreas.length === 0 || !source}
            className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
