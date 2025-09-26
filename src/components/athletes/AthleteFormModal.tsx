import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    birth_date: '',
  });

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        birth_date: athlete.birth_date || '',
      });
    } else {
      // Reset form for new athlete
      setFormData({
        name: '',
        email: '',
        birth_date: '',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {athlete ? 'Editar Atleta' : 'Novo Atleta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cadastro Rápido de Atleta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha apenas os dados essenciais. O atleta completará o perfil no primeiro acesso.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Nome completo do atleta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="birth_date">Data de Nascimento *</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Esta data será usada para gerar a senha inicial do atleta
                </p>
              </div>

              {formData.birth_date && formData.email && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Credenciais de Acesso:</h4>
                  <p className="text-sm text-blue-700">
                    <strong>Email:</strong> {formData.email}<br />
                    <strong>Senha:</strong> {generatePasswordFromDate(formData.birth_date)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    O atleta usará essas credenciais para acessar a área do aluno
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
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