import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCompanies } from '@/hooks/useCompanies';
import { CheckCircle, XCircle, Building2, Mail, Calendar, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const CompanyApprovalQueue = () => {
  const { companies, isLoading, approveCompany, rejectCompany, refetch } = useCompanies();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingCompanies = companies?.filter((c) => !c.is_approved) || [];

  const handleReject = () => {
    if (selectedCompany && rejectionReason) {
      rejectCompany({ companyId: selectedCompany, reason: rejectionReason });
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedCompany(null);
    }
  };

  return (
    <>
      <Card className="border-cagio-green/20">
        <CardHeader className="bg-cagio-green-muted">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cagio-green-dark flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas Pendentes de Aprovação
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="border-cagio-green text-cagio-green hover:bg-cagio-green hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">A carregar...</p>
          ) : pendingCompanies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma empresa pendente de aprovação
            </p>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-cagio-green/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-cagio-green-light rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-cagio-green" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-foreground">{company.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {company.email || 'Sem email'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(company.created_at || '').toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                      {company.rejection_reason && (
                        <Badge variant="destructive" className="mt-2">
                          Rejeitada: {company.rejection_reason}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-cagio-green hover:bg-cagio-green-dark text-white"
                      onClick={() => approveCompany(company.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedCompany(company.id);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, forneça um motivo para a rejeição desta empresa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Motivo da rejeição..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Rejeitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};