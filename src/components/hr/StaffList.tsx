import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Mail, 
  Phone,
  Search,
  UserPlus,
  Filter,
  Users,
  Eye
} from 'lucide-react';
import { useStaff, type Staff } from '@/hooks/useStaff';
import { StaffFormModal } from './StaffFormModal';
import { StaffDetailModal } from './StaffDetailModal';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const StaffList: React.FC = () => {
  const { staff, loading, saveStaff, deleteStaff, resetStaffPassword, checkEmailExists } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: Staff) => {
    setSelectedStaff(member);
    setShowDetailModal(true);
  };

  const handleView = (member: Staff) => {
    setSelectedStaff(member);
    setShowDetailModal(true);
  };

  const handleDelete = async () => {
    if (staffToDelete) {
      await deleteStaff(staffToDelete);
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { label: 'Ativo', className: 'bg-cagio-green text-white' },
      inactive: { label: 'Inativo', className: 'bg-gray-400 text-white' },
      vacation: { label: 'Férias', className: 'bg-blue-500 text-white' },
      sick_leave: { label: 'Baixa', className: 'bg-orange-500 text-white' }
    };

    const config = statusConfig[status || 'active'] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" text="Carregando funcionários..." />
      </div>
    );
  }

  return (
    <>
      <Card className="border-t-4 border-t-cagio-green">
        <CardHeader className="bg-cagio-green-light/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-cagio-green">Gestão de Funcionários</CardTitle>
            <Button 
              onClick={() => {
                setSelectedStaff(null);
                setIsModalOpen(true);
              }}
              className="bg-cagio-green hover:bg-cagio-green-dark text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cagio-green" />
              <Input
                placeholder="Pesquisar por nome, email ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-cagio-green/30 focus:border-cagio-green"
              />
            </div>
            <Button variant="outline" className="border-cagio-green text-cagio-green hover:bg-cagio-green-light">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-cagio-green-light mb-4">
                <Users className="h-12 w-12 text-cagio-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Tente ajustar sua pesquisa.' : 'Comece adicionando seu primeiro funcionário.'}
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-cagio-green hover:bg-cagio-green-dark text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Funcionário
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Data Admissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {member.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(member.hire_date)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(member)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(member)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar Rápido
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setStaffToDelete(member.id!);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSave={async (staffData) => {
          await saveStaff(staffData);
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        checkEmailExists={checkEmailExists}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedStaff && showDetailModal && (
        <StaffDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onSave={async (staffData) => {
            await saveStaff(staffData);
            setShowDetailModal(false);
            setSelectedStaff(null);
          }}
          onResetPassword={resetStaffPassword}
        />
      )}
    </>
  );
};