
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2,
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const RecentBoxes: React.FC = () => {
  const recentBoxes = [
    {
      id: 1,
      name: 'CrossFit Benfica',
      owner: 'João Silva',
      location: 'Lisboa, Portugal',
      students: 156,
      registeredAt: '2024-01-10T14:30:00',
      status: 'active',
      plan: 'Premium'
    },
    {
      id: 2,
      name: 'Functional Gym Porto',
      owner: 'Maria Santos',
      location: 'Porto, Portugal',
      students: 89,
      registeredAt: '2024-01-08T09:15:00',
      status: 'pending',
      plan: 'Basic'
    },
    {
      id: 3,
      name: 'Elite CrossFit',
      owner: 'Pedro Costa',
      location: 'Coimbra, Portugal',
      students: 234,
      registeredAt: '2024-01-05T16:45:00',
      status: 'active',
      plan: 'Enterprise'
    },
    {
      id: 4,
      name: 'Strength & Conditioning',
      owner: 'Ana Ferreira',
      location: 'Braga, Portugal',
      students: 67,
      registeredAt: '2024-01-03T11:20:00',
      status: 'suspended',
      plan: 'Basic'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            BOX Recentes
          </div>
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {recentBoxes.map((box) => (
            <div key={box.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{box.name}</h4>
                    {getStatusBadge(box.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Proprietário: {box.owner}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{box.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{box.students} alunos</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Registado em {format(parseISO(box.registeredAt), 'dd/MM/yyyy', { locale: pt })}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {box.plan}
                    </Badge>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Suspender
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
