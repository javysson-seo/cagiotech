import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface CompanySettings {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  nif?: string;
  business_type?: string;
  slogan?: string;
  website?: string;
  instagram?: string;
  founded_date?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  gps_coordinates?: string;
  capacity?: number;
  description?: string;
  operating_hours?: Record<string, any>;
  logo_url?: string;
}

export const useCompanySettings = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const queryClient = useQueryClient();

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID is required');

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;
      return data as CompanySettings;
    },
    enabled: !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<CompanySettings>) => {
      if (!companyId) throw new Error('Company ID is required');

      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', companyId] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  return {
    company,
    isLoading,
    error,
    updateCompany: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
