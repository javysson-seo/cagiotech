import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Search, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export const AllAthletesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: athletes, isLoading } = useQuery({
    queryKey: ['admin-all-athletes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athletes')
        .select(`
          *,
          company:companies(name, logo_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredAthletes = athletes?.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Ativo', variant: 'default' },
      inactive: { label: 'Inativo', variant: 'secondary' },
      suspended: { label: 'Suspenso', variant: 'destructive' },
    };
    const config = variants[status] || variants.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Todos os Atletas</h1>
                <p className="text-muted-foreground mt-2">
                  Visualize todos os atletas de todas as empresas
                </p>
              </div>
              <Card className="w-auto">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{athletes?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Total de Atletas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar atletas por nome, email ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Carregando...</p>
                  </CardContent>
                </Card>
              ) : filteredAthletes?.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Nenhum atleta encontrado</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAthletes?.map((athlete) => (
                  <Card key={athlete.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {athlete.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">{athlete.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <CardDescription>
                                {athlete.company?.name || 'Sem empresa'}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(athlete.status || 'active')}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{athlete.email || '-'}</p>
                            <p className="text-xs text-muted-foreground">Email</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{athlete.phone || '-'}</p>
                            <p className="text-xs text-muted-foreground">Telefone</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {athlete.created_at ? format(new Date(athlete.created_at), 'dd/MM/yyyy', { locale: pt }) : '-'}
                            </p>
                            <p className="text-xs text-muted-foreground">Registro</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
