import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Permission {
  key: string;
  module: string;
  label: string;
  description: string;
}

export interface Role {
  id: string;
  company_id?: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isSystem?: boolean;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Definição completa de todas as permissões por módulo
export const PERMISSION_MODULES = {
  athletes: {
    label: 'Gestão de Atletas',
    icon: '👥',
    permissions: [
      { key: 'athletes.view', label: 'Ver Atletas', description: 'Visualizar lista e perfis de atletas' },
      { key: 'athletes.create', label: 'Criar Atletas', description: 'Cadastrar novos atletas' },
      { key: 'athletes.edit', label: 'Editar Atletas', description: 'Modificar dados dos atletas' },
      { key: 'athletes.delete', label: 'Excluir Atletas', description: 'Remover atletas do sistema' },
      { key: 'athletes.checkin', label: 'Check-in', description: 'Realizar check-in de atletas' },
      { key: 'athletes.documents', label: 'Gerir Documentos', description: 'Visualizar e gerenciar documentos' },
      { key: 'athletes.assessments', label: 'Avaliações Físicas', description: 'Criar e visualizar avaliações' },
      { key: 'athletes.plans', label: 'Planos Nutricionais', description: 'Criar e gerenciar planos' }
    ]
  },
  classes: {
    label: 'Gestão de Aulas',
    icon: '📅',
    permissions: [
      { key: 'classes.view', label: 'Ver Aulas', description: 'Visualizar grade de aulas' },
      { key: 'classes.create', label: 'Criar Aulas', description: 'Agendar novas aulas' },
      { key: 'classes.edit', label: 'Editar Aulas', description: 'Modificar aulas agendadas' },
      { key: 'classes.delete', label: 'Excluir Aulas', description: 'Cancelar aulas' },
      { key: 'classes.bookings', label: 'Gerir Reservas', description: 'Gerenciar reservas de atletas' },
      { key: 'classes.waitlist', label: 'Lista de Espera', description: 'Gerenciar lista de espera' },
      { key: 'classes.modalities', label: 'Gerir Modalidades', description: 'Criar e editar modalidades' }
    ]
  },
  financial: {
    label: 'Gestão Financeira',
    icon: '💰',
    permissions: [
      { key: 'financial.view', label: 'Ver Financeiro', description: 'Visualizar dados financeiros' },
      { key: 'financial.transactions', label: 'Transações', description: 'Criar e gerenciar transações' },
      { key: 'financial.payments', label: 'Pagamentos', description: 'Processar pagamentos' },
      { key: 'financial.receivables', label: 'Contas a Receber', description: 'Gerenciar recebíveis' },
      { key: 'financial.expenses', label: 'Despesas', description: 'Registrar despesas' },
      { key: 'financial.reports', label: 'Relatórios', description: 'Gerar relatórios financeiros' },
      { key: 'financial.export', label: 'Exportar Dados', description: 'Exportar dados financeiros' }
    ]
  },
  subscriptions: {
    label: 'Assinaturas e Planos',
    icon: '📋',
    permissions: [
      { key: 'subscriptions.view', label: 'Ver Assinaturas', description: 'Visualizar assinaturas ativas' },
      { key: 'subscriptions.create', label: 'Criar Assinaturas', description: 'Cadastrar novas assinaturas' },
      { key: 'subscriptions.edit', label: 'Editar Assinaturas', description: 'Modificar assinaturas' },
      { key: 'subscriptions.cancel', label: 'Cancelar Assinaturas', description: 'Cancelar assinaturas' },
      { key: 'subscriptions.plans', label: 'Gerir Planos', description: 'Criar e editar planos' },
      { key: 'subscriptions.coupons', label: 'Cupons', description: 'Criar cupons de desconto' }
    ]
  },
  crm: {
    label: 'CRM e Prospecção',
    icon: '🎯',
    permissions: [
      { key: 'crm.view', label: 'Ver CRM', description: 'Visualizar leads e prospects' },
      { key: 'crm.prospects', label: 'Gerir Prospects', description: 'Criar e gerenciar prospects' },
      { key: 'crm.deals', label: 'Gerir Negociações', description: 'Gerenciar pipeline de vendas' },
      { key: 'crm.activities', label: 'Atividades', description: 'Registrar atividades' },
      { key: 'crm.convert', label: 'Converter Leads', description: 'Converter prospects em atletas' }
    ]
  },
  communication: {
    label: 'Comunicação',
    icon: '💬',
    permissions: [
      { key: 'communication.view', label: 'Ver Mensagens', description: 'Visualizar comunicações' },
      { key: 'communication.send', label: 'Enviar Mensagens', description: 'Enviar mensagens individuais' },
      { key: 'communication.broadcast', label: 'Mensagens em Massa', description: 'Enviar para múltiplos destinatários' },
      { key: 'communication.notifications', label: 'Notificações', description: 'Criar notificações internas' }
    ]
  },
  equipment: {
    label: 'Equipamentos',
    icon: '🏋️',
    permissions: [
      { key: 'equipment.view', label: 'Ver Equipamentos', description: 'Visualizar inventário' },
      { key: 'equipment.create', label: 'Adicionar Equipamentos', description: 'Cadastrar novos equipamentos' },
      { key: 'equipment.edit', label: 'Editar Equipamentos', description: 'Modificar equipamentos' },
      { key: 'equipment.delete', label: 'Excluir Equipamentos', description: 'Remover equipamentos' },
      { key: 'equipment.maintenance', label: 'Manutenção', description: 'Registrar manutenções' }
    ]
  },
  reports: {
    label: 'Relatórios e Métricas',
    icon: '📊',
    permissions: [
      { key: 'reports.view', label: 'Ver Relatórios', description: 'Visualizar relatórios' },
      { key: 'reports.dashboard', label: 'Dashboard', description: 'Acesso ao dashboard' },
      { key: 'reports.analytics', label: 'Analytics', description: 'Análises detalhadas' },
      { key: 'reports.export', label: 'Exportar', description: 'Exportar relatórios' },
      { key: 'reports.kpis', label: 'KPIs', description: 'Visualizar e configurar KPIs' }
    ]
  },
  settings: {
    label: 'Configurações',
    icon: '⚙️',
    permissions: [
      { key: 'settings.view', label: 'Ver Configurações', description: 'Visualizar configurações' },
      { key: 'settings.company', label: 'Dados da Empresa', description: 'Editar dados da empresa' },
      { key: 'settings.roles', label: 'Gerir Cargos', description: 'Criar e editar cargos' },
      { key: 'settings.users', label: 'Gerir Usuários', description: 'Convidar e gerenciar usuários' },
      { key: 'settings.integrations', label: 'Integrações', description: 'Configurar integrações' },
      { key: 'settings.security', label: 'Segurança', description: 'Configurações de segurança' }
    ]
  }
};

export const useRoles = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (rolesError) throw rolesError;

      // Fetch permissions for each role
      const rolesWithPermissions = await Promise.all(
        (rolesData || []).map(async (role) => {
          const { data: permissionsData } = await supabase
            .from('role_permissions')
            .select('permission_key')
            .eq('role_id', role.id);

          return {
            ...role,
            permissions: permissionsData?.map(p => p.permission_key) || []
          };
        })
      );

      setRoles(rolesWithPermissions);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Erro ao carregar cargos');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const createRole = async (roleData: Omit<Role, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!companyId) {
      toast.error('Empresa não identificada');
      return;
    }

    try {
      // Create role
      const { data: newRole, error: roleError } = await supabase
        .from('roles')
        .insert([{
          company_id: companyId,
          name: roleData.name,
          description: roleData.description,
          color: roleData.color,
          is_system: false
        }])
        .select()
        .single();

      if (roleError) throw roleError;

      // Create permissions
      if (roleData.permissions.length > 0) {
        const permissionsToInsert = roleData.permissions.map(permKey => ({
          role_id: newRole.id,
          permission_key: permKey
        }));

        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(permissionsToInsert);

        if (permError) throw permError;
      }

      toast.success('Cargo criado com sucesso!');
      await fetchRoles();
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(error.message || 'Erro ao criar cargo');
    }
  };

  const updateRole = async (roleId: string, updates: Partial<Role>) => {
    try {
      // Update role basic info
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: updates.name,
          description: updates.description,
          color: updates.color
        })
        .eq('id', roleId);

      if (roleError) throw roleError;

      // Update permissions if provided
      if (updates.permissions) {
        // Delete existing permissions
        await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId);

        // Insert new permissions
        if (updates.permissions.length > 0) {
          const permissionsToInsert = updates.permissions.map(permKey => ({
            role_id: roleId,
            permission_key: permKey
          }));

          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(permissionsToInsert);

          if (permError) throw permError;
        }
      }

      toast.success('Cargo atualizado com sucesso!');
      await fetchRoles();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Erro ao atualizar cargo');
    }
  };

  const deleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem || role?.is_system) {
      toast.error('Não é possível excluir cargos do sistema');
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Cargo excluído com sucesso!');
      await fetchRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Erro ao excluir cargo');
    }
  };

  const duplicateRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    await createRole({
      name: `${role.name} (Cópia)`,
      description: role.description,
      color: role.color,
      permissions: role.permissions
    });
  };

  return {
    roles,
    loading,
    createRole,
    updateRole,
    deleteRole,
    duplicateRole,
    refetch: fetchRoles
  };
};