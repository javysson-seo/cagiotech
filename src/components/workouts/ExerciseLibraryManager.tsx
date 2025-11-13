import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Dumbbell, Filter } from 'lucide-react';
import { useExerciseLibrary } from '@/hooks/useExerciseLibrary';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const ExerciseLibraryManager: React.FC = () => {
  const { currentCompany } = useCompany();
  const { exercises, isLoading, createExercise, updateExercise, deleteExercise } = useExerciseLibrary(currentCompany?.id);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as 'bodybuilding' | 'crossfit' | 'other',
    muscle_group: '',
    description: '',
    video_url: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      muscle_group: '',
      description: '',
      video_url: '',
    });
    setEditingExercise(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do exercício é obrigatório');
      return;
    }

    if (!formData.muscle_group.trim()) {
      toast.error('Grupo muscular é obrigatório');
      return;
    }

    if (!currentCompany) {
      toast.error('Empresa não identificada');
      return;
    }

    if (editingExercise) {
      updateExercise.mutate({
        id: editingExercise.id,
        ...formData,
      }, {
        onSuccess: () => {
          setShowAddDialog(false);
          resetForm();
        },
      });
    } else {
      createExercise.mutate({
        ...formData,
        company_id: currentCompany.id,
      }, {
        onSuccess: () => {
          setShowAddDialog(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (exercise: any) => {
    setFormData({
      name: exercise.name,
      category: exercise.category,
      muscle_group: exercise.muscle_group,
      description: exercise.description || '',
      video_url: exercise.video_url || '',
    });
    setEditingExercise(exercise);
    setShowAddDialog(true);
  };

  const handleDelete = (id: string) => {
    deleteExercise.mutate(id, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  // Filter exercises
  const customExercises = exercises.filter(e => !e.is_default && e.company_id === currentCompany?.id);
  const filteredExercises = customExercises.filter(exercise => {
    const categoryMatch = filterCategory === 'all' || exercise.category === filterCategory;
    const muscleGroupMatch = filterMuscleGroup === 'all' || exercise.muscle_group === filterMuscleGroup;
    const searchMatch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && muscleGroupMatch && searchMatch;
  });

  const availableMuscleGroups = Array.from(new Set(customExercises.map(e => e.muscle_group)));

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'bodybuilding': return 'bg-blue-500';
      case 'crossfit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            Biblioteca de Exercícios Personalizada
          </h2>
          <p className="text-muted-foreground">
            Gerencie exercícios personalizados da sua empresa
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Exercício
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Buscar</Label>
            <Input
              placeholder="Nome do exercício..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="bodybuilding">Musculação</SelectItem>
                <SelectItem value="crossfit">CrossFit</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grupo Muscular</Label>
            <Select value={filterMuscleGroup} onValueChange={setFilterMuscleGroup}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableMuscleGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {customExercises.length === 0 
                ? 'Nenhum exercício personalizado cadastrado. Adicione o primeiro!'
                : 'Nenhum exercício encontrado com os filtros aplicados.'}
            </p>
          </Card>
        ) : (
          filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.muscle_group}</p>
                </div>
                <Badge className={getCategoryBadgeColor(exercise.category)}>
                  {exercise.category === 'bodybuilding' && 'Musculação'}
                  {exercise.category === 'crossfit' && 'CrossFit'}
                  {exercise.category === 'other' && 'Outros'}
                </Badge>
              </div>

              {exercise.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exercise.description}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(exercise)}
                  className="flex-1"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmId(exercise.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? 'Editar Exercício' : 'Adicionar Exercício'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Exercício *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Agachamento com barra"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodybuilding">Musculação</SelectItem>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Grupo Muscular *</Label>
                <Input
                  value={formData.muscle_group}
                  onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                  placeholder="Ex: Pernas"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição técnica do exercício..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>URL do Vídeo</Label>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingExercise ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};