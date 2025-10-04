import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const QuickRegisterModal: React.FC<QuickRegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birth_date: '',
  });

  const generatePasswordFromDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.birth_date) {
      alert('Todos os campos são obrigatórios');
      return;
    }
    
    onSave(formData);
    setFormData({ name: '', email: '', birth_date: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('athletes.quickRegisterTitle')}</DialogTitle>
          <DialogDescription>
            {t('athletes.quickRegisterDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('athletes.fullName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">{t('athletes.birthDate')} *</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('athletes.birthDateHelper')}
              </p>
            </div>

            {formData.birth_date && formData.email && (
              <Card className="bg-cagio-green-light border-cagio-green">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-cagio-green-dark mb-2">
                    {t('athletes.accessCredentials')}:
                  </h4>
                  <p className="text-sm text-foreground">
                    <strong>Email:</strong> {formData.email}<br />
                    <strong>{t('athletes.password')}:</strong> {generatePasswordFromDate(formData.birth_date)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('athletes.accessHelper')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('athletes.cancel')}
            </Button>
            <Button type="submit" className="bg-cagio-green hover:bg-cagio-green-dark text-white">
              {t('athletes.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};