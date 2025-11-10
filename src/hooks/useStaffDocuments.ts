import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface StaffDocument {
  id?: string;
  staff_id: string;
  company_id?: string;
  name: string;
  document_type: 'contract' | 'id' | 'certificate' | 'medical' | 'other';
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at?: string;
  notes?: string;
  created_at?: string;
}

export const useStaffDocuments = (staffId?: string) => {
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchDocuments = useCallback(async () => {
    if (!currentCompany?.id || !staffId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_documents')
        .select('*')
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff documents:', error);
        toast.error('Erro ao carregar documentos do funcionário.');
        return;
      }

      setDocuments(data as StaffDocument[] || []);
    } catch (error) {
      console.error('Error fetching staff documents:', error);
      toast.error('Erro ao carregar documentos do funcionário.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id, staffId]);

  const uploadDocument = async (file: File, documentData: Partial<StaffDocument>) => {
    if (!currentCompany?.id || !staffId) {
      toast.error('Nenhuma empresa ou funcionário selecionado.');
      return null;
    }

    try {
      // Upload para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentCompany.id}/staff/${staffId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Salvar referência no banco
      const { data, error: dbError } = await supabase
        .from('staff_documents')
        .insert([{
          staff_id: staffId,
          company_id: currentCompany.id,
          name: documentData.name || '',
          document_type: documentData.document_type || 'other',
          notes: documentData.notes || null,
          file_url: publicUrl,
          file_size: file.size,
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Documento enviado com sucesso!');
      await fetchDocuments();
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erro ao enviar documento');
      return null;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('staff_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Documento removido com sucesso!');
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erro ao remover documento');
    }
  };

  useEffect(() => {
    if (currentCompany?.id && staffId) {
      fetchDocuments();
    }
  }, [currentCompany?.id, staffId, fetchDocuments]);

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
};
