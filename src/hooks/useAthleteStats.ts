import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AthleteStats {
  currentStreak: number;
  totalPoints: number;
  monthlyClasses: number;
  currentLevel: string;
  lastCheckIn: string | null;
  bestStreak: number;
}

export const useAthleteStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AthleteStats>({
    currentStreak: 0,
    totalPoints: 0,
    monthlyClasses: 0,
    currentLevel: 'Novato',
    lastCheckIn: null,
    bestStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.email) return;

    try {
      // Get athlete ID
      const { data: athlete } = await supabase
        .from('athletes')
        .select('id, company_id')
        .eq('email', user.email)
        .maybeSingle();

      if (!athlete) {
        setLoading(false);
        return;
      }

      // Get gamification data
      const { data: levelData } = await supabase
        .from('athlete_levels')
        .select('*')
        .eq('athlete_id', athlete.id)
        .maybeSingle();

      // Get monthly classes count
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const { count: monthlyCount } = await supabase
        .from('athlete_check_ins')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', athlete.id)
        .gte('check_in_time', startOfMonth.toISOString());

      setStats({
        currentStreak: levelData?.current_streak || 0,
        totalPoints: levelData?.total_points || 0,
        monthlyClasses: monthlyCount || 0,
        currentLevel: levelData?.current_level || 'Novato',
        lastCheckIn: levelData?.last_check_in_date || null,
        bestStreak: levelData?.best_streak || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.email]);

  return { stats, loading, refetch: fetchStats };
};
