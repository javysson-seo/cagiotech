
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, Building2, Euro, TrendingUp, MoreHorizontal, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Header } from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface BoxData {
  id: string;
  name: string;
  location: string;
  members: number;
  monthlyRevenue: number;
  plan: string;
  status: 'active' | 'trial' | 'inactive';
  joinDate: string;
}

export const CagioAdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mockBoxes: BoxData[] = [
    {
      id: 'box_1',
      name: 'CrossFit Porto',
      location: 'Porto, Portugal',
      members: 145,
      monthlyRevenue: 8750,
      plan: 'Professional',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 'box_2', 
      name: 'Iron Temple Lisboa',
      location: 'Lisboa, Portugal',
      members: 230,
      monthlyRevenue: 14500,
      plan: 'Enterprise',
      status: 'active',
      joinDate: '2023-11-20'
    },
    {
      id: 'box_3',
      name: 'Functional Braga',
      location: 'Braga, Portugal',
      members: 78,
      monthlyRevenue: 4680,
      plan: 'Starter',
      status: 'trial',
      joinDate: '2024-03-10'
    },
    {
      id: 'box_4',
      name: 'Elite Performance',
      location: 'Coimbra, Portugal',
      members: 95,
      monthlyRevenue: 5700,
      plan: 'Professional',
      status: 'active',
      joinDate: '2024-02-05'
    }
  ];

  const totalBoxes = mockBoxes.length;
  const totalMembers = mockBoxes.reduce((sum, box) => sum + box.members, 0);
  const totalRevenue = mockBoxes.reduce((sum, box) => sum + box.monthlyRevenue, 0);
  const activeTrainers = 45; // Mock data

  const getStatusColor = (status: BoxData['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'trial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: BoxData['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'trial': return 'Trial';
      case 'inactive': return 'Inativo';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-muted-foreground text-lg">
                Painel de controlo super-administrador
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/onboarding')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.addNewBox')}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalBoxes')}
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBoxes}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> {t('dashboard.growth')} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalStudents')}
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> {t('dashboard.growth')} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.monthlyRevenue')}
              </CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> {t('dashboard.growth')} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.activeTrainers')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTrainers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5</span> novos este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* BOX List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('dashboard.recentBoxes')}</CardTitle>
                <CardDescription>
                  Gestão de todas as BOX na plataforma
                </CardDescription>
              </div>
              <Button variant="outline">
                {t('dashboard.viewAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {mockBoxes.map((box) => (
                <div
                  key={box.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{box.name}</h3>
                        <Badge className={getStatusColor(box.status)}>
                          {getStatusText(box.status)}
                        </Badge>
                        <Badge variant="outline">{box.plan}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {box.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Desde {new Date(box.joinDate).toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8 text-right">
                    <div>
                      <div className="text-sm font-medium">{box.members} membros</div>
                      <div className="text-xs text-muted-foreground">Atletas</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">€{box.monthlyRevenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Receita/mês</div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Aceder como BOX</DropdownMenuItem>
                        <DropdownMenuItem>Configurações</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Suspender BOX
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
