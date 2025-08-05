
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, Upload, Download, Eye, Trash2, Search, 
  User, Calendar, AlertCircle, CheckCircle, Clock,
  Camera, FileImage, Shield, CreditCard
} from 'lucide-react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';

interface MemberDocument {
  id: string;
  memberId: string;
  memberName: string;
  type: 'cc' | 'medical' | 'photo' | 'contract' | 'payment' | 'insurance';
  name: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'expiring';
  size: string;
  url: string;
}

export const MembersDocuments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock data para documentos dos membros
  const documents: MemberDocument[] = [
    {
      id: '1',
      memberId: 'mem1',
      memberName: 'Ana Silva',
      type: 'cc',
      name: 'Cartão de Cidadão - Ana Silva',
      uploadDate: '2024-01-15',
      expiryDate: '2029-01-15',
      status: 'valid',
      size: '2.3 MB',
      url: '#'
    },
    {
      id: '2',
      memberId: 'mem1',
      memberName: 'Ana Silva',
      type: 'medical',
      name: 'Atestado Médico - Ana Silva',
      uploadDate: '2024-01-10',
      expiryDate: '2024-07-10',
      status: 'expiring',
      size: '1.8 MB',
      url: '#'
    },
    {
      id: '3',
      memberId: 'mem2',
      memberName: 'João Santos',
      type: 'photo',
      name: 'Foto de Perfil - João Santos',
      uploadDate: '2024-01-20',
      status: 'valid',
      size: '456 KB',
      url: '#'
    },
    {
      id: '4',
      memberId: 'mem3',
      memberName: 'Maria Costa',
      type: 'medical',
      name: 'Atestado Médico - Maria Costa',
      uploadDate: '2023-06-15',
      expiryDate: '2023-12-15',
      status: 'expired',
      size: '2.1 MB',
      url: '#'
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'cc': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'medical': return <FileText className="h-5 w-5 text-green-600" />;
      case 'photo': return <Camera className="h-5 w-5 text-purple-600" />;
      case 'contract': return <FileText className="h-5 w-5 text-orange-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-emerald-600" />;
      case 'insurance': return <Shield className="h-5 w-5 text-red-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (status === 'expiring') {
      return <Badge variant="outline" className="text-amber-600 border-amber-600">
        <Clock className="h-3 w-3 mr-1" />
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
      cc: 'Cartão de Cidadão',
      medical: 'Atestado Médico',
      photo: 'Foto',
      contract: 'Contrato',
      payment: 'Pagamento',
      insurance: 'Seguro'
    };
    return types[type as keyof typeof types] || 'Outros';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const documentStats = {
    total: documents.length,
    valid: documents.filter(d => d.status === 'valid').length,
    expired: documents.filter(d => d.status === 'expired').length,
    expiring: documents.filter(d => d.status === 'expiring').length
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Documentos dos Membros</h1>
                <p className="text-muted-foreground">
                  Gestão de documentos pessoais, médicos e contratuais
                </p>
              </div>
              
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload de Documento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Arraste ficheiros aqui ou clique para selecionar
                      </p>
                      <Button variant="outline" className="mt-2">
                        Selecionar Ficheiros
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                    <CheckCircle className="h-8 w-8 text-green-600" />
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
                      <p className="text-sm font-medium text-muted-foreground">A Expirar</p>
                      <p className="text-2xl font-bold">{documentStats.expiring}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Expirados</p>
                      <p className="text-2xl font-bold">{documentStats.expired}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar por membro ou documento..."
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
                    <option value="cc">Cartão de Cidadão</option>
                    <option value="medical">Atestado Médico</option>
                    <option value="photo">Fotos</option>
                    <option value="contract">Contratos</option>
                    <option value="payment">Pagamentos</option>
                    <option value="insurance">Seguros</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
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
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{document.memberName}</span>
                              </div>
                              <span>{getTypeLabel(document.type)}</span>
                              <span>{document.size}</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(document.uploadDate).toLocaleDateString('pt-PT')}</span>
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
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
