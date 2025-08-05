import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Share,
  FileImage,
  FileCheck,
  FileX,
  Search,
  Filter,
  Calendar,
  User,
  Clock
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'medical' | 'identification' | 'payment' | 'other';
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending';
  uploadedBy: string;
  url?: string;
}

export const DocumentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Contrato de Adesão - Maria Silva',
      type: 'contract',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'valid',
      uploadedBy: 'João Admin',
      url: '#'
    },
    {
      id: '2',
      name: 'Atestado Médico - João Santos',
      type: 'medical',
      size: '1.2 MB',
      uploadDate: '2024-01-10',
      expiryDate: '2024-07-10',
      status: 'valid',
      uploadedBy: 'João Santos',
      url: '#'
    },
    {
      id: '3',
      name: 'RG - Ana Costa',
      type: 'identification',
      size: '890 KB',
      uploadDate: '2024-01-08',
      status: 'valid',
      uploadedBy: 'Ana Costa',
      url: '#'
    },
    {
      id: '4',
      name: 'Comprovante de Pagamento - Dezembro',
      type: 'payment',
      size: '156 KB',
      uploadDate: '2023-12-05',
      status: 'valid',
      uploadedBy: 'Sistema',
      url: '#'
    },
    {
      id: '5',
      name: 'Atestado Médico - Pedro Lima',
      type: 'medical',
      size: '2.1 MB',
      uploadDate: '2023-06-15',
      expiryDate: '2023-12-15',
      status: 'expired',
      uploadedBy: 'Pedro Lima',
      url: '#'
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'medical': return <FileCheck className="h-5 w-5 text-green-600" />;
      case 'identification': return <FileImage className="h-5 w-5 text-purple-600" />;
      case 'payment': return <FileText className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 30) {
        return <Badge variant="outline" className="text-amber-600 border-amber-600">
          Expira em {daysUntilExpiry} dias
        </Badge>;
      }
    }
    return <Badge className="bg-green-100 text-green-700">Válido</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const types = {
      contract: 'Contrato',
      medical: 'Médico',
      identification: 'Identificação',
      payment: 'Pagamento',
      other: 'Outros'
    };
    return types[type as keyof typeof types] || 'Outros';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const documentStats = {
    total: documents.length,
    valid: documents.filter(d => d.status === 'valid').length,
    expired: documents.filter(d => d.status === 'expired').length,
    expiringSoon: documents.filter(d => {
      if (!d.expiryDate) return false;
      const expiry = new Date(d.expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Documentos</h1>
          <p className="text-muted-foreground">
            Organize e gerencie todos os documentos da academia
          </p>
        </div>
        
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Documento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Válidos</p>
                <p className="text-2xl font-bold">{documentStats.valid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expirando</p>
                <p className="text-2xl font-bold">{documentStats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold">{documentStats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="medical">Médicos</TabsTrigger>
          <TabsTrigger value="identification">Identificação</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Pesquisar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="contract">Contratos</option>
                  <option value="medical">Médicos</option>
                  <option value="identification">Identificação</option>
                  <option value="payment">Pagamentos</option>
                  <option value="other">Outros</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getDocumentIcon(document.type)}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">
                            {document.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{getTypeLabel(document.type)}</span>
                            <span>{document.size}</span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(document.uploadDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{document.uploadedBy}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(document.status, document.expiryDate)}
                        
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não foram encontrados documentos com os critérios selecionados.
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Primeiro Documento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Arraste arquivos aqui</h3>
                <p className="text-muted-foreground mb-4">
                  ou clique para selecionar arquivos do seu computador
                </p>
                <Button>
                  Selecionar Arquivos
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar with filtered data */}
      </Tabs>
    </div>
  );
};
