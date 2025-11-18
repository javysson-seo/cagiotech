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
  nif: string | null;
  business_type: string | null;
  slogan: string | null;
  website: string | null;
  instagram: string | null;
  founded_date: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  gps_coordinates: string | null;
  capacity: number | null;
  description: string | null;
  operating_hours: Record<string, any> | null;
  logo_url: string | null;
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
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['company-settings', companyId] });

      // Snapshot the previous value
      const previousCompany = queryClient.getQueryData(['company-settings', companyId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['company-settings', companyId], (old: any) => ({
        ...old,
        ...updates,
      }));

      // Return context with snapshot
      return { previousCompany };
    },
    onSuccess: (data) => {
      // Update with the actual data from server
      queryClient.setQueryData(['company-settings', companyId], data);
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: Error, _updates, context) => {
      // Rollback to the previous value on error
      if (context?.previousCompany) {
        queryClient.setQueryData(['company-settings', companyId], context.previousCompany);
      }
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
