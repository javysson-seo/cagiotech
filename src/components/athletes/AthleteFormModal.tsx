import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useTrainers } from '@/hooks/useTrainers';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

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
  const { t } = useTranslation();
  const { currentCompany } = useCompany();
  const { plans } = useSubscriptionPlans(currentCompany?.id);
  const { trainers } = useTrainers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birth_date: '',
    phone: '',
    address: '',
    gender: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
    plan: '',
    trainer: '',
    monthly_fee: '',
    goals: [] as string[],
    notes: '',
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        birth_date: athlete.birth_date || '',
        phone: athlete.phone || '',
        address: athlete.address || '',
        gender: athlete.gender || '',
        emergency_contact_name: athlete.emergency_contact_name || '',
        emergency_contact_phone: athlete.emergency_contact_phone || '',
        medical_notes: athlete.medical_notes || '',
        plan: athlete.plan || '',
        trainer: athlete.trainer || '',
        monthly_fee: athlete.monthly_fee?.toString() || '',
        goals: athlete.goals || [],
        notes: athlete.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        birth_date: '',
        phone: '',
        address: '',
        gender: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_notes: '',
        plan: '',
        trainer: '',
        monthly_fee: '',
        goals: [],
        notes: '',
      });
    }
  }, [athlete, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.birth_date) {
      alert('Nome, email e data de nascimento são obrigatórios');
      return;
    }

    const athleteData = {
      ...formData,
      monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : 0,
      id: athlete?.id,
    };

    onSave(athleteData);
  };

  const generatePasswordFromDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      const price = Number(selectedPlan.price);
      setOriginalPrice(price);
      setFormData(prev => ({
        ...prev,
        plan: selectedPlan.name,
        monthly_fee: (price * (1 - discount / 100)).toFixed(2)
      }));
    }
  };

  const applyCoupon = () => {
    // Simulação de validação de cupom - em produção, deve validar no backend
    const validCoupons: Record<string, number> = {
      'WELCOME10': 10,
      'PROMO20': 20,
      'SAVE30': 30,
      'VIP50': 50,
    };

    const discountValue = validCoupons[couponCode.toUpperCase()];
    
    if (discountValue) {
      setDiscount(discountValue);
      const finalPrice = originalPrice * (1 - discountValue / 100);
      setFormData(prev => ({
        ...prev,
        monthly_fee: finalPrice.toFixed(2)
      }));
      toast.success(`Cupom aplicado! ${discountValue}% de desconto`);
    } else {
      toast.error('Cupom inválido');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode('');
    setFormData(prev => ({
      ...prev,
      monthly_fee: originalPrice.toFixed(2)
    }));
    toast.success('Cupom removido');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {athlete ? t('athletes.editAthlete') : t('athletes.newAthlete')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('athletes.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">{t('athletes.fullName')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Nome completo do atleta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('athletes.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('athletes.birthDate')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                      required
                      className="pl-3"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('athletes.birthDateHelper')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('athletes.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+351 912 345 678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">{t('athletes.gender')}</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('athletes.male')}</SelectItem>
                      <SelectItem value="female">{t('athletes.female')}</SelectItem>
                      <SelectItem value="other">{t('athletes.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">{t('athletes.address')}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, código postal, cidade"
                  />
                </div>
              </div>

              {formData.birth_date && formData.email && (
                <div className="p-4 bg-cagio-green-light rounded-lg border border-cagio-green">
                  <h4 className="font-medium text-cagio-green-dark mb-2">{t('athletes.accessCredentials')}:</h4>
                  <p className="text-sm text-foreground">
                    <strong>Email:</strong> {formData.email}<br />
                    <strong>{t('athletes.password')}:</strong> {generatePasswordFromDate(formData.birth_date)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('athletes.accessHelper')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacto de Emergência */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('athletes.emergencyContact')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_name">{t('athletes.emergencyName')}</Label>
                  <Input
                    id="emergency_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    placeholder="Nome do contacto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">{t('athletes.emergencyPhone')}</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Subscrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('athletes.subscriptionInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">{t('athletes.plan')}</Label>
                  <Select value={selectedPlanId} onValueChange={handlePlanChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.filter(p => p.is_active).map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          <div className="flex items-center justify-between gap-2">
                            <span>{plan.name}</span>
                            <Badge variant="outline">€{plan.price}/{plan.billing_period === 'monthly' ? 'mês' : plan.billing_period === 'quarterly' ? 'trimestre' : 'ano'}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPlanId && (
                    <p className="text-xs text-muted-foreground">
                      {plans.find(p => p.id === selectedPlanId)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer">{t('athletes.trainer')}</Label>
                  <Select 
                    value={formData.trainer} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, trainer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um personal trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem personal trainer</SelectItem>
                      {trainers.filter(t => t.status === 'active').map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.name}>
                          {trainer.name}
                          {trainer.specialties && trainer.specialties.length > 0 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({trainer.specialties.join(', ')})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cupom de Desconto */}
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Cupom de Desconto
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Digite o código do cupom"
                    disabled={discount > 0}
                  />
                  {discount > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeCoupon}
                    >
                      Remover
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode}
                    >
                      Aplicar
                    </Button>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Percent className="h-4 w-4" />
                    <span className="font-medium">{discount}% de desconto aplicado!</span>
                  </div>
                )}
              </div>

              {/* Valor Final */}
              <div className="grid grid-cols-2 gap-4">
                {discount > 0 && (
                  <div className="space-y-2">
                    <Label>Valor Original</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg line-through text-muted-foreground">
                        €{originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="monthly_fee">
                    {discount > 0 ? 'Valor Final' : t('athletes.monthlyFee')} (€)
                  </Label>
                  <Input
                    id="monthly_fee"
                    type="number"
                    step="0.01"
                    value={formData.monthly_fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_fee: e.target.value }))}
                    placeholder="80.00"
                    className={discount > 0 ? 'font-bold text-green-600' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Saúde */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('athletes.medicalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical_notes">{t('athletes.medicalNotes')}</Label>
                <Textarea
                  id="medical_notes"
                  value={formData.medical_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_notes: e.target.value }))}
                  placeholder="Alergias, condições médicas, restrições..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notas Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('athletes.notes')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais sobre o atleta..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('athletes.cancel')}
            </Button>
            <Button type="submit" className="bg-cagio-green hover:bg-cagio-green-dark text-white">
              {athlete ? t('athletes.update') : t('athletes.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};