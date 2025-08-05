
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Save, X, Upload, Camera, User, Mail, Phone, MapPin,
  Calendar, Heart, Target, FileText, Shield
} from 'lucide-react';

interface AthleteFormWithDocumentsProps {
  athlete?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const AthleteFormWithDocuments: React.FC<AthleteFormWithDocumentsProps> = ({
  athlete,
  onSave,
  onCancel
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    athlete?.avatar || null
  );
  const [documents, setDocuments] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDocuments(prev => [...prev, ...Array.from(event.target.files || [])]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {athlete ? 'Editar Atleta' : 'Novo Atleta'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Photo Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileImage || ''} alt="Foto do atleta" />
            <AvatarFallback className="bg-muted text-2xl">
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Foto de Perfil</Label>
            <Input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG até 5MB
            </p>
          </div>
        </div>

        <Separator />

        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informações Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input 
                id="name" 
                defaultValue={athlete?.name}
                placeholder="Nome completo do atleta"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                defaultValue={athlete?.email}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input 
                id="phone" 
                defaultValue={athlete?.phone}
                placeholder="+351 912 345 678"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input 
                id="dateOfBirth" 
                type="date"
                defaultValue={athlete?.dateOfBirth}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cc">Cartão de Cidadão</Label>
              <Input 
                id="cc" 
                defaultValue={athlete?.cc}
                placeholder="12345678 9 ZZ0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nif">NIF</Label>
              <Input 
                id="nif" 
                defaultValue={athlete?.nif}
                placeholder="123456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Morada</Label>
            <Input 
              id="address" 
              defaultValue={athlete?.address}
              placeholder="Rua, número, código postal, cidade"
            />
          </div>
        </div>

        <Separator />

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Contacto de Emergência
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Nome</Label>
              <Input 
                id="emergencyName" 
                defaultValue={athlete?.emergencyContact}
                placeholder="Nome do contacto de emergência"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Telefone</Label>
              <Input 
                id="emergencyPhone" 
                defaultValue={athlete?.emergencyPhone}
                placeholder="+351 912 345 678"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyRelation">Parentesco</Label>
              <Input 
                id="emergencyRelation" 
                defaultValue={athlete?.emergencyRelation}
                placeholder="Pai, mãe, cônjuge, etc."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Health Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Informações de Saúde
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Condições Médicas / Lesões</Label>
            <Textarea 
              id="medicalConditions" 
              defaultValue={athlete?.medicalConditions}
              placeholder="Descreva qualquer condição médica, lesão ou limitação física..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medications">Medicamentos</Label>
            <Textarea 
              id="medications" 
              defaultValue={athlete?.medications}
              placeholder="Liste medicamentos em uso regular..."
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Objetivos e Preferências
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="goals">Objetivos</Label>
            <Textarea 
              id="goals" 
              defaultValue={athlete?.goals?.join(', ')}
              placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condição física..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Experiência no Desporto</Label>
            <select 
              id="experience" 
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              defaultValue={athlete?.experience || 'beginner'}
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermédio</option>
              <option value="advanced">Avançado</option>
              <option value="professional">Profissional</option>
            </select>
          </div>
        </div>

        <Separator />

        {/* Documents Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documentos
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="documents">Carregar Documentos</Label>
            <Input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleDocumentUpload}
            />
            <p className="text-xs text-muted-foreground">
              Cartão de Cidadão, Atestado Médico, Contrato, etc. (PDF, JPG, PNG, DOC)
            </p>
          </div>

          {documents.length > 0 && (
            <div className="space-y-2">
              <Label>Documentos Selecionados:</Label>
              <div className="space-y-2">
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Membership Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Plano de Adesão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Plano</Label>
              <select 
                id="plan" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                defaultValue={athlete?.plan}
              >
                <option value="">Selecionar plano...</option>
                <option value="Básico">Básico - €35/mês</option>
                <option value="Premium">Premium - €55/mês</option>
                <option value="Elite">Elite - €89/mês</option>
                <option value="Estudante">Estudante - €25/mês</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trainer">Personal Trainer</Label>
              <select 
                id="trainer" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                defaultValue={athlete?.trainer}
              >
                <option value="">Sem personal trainer</option>
                <option value="Carlos Silva">Carlos Silva</option>
                <option value="Ana Costa">Ana Costa</option>
                <option value="Pedro Santos">Pedro Santos</option>
              </select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas Adicionais</Label>
          <Textarea 
            id="notes" 
            defaultValue={athlete?.notes}
            placeholder="Informações adicionais, observações, etc..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            {athlete ? 'Atualizar' : 'Guardar'} Atleta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
