import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CurrentAthlete {
  id: string;
  name: string;
  email: string;
  company_id: string;
  is_approved: boolean;
  status: string;
  birth_date: string | null;
  phone: string | null;
  profile_photo: string | null;
  user_id: string | null;
}

export const useCurrentAthlete = () => {
  const { user } = useAuth();
  const [athlete, setAthlete] = useState<CurrentAthlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthlete = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar atleta por user_id primeiro, depois por email
        const { data, error: fetchError } = await supabase
          .from('athletes')
          .select('*')
          .or(`user_id.eq.${user.id},email.eq.${user.email}`)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data) {
          setAthlete(data);
          
          // Se encontrou por email mas não tem user_id, atualizar
          if (!data.user_id) {
            await supabase
              .from('athletes')
              .update({ user_id: user.id })
              .eq('id', data.id);
          }
        } else {
          setError('Atleta não encontrado');
        }
      } catch (err: any) {
        console.error('Error fetching athlete:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAthlete();
  }, [user?.id, user?.email]);

  const refetch = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('athletes')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (data) setAthlete(data);
    } catch (err: any) {
      console.error('Error refetching athlete:', err);
    }
  };

  return { athlete, loading, error, refetch };
};
