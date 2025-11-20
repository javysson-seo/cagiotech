import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePlatformSuggestions } from '@/hooks/usePlatformSuggestions';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export const SuggestionsReview = () => {
  const { suggestions, isLoading, updateSuggestionStatus, refetch } =
    usePlatformSuggestions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredSuggestions =
    filter === 'all'
      ? suggestions
      : suggestions?.filter((s) => s.status === filter);

  const handleUpdateStatus = () => {
    if (selectedSuggestion && newStatus) {
      updateSuggestionStatus({
        id: selectedSuggestion.id,
        status: newStatus,
        admin_notes: adminNotes,
        is_public: makePublic,
      });
      setDialogOpen(false);
      setAdminNotes('');
      setNewStatus('');
      setMakePublic(false);
      setSelectedSuggestion(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      reviewing: { variant: 'default', icon: Eye },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle },
      implemented: { variant: 'default', icon: CheckCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={
          status === 'approved' || status === 'implemented'
            ? 'bg-cagio-green text-white'
            : ''
        }
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card className="border-cagio-green/20">
        <CardHeader className="bg-cagio-green-muted">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cagio-green-dark flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Sugestões das Empresas
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px] border-cagio-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="reviewing">Em Revisão</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="rejected">Rejeitadas</SelectItem>
                  <SelectItem value="implemented">Implementadas</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="border-cagio-green text-cagio-green hover:bg-cagio-green hover:text-white"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">A carregar...</p>
          ) : !filteredSuggestions || filteredSuggestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma sugestão encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion: any) => (
                <div
                  key={suggestion.id}
                  className="p-4 border border-border rounded-lg hover:border-cagio-green/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {suggestion.title}
                        </h4>
                        {getStatusBadge(suggestion.status)}
                        {suggestion.is_public && (
                          <Badge variant="outline" className="border-cagio-green">
                            <Eye className="h-3 w-3 mr-1" />
                            Pública
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Empresa: {suggestion.company?.name}</span>
                        <span>Categoria: {suggestion.category}</span>
                        <span>Prioridade: {suggestion.priority}</span>
                        <span>Votos: {suggestion.votes}</span>
                      </div>
                      {suggestion.admin_notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <strong>Notas Admin:</strong> {suggestion.admin_notes}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cagio-green text-cagio-green hover:bg-cagio-green hover:text-white ml-4"
                      onClick={() => {
                        setSelectedSuggestion(suggestion);
                        setNewStatus(suggestion.status);
                        setAdminNotes(suggestion.admin_notes || '');
                        setMakePublic(suggestion.is_public || false);
                        setDialogOpen(true);
                      }}
                    >
                      Gerir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Gerir Sugestão</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSuggestion?.title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Estado</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="reviewing">Em Revisão</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="implemented">Implementada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notas do Administrador</Label>
              <Textarea
                placeholder="Adicione notas sobre esta sugestão..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={makePublic}
                onCheckedChange={setMakePublic}
              />
              <Label htmlFor="public">
                Tornar pública (visível para todas as empresas)
              </Label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              className="bg-cagio-green hover:bg-cagio-green-dark"
            >
              Atualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};