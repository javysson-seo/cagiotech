import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import { useStaffDocuments } from '@/hooks/useStaffDocuments';
import { Loading } from '@/components/ui/loading';

interface StaffDocumentsSectionProps {
  staffId: string;
}

export const StaffDocumentsSection: React.FC<StaffDocumentsSectionProps> = ({ staffId }) => {
  const { documents, loading, uploadDocument, deleteDocument } = useStaffDocuments(staffId);
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    document_type: 'other' as const,
    notes: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!newDoc.name) {
      return;
    }

    setUploading(true);
    await uploadDocument(file, newDoc);
    setNewDoc({ name: '', document_type: 'other', notes: '' });
    setUploading(false);
    
    // Reset file input
    event.target.value = '';
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      contract: 'Contrato',
      id: 'Identificação',
      certificate: 'Certificado',
      medical: 'Atestado Médico',
      other: 'Outro'
    };
    return types[type] || type;
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      contract: 'bg-blue-500',
      id: 'bg-purple-500',
      certificate: 'bg-green-500',
      medical: 'bg-red-500',
      other: 'bg-gray-500'
    };
    return colors[type] || colors.other;
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Adicionar Documento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="doc-name">Nome *</Label>
              <Input
                id="doc-name"
                placeholder="Ex: Contrato de Trabalho"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="doc-type">Tipo *</Label>
              <Select
                value={newDoc.document_type}
                onValueChange={(value: any) => setNewDoc({ ...newDoc, document_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="id">Identificação</SelectItem>
                  <SelectItem value="certificate">Certificado</SelectItem>
                  <SelectItem value="medical">Atestado Médico</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doc-file">Arquivo *</Label>
              <Input
                id="doc-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading || !newDoc.name}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Documentos ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
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
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{doc.name}</h4>
                        <Badge className={`${getDocumentTypeBadge(doc.document_type)} text-white`}>
                          {getDocumentTypeLabel(doc.document_type)}
                        </Badge>
                      </div>
                      {doc.notes && (
                        <p className="text-sm text-muted-foreground">{doc.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.uploaded_at && `Enviado em ${new Date(doc.uploaded_at).toLocaleDateString()}`}
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
                      onClick={() => doc.id && deleteDocument(doc.id)}
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
    </div>
  );
};
