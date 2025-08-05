
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
  Plus, 
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  MoreHorizontal,
  User,
  Activity
} from 'lucide-react';

export const TrainerStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Mock data - will come from API/Supabase
  const students = [
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '+351 912 345 678',
      avatar: null,
      membershipPlan: 'Premium',
      joinDate: '2024-01-15',
      lastWorkout: '2024-01-20',
      totalWorkouts: 45,
      progression: 'Excelente',
      goals: ['Perder peso', 'Ganhar força'],
      status: 'Ativo',
      nextSession: '2024-01-22 10:00'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      phone: '+351 913 456 789',
      avatar: null,
      membershipPlan: 'Standard',
      joinDate: '2023-12-10',
      lastWorkout: '2024-01-19',
      totalWorkouts: 32,
      progression: 'Bom',
      goals: ['Hipertrofia', 'Condicionamento'],
      status: 'Ativo',
      nextSession: '2024-01-22 15:00'
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '+351 914 567 890',
      avatar: null,
      membershipPlan: 'Premium',
      joinDate: '2024-01-08',
      lastWorkout: '2024-01-18',
      totalWorkouts: 28,
      progression: 'Médio',
      goals: ['Reabilitação', 'Mobilidade'],
      status: 'Pausa',
      nextSession: null
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Pausa': return 'bg-yellow-100 text-yellow-700';
      case 'Inativo': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressionColor = (progression: string) => {
    switch (progression) {
      case 'Excelente': return 'text-green-600';
      case 'Bom': return 'text-blue-600';
      case 'Médio': return 'text-yellow-600';
      case 'Precisa melhorar': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
                  Acompanhe o progresso e evolução dos seus alunos
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
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Alunos Ativos</p>
                      <p className="text-2xl font-bold">
                        {students.filter(s => s.status === 'Ativo').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Prog. Excelente</p>
                      <p className="text-2xl font-bold">
                        {students.filter(s => s.progression === 'Excelente').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Sessões Hoje</p>
                      <p className="text-2xl font-bold">
                        {students.filter(s => s.nextSession && s.nextSession.includes('2024-01-22')).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Pesquisar alunos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Students List */}
              <div className="lg:col-span-2">
                <div className="grid gap-4">
                  {filteredStudents.map((student) => (
                    <Card 
                      key={student.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{student.name}</h3>
                                <Badge className={getStatusColor(student.status)}>
                                  {student.status}
                                </Badge>
                              </div>
                              
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  <span>{student.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>{student.phone}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Treinos</p>
                                  <p className="font-medium">{student.totalWorkouts}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Plano</p>
                                  <p className="font-medium">{student.membershipPlan}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Progresso</p>
                                  <p className={`font-medium ${getProgressionColor(student.progression)}`}>
                                    {student.progression}
                                  </p>
                                </div>
                              </div>
                              
                              {student.nextSession && (
                                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    Próxima sessão: {new Date(student.nextSession).toLocaleString('pt-PT')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Student Details */}
              <div className="lg:col-span-1">
                {selectedStudent ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Detalhes do Aluno</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarImage src={selectedStudent.avatar} />
                          <AvatarFallback className="text-lg">
                            {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Membro desde {new Date(selectedStudent.joinDate).toLocaleDateString('pt-PT')}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Objetivos</h4>
                          <div className="space-y-1">
                            {selectedStudent.goals.map((goal, index) => (
                              <Badge key={index} variant="outline" className="mr-1">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Estatísticas</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total de treinos:</span>
                              <span className="font-medium">{selectedStudent.totalWorkouts}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Último treino:</span>
                              <span className="font-medium">
                                {new Date(selectedStudent.lastWorkout).toLocaleDateString('pt-PT')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Progresso:</span>
                              <span className={`font-medium ${getProgressionColor(selectedStudent.progression)}`}>
                                {selectedStudent.progression}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar Sessão
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </Button>
                        <Button variant="outline" className="w-full">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Ver Progresso
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Selecione um aluno</h3>
                      <p className="text-muted-foreground">
                        Clique num aluno da lista para ver os detalhes e opções.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {filteredStudents.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum aluno encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não foram encontrados alunos com os critérios de pesquisa.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Aluno
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
