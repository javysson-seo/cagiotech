import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface Permission {
  key: string;
  module: string;
  label: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isSystem?: boolean;
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
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      permissions: Object.values(PERMISSION_MODULES)
        .flatMap(m => m.permissions.map(p => p.key)),
      color: '#ef4444',
      isSystem: true
    },
    {
      id: '2',
      name: 'Trainer',
      description: 'Personal Trainer com acesso a aulas e atletas',
      permissions: [
        'athletes.view',
        'athletes.checkin',
        'athletes.assessments',
        'athletes.plans',
        'classes.view',
        'classes.create',
        'classes.edit',
        'reports.view',
        'reports.dashboard'
      ],
      color: '#3b82f6',
      isSystem: true
    },
    {
      id: '3',
      name: 'Recepcionista',
      description: 'Atendimento e gestão básica',
      permissions: [
        'athletes.view',
        'athletes.checkin',
        'classes.view',
        'classes.bookings',
        'subscriptions.view',
        'communication.view',
        'communication.send'
      ],
      color: '#10b981',
      isSystem: true
    }
  ]);

  const [loading, setLoading] = useState(false);

  const createRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: Date.now().toString(),
    };
    setRoles(prev => [...prev, newRole]);
    toast.success('Cargo criado com sucesso!');
  };

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, ...updates } : role
    ));
    toast.success('Cargo atualizado com sucesso!');
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error('Não é possível excluir cargos do sistema');
      return;
    }
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast.success('Cargo excluído com sucesso!');
  };

  const duplicateRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      name: `${role.name} (Cópia)`,
      isSystem: false
    };
    setRoles(prev => [...prev, newRole]);
    toast.success('Cargo duplicado com sucesso!');
  };

  return {
    roles,
    loading,
    createRole,
    updateRole,
    deleteRole,
    duplicateRole
  };
};
