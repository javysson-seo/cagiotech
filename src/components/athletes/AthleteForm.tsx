
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AthleteFormProps {
  athlete?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const AthleteForm: React.FC<AthleteFormProps> = ({
  athlete,
  onSave,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Data
    name: athlete?.name || '',
    email: athlete?.email || '',
    phone: athlete?.phone || '',
    birthDate: athlete?.birthDate || '',
    address: athlete?.address || '',
    city: athlete?.city || '',
    postalCode: athlete?.postalCode || '',
    emergencyContact: athlete?.emergencyContact || '',
    emergencyPhone: athlete?.emergencyPhone || '',
    
    // Plan Data
    plan: athlete?.plan || 'unlimited',
    startDate: athlete?.startDate || new Date().toISOString().split('T')[0],
    trainer: athlete?.trainer || '',
    paymentMethod: athlete?.paymentMethod || 'monthly',
    monthlyFee: athlete?.monthlyFee || 75,
    
    // Health & Preferences
    medicalConditions: athlete?.medicalConditions || '',
    goals: athlete?.goals || '',
    notes: athlete?.notes || '',
    
    // Documents
    documents: athlete?.documents || []
  });

  const steps = [
    { id: 1, title: 'Dados Pessoais', description: 'Informações básicas do atleta' },
    { id: 2, title: 'Plano e Pagamento', description: 'Configuração do plano' },
    { id: 3, title: 'Saúde e Objetivos', description: 'Informações médicas' },
    { id: 4, title: 'Documentos', description: 'Upload de documentos' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    // Here would save to API/Supabase
    console.log('Saving athlete:', formData);
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
                  <AvatarImage src={athlete?.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('') || 'AT'}
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
                  placeholder="Nome do atleta"
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
              
              <div>
                <Label htmlFor="emergencyContact">Contacto Emergência</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Nome do contacto"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyPhone">Telefone Emergência</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="+351 9__ ___ ___"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan">Plano *</Label>
                <select
                  id="plan"
                  value={formData.plan}
                  onChange={(e) => handleInputChange('plan', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="unlimited">Ilimitado (€75/mês)</option>
                  <option value="8x">8x por Semana (€50/mês)</option>
                  <option value="4x">4x por Semana (€35/mês)</option>
                  <option value="dropin">Drop-in (€15/aula)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="startDate">Data Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="trainer">Personal Trainer</Label>
                <select
                  id="trainer"
                  value={formData.trainer}
                  onChange={(e) => handleInputChange('trainer', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Selecionar trainer...</option>
                  <option value="carlos">Carlos Santos</option>
                  <option value="ana">Ana Costa</option>
                  <option value="pedro">Pedro Silva</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Forma Pagamento</Label>
                <select
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="yearly">Anual</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="monthlyFee">Valor Mensal (€)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                  placeholder="75"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicalConditions">Condições Médicas</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="Lesões, alergias, medicação..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="goals">Objetivos Fitness</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="Perder peso, ganhar força, competição..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notas e Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload de Documentos</p>
              <p className="text-muted-foreground mb-4">
                Arraste ficheiros aqui ou clique para selecionar
              </p>
              <Button variant="outline">
                Selecionar Ficheiros
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Documentos Obrigatórios:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-border rounded">
                  <span>Termo de Responsabilidade</span>
                  <Badge variant="destructive">Pendente</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-border rounded">
                  <span>Questionário PAR-Q</span>
                  <Badge variant="destructive">Pendente</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border border-border rounded">
                  <span>RGPD Consent</span>
                  <Badge variant="destructive">Pendente</Badge>
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
          <span>{athlete ? 'Editar Atleta' : 'Novo Atleta'}</span>
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
              {athlete ? 'Atualizar' : 'Criar'} Atleta
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
