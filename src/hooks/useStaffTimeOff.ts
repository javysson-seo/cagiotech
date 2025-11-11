import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';
import { useHRActivities } from './useHRActivities';

export interface TimeOffRequest {
  id: string;
  company_id: string;
  staff_id: string;
  request_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  status: string;
  reason?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  staff?: {
    name: string;
    position?: string;
  };
}

export const useStaffTimeOff = () => {
  const { currentCompany } = useCompany();
  const { logActivity } = useHRActivities();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_time_off')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Enrich with staff data
      const enrichedData = await Promise.all(
        (data || []).map(async (request) => {
          const { data: staffData } = await supabase
            .from('staff')
            .select('name, position')
            .eq('id', request.staff_id)
            .single();
          
          return {
            ...request,
            staff: staffData
          };
        })
      );

      if (error) throw error;
      setRequests(enrichedData || []);
    } catch (error: any) {
      console.error('Error fetching time off requests:', error);
      toast.error('Erro ao carregar pedidos de férias');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: Partial<TimeOffRequest>) => {
    if (!currentCompany?.id) return;

    try {
      const insertData: any = {
        company_id: currentCompany.id,
        staff_id: requestData.staff_id,
        request_type: requestData.request_type,
        start_date: requestData.start_date,
        end_date: requestData.end_date,
        days_count: requestData.days_count,
        reason: requestData.reason
      };

      const { data, error } = await supabase
        .from('staff_time_off')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Pedido de férias criado com sucesso');
      
      await logActivity(
        'time_off_request',
        'Novo pedido de férias',
        `Pedido de ${requestData.request_type} de ${requestData.start_date} a ${requestData.end_date}`,
        data.id
      );

      await fetchRequests();
    } catch (error: any) {
      console.error('Error creating time off request:', error);
      toast.error('Erro ao criar pedido de férias');
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: string,
    rejectionReason?: string
  ) => {
    if (!currentCompany?.id) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateData.approved_by = userData.user?.id;
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('staff_time_off')
        .update(updateData)
        .eq('id', requestId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('notify-time-off-status', {
          body: {
            requestId,
            status,
            rejectionReason
          }
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast.success(`Pedido ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`);
      
      await logActivity(
        'time_off_status_change',
        `Pedido de férias ${status === 'approved' ? 'aprovado' : 'rejeitado'}`,
        rejectionReason,
        requestId
      );

      await fetchRequests();
    } catch (error: any) {
      console.error('Error updating time off request:', error);
      toast.error('Erro ao atualizar pedido');
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!currentCompany?.id) return;

    try {
      const { error } = await supabase
        .from('staff_time_off')
        .delete()
        .eq('id', requestId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      toast.success('Pedido removido com sucesso');
      await fetchRequests();
    } catch (error: any) {
      console.error('Error deleting time off request:', error);
      toast.error('Erro ao remover pedido');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentCompany?.id]);

  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    deleteRequest,
    refetch: fetchRequests
  };
};
