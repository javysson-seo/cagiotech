
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TrainerFormProps {
  trainer?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const TrainerForm: React.FC<TrainerFormProps> = ({
  trainer,
  onSave,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Data
    name: trainer?.name || '',
    email: trainer?.email || '',
    phone: trainer?.phone || '',
    birthDate: trainer?.birthDate || '',
    address: trainer?.address || '',
    city: trainer?.city || '',
    postalCode: trainer?.postalCode || '',
    
    // Professional Data
    specialties: trainer?.specialties || [],
    certifications: trainer?.certifications || [],
    experience: trainer?.experience || '',
    bio: trainer?.bio || '',
    
    // Availability & Payment
    availability: trainer?.availability || {
      monday: { enabled: true, start: '06:00', end: '22:00' },
      tuesday: { enabled: true, start: '06:00', end: '22:00' },
      wednesday: { enabled: true, start: '06:00', end: '22:00' },
      thursday: { enabled: true, start: '06:00', end: '22:00' },
      friday: { enabled: true, start: '06:00', end: '22:00' },
      saturday: { enabled: false, start: '08:00', end: '18:00' },
      sunday: { enabled: false, start: '08:00', end: '18:00' }
    },
    paymentType: trainer?.paymentType || 'fixed',
    monthlyPay: trainer?.monthlyPay || 1500,
    payPerClass: trainer?.payPerClass || 25,
    percentage: trainer?.percentage || 40,
    
    // Permissions
    permissions: trainer?.permissions || {
      viewAllAthletes: false,
      createEditWorkouts: true,
      recordResults: true,
      communicateAthletes: true,
      accessReports: false,
      manageSchedule: false
    }
  });

  const steps = [
    { id: 1, title: 'Dados Pessoais', description: 'Informações básicas do trainer' },
    { id: 2, title: 'Dados Profissionais', description: 'Especialidades e certificações' },
    { id: 3, title: 'Disponibilidade', description: 'Horários de trabalho' },
    { id: 4, title: 'Remuneração e Permissões', description: 'Pagamento e acesso ao sistema' }
  ];

  const specialtyOptions = [
    'CrossFit', 'Olympic Lifting', 'Powerlifting', 'Functional Training',
    'Yoga', 'Pilates', 'Mobility', 'Nutrition', 'Gymnastics', 'Running'
  ];

  const dayNames = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s: string) => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Saving trainer:', formData);
    onSave();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={trainer?.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('') || 'TR'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome do trainer"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+351 9__ ___ ___"
                />
              </div>
              
              <div>
                <Label htmlFor="birthDate">Data Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Morada</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, andar"
                />
              </div>
              
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="0000-000"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Especialidades *</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Selecione as modalidades que o trainer pode lecionar
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <Label htmlFor={specialty} className="text-sm">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="certifications">Certificações</Label>
              <Input
                id="certifications"
                value={formData.certifications.join(', ')}
                onChange={(e) => handleInputChange('certifications', e.target.value.split(', '))}
                placeholder="CrossFit L1, Olympic Lifting, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Anos de Experiência</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Ex: 5 anos"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Biografia Profissional</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Breve descrição da experiência e especialidades..."
                rows={4}
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-4">Configurar Disponibilidade Semanal</h3>
              <div className="space-y-3">
                {Object.entries(dayNames).map(([key, name]) => (
                  <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 min-w-[100px]">
                      <Checkbox
                        checked={formData.availability[key].enabled}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange(key, 'enabled', checked)
                        }
                      />
                      <Label className="font-medium">{name}</Label>
                    </div>
                    
                    {formData.availability[key].enabled && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={formData.availability[key].start}
                          onChange={(e) => 
                            handleAvailabilityChange(key, 'start', e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-muted-foreground">até</span>
                        <Input
                          type="time"
                          value={formData.availability[key].end}
                          onChange={(e) => 
                            handleAvailabilityChange(key, 'end', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            {/* Payment Configuration */}
            <div>
              <h3 className="font-medium mb-4">Configuração de Remuneração</h3>
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Pagamento</Label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
                  >
                    <option value="fixed">Salário Fixo Mensal</option>
                    <option value="per_class">Por Aula</option>
                    <option value="percentage">Percentual da Receita</option>
                  </select>
                </div>
                
                {formData.paymentType === 'fixed' && (
                  <div>
                    <Label htmlFor="monthlyPay">Valor Mensal (€)</Label>
                    <Input
                      id="monthlyPay"
                      type="number"
                      value={formData.monthlyPay}
                      onChange={(e) => handleInputChange('monthlyPay', parseFloat(e.target.value))}
                    />
                  </div>
                )}
                
                {formData.paymentType === 'per_class' && (
                  <div>
                    <Label htmlFor="payPerClass">Valor por Aula (€)</Label>
                    <Input
                      id="payPerClass"
                      type="number"
                      value={formData.payPerClass}
                      onChange={(e) => handleInputChange('payPerClass', parseFloat(e.target.value))}
                    />
                  </div>
                )}
                
                {formData.paymentType === 'percentage' && (
                  <div>
                    <Label htmlFor="percentage">Percentual (%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      value={formData.percentage}
                      onChange={(e) => handleInputChange('percentage', parseFloat(e.target.value))}
                      max="100"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Permissions */}
            <div>
              <h3 className="font-medium mb-4">Permissões do Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Ver Todos os Atletas</Label>
                    <p className="text-sm text-muted-foreground">Acesso a lista completa de atletas</p>
                  </div>
                  <Checkbox
                    checked={formData.permissions.viewAllAthletes}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('viewAllAthletes', !!checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Criar/Editar Treinos</Label>
                    <p className="text-sm text-muted-foreground">Criar WODs e planos personalizados</p>
                  </div>
                  <Checkbox
                    checked={formData.permissions.createEditWorkouts}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('createEditWorkouts', !!checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Registrar Resultados</Label>
                    <p className="text-sm text-muted-foreground">Lançar performance e recordes</p>
                  </div>
                  <Checkbox
                    checked={formData.permissions.recordResults}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('recordResults', !!checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Comunicar com Atletas</Label>
                    <p className="text-sm text-muted-foreground">Enviar mensagens e notificações</p>
                  </div>
                  <Checkbox
                    checked={formData.permissions.communicateAthletes}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('communicateAthletes', !!checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Acesso a Relatórios</Label>
                    <p className="text-sm text-muted-foreground">Ver relatórios de performance</p>
                  </div>
                  <Checkbox
                    checked={formData.permissions.accessReports}
                    onCheckedChange={(checked) => 
                      handlePermissionChange('accessReports', !!checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{trainer ? 'Editar Trainer' : 'Novo Trainer'}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-2 mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.id < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  step.id < currentStep ? 'bg-green-600' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <h3 className="font-medium">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              {trainer ? 'Atualizar' : 'Criar'} Trainer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
