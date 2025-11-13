import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface AthleteDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  file_size: number;
  created_at: string;
  uploaded_by: string | null;
}

export const useAthleteDocuments = (athleteId: string, companyId: string) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AthleteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    if (!athleteId || !companyId) return;

    try {
      const { data, error } = await supabase
        .from('athlete_documents')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching athlete documents:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, type: string = 'other') => {
    if (!athleteId || !companyId || !user) {
      toast.error('Dados incompletos para upload');
      return false;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`O arquivo ${file.name} excede o limite de 5MB`);
      return false;
    }

    setUploading(true);

    try {
      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${athleteId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('athlete-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('athlete-documents')
        .getPublicUrl(fileName);

      // Salvar referência no banco
      const { error: dbError } = await supabase
        .from('athlete_documents')
        .insert({
          athlete_id: athleteId,
          company_id: companyId,
          name: file.name,
          type,
          file_url: publicUrl,
          file_size: file.size,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Documento enviado com sucesso!');
      await fetchDocuments();
      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erro ao enviar documento');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string, fileUrl: string) => {
    try {
      // Extrair caminho do arquivo da URL
      const urlParts = fileUrl.split('/athlete-documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage
          .from('athlete-documents')
          .remove([filePath]);
      }

      // Deletar do banco
      const { error } = await supabase
        .from('athlete_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Documento excluído com sucesso');
      await fetchDocuments();
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erro ao excluir documento');
      return false;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [athleteId, companyId]);

  return { 
    documents, 
    loading, 
    uploading,
    refetch: fetchDocuments,
    uploadDocument,
    deleteDocument
  };
};
