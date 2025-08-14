
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Clock,
  Users,
  Euro,
  Target,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';

export const ModalitiesSettings: React.FC = () => {
  const [modalities, setModalities] = useState([
    {
      id: '1',
      name: 'CrossFit',
      description: 'Treino funcional de alta intensidade',
      duration: 60,
      maxCapacity: 12,
      dropInPrice: 15,
      difficultyLevel: 'intermediate',
      color: '#ef4444',
      equipment: ['Barras', 'Kettlebells', 'Boxes'],
      active: true
    },
    {
      id: '2',
      name: 'Functional Training',
      description: 'Movimento funcional para o dia a dia',
      duration: 45,
      maxCapacity: 15,
      dropInPrice: 12,
      difficultyLevel: 'beginner',
      color: '#10b981',
      equipment: ['TRX', 'Medicine Ball', 'Cordas'],
      active: true
    },
    {
      id: '3',
      name: 'HIIT',
      description: 'Treino intervalado de alta intensidade',
      duration: 30,
      maxCapacity: 20,
      dropInPrice: 10,
      difficultyLevel: 'intermediate',
      color: '#f59e0b',
      equipment: ['Kettlebells', 'Battle Ropes', 'Pesos Livres'],
      active: true
    }
  ]);

  const [bookingRules, setBookingRules] = useState({
    minAdvanceBooking: 1, // horas
    maxAdvanceBooking: 7, // dias
    cancellationDeadline: 2, // horas
    maxSimultaneousBookings: 3,
    waitlistEnabled: true,
    confirmationRequired: false,
    noShowPolicy: 'strict'
  });

  const [creditRules, setCreditRules] = useState({
    creditForCancellation: true,
    creditLossForNoShow: true,
    freezeAllowed: true,
    maxFreezeDays: 30,
    reactivationFee: 0
  });

  const [newModality, setNewModality] = useState({
    name: '',
    description: '',
    duration: 60,
    maxCapacity: 15,
    dropInPrice: 12,
    difficultyLevel: 'beginner',
    color: '#3b82f6',
    equipment: [] as string[],
    active: true
  });

  const [showNewModality, setShowNewModality] = useState(false);
  const [newEquipment, setNewEquipment] = useState('');

  const difficultyLevels = [
    { value: 'beginner', label: 'Iniciante', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediário', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Avançado', color: 'bg-red-100 text-red-800' }
  ];

  const predefinedModalities = [
    'CrossFit', 'Functional Training', 'HIIT', 'Yoga', 'Pilates', 
    'Boxing', 'Spinning', 'Personal Training', 'Mobility', 'Strength'
  ];

  const addNewModality = () => {
    if (!newModality.name) {
      toast.error('Nome da modalidade é obrigatório');
      return;
    }

    const modality = {
      ...newModality,
      id: String(modalities.length + 1)
    };

    setModalities([...modalities, modality]);
    setNewModality({
      name: '',
      description: '',
      duration: 60,
      maxCapacity: 15,
      dropInPrice: 12,
      difficultyLevel: 'beginner',
      color: '#3b82f6',
      equipment: [],
      active: true
    });
    setShowNewModality(false);
    toast.success('Nova modalidade adicionada!');
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setNewModality({
        ...newModality,
        equipment: [...newModality.equipment, newEquipment.trim()]
      });
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    const updatedEquipment = newModality.equipment.filter((_, i) => i !== index);
    setNewModality({ ...newModality, equipment: updatedEquipment });
  };

  const toggleModalityStatus = (id: string) => {
    setModalities(modalities.map(mod => 
      mod.id === id ? { ...mod, active: !mod.active } : mod
    ));
    toast.success('Status da modalidade atualizado');
  };

  const handleSave = () => {
    toast.success('Configurações de modalidades salvas!');
    console.log('Salvando modalidades:', { modalities, bookingRules, creditRules });
  };

  const getDifficultyBadge = (level: string) => {
    const levelData = difficultyLevels.find(l => l.value === level);
    return levelData ? (
      <Badge className={levelData.color}>
        {levelData.label}
      </Badge>
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Dumbbell className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Modalidades & Aulas</h2>
      </div>

      {/* Lista de Modalidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Modalidades Disponíveis</span>
            <Button onClick={() => setShowNewModality(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Modalidade
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewModality && (
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <h4 className="font-medium">Criar Nova Modalidade</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Modalidade</Label>
                  <Select value={newModality.name} onValueChange={(value) => setNewModality({ ...newModality, name: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione ou digite" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedModalities.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duração (minutos)</Label>
                  <Select value={String(newModality.duration)} onValueChange={(value) => setNewModality({ ...newModality, duration: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Capacidade Máxima</Label>
                  <Input
                    type="number"
                    value={newModality.maxCapacity}
                    onChange={(e) => setNewModality({ ...newModality, maxCapacity: parseInt(e.target.value) })}
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <Label>Preço Aula Avulsa (EUR)</Label>
                  <Input
                    type="number"
                    value={newModality.dropInPrice}
                    onChange={(e) => setNewModality({ ...newModality, dropInPrice: parseFloat(e.target.value) })}
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label>Nível de Dificuldade</Label>
                  <Select value={newModality.difficultyLevel} onValueChange={(value) => setNewModality({ ...newModality, difficultyLevel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Cor no Calendário</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newModality.color}
                      onChange={(e) => setNewModality({ ...newModality, color: e.target.value })}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={newModality.color}
                      onChange={(e) => setNewModality({ ...newModality, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newModality.description}
                  onChange={(e) => setNewModality({ ...newModality, description: e.target.value })}
                  placeholder="Descreva esta modalidade..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Equipamentos Necessários</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Nome do equipamento"
                    onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                  />
                  <Button type="button" onClick={addEquipment}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newModality.equipment.map((equipment, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeEquipment(index)}>
                      {equipment} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={addNewModality}>Adicionar Modalidade</Button>
                <Button variant="outline" onClick={() => setShowNewModality(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {modalities.map((modality) => (
              <div key={modality.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: modality.color }}
                    ></div>
                    <div>
                      <h4 className="font-medium flex items-center space-x-2">
                        <span>{modality.name}</span>
                        {getDifficultyBadge(modality.difficultyLevel)}
                      </h4>
                      <p className="text-sm text-muted-foreground">{modality.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={modality.active}
                    onCheckedChange={() => toggleModalityStatus(modality.id)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{modality.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{modality.maxCapacity} pessoas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span>€{modality.dropInPrice}</span>
                  </div>
                </div>

                {modality.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {modality.equipment.map((equipment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regras de Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Regras de Agendamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Antecedência Mínima para Reservar</Label>
              <Select value={String(bookingRules.minAdvanceBooking)} onValueChange={(value) => setBookingRules({ ...bookingRules, minAdvanceBooking: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="12">12 horas</SelectItem>
                  <SelectItem value="24">24 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Antecedência Máxima para Reservar</Label>
              <Select value={String(bookingRules.maxAdvanceBooking)} onValueChange={(value) => setBookingRules({ ...bookingRules, maxAdvanceBooking: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prazo para Cancelar sem Penalização</Label>
              <Select value={String(bookingRules.cancellationDeadline)} onValueChange={(value) => setBookingRules({ ...bookingRules, cancellationDeadline: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="12">12 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Limite de Reservas Simultâneas</Label>
              <Input
                type="number"
                value={bookingRules.maxSimultaneousBookings}
                onChange={(e) => setBookingRules({ ...bookingRules, maxSimultaneousBookings: parseInt(e.target.value) })}
                min="1"
                max="10"
              />
            </div>

            <div>
              <Label>Política de No-Show</Label>
              <Select value={bookingRules.noShowPolicy} onValueChange={(value) => setBookingRules({ ...bookingRules, noShowPolicy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lenient">Flexível</SelectItem>
                  <SelectItem value="moderate">Moderada</SelectItem>
                  <SelectItem value="strict">Rigorosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Lista de Espera Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar lista de espera quando aula lotada
                </p>
              </div>
              <Switch
                checked={bookingRules.waitlistEnabled}
                onCheckedChange={(checked) => setBookingRules({ ...bookingRules, waitlistEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Confirmação Obrigatória</Label>
                <p className="text-sm text-muted-foreground">
                  Aluno deve confirmar presença
                </p>
              </div>
              <Switch
                checked={bookingRules.confirmationRequired}
                onCheckedChange={(checked) => setBookingRules({ ...bookingRules, confirmationRequired: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Créditos e Penalizações */}
      <Card>
        <CardHeader>
          <CardTitle>Créditos e Penalizações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Crédito por Cancelamento no Prazo</Label>
                <p className="text-sm text-muted-foreground">
                  Devolver crédito quando cancelar dentro do prazo
                </p>
              </div>
              <Switch
                checked={creditRules.creditForCancellation}
                onCheckedChange={(checked) => setCreditRules({ ...creditRules, creditForCancellation: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Perda de Crédito por No-Show</Label>
                <p className="text-sm text-muted-foreground">
                  Deduzir crédito quando não comparecer
                </p>
              </div>
              <Switch
                checked={creditRules.creditLossForNoShow}
                onCheckedChange={(checked) => setCreditRules({ ...creditRules, creditLossForNoShow: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir Congelamento de Plano</Label>
                <p className="text-sm text-muted-foreground">
                  Alunos podem pausar temporariamente
                </p>
              </div>
              <Switch
                checked={creditRules.freezeAllowed}
                onCheckedChange={(checked) => setCreditRules({ ...creditRules, freezeAllowed: checked })}
              />
            </div>

            <div>
              <Label>Máximo de Dias Congelados</Label>
              <Input
                type="number"
                value={creditRules.maxFreezeDays}
                onChange={(e) => setCreditRules({ ...creditRules, maxFreezeDays: parseInt(e.target.value) })}
                min="1"
                max="90"
                disabled={!creditRules.freezeAllowed}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Taxa de Reativação (EUR)</Label>
              <Input
                type="number"
                value={creditRules.reactivationFee}
                onChange={(e) => setCreditRules({ ...creditRules, reactivationFee: parseFloat(e.target.value) })}
                min="0"
                step="0.5"
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de Modalidades
      </Button>
    </div>
  );
};
