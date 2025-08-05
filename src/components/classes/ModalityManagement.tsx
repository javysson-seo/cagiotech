
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Euro,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export const ModalityManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedModality, setSelectedModality] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    duration: 60,
    maxCapacity: 20,
    price: 15,
    difficulty: 'Intermediário',
    category: 'Fitness',
    equipment: [],
    benefits: []
  });

  // Mock data - em produção virá da API/Supabase
  const modalities = [
    {
      id: 1,
      name: 'CrossFit',
      description: 'Treinamento funcional de alta intensidade que combina elementos de levantamento de peso olímpico, powerlifting, ginástica e condicionamento metabólico.',
      color: '#3B82F6',
      duration: 60,
      maxCapacity: 20,
      price: 15,
      difficulty: 'Intermediário',
      category: 'Fitness',
      activeClasses: 8,
      totalMembers: 45,
      weeklyRevenue: 540,
      equipment: ['Kettlebells', 'Barras', 'Boxes', 'Medicine Balls'],
      benefits: ['Força', 'Resistência', 'Flexibilidade', 'Coordenação'],
      trainers: ['Carlos Santos', 'Pedro Silva']
    },
    {
      id: 2,
      name: 'Yoga',
      description: 'Prática milenar que combina posturas físicas, técnicas de respiração e meditação para promover bem-estar físico e mental.',
      color: '#10B981',
      duration: 75,
      maxCapacity: 15,
      price: 12,
      difficulty: 'Iniciante',
      category: 'Bem-estar',
      activeClasses: 6,
      totalMembers: 32,
      weeklyRevenue: 384,
      equipment: ['Tapetes', 'Blocos', 'Straps', 'Almofadas'],
      benefits: ['Flexibilidade', 'Relaxamento', 'Equilíbrio', 'Consciência corporal'],
      trainers: ['Ana Costa']
    },
    {
      id: 3,
      name: 'Pilates',
      description: 'Método de exercício que enfatiza o uso da mente para controlar o corpo, focando na força do core, flexibilidade e consciência corporal.',
      color: '#8B5CF6',
      duration: 55,
      maxCapacity: 10,
      price: 20,
      difficulty: 'Intermediário',
      category: 'Reabilitação',
      activeClasses: 4,
      totalMembers: 28,
      weeklyRevenue: 560,
      equipment: ['Reformers', 'Cadillac', 'Barris', 'Bolas'],
      benefits: ['Core forte', 'Postura', 'Flexibilidade', 'Coordenação'],
      trainers: ['Ana Costa']
    },
    {
      id: 4,
      name: 'Functional Training',
      description: 'Treinamento baseado em movimentos funcionais que imitam atividades da vida diária, melhorando força, mobilidade e estabilidade.',
      color: '#F59E0B',
      duration: 45,
      maxCapacity: 12,
      price: 18,
      difficulty: 'Avançado',
      category: 'Fitness',
      activeClasses: 5,
      totalMembers: 24,
      weeklyRevenue: 432,
      equipment: ['TRX', 'Kettlebells', 'Cones', 'Medicine Balls'],
      benefits: ['Força funcional', 'Agilidade', 'Estabilidade', 'Coordenação'],
      trainers: ['Pedro Silva']
    }
  ];

  const categories = ['Fitness', 'Bem-estar', 'Reabilitação', 'Dança', 'Artes Marciais'];
  const difficultyLevels = ['Iniciante', 'Intermediário', 'Avançado'];

  const handleNewModality = () => {
    setSelectedModality(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      duration: 60,
      maxCapacity: 20,
      price: 15,
      difficulty: 'Intermediário',
      category: 'Fitness',
      equipment: [],
      benefits: []
    });
    setShowForm(true);
  };

  const handleEditModality = (modality: any) => {
    setSelectedModality(modality);
    setFormData(modality);
    setShowForm(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving modality:', formData);
    setShowForm(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-orange-100 text-orange-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedModality ? 'Editar Modalidade' : 'Nova Modalidade'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Modalidade *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: CrossFit"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição detalhada da modalidade..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duração Padrão (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min="15"
                  max="180"
                />
              </div>
              
              <div>
                <Label htmlFor="maxCapacity">Capacidade Máxima</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Preço Padrão (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="color">Cor da Modalidade</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {selectedModality ? 'Atualizar' : 'Criar'} Modalidade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Modalidades ({modalities.length})
        </h2>
        <Button onClick={handleNewModality} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Modalidade
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modalities.map((modality) => (
          <Card key={modality.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: modality.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{modality.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">
                      {modality.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditModality(modality)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {modality.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">{modality.activeClasses}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Aulas Ativas</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">{modality.totalMembers}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Membros</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Euro className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold">{modality.weeklyRevenue}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Receita/Sem</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Duração:
                  </span>
                  <span className="font-medium">{modality.duration} min</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Capacidade:
                  </span>
                  <span className="font-medium">{modality.maxCapacity} pessoas</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
                    Preço:
                  </span>
                  <span className="font-medium">€{modality.price}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    Dificuldade:
                  </span>
                  <Badge className={getDifficultyColor(modality.difficulty)}>
                    {modality.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Benefits */}
              {modality.benefits && modality.benefits.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Benefícios:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {modality.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trainers */}
              {modality.trainers && modality.trainers.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Trainers:</p>
                  <div className="flex flex-wrap gap-1">
                    {modality.trainers.map((trainer, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trainer}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
