import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const useClassesMetrics = (companyId: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['classes-metrics', companyId, dateRange],
    queryFn: async () => {
      const startDate = dateRange?.from || startOfMonth(new Date());
      const endDate = dateRange?.to || endOfMonth(new Date());

      const { data: classes } = await supabase
        .from('classes')
        .select(`
          *,
          modalities(name),
          trainers(name),
          class_bookings(*),
          class_check_ins(*)
        `)
        .eq('company_id', companyId)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));

      // Group by modality
      const byModality = (classes || []).reduce((acc: Record<string, any>, cls: any) => {
        const modalityName = cls.modalities?.name || 'Sem modalidade';
        if (!acc[modalityName]) {
          acc[modalityName] = {
            name: modalityName,
            classes: 0,
            bookings: 0,
            checkIns: 0,
            capacity: 0,
          };
        }
        acc[modalityName].classes += 1;
        acc[modalityName].bookings += cls.class_bookings?.length || 0;
        acc[modalityName].checkIns += cls.class_check_ins?.length || 0;
        acc[modalityName].capacity += cls.max_capacity;
        return acc;
      }, {});

      // Group by trainer
      const byTrainer = (classes || []).reduce((acc: Record<string, any>, cls: any) => {
        const trainerName = cls.trainers?.name || 'Sem treinador';
        if (!acc[trainerName]) {
          acc[trainerName] = {
            name: trainerName,
            classes: 0,
            bookings: 0,
            checkIns: 0,
          };
        }
        acc[trainerName].classes += 1;
        acc[trainerName].bookings += cls.class_bookings?.length || 0;
        acc[trainerName].checkIns += cls.class_check_ins?.length || 0;
        return acc;
      }, {});

      return {
        byModality: Object.values(byModality),
        byTrainer: Object.values(byTrainer),
        totalClasses: classes?.length || 0,
        totalBookings: classes?.reduce((sum: number, c: any) => sum + (c.class_bookings?.length || 0), 0) || 0,
        totalCheckIns: classes?.reduce((sum: number, c: any) => sum + (c.class_check_ins?.length || 0), 0) || 0,
      };
    },
    enabled: !!companyId,
  });
};
