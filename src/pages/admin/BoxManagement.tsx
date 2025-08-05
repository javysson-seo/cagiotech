
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Star,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

export const BoxManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Mock data - em produção virá da API/Supabase
  const boxes = [
    {
      id: 1,
      name: 'CrossFit Benfica',
      owner: 'João Silva',
      email: 'joao@crossfitbenfica.com',
      location: 'Lisboa, Portugal',
      students: 156,
      trainers: 8,
      registeredAt: '2024-01-10',
      status: 'active',
      plan: 'Premium',
      rating: 4.8,
      monthlyRevenue: 8500
    },
    {
      id: 2,
      name: 'Functional Gym Porto',
      owner: 'Maria Santos',
      email: 'maria@functionalgym.pt',
      location: 'Porto, Portugal',
      students: 89,
      trainers: 4,
      registeredAt: '2024-01-08',
      status: 'pending',
      plan: 'Basic',
      rating: 4.5,
      monthlyRevenue: 3200
    },
    {
      id: 3,
      name: 'Elite CrossFit',
      owner: 'Pedro Costa',
      email: 'pedro@elitecrossfit.com',
      location: 'Coimbra, Portugal',
      students: 234,
      trainers: 12,
      registeredAt: '2024-01-05',
      status: 'active',
      plan: 'Enterprise',
      rating: 4.9,
      monthlyRevenue: 15600
    },
    {
      id: 4,
      name: 'Strength & Conditioning',
      owner: 'Ana Ferreira',
      email: 'ana@strengthconditioning.pt',
      location: 'Braga, Portugal',
      students: 67,
      trainers: 3,
      registeredAt: '2024-01-03',
      status: 'suspended',
      plan: 'Basic',
      rating: 4.2,
      monthlyRevenue: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Basic':
        return <Badge variant="outline">Basic</Badge>;
      case 'Premium':
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>;
      case 'Enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  const handleApproveBox = (boxId: number) => {
    toast.success('BOX aprovada com sucesso!');
  };

  const handleRejectBox = (boxId: number) => {
    toast.error('BOX rejeitada');
  };

  const handleSuspendBox = (boxId: number) => {
    toast.warning('BOX suspensa');
  };

  const filteredBoxes = boxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || box.status === statusFilter;
    const matchesPlan = planFilter === 'all' || box.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestão de BOX</h1>
                <p className="text-muted-foreground mt-1">
                  Gerir todas as BOX registadas na plataforma
                </p>
              </div>
              
              <Button onClick={() => navigate('/admin/box/onboarding')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova BOX
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Procurar por nome ou proprietário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Estados</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="suspended">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Planos</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* BOX Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoxes.map((box) => (
                <Card key={box.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{box.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          por {box.owner}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(box.status)}
                        {getPlanBadge(box.plan)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{box.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{box.students} alunos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{box.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Receita Mensal:</p>
                      <p className="text-green-600">€{box.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/box/${box.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      
                      {box.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveBox(box.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectBox(box.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                      
                      {box.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendBox(box.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Suspender
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBoxes.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma BOX encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou adicionar uma nova BOX.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
