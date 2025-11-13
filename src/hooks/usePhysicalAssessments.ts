import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePhysicalAssessments = (athleteId: string, companyId: string) => {
  return useQuery({
    queryKey: ['physical-assessments', athleteId, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('physical_assessments')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('company_id', companyId)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!athleteId && !!companyId,
  });
};