
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export const ModalityManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingModality, setEditingModality] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    duration: 60,
    maxCapacity: 20,
    price: 15,
    equipment: '',
    level: 'all'
  });

  // Mock data
  const [modalities, setModalities] = useState([
    {
      id: 1,
      name: 'CrossFit',
      description: 'Treino funcional de alta intensidade',
      color: '#3B82F6',
      duration: 60,
      maxCapacity: 20,
      price: 15,
      equipment: 'Barras, kettlebells, caixas',
      level: 'all',
      activeClasses: 24,
      totalStudents: 156
    },
    {
      id: 2,
      name: 'Yoga',
      description: 'Práticas de yoga para flexibilidade e bem-estar',
      color: '#8B5CF6',
      duration: 75,
      maxCapacity: 15,
      price: 12,
      equipment: 'Tapetes de yoga, blocos',
      level: 'all',
      activeClasses: 18,
      totalStudents: 89
    },
    {
      id: 3,
      name: 'HIIT',
      description: 'Treino intervalado de alta intensidade',
      color: '#EF4444',
      duration: 45,
      maxCapacity: 25,
      price: 18,
      equipment: 'Pesos livres, corda',
      level: 'intermediate',
      activeClasses: 12,
      totalStudents: 78
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Nome da modalidade é obrigatório');
      return;
    }

    if (editingModality) {
      setModalities(prev => prev.map(mod => 
        mod.id === editingModality.id 
          ? { ...mod, ...formData }
          : mod
      ));
      toast.success('Modalidade atualizada!');
    } else {
      const newModality = {
        id: Date.now(),
        ...formData,
        activeClasses: 0,
        totalStudents: 0
      };
      setModalities(prev => [...prev, newModality]);
      toast.success('Modalidade criada!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      duration: 60,
      maxCapacity: 20,
      price: 15,
      equipment: '',
      level: 'all'
    });
    setEditingModality(null);
    setShowForm(false);
  };

  const handleEdit = (modality: any) => {
    setFormData({
      name: modality.name,
      description: modality.description,
      color: modality.color,
      duration: modality.duration,
      maxCapacity: modality.maxCapacity,
      price: modality.price,
      equipment: modality.equipment,
      level: modality.level
    });
    setEditingModality(modality);
    setShowForm(true);
  };

  const handleDelete = (modalityId: number) => {
    setModalities(prev => prev.filter(mod => mod.id !== modalityId));
    toast.success('Modalidade removida!');
  };

  const getLevelBadge = (level: string) => {
    const config = {
      beginner: { label: 'Iniciante', color: 'bg-green-100 text-green-800' },
      intermediate: { label: 'Intermédio', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: 'Avançado', color: 'bg-red-100 text-red-800' },
      all: { label: 'Todos', color: 'bg-blue-100 text-blue-800' }
    };
    return config[level as keyof typeof config] || config.all;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Modalidades</h2>
          <p className="text-muted-foreground">
            Gerir tipos de aulas e atividades da BOX
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Modalidade
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modalidades List */}
        <div className="lg:col-span-2 space-y-4">
          {modalities.map((modality) => {
            const levelBadge = getLevelBadge(modality.level);
            
            return (
              <Card key={modality.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full mt-1"
                        style={{ backgroundColor: modality.color }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {modality.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {modality.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(modality)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(modality.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Duração</p>
                      <p className="font-medium">{modality.duration} min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacidade</p>
                      <p className="font-medium">{modality.maxCapacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preço</p>
                      <p className="font-medium text-green-600">€{modality.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nível</p>
                      <Badge className={levelBadge.color}>
                        {levelBadge.label}
                      </Badge>
                    </div>
                  </div>

                  {modality.equipment && (
                    <div className="mb-4">
                      <p className="text-muted-foreground text-sm">Equipamento:</p>
                      <p className="text-sm">{modality.equipment}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Aulas ativas: </span>
                      <span className="font-medium">{modality.activeClasses}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total alunos: </span>
                      <span className="font-medium">{modality.totalStudents}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {modalities.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ainda não há modalidades criadas.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Modalidade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-1">
          {showForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editingModality ? 'Editar Modalidade' : 'Nova Modalidade'}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da modalidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Breve descrição da modalidade"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duração (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        placeholder="60"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxCapacity">Capacidade</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      placeholder="15.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Nível</Label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="all">Todos os Níveis</option>
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermédio</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipamento</Label>
                    <Input
                      id="equipment"
                      value={formData.equipment}
                      onChange={(e) => handleInputChange('equipment', e.target.value)}
                      placeholder="Equipamento necessário"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingModality ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Modalidades</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Selecione uma modalidade para editar ou crie uma nova.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Modalidade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
