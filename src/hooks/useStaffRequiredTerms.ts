import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface StaffRequiredTerm {
  id?: string;
  company_id: string;
  document_id: string;
  is_required: boolean;
  auto_accept: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  document?: {
    id: string;
    name: string;
    file_url: string;
    document_type: string;
    description?: string;
  };
}

export interface StaffTermAcceptance {
  id?: string;
  staff_id: string;
  company_id: string;
  document_id: string;
  accepted_at?: string;
  ip_address?: string;
  user_agent?: string;
}

export const useStaffRequiredTerms = () => {
  const [requiredTerms, setRequiredTerms] = useState<StaffRequiredTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchRequiredTerms = useCallback(async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_required_terms')
        .select(`
          *,
          document:company_documents(id, name, file_url, document_type, description)
        `)
        .eq('company_id', currentCompany.id)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching required terms:', error);
        toast.error('Erro ao carregar termos obrigatórios.');
        return;
      }

      setRequiredTerms(data || []);
    } catch (error) {
      console.error('Error fetching required terms:', error);
      toast.error('Erro ao carregar termos obrigatórios.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id]);

  const saveRequiredTerm = async (term: Partial<StaffRequiredTerm>) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return;
    }

    try {
      const termData = {
        ...term,
        company_id: currentCompany.id,
        updated_at: new Date().toISOString()
      };

      if (term.id) {
        const { error } = await supabase
          .from('staff_required_terms')
          .update({
            is_required: termData.is_required,
            auto_accept: termData.auto_accept,
            display_order: termData.display_order,
            updated_at: termData.updated_at
          })
          .eq('id', term.id);

        if (error) throw error;
        toast.success('Termo atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('staff_required_terms')
          .insert([{
            company_id: termData.company_id,
            document_id: term.document_id!,
            is_required: termData.is_required ?? true,
            auto_accept: termData.auto_accept ?? false,
            display_order: termData.display_order ?? 0
          }]);

        if (error) throw error;
        toast.success('Termo adicionado com sucesso!');
      }

      await fetchRequiredTerms();
    } catch (error: any) {
      console.error('Error saving required term:', error);
      toast.error(`Erro ao salvar termo: ${error.message || ''}`);
    }
  };

  const deleteRequiredTerm = async (termId: string) => {
    try {
      const { error } = await supabase
        .from('staff_required_terms')
        .delete()
        .eq('id', termId);

      if (error) throw error;

      toast.success('Termo removido com sucesso!');
      await fetchRequiredTerms();
    } catch (error) {
      console.error('Error deleting required term:', error);
      toast.error('Erro ao remover termo');
    }
  };

  const checkStaffAcceptances = async (staffId: string) => {
    if (!currentCompany?.id) return [];

    try {
      const { data, error } = await supabase
        .from('staff_term_acceptances')
        .select('*')
        .eq('staff_id', staffId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error checking staff acceptances:', error);
      return [];
    }
  };

  const acceptTerm = async (staffId: string, documentId: string) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('staff_term_acceptances')
        .insert({
          staff_id: staffId,
          company_id: currentCompany.id,
          document_id: documentId,
          ip_address: window.location.hostname,
          user_agent: navigator.userAgent
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error accepting term:', error);
      toast.error(`Erro ao aceitar termo: ${error.message || ''}`);
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) {
      fetchRequiredTerms();
    }
  }, [currentCompany?.id, fetchRequiredTerms]);

  return {
    requiredTerms,
    loading,
    saveRequiredTerm,
    deleteRequiredTerm,
    checkStaffAcceptances,
    acceptTerm,
    refetch: fetchRequiredTerms
  };
};
