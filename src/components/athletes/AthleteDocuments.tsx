
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Upload, FileText, Image, Download, Eye, Trash2, 
  Calendar, CheckCircle, AlertCircle, Camera, Shield
} from 'lucide-react';

interface AthleteDocument {
  id: string;
  type: 'photo' | 'cc' | 'medical' | 'contract' | 'other';
  name: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'expiring';
  size: string;
  url: string;
}

interface AthleteDocumentsProps {
  athleteId: string;
  athleteName: string;
}

export const AthleteDocuments: React.FC<AthleteDocumentsProps> = ({
  athleteId,
  athleteName
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>('');

  // Mock documents for the athlete
  const documents: AthleteDocument[] = [
    {
      id: '1',
      type: 'photo',
      name: 'Foto de Perfil',
      uploadDate: '2024-01-15',
      status: 'valid',
      size: '2.3 MB',
      url: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400`
    },
    {
      id: '2',
      type: 'cc',
      name: 'Cartão de Cidadão',
      uploadDate: '2024-01-10',
      expiryDate: '2029-01-10',
      status: 'valid',
      size: '1.8 MB',
      url: '#'
    },
    {
      id: '3',
      type: 'medical',
      name: 'Atestado Médico',
      uploadDate: '2023-07-15',
      expiryDate: '2024-01-15',
      status: 'expiring',
      size: '1.2 MB',
      url: '#'
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-5 w-5 text-purple-600" />;
      case 'cc': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'medical': return <FileText className="h-5 w-5 text-green-600" />;
      case 'contract': return <FileText className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (status === 'expiring') {
      return <Badge variant="outline" className="text-amber-600 border-amber-600">
        A Expirar
      </Badge>;
    }
    return <Badge className="bg-green-100 text-green-700">
      <CheckCircle className="h-3 w-3 mr-1" />
      Válido
    </Badge>;
  };

  const getTypeLabel = (type: string) => {
    const types = {
      photo: 'Foto',
      cc: 'Cartão de Cidadão',
      medical: 'Atestado Médico',
      contract: 'Contrato',
      other: 'Outros'
    };
    return types[type as keyof typeof types] || 'Outros';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = () => {
    // Aqui seria implementada a lógica de upload real
    console.log('Uploading files:', selectedFiles, 'Type:', documentType);
    setUploadDialogOpen(false);
    setSelectedFiles([]);
    setDocumentType('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documentos e Fotos</CardTitle>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento</Label>
                  <select
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">Selecionar tipo...</option>
                    <option value="photo">Foto de Perfil</option>
                    <option value="cc">Cartão de Cidadão</option>
                    <option value="medical">Atestado Médico</option>
                    <option value="contract">Contrato</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileUpload">Ficheiros</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos aceites: PDF, JPG, PNG, DOC, DOCX (máx. 10MB cada)
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Ficheiros Selecionados:</Label>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={!documentType || selectedFiles.length === 0}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum documento carregado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  {getDocumentIcon(document.type)}
                  <div>
                    <h4 className="font-medium text-sm">{document.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{getTypeLabel(document.type)}</span>
                      <span>{document.size}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(document.uploadDate).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(document.status, document.expiryDate)}
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
