import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingUp, Search, CheckCircle, XCircle, Trash2, Shield } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useCompanies } from '@/hooks/useCompanies';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

export const CompanyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const [rejectCompanyId, setRejectCompanyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { companies, isLoading, approveCompany, rejectCompany, deleteCompany } = useCompanies();

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (companyId: string) => {
    approveCompany(companyId);
  };

  const handleReject = () => {
    if (rejectCompanyId && rejectionReason.trim()) {
      rejectCompany({ companyId: rejectCompanyId, reason: rejectionReason });
      setRejectCompanyId(null);
      setRejectionReason('');
    }
  };

  const handleDelete = () => {
    if (deleteCompanyId) {
      deleteCompany(deleteCompanyId);
      setDeleteCompanyId(null);
    }
  };

  const getStatusBadge = (company: any) => {
    if (company.is_approved === false) {
      return <Badge variant="destructive">Rejeitada</Badge>;
    }
    if (company.is_approved === null || company.is_approved === false) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Pendente</Badge>;
    }
    if (company.subscription_status === 'active') {
      return <Badge className="bg-cagio-green text-white">Ativa</Badge>;
    }
    return <Badge variant="secondary">Inativa</Badge>;
  };

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Hero Header */}
              <div className="bg-gradient-to-r from-cagio-green to-cagio-green-dark rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">Gestão de Empresas</h1>
                </div>
                <p className="text-white/90 mt-2">
                  Gerencie todas as empresas (boxes) registradas na plataforma CagioTech
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white/70 text-sm">Total</p>
                    <p className="text-2xl font-bold">{companies?.length || 0}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white/70 text-sm">Ativas</p>
                    <p className="text-2xl font-bold">
                      {companies?.filter(c => c.subscription_status === 'active').length || 0}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white/70 text-sm">Pendentes</p>
                    <p className="text-2xl font-bold">
                      {companies?.filter(c => c.is_approved === null || c.is_approved === false).length || 0}
                    </p>
                  </div>
                </div>
              </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empresas..."
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
              ) : filteredCompanies?.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Nenhuma empresa encontrada</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCompanies?.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow border-cagio-green/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="w-14 h-14 rounded-lg object-cover ring-2 ring-cagio-green/20" />
                          ) : (
                            <div className="w-14 h-14 bg-cagio-green/10 rounded-lg flex items-center justify-center">
                              <Building2 className="w-7 h-7 text-cagio-green" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-xl">{company.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {company.email || 'Sem email'}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                              {getStatusBadge(company)}
                              <Badge variant="outline" className="text-xs">
                                {company.business_type || 'CrossFit'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-cagio-green/5 rounded-lg border border-cagio-green/10">
                          <Users className="h-5 w-5 text-cagio-green" />
                          <div>
                            <p className="text-xl font-bold text-foreground">{company.athletes?.[0]?.count || 0}</p>
                            <p className="text-xs text-muted-foreground">Atletas</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-cagio-green/5 rounded-lg border border-cagio-green/10">
                          <TrendingUp className="h-5 w-5 text-cagio-green" />
                          <div>
                            <p className="text-xl font-bold text-foreground">{company.capacity || 0}</p>
                            <p className="text-xs text-muted-foreground">Capacidade</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-cagio-green/5 rounded-lg border border-cagio-green/10">
                          <Building2 className="h-5 w-5 text-cagio-green" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{company.city || '-'}</p>
                            <p className="text-xs text-muted-foreground">Cidade</p>
                          </div>
                        </div>
                      </div>

                      {company.rejection_reason && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm font-medium text-destructive">Motivo da rejeição:</p>
                          <p className="text-sm text-muted-foreground mt-1">{company.rejection_reason}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {(company.is_approved === null || company.is_approved === false) && !company.rejection_reason && (
                          <>
                            <Button 
                              size="sm"
                              className="bg-cagio-green hover:bg-cagio-green-dark text-white"
                              onClick={() => handleApprove(company.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => setRejectCompanyId(company.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteCompanyId(company.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteCompanyId} onOpenChange={() => setDeleteCompanyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente a empresa e todos os seus dados associados (atletas, treinos, pagamentos, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover Empresa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectCompanyId} onOpenChange={() => setRejectCompanyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, forneça um motivo para a rejeição desta empresa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              placeholder="Digite o motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Rejeitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </AdminAuthGuard>
  );
};
