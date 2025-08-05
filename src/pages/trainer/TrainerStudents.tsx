
import React, { useState } from 'react';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  Calendar,
  FileText,
  BookOpen,
  MessageCircle,
  Eye,
  Plus
} from 'lucide-react';

export const TrainerStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Mock data - will come from API/Supabase
  const students = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '+351 912 345 678',
      joinDate: '2023-06-15',
      lastClass: '2024-01-15',
      totalClasses: 48,
      workoutPlan: 'Força & Condicionamento',
      nutritionPlan: 'Perda de Peso',
      progress: 85,
      status: 'active',
      nextClass: '2024-01-16 09:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      goals: ['Perder 5kg', 'Aumentar força', 'Melhorar resistência'],
      notes: 'Aluna muito dedicada, progresso excelente.'
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '+351 913 456 789',
      joinDate: '2023-08-20',
      lastClass: '2024-01-14',
      totalClasses: 32,
      workoutPlan: 'Hipertrofia',
      nutritionPlan: 'Ganho de Massa',
      progress: 72,
      status: 'active',
      nextClass: '2024-01-17 11:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      goals: ['Ganhar massa muscular', 'Melhorar técnica'],
      notes: 'Precisa de mais foco na dieta.'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '+351 914 567 890',
      joinDate: '2023-04-10',
      lastClass: '2024-01-15',
      totalClasses: 65,
      workoutPlan: 'Funcional',
      nutritionPlan: 'Manutenção',
      progress: 93,
      status: 'active',
      nextClass: '2024-01-16 15:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      goals: ['Manter forma física', 'Flexibilidade'],
      notes: 'Aluna experiente, excelente dedicação.'
    }
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      pending: { label: 'Pendente', variant: 'outline' as const }
    };
    return config[status as keyof typeof config] || config.active;
  };

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Meus Alunos
                </h1>
                <p className="text-muted-foreground">
                  Gerir alunos, planos e acompanhar progressos
                </p>
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Aluno
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Alunos</p>
                      <p className="text-2xl font-bold">{students.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Progresso Médio</p>
                      <p className="text-2xl font-bold">83%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Aulas Esta Semana</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Planos Ativos</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar alunos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {filteredStudents.map((student) => {
                        const statusBadge = getStatusBadge(student.status);
                        
                        return (
                          <div 
                            key={student.id} 
                            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback className="bg-green-100 text-green-600">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-foreground truncate">
                                    {student.name}
                                  </h3>
                                  <Badge variant={statusBadge.variant}>
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Próxima aula: {student.nextClass}</p>
                                  <p>Total de aulas: {student.totalClasses}</p>
                                  <div className="flex items-center space-x-2">
                                    <span>Progresso:</span>
                                    <div className="w-20 bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-green-600 h-2 rounded-full" 
                                        style={{ width: `${student.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium">{student.progress}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Details Panel */}
              <div className="lg:col-span-1">
                {selectedStudent ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes do Aluno</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                          <AvatarFallback>
                            {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedStudent.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Planos Atuais</h4>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Treino:</span>
                              <Badge variant="outline">{selectedStudent.workoutPlan}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Nutrição:</span>
                              <Badge variant="outline">{selectedStudent.nutritionPlan}</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Objetivos</h4>
                          <div className="mt-2 space-y-1">
                            {selectedStudent.goals.map((goal: string, index: number) => (
                              <div key={index} className="text-sm bg-muted p-2 rounded">
                                {goal}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Notas</h4>
                          <p className="text-sm bg-muted p-3 rounded mt-2">
                            {selectedStudent.notes}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Atualizar Plano Treino
                        </Button>
                        <Button variant="outline" className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Plano Nutricional
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Selecione um aluno para ver os detalhes
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
