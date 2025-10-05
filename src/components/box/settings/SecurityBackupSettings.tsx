import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Trash2, Download, FileCheck, Shield } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SecurityBackupSettings: React.FC = () => {
  const { currentCompany } = useCompany();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    description: '',
    document_type: 'contract',
  });

  React.useEffect(() => {
    if (currentCompany?.id) {
      loadDocuments();
    }
  }, [currentCompany?.id]);

  const loadDocuments = async () => {
    if (!currentCompany?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_documents')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentCompany?.id) return;

    if (!newDoc.name) {
      toast.error('Digite um nome para o documento');
      return;
    }

    setUploading(true);
    try {
      // Upload para o storage do Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentCompany.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Salvar referência no banco
      const { error: dbError } = await supabase
        .from('company_documents')
        .insert({
          company_id: currentCompany.id,
          name: newDoc.name,
          description: newDoc.description,
          document_type: newDoc.document_type,
          file_url: publicUrl,
          file_size: file.size,
        });

      if (dbError) throw dbError;

      toast.success('Documento enviado com sucesso!');
      setNewDoc({ name: '', description: '', document_type: 'contract' });
      loadDocuments();
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_documents')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Documento removido!');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast.error('Erro ao remover documento');
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      contract: 'Contrato',
      term: 'Termo',
      policy: 'Política',
      other: 'Outro',
    };
    return types[type] || type;
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      contract: 'bg-blue-500',
      term: 'bg-green-500',
      policy: 'bg-purple-500',
      other: 'bg-gray-500',
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Dossiê Digital</h2>
          <p className="text-sm text-muted-foreground">Contratos, termos e documentos da empresa</p>
        </div>
      </div>

      {/* Upload de novo documento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Adicionar Documento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="doc-name">Nome do Documento *</Label>
              <Input
                id="doc-name"
                placeholder="Ex: Contrato de Adesão 2024"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="doc-type">Tipo *</Label>
              <Select
                value={newDoc.document_type}
                onValueChange={(value) => setNewDoc({ ...newDoc, document_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="term">Termo</SelectItem>
                  <SelectItem value="policy">Política</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doc-file">Arquivo *</Label>
              <Input
                id="doc-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="doc-desc">Descrição (opcional)</Label>
            <Input
              id="doc-desc"
              placeholder="Breve descrição do documento"
              value={newDoc.description}
              onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Armazenados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Carregando documentos...</p>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento adicionado ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileCheck className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{doc.name}</h4>
                        <Badge className={`${getDocumentTypeBadge(doc.document_type)} text-white`}>
                          {getDocumentTypeLabel(doc.document_type)}
                        </Badge>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Adicionado em {new Date(doc.created_at).toLocaleDateString()}
                        {doc.file_size && ` • ${(doc.file_size / 1024).toFixed(0)} KB`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
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

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <FileCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Compliance RGPD (Portugal)</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 ml-6">
              <div>• Consentimento de dados implementado</div>
              <div>• Direito ao esquecimento ativo</div>
              <div>• Export de dados pessoais disponível</div>
              <div>• Log de acessos mantido</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
