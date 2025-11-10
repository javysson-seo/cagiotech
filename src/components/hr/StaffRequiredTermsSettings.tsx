import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Plus, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useStaffRequiredTerms } from '@/hooks/useStaffRequiredTerms';
import { Loading } from '@/components/ui/loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';

export const StaffRequiredTermsSettings: React.FC = () => {
  const { requiredTerms, loading, saveRequiredTerm, deleteRequiredTerm, refetch } = useStaffRequiredTerms();
  const { currentCompany } = useCompany();
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [isAddingTerm, setIsAddingTerm] = useState(false);

  React.useEffect(() => {
    loadAvailableDocuments();
  }, [currentCompany?.id]);

  const loadAvailableDocuments = async () => {
    if (!currentCompany?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('company_documents')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('is_active', true)
        .in('document_type', ['term', 'contract', 'policy'])
        .order('name');

      if (error) throw error;
      
      // Filtrar documentos que já não são termos obrigatórios
      const assignedIds = requiredTerms.map(t => t.document_id);
      const available = (data || []).filter(doc => !assignedIds.includes(doc.id));
      
      setAvailableDocuments(available);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleAddTerm = async () => {
    if (!selectedDocId) return;

    await saveRequiredTerm({
      document_id: selectedDocId,
      is_required: true,
      auto_accept: false,
      display_order: requiredTerms.length
    });

    setSelectedDocId('');
    setIsAddingTerm(false);
    loadAvailableDocuments();
  };

  const handleToggleRequired = async (term: any) => {
    await saveRequiredTerm({
      ...term,
      is_required: !term.is_required
    });
  };

  const handleToggleAutoAccept = async (term: any) => {
    await saveRequiredTerm({
      ...term,
      auto_accept: !term.auto_accept
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure quais documentos da empresa serão termos obrigatórios para os funcionários aceitarem no primeiro acesso ao sistema.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Termos Obrigatórios para Funcionários
            </CardTitle>
            <Dialog open={isAddingTerm} onOpenChange={setIsAddingTerm}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={loadAvailableDocuments}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Termo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Termo Obrigatório</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Selecione o Documento</Label>
                    <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um documento..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name} ({doc.document_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableDocuments.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Nenhum documento disponível. Crie documentos do tipo "Termo", "Contrato" ou "Política" no Dossiê Digital primeiro.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingTerm(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddTerm} disabled={!selectedDocId}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {requiredTerms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum termo obrigatório configurado</p>
              <p className="text-sm mt-2">Adicione documentos que os funcionários devem aceitar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requiredTerms.map((term) => (
                <div
                  key={term.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{term.document?.name}</h4>
                        {term.is_required && (
                          <Badge variant="destructive">Obrigatório</Badge>
                        )}
                        {term.auto_accept && (
                          <Badge className="bg-green-500">Auto-Aceite</Badge>
                        )}
                      </div>
                      {term.document?.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {term.document.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`required-${term.id}`} className="text-sm">
                        Obrigatório
                      </Label>
                      <Switch
                        id={`required-${term.id}`}
                        checked={term.is_required}
                        onCheckedChange={() => handleToggleRequired(term)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`auto-${term.id}`} className="text-sm">
                        Auto-Aceite
                      </Label>
                      <Switch
                        id={`auto-${term.id}`}
                        checked={term.auto_accept}
                        onCheckedChange={() => handleToggleAutoAccept(term)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={term.document?.file_url} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => term.id && deleteRequiredTerm(term.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-muted/30">
        <AlertDescription className="text-sm space-y-2">
          <p><strong>Obrigatório:</strong> O funcionário precisa aceitar explicitamente o termo para acessar o sistema.</p>
          <p><strong>Auto-Aceite:</strong> O termo é aceito automaticamente no primeiro login (útil para políticas gerais).</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
