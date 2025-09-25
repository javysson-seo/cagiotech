
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AthleteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: any;
  onSave: (data: any) => void;
}

export const AthleteFormModal: React.FC<AthleteFormModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: undefined as Date | undefined,
    gender: '',
    address: '',
    plan: '',
    trainer: '',
    group: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalNotes: '',
    goals: [] as string[],
    notes: '',
    nutritionPreview: '',
    profilePhoto: '',
    hasEmergencyContact: false,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Mock data - em produção virão das configurações
  const availablePlans = [
    { id: 'basic', name: 'Básico', price: 50 },
    { id: 'premium', name: 'Premium', price: 80 },
    { id: 'vip', name: 'VIP', price: 120 },
    { id: 'unlimited', name: 'Ilimitado', price: 100 }
  ];

  const availableTrainers = [
    { id: '1', name: 'Carlos Santos' },
    { id: '2', name: 'Ana Costa' },
    { id: '3', name: 'Pedro Silva' },
    { id: '4', name: 'Maria Oliveira' }
  ];

  const availableGroups = [
    { id: '1', name: 'Crossfit Iniciantes' },
    { id: '2', name: 'Musculação Avançada' },
    { id: '3', name: 'Funcional' },
    { id: '4', name: 'Pilates' }
  ];

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        phone: athlete.phone || '',
        birthDate: athlete.birthDate ? new Date(athlete.birthDate) : undefined,
        gender: athlete.gender || '',
        address: athlete.address || '',
        plan: athlete.plan || '',
        trainer: athlete.trainer || '',
        group: athlete.group || '',
        emergencyContactName: athlete.emergencyContact || '',
        emergencyContactPhone: athlete.emergencyPhone || '',
        medicalNotes: athlete.medical_notes || '',
        goals: athlete.goals || [],
        notes: athlete.notes || '',
        nutritionPreview: athlete.nutritionPreview || '',
        profilePhoto: athlete.profilePhoto || '',
        hasEmergencyContact: !!(athlete.emergencyContact || athlete.emergencyPhone),
      });
      setPreviewUrl(athlete.profilePhoto || '');
    } else {
      // Reset form for new athlete
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthDate: undefined,
        gender: '',
        address: '',
        plan: '',
        trainer: '',
        group: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        medicalNotes: '',
        goals: [],
        notes: '',
        nutritionPreview: '',
        profilePhoto: '',
        hasEmergencyContact: false,
      });
      setPreviewUrl('');
      setProfileImage(null);
    }
  }, [athlete, isOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const getSelectedPlanPrice = () => {
    const selectedPlan = availablePlans.find(p => p.name === formData.plan);
    return selectedPlan?.price || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const athleteData = {
      ...formData,
      monthlyFee: getSelectedPlanPrice(),
      status: 'active',
      joinDate: athlete?.joinDate || new Date().toISOString().split('T')[0],
      // Se há nova imagem, usar ela, senão manter a existente
      profilePhoto: previewUrl || formData.profilePhoto,
    };

    // Limpar campos de contato de emergência se não selecionado
    if (!formData.hasEmergencyContact) {
      athleteData.emergencyContactName = '';
      athleteData.emergencyContactPhone = '';
    }

    onSave(athleteData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {athlete ? 'Editar Atleta' : 'Novo Atleta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={previewUrl} alt="Preview" />
                <AvatarFallback className="bg-green-100 text-green-600">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AT'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Clique para fazer upload da foto</p>
                    <p className="text-xs text-muted-foreground">Máximo 5MB (JPG, PNG)</p>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>
              
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewUrl('');
                    setProfileImage(null);
                    setFormData(prev => ({ ...prev, profilePhoto: '' }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birthDate ? (
                        format(formData.birthDate, "PPP", { locale: pt })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={pt}
                      captionLayout="dropdown-buttons"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Plano e Treinamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plano e Treinamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano *</Label>
                  <Select value={formData.plan} onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{plan.name}</span>
                            <Badge variant="outline" className="ml-2">€{plan.price}/mês</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer">Personal Trainer</Label>
                  <Select value={formData.trainer} onValueChange={(value) => setFormData(prev => ({ ...prev, trainer: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTrainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.name}>
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group">Grupo</Label>
                  <Select value={formData.group} onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroups.map((group) => (
                        <SelectItem key={group.id} value={group.name}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.plan && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Valor da Mensalidade:</span>
                    <span className="text-xl font-bold text-green-600">€{getSelectedPlanPrice()}/mês</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contato de Emergência */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contato de Emergência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency-contact"
                  checked={formData.hasEmergencyContact}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasEmergencyContact: !!checked }))}
                />
                <Label htmlFor="emergency-contact">Deseja adicionar contato de emergência?</Label>
              </div>

              {formData.hasEmergencyContact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-name">Nome do Contato</Label>
                    <Input
                      id="emergency-name"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">Telefone do Contato</Label>
                    <Input
                      id="emergency-phone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical">Condições Médicas / Restrições</Label>
                <Textarea
                  id="medical"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalNotes: e.target.value }))}
                  placeholder="Ex: Alergia a frutos secos, lesão no joelho..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nutrition">Preview Plano Nutricional</Label>
                <Textarea
                  id="nutrition"
                  value={formData.nutritionPreview}
                  onChange={(e) => setFormData(prev => ({ ...prev, nutritionPreview: e.target.value }))}
                  placeholder="Breve descrição do plano nutricional..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas adicionais sobre o atleta..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {athlete ? 'Atualizar Atleta' : 'Criar Atleta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
