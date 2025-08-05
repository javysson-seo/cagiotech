
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2,
  Star,
  Users,
  Euro,
  TrendingUp,
  MapPin,
  Eye
} from 'lucide-react';

interface TopBoxesProps {
  dateRange: string;
}

export const TopBoxes: React.FC<TopBoxesProps> = ({ dateRange }) => {
  const topBoxes = [
    {
      id: 1,
      name: 'Elite CrossFit',
      owner: 'Pedro Costa',
      location: 'Coimbra, Portugal',
      revenue: 15600,
      students: 234,
      rating: 4.9,
      growth: 18.5,
      plan: 'Enterprise',
      status: 'active'
    },
    {
      id: 2,
      name: 'CrossFit Benfica',
      owner: 'João Silva',
      location: 'Lisboa, Portugal',
      revenue: 12400,
      students: 198,
      rating: 4.8,
      growth: 15.2,
      plan: 'Premium',
      status: 'active'
    },
    {
      id: 3,
      name: 'Functional Gym Porto',
      owner: 'Maria Santos',
      location: 'Porto, Portugal',
      revenue: 9800,
      students: 156,
      rating: 4.7,
      growth: 12.8,
      plan: 'Premium',
      status: 'active'
    },
    {
      id: 4,
      name: 'Strong Athletes',
      owner: 'Carlos Ferreira',
      location: 'Braga, Portugal',
      revenue: 8200,
      students: 134,
      rating: 4.6,
      growth: 9.4,
      plan: 'Basic',
      status: 'active'
    },
    {
      id: 5,
      name: 'Iron Box Gym',
      owner: 'Ana Rodrigues',
      location: 'Aveiro, Portugal',
      revenue: 7500,
      students: 118,
      rating: 4.5,
      growth: 7.2,
      plan: 'Basic',
      status: 'active'
    }
  ];

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      case 'Premium':
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>;
      case 'Basic':
        return <Badge variant="outline">Basic</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Top Performing BOX
          </div>
          <Badge className="bg-green-100 text-green-800">
            {dateRange === '7' ? 'Últimos 7 dias' : 
             dateRange === '30' ? 'Últimos 30 dias' : 
             dateRange === '90' ? 'Últimos 3 meses' : 'Último ano'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {topBoxes.map((box, index) => (
            <div 
              key={box.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Ranking */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* BOX Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{box.name}</h4>
                    {getPlanBadge(box.plan)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>por {box.owner}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{box.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      €{box.revenue.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Receita</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">{box.students}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Alunos</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-600">{box.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-600">+{box.growth}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Crescimento</p>
                </div>

                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="outline" className="w-full">
            Ver Relatório Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
